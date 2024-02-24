const nodeMailer = require("nodemailer");


async function test(){
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        service: 'gmail',
        auth: {
            user: 'yogendramanikanta9951@gmail.com',
            pass: 'xwrxqbvgldqegtll',
        },
    });

    const mailOptions = {
        from: 'yogendramanikanta9951@gmail.com',
        to: 'kiranrajchintada302@gmail.com',
        subject: 'sample test',
        html: '',
    };
    // console.log(mailOptions);
    // console.log(transporter);
    await transporter.sendMail(mailOptions);

}
const sendEmail = async (options) => {
    // console.log(options);
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        service: 'gmail',
        auth: {
            user: 'yogendramanikanta9951@gmail.com',
            pass: 'xwrxqbvgldqegtll',
        },
    });

    const mailOptions = {
        from: 'yogendramanikanta9951@gmail.com',
        to: 'kiranrajchintada302@gmail.com',
        subject: 'sample test',
        html: '',
    };
    // console.log(mailOptions);
    // console.log(transporter);
    await transporter.sendMail(mailOptions);
};


module.exports ={
     sendEmail,
}

// const transporter = nodeMailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: '587',
//     service: 'gmail',
//     auth: {
//         user: 'yogendramanikanta9951@gmail.com',
//         pass: 'xwrxqbvgldqegtll',
//     },
// });

// const mailOptions = {
//     from: 'kiranrajchintada302@gmail.com',
//     to: 'yogendramanikanta9951@gmail.com',
//     subject: 'Can you please give me Admin access',
//     html: '',
// };
// // console.log(mailOptions);
// // console.log(transporter);
// await transporter.sendMail(mailOptions);