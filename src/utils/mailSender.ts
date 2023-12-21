import nodemailer from 'nodemailer';

class MailSender {

    public static sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'abhishek.verma.hi@gmail.com',
            pass: 'mnlq rekl ijsj nqos',
          },
        });

        const resetLink = `http://localhost:3000/reset-password/${encodeURIComponent(resetToken)}`;

        const mailOptions = {
          from: 'abhishek.verma.hi@gmail.com',
          to: email,
          subject: 'Reset Your Password',
          html: `
            <p>We have received a request to reset your password.</p>
            <p>Please follow <a href="${resetLink}">this link</a> to reset your password.</p>
            <p>This link will expire in one hour for security reasons.</p>
            <p>Best regards,<br/>Your masai Admin</p>
          `,
          contentType: 'text/html',
        };

          await transporter.sendMail(mailOptions);
      };

}

export default MailSender;
