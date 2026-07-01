const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendResetEmail = async ({ email, link, username }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"Career Compass" <no-reply@careercompass.com>`,
    to: email,
    subject: "Reset Your Password - Career Compass",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a; margin-bottom: 16px;">Career Compass</h2>
        <p>Hello ${username || "User"},</p>
        <p>We received a request to reset your password. Click the button below to choose a new password. This link is valid for 5 minutes:</p>
        <div style="margin: 24px 0;">
          <a href="${link}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendResetEmail,
};
