import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: ''
    }
});

const sendEmail = async ({ to, subject, text, OTPNumber }) => {
    const info = await transporter.sendMail({
        from: `"Koda Store" <${'KODA_STORE@gmail.com'}>`,
        to,
        subject,
        text,
        html: otpEmailTemplate(OTPNumber), 
    });

    console.log("Email sent:", info.messageId);
};

export const otpEmailTemplate = (otp) => `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 0;">
        <tr>
        <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <tr>
                <td style="background:#4f46e5; padding:24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px;">KODA STORE</h1>
                </td>
            </tr>
            <tr>
                <td style="padding:32px; text-align:center;">
                <p style="font-size:16px; color:#333333; margin:0 0 16px;">Your verification code is:</p>
                <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#4f46e5; margin:16px 0;">
                    ${otp}
                </div>
                <p style="font-size:14px; color:#888888; margin:16px 0 0;">This code expires in 5 minutes.</p>
                </td>
            </tr>
            <tr>
                <td style="background:#fafafa; padding:16px; text-align:center;">
                <p style="font-size:12px; color:#aaaaaa; margin:0;">If you didn't request this, you can ignore this email.</p>
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>
    </body>
    </html>
    `;

export default sendEmail;