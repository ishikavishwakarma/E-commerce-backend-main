const nodemailer = require("nodemailer");

exports.sendmail = (req, res, next, url) => {
    const transport = nodemailer.createTransport({
        server: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.Mail_EMAIL_ADDERSH,
            pass: process.env.Mail_EMAIL_PASS,
        }
    });
    const mailOptions = {
        from: process.env.Mail_EMAIL_ADDERSH,
        to: req.body.email,
        subject: "password reset Link",
        html: `<h1>click here to reset password</h1> <a href=${url}>reset Password don't share link with any one</a> `

    }
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err, "nodemailer");
        }
        return res.status(200).json({
            msg: "mail send successfully",
            url,
            success:true
        })
    })
}