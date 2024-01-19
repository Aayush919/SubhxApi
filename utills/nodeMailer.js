const nodemailer = require("nodemailer");
const ErorrHandler = require("./ErorrHandlers.js");

const sendMail = async (req, res, next, msg) => {
    return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.MAIL_EMAIL_ADRESS,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: "Subhx pvt.ltd <malviyaaayush50@gmail.com>",
            to: req.body.email,
            subject: "email verification Otp",
            text: "Do not share this otp to anyone..",
            html: `${msg}`,
        };

        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(false);
            } else {

                resolve(true);
            }
        });
    });
};

module.exports = { sendMail };
