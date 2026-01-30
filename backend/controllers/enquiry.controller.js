import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enquiry } from "../models/enquiry.model.js";
import { Property } from "../models/property.model.js";
import { User } from "../models/user.model.js";
import { sendEmail, sendSMS } from "../utils/notification.service.js";

const createEnquiry = asyncHandler(async (req, res) => {
    const { propertyId, message, name, email, phone } = req.body;
    const userId = req.user?._id;

    if (!propertyId || !message || !name || !email || !phone) {
        throw new ApiError(400, "All fields are required");
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    if (property.owner.toString() === userId.toString()) {
        throw new ApiError(400, "You cannot enquire about your own property");
    }

    const enquiry = await Enquiry.create({
        user: userId,
        owner: property.owner,
        property: propertyId,
        message,
        name,
        email,
        phone
    });

    // Add enquiry to user's list
    await User.findByIdAndUpdate(userId, {
        $push: { enquiries: enquiry._id }
    });

    // Notify Owner
    const owner = await User.findById(property.owner);
    if (owner) {
        const messageText = `Hello ${owner.username}, you have a new enquiry from ${name} regarding your property "${property.title || property.type}".\n\nMessage: "${message}"\n\nCheck your dashboard for details.`;

        // Send Email
        await sendEmail({
            to: owner.email,
            subject: `New Enquiry for ${property.title || 'Property'}`,
            text: messageText,
            html: `<p>Hello <strong>${owner.username}</strong>,</p><p>You have a new enquiry from <strong>${name}</strong> regarding your property <strong>${property.title || property.type}</strong>.</p><blockquote>"${message}"</blockquote><p>Contact: ${phone}, ${email}</p><a href="${process.env.CORS_ORIGIN}/owner/dashboard">View Dashboard</a>`
        });

        // Send SMS
        if (owner.phoneNumber) {
            await sendSMS({
                to: owner.phoneNumber,
                message: `New Enquiry from ${name}: ${message.substring(0, 50)}... Log in to view details.`
            });
        }
    }

    return res.status(201).json(
        new ApiResponse(201, enquiry, "Enquiry created successfully")
    );
});

const deleteEnquiry = asyncHandler(async (req, res) => {
    const { enquiryId } = req.params;
    const userId = req.user?._id;

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
        throw new ApiError(404, "Enquiry not found");
    }

    // Allow deletion if user is the creator OR the property owner
    if (
        enquiry.user.toString() !== userId.toString() &&
        enquiry.owner.toString() !== userId.toString()
    ) {
        throw new ApiError(403, "Unauthorized to delete this enquiry");
    }

    await Enquiry.findByIdAndDelete(enquiryId);

    // Remove from user's list
    await User.findByIdAndUpdate(enquiry.user, {
        $pull: { enquiries: enquiryId }
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Enquiry deleted successfully")
    );
});

const getEnquiryById = asyncHandler(async (req, res) => {
    const { enquiryId } = req.params;
    const userId = req.user?._id;

    const enquiry = await Enquiry.findById(enquiryId)
        .populate("property", "title location rent images")
        .populate("user", "username email profileImage");

    if (!enquiry) {
        throw new ApiError(404, "Enquiry not found");
    }

    // Allow access if user is Creator or Owner
    if (
        enquiry.user._id.toString() !== userId.toString() &&
        enquiry.owner.toString() !== userId.toString()
    ) {
        throw new ApiError(403, "Unauthorized to view this enquiry");
    }

    return res.status(200).json(
        new ApiResponse(200, enquiry, "Enquiry fetched successfully")
    );
});


const getEnquiryByTenantId = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const enquiries = await Enquiry.find({ user: userId })
        .populate({
            path: "property",
            select: "type location rent images" // Select necessary fields
        })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, enquiries, "Your enquiries fetched successfully")
    );
});

const getEnquiryByOwnerId = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "owner") {
        throw new ApiError(403, "Unauthorized")
    }

    const enquiries = await Enquiry.find()
        .populate({
            path: "property",
            match: { owner: userId }, // 🔒 critical security filter
            select: "type location rent status images"
        })
        .populate({
            path: "user",
            select: "username email phoneNumber profileImage"
        })
        .sort({ createdAt: -1 })

    // Remove enquiries where property didn’t match owner
    const filteredEnquiries = enquiries.filter(e => e.property !== null)

    return res.status(200).json(
        new ApiResponse(
            200,
            filteredEnquiries,
            "Enquiries for your properties fetched successfully"
        )
    )
})

