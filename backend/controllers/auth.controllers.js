import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../ulits/token.js";
import { sendMail } from "../ulits/mail.js";

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    if (!mobile || mobile.length < 10)
      return res.status(400).json({ message: "Mobile number must be at least 10 digits long" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed, mobile, role });

    const token = genToken(user._id);
    res.cookie("token", token, cookieOpts);

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `signUp error ${error.message}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = genToken(user._id);
    res.cookie("token", token, cookieOpts);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `signIn error ${error.message}` });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Signout successfully" });
  } catch (error) {
    return res.status(500).json({ message: `signOut error ${error.message}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.isOtpVerified = false;
    await user.save();

    await sendMail(email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Error in sending OTP ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const expired = !user.otpExpiry || user.otpExpiry.getTime() < Date.now();
    if (user.resetOtp !== otp || expired) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Failed to verify OTP ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters long" });

    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isOtpVerified = false; // require fresh OTP next time
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Password reset error ${error.message}` });
  }
};

export const gooogleAuth = async (req, res) => {
  try {
    const {fullName, email, mobile, role} = req.body;
    let user = await User.findOne({email});
    if(!user){user = await User.create(fullName, email, mobile, role)};
    const token = genToken(user._id);
    res.cookie("token", token, cookieOpts);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `googleAuth error ${error.message}` }); 
  }
}