import nodemailer from 'nodemailer';

// Helper to get transporter
const getTransporter = async () => {
  // If SMTP configs are in env, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    if (process.env.SMTP_HOST.includes('gmail')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Create ethereal test account for local development
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (e) {
    // Ethereal is unreachable — return null so caller can handle gracefully
    return null;
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<any> => {
  const transporter = await getTransporter();

  // --- Dev/offline fallback: no SMTP configured and Ethereal unreachable ---
  if (!transporter) {
    console.log('------------------------------------------------------------');
    console.log('📬 NO SMTP CONFIGURED — DEV MODE PASSWORD RESET');
    console.log(`   To:        ${email}`);
    console.log(`   Reset URL: ${resetUrl}`);
    console.log('   Open the URL above in your browser to reset the password.');
    console.log('   To send real emails, add SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS to .env');
    console.log('------------------------------------------------------------');
    return { devMode: true };
  }

  const mailOptions = {
    from: process.env.SMTP_USER ? `"ConversionIQ" <${process.env.SMTP_USER}>` : '"ConversionIQ Support" <support@conversioniq.com>',
    to: email,
    subject: 'Reset your password - ConversionIQ',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; rounded: 12px;">
        <h2 style="color: #4f46e5; margin-bottom: 24px;">Reset your ConversionIQ Password</h2>
        <p style="color: #3f3f46; font-size: 16px; line-height: 24px;">
          You requested a password reset for your ConversionIQ account. Click the button below to set a new password. This link will expire in 1 hour.
        </p>
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #71717a; font-size: 14px; line-height: 20px;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">
          ${resetUrl}
        </p>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
        <p style="color: #a1a1aa; font-size: 12px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, print the test email URL
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('------------------------------------------------------------');
      console.log('📬 PASSWORD RESET EMAIL SENT (Ethereal test message):');
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      console.log('------------------------------------------------------------');
    }
    return info;
  } catch (error: any) {
    console.error('⚠️ SMTP send error:', error.message || error);
    console.log('------------------------------------------------------------');
    console.log('📬 SMTP DELIVERY FAILED — DEV FALLBACK RESET LINK');
    console.log(`   Reset URL: ${resetUrl}`);
    console.log('------------------------------------------------------------');
    return { devMode: true, error: error.message };
  }
};