const acceptEnquiry = asyncHandler(async (req, res) => {
    const { enquiryId } = req.params
    const { reply } = req.body

    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "owner") {
        throw new ApiError(403, "Unauthorized")
    }

    if (!reply || reply.trim().length === 0) {
        throw new ApiError(400, "Reply message is required to accept enquiry")
    }

    const enquiry = await Enquiry.findById(enquiryId)
    if (!enquiry) {
        throw new ApiError(404, "Enquiry not found")
    }

    if (enquiry.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Only the property owner can accept this enquiry")
    }

    enquiry.status = "contacted"
    enquiry.reply = reply

    await enquiry.save()

    // Notify Tenant
    const tenant = await User.findById(enquiry.user);
    // Populate property for details
    const property = await Property.findById(enquiry.property);

    if (tenant) {
        const subject = `Response to your enquiry for ${property?.title || 'Property'}`;
        const emailContent = `<p>Hello <strong>${tenant.username}</strong>,</p><p>The owner has responded to your enquiry for <strong>${property?.title || 'property'}</strong>.</p><p><strong>Owner's Reply:</strong></p><blockquote>"${reply}"</blockquote><p>For more details, visit your profile.</p>`;

        await sendEmail({
            to: tenant.email,
            subject: subject,
            text: `Owner replied: "${reply}"`,
            html: emailContent
        });

        if (tenant.phoneNumber) {
            await sendSMS({
                to: tenant.phoneNumber,
                message: `Owner replied to your enquiry: "${reply.substring(0, 50)}..."`
            });
        }
    }

    return res.status(200).json(
        new ApiResponse(200, enquiry, "Enquiry accepted and reply sent")
    )
})
const rejectEnquiry = asyncHandler(async (req, res) => {
    const { enquiryId } = req.params
    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "owner") {
        throw new ApiError(403, "Unauthorized")
    }

    const enquiry = await Enquiry.findById(enquiryId)
    if (!enquiry) {
        throw new ApiError(404, "Enquiry not found")
    }

    if (enquiry.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Only the property owner can reject this enquiry")
    }

    enquiry.status = "rejected"
    enquiry.reply = ""

    await enquiry.save()

    // Notify Tenant
    const tenant = await User.findById(enquiry.user);
    const property = await Property.findById(enquiry.property);

    if (tenant) {
        const subject = `Update on your enquiry for ${property?.title || 'Property'}`;

        await sendEmail({
            to: tenant.email,
            subject: subject,
            text: `Your enquiry for ${property?.title || 'property'} was not accepted at this time.`,
            html: `<p>Hello <strong>${tenant.username}</strong>,</p><p>The owner has reviewed your enquiry for <strong>${property?.title || 'property'}</strong>.</p><p>Unfortunately, the enquiry was rejected/closed by the owner.</p>`
        });

        if (tenant.phoneNumber) {
            await sendSMS({
                to: tenant.phoneNumber,
                message: `Your enquiry for ${property?.title || 'property'} was declined by the owner.`
            });
        }
    }

    return res.status(200).json(
        new ApiResponse(200, enquiry, "Enquiry rejected successfully")
    )
})

export {
    createEnquiry,
    deleteEnquiry,
    getEnquiryById,
    getEnquiryByTenantId,
    getEnquiryByOwnerId,
    acceptEnquiry,
    rejectEnquiry,
    updateEnquiry
};

const updateEnquiry = asyncHandler(async (req, res) => {
    const { enquiryId } = req.params;
    const { message } = req.body;
    const userId = req.user?._id;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
        throw new ApiError(404, "Enquiry not found");
    }

    if (enquiry.user.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to update this enquiry");
    }

    // Optional: Prevent update if already contacted/rejected?
    // if (enquiry.status !== 'pending') {
    //     throw new ApiError(400, "Cannot update processed enquiry");
    // }

    enquiry.message = message;
    await enquiry.save();

    return res.status(200).json(
        new ApiResponse(200, enquiry, "Enquiry updated successfully")
    );
});