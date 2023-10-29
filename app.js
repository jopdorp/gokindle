// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/send-sgf', async (req, res) => {
    const { sgfData, recipient } = req.body;

    // Validate SGF data and recipient email
    const sgfRegex = /\(;([A-z]+\[[A-z\.1-9]+\];?)+\)/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if (!sgfRegex.test(sgfData) || !emailRegex.test(recipient)) {
        return res.status(400).send('Invalid SGF data or recipient email');
    }

    // Setup email options
    const msg = {
        from: 'derusproductions@gmail.com',  // Use your verified SendGrid sender email
        to: recipient,
        subject: 'SGF File',
        text: 'Attached is the SGF file you requested.',
        attachments: [{
            filename: 'game.sgf',
            content: sgfData
        }]
    };

    try {
        // Send email
        await sgMail.send(msg);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while sending the email');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
