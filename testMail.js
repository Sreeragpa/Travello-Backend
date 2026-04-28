require('dotenv').config();
const nodemailer = require('nodemailer');
async function test() {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASS 
        }
    });
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'Test',
            text: 'Test content'
        });
        console.log('Success');
    } catch(err) {
        console.log('Error:', err);
    }
}
test();
