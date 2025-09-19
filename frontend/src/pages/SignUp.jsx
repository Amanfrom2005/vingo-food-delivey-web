import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useToast } from "../context/ToastContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import {setUserData} from "../redux/userSlice.js"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, mobile, password, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      setLoading(false)
      showToast("Account created successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast(error?.response?.data?.message || "Sign up failed", "error");
      setLoading(false)
    }
  };

  const handleGoogleAuth = async () => {
    if(!mobile){showToast("mobile number is requird", "error");}
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        fullName: result.user.displayName,
        email: result.user.email,
        role,
        mobile
      }, {withCredentials: true})
      dispatch(setUserData(data.data))
    } catch (error) {
      console.log(error);
      showToast(error?.response?.data?.message || "Google auth failed failed", "error");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#fff9f6] to-[#ffe4df]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#eee]">
        <h1 className="text-4xl font-bold mb-2 text-[#ff4d2d] tracking-tight animate-fadeIn">
          Vingo
        </h1>
        <p className="text-gray-500 mb-8 font-medium animate-fadeIn delay-75">
          Create your account to get started with delicious food deliveries
        </p>

        <form onSubmit={handleSignUp}>
          <div className="mb-5 animate-fadeIn delay-100">
            <label
              htmlFor="fullName"
              className="block text-gray-700 mb-1 font-semibold"
            >
              Full Name
            </label>
            <input
              required
              id="fullName"
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition-[border] duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
              placeholder="Enter Your Full Name"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
          </div>

          <div className="mb-5 animate-fadeIn delay-125">
            <label
              htmlFor="email"
              className="block text-gray-700 mb-1 font-semibold"
            >
              Email
            </label>
            <input
              required
              id="email"
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition-[border] duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
              placeholder="Enter Your Email"
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="mb-5 animate-fadeIn delay-150">
            <label
              htmlFor="mobile"
              className="block text-gray-700 mb-1 font-semibold"
            >
              Mobile
            </label>
            <input
              required
              id="mobile"
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition-[border] duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
              placeholder="Enter Your Mobile Number"
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
            />
          </div>

          <div className="mb-5 animate-fadeIn delay-175">
            <label
              htmlFor="password"
              className="block text-gray-700 mb-1 font-semibold"
            >
              Password
            </label>
            <div className="relative">
              <input
                required
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition-[border] duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
                placeholder="Enter Your Password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                className="absolute right-3 top-2/6 text-gray-600 cursor-pointer focus:outline-none focus:text-[#ff4d2d] transition-colors duration-200"
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
              >
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          <div className="mb-5 animate-fadeIn delay-200">
            <label
              htmlFor={role}
              className="block text-gray-700 mb-1 font-semibold"
            >
              Role
            </label>
            <div className="flex gap-2">
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-150 border ${
                    role === r
                      ? "bg-[#ff4d2d] text-white border-[#ff4d2d] scale-105 shadow-md"
                      : "bg-white text-gray-700 border-[#eee] hover:bg-[#fff5f0]"
                  }`}
                  key={r}
                  onClick={() => setRole(r)}
                  id={r}
                  type="button"
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-[#ff4d2d] text-white hover:bg-[#e64323] active:scale-98 font-bold mt-4 flex items-center justify-center gap-2 border-none rounded-lg px-4 py-2 transition-all duration-200 shadow hover:shadow-lg"
            type="submit"
            disabled={loading}
          >
            {loading? <ClipLoader color="white" size={24} /> : "Sign Up"}
          </button>
        </form>

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-100 font-medium transition-all duration-200 shadow-sm hover:shadow-lg"
          type="button"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center mt-6 animate-fadeIn delay-300">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-[#ff4d2d] hover:underline focus:outline-none transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
