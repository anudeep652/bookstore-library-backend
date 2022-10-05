import sgMail from "@sendgrid/mail";
export const sendMail = async (
  receiver,
  bookName = "",
  isContact = false,
  email,
  subject,
  message
) => {
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

  if (isContact) {
    const msg = {
      to: receiver,
      from: "webbuilders58@gmail.com",
      subject: subject,
      html: `You have a feedback from ${email}
      <p>
      "
      ${message}
      "
      </p>
      `,
    };
    await sgMail.send(msg);
  } else {
    const msg = {
      to: receiver,
      from: "webbuilders58@gmail.com",
      subject: "Here is your book!",
      html: `Thank you for purchasing the book ${bookName}
      <p>Since this is a test application u will not receive the book</p> 
      `,
    };
    await sgMail.send(msg);
  }
};
