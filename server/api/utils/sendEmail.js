import nodemailer from "nodemailer";

/**
 * sendEmail
 * @param {string} to - receiver email
 * @param {string} subject - email subject
 * @param {string} html - email HTML body
 */
export const sendEmail = async ({ to, subject, html }) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"LIVITY Real Estate" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("📧 Email sent to:", to);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw error; // important for controller to catch
    }
};
