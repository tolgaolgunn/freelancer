import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
      },
      tls:{
        rejectUnauthorized:false,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html, 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail gönderildi: ", info.response);
  } catch (err) {
    console.error("Mail gönderme hatası:", err);
  }
};
