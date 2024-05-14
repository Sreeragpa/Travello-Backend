import nodemailer from "nodemailer"

// Configure Nodemailer transporter


// Function to send email
async function sendEmail(to: string, subject: string, text: string) {
    // Compose email message
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, // Your Gmail email address
            pass: process.env.PASS // Your Gmail password
        }
    });
    console.log(to,subject,text);
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Throw error for handling in the caller function
    }
}


export{sendEmail}