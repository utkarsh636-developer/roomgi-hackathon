import nodemailer from 'nodemailer';

// Helper to create transporter only if credentials exist
const createTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return null;
};

export const sendEmail = async ({ to, subject, text, html }) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log("\n⚠️  [MOCK EMAIL SERVICE] Email verification skipped (Missing credentials)");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${text || 'HTML Content'}\n`);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
};

export const sendSMS = async ({ to, message }) => {
    // Mock implementation for Hackathon
    // To make real: Use Twilio (npm install twilio)
    console.log("\n📱 [MOCK SMS SERVICE]");
    console.log(`To: ${to}`);
    console.log(`Message: ${message}\n`);
};
