import nodemailer from "nodemailer";

/**
 * Nodemailer transporter object for sending emails.
 */
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

/**
 * Mail options object for sending an email.
 *
 * @param receiver The email address to send the email to
 * @param subject The subject of the email
 * @param html The HTML content of the email
 * @returns The mail options object
 */
const mailOptions = (receiver: string, subject: string, html: string) => ({
	from: process.env.EMAIL_USER,
	to: receiver,
	subject: subject,
	html: html,
});

const emailRegards = "<p>If you did not request this email, please ignore it.</p>";

const emailHtmls = {
	confirmEmail: (emailConfirmationLink: string) =>
		`<p>Thank you for signing up to the website!</p>
    <p>Please confirm your email address by clicking this link <a href="${emailConfirmationLink}">here</a>.</p>
    <p>Note that this link will expire in 1 hour.</p>
    ${emailRegards}`,
};

/**
 * Sends an email to the user with a link to confirm their email.
 *
 * @param email The email address to send the email to
 * @param token The email confirmation token
 */
export async function sendConfirmationEmail(email: string, token: string) {
	const emailConfirmationLink = `${process.env.BASE_URL}/confirm-email?token=${token}`;

	const options = mailOptions(email, "Email confirmation", emailHtmls.confirmEmail(emailConfirmationLink));

	await transporter.sendMail(options).finally(() => {
		console.log("Confirmation email sent to", email);
	});
}
