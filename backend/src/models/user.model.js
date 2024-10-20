import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
      },
      companyName: {
        type: String,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      phoneNumber: {
        type: String,
        required: true
      },
      companyEmail: { 
        type: String, 
        required: true, 
        unique: true 
        },
      otp: { 
        type: Number 
        },
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;