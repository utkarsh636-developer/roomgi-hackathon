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

    console.log(`\n📧 Initiating email send to: ${to}`);
    console.log(`   Internal Creds Check: User=${!!process.env.EMAIL_USER}, Pass=${!!process.env.EMAIL_PASS ? 'Yes' : 'No'}`);

    if (!transporter) {
        console.log("⚠️  [MOCK EMAIL SERVICE] Email verification skipped (Missing credentials in .env)");
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Content Preview: ${text ? text.substring(0, 50) + '...' : 'HTML Content'}\n`);
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
        console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Failed to send email via Gmail:");
        console.error(`   Error Code: ${error.code}`);
        console.error(`   Error Message: ${error.message}`);
        if (error.response) console.error(`   Response: ${error.response}`);
    }
};

export const sendSMS = async ({ to, message }) => {
    // Mock implementation for Hackathon
    // To make real: Use Twilio (npm install twilio)
    console.log("\n📱 [MOCK SMS SERVICE]");
    console.log(`To: ${to}`);
    console.log(`Message: ${message}\n`);
};
