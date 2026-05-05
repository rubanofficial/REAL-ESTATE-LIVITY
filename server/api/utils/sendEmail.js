import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, replyTo }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"LIVITY" <${process.env.APP_EMAIL}>`,
        to,
        subject,
        html,
        replyTo, // 🔥 KEY LINE
    });
};
