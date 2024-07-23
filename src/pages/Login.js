import React, {useEffect, useState, useRef} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setUser} from "../redux/userReducer";
import axiosInstance from "../api/axiosInstance";
import {ClipLoader} from "react-spinners";

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const otpRefs = useRef([]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData !== null) {
      navigate("/");
    }
  }, [navigate]);

  const handleEmailForm = async (event) => {
    console.log('haaai')
    event.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await axiosInstance.post("accounts/otp-request/", {
        email,
      });
      setMessage(response.data.message);
      setIsOtpSent(true);
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("An error occurred");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus on the next input if available
      if (index < otp.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        otpRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").split("").slice(0, 6);
    const newOtp = [...otp];
    pasteData.forEach((char, idx) => {
      if (!isNaN(char)) {
        newOtp[idx] = char;
      }
    });
    setOtp(newOtp);
    otpRefs.current[pasteData.length - 1]?.focus();
  };

  const handleOtpForm = async (event) => {
    event.preventDefault();
    const enteredOtp = otp.join("");
    setIsLoading(true); // Start loading
    try {
      const response = await axiosInstance.post("/accounts/otp-verification/", {
        otp: enteredOtp,
        email,
      });

      const userData = response.data;
      dispatch(setUser(userData));
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log('fail to verify ',error)
      if (error.response) {

        setMessage(error.response.data.errors);
      } else {
        setMessage("An error occurred");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-3" style={{width: "440px"}}>
        <div className="max-w-md w-full p-6 bg-white rounded">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Login
          </h2>
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <ClipLoader size={50} color={"#4A90E2"} loading={isLoading} />
              </div>
            ) : !isOtpSent ? (
              <form onSubmit={handleEmailForm}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:border-violet-600"
                  required
                />
                {message && <p className="text-red-500 mb-4">{message}</p>}
                <button
                  type="submit"
                  className="w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-800 transition duration-200"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpForm}>
                <label className="block text-sm text-gray-700 mb-2">
                  Enter OTP for verification
                </label>
                <div className="flex space-x-2 mb-4">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onPaste={handleOtpPaste}
                      ref={(el) => (otpRefs.current[index] = el)}
                      className="w-12 h-12 border border-gray-300 rounded-md pl-4 py-3 focus:outline-none focus:border-violet-600"
                      required
                    />
                  ))}
                </div>
                {message && <p className="text-black mb-4">{message}</p>}
                <button
                  type="submit"
                  className="w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition duration-200"
                >
                  Verify OTP
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
