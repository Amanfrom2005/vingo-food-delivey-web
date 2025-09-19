import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useToast } from "../context/ToastContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import {setUserData} from "../redux/userSlice.js"

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const handleSignIn = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      setLoading(false);
      showToast("Login successful!", "success");
      navigate("/");
    } catch (err) {
      showToast(err?.response?.data?.message || "Sign in error", "error");
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      try {
        const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`, {
          email: result.user.email
        }, {withCredentials: true})
      dispatch(setUserData(data.data))
      } catch (error) {
        console.log(error);
        showToast(error?.response?.data?.message || "Google auth failed failed", "error");
      }
    }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#fff9f6] to-[#ffe4df]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#eee] animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2 text-[#ff4d2d] tracking-tight">Vingo</h1>
        <p className="text-gray-500 mb-8 font-medium">Welcome back, sign in to your account!</p>

        <form onSubmit={handleSignIn}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-gray-700 mb-1 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition-[border] duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-gray-700 mb-1 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition-[border] duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2/6 text-gray-600 cursor-pointer focus:outline-none focus:text-[#ff4d2d] transition-colors duration-200"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff4d2d] text-white hover:bg-[#e64323] active:scale-98 font-bold mt-4 flex items-center justify-center gap-2 border-none rounded-lg px-4 py-2 transition-all duration-200 shadow hover:shadow-lg"
            disabled={loading}
          >
            {loading? <ClipLoader color="white" size={24} /> : "Sign Up"}
          </button>
        </form>

        <button
          type="button"
          className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-100 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        <div className="flex items-center justify-between mt-6">
          <Link
            to="/forgot-password"
            className="text-sm text-[#ff4d2d] hover:underline focus:outline-none"
          >
            Forgot password?
          </Link>
          <span className="text-gray-400 mx-3">|</span>
          <Link
            to="/signup"
            className="text-sm text-[#ff4d2d] hover:underline focus:outline-none"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
