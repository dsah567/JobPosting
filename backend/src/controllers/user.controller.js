import User from '../models/user.model.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';


dotenv.config({
  path: './.env'
})

// Create a transporter for sending emails using Google SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: { 
        user: "sahd7929@gmail.com",  
        pass: process.env.Pass 
    },
});

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const signUp = async (req, res) => {
  const { fullName, companyName, phoneNumber, size, companyEmail } = req.body;

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ companyEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Send OTP to the provided email
    const mailOptions = {
      from: 'sahd7929@gmail.com',
      to: companyEmail,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Create a new user
    const newUser = new User({
      fullName,
      companyName,
      phoneNumber,
      size,
      companyEmail,
      otp,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully, OTP sent to email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


export const signIn = async (req, res) => {
  const { companyEmail, otp } = req.body;

  try {
    // Find the user by company email
    const user = await User.findOne({ companyEmail });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if the OTP matches
    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    const token =await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
   

    return res.status(200).cookie('jwt_token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
      maxAge: 24 * 60 * 60 * 1000,
    }).json({ message: 'Login successful.', name:user.fullName,companyName:user.companyName  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const postJob = async (req, res) => {
    const { jobTitle, jobDescription, experience, candidateEmail, endDate } = req.body;
    console.log(jobTitle, jobDescription, experience, candidateEmail, endDate);
  
    try {
      // Compose the email details
      const mailOptions = {
        from: 'sahd7929@gmail.com',
        to: candidateEmail,
        subject: `Job Opportunity: ${jobTitle}`,
        text: `Job Title: ${jobTitle}\nDescription: ${jobDescription}\nExperience Required: ${experience}\nEnd Date: ${endDate}`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Job details sent to the candidate.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error in sending email. Please try again later.' });
    }
  };