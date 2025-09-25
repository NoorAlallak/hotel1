import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function SignUpComponent() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);

    const email = formData.get("email").trim();
    const username = formData.get("username").trim();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const userType = formData.get("userType");

    if (!email || !username || !password || !confirmPassword || !userType) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await axios.post("http://localhost:3000/auth/register", {
        email,
        username,
        password,
        role: userType,
      });
      console.log("Registration successful");
      navigate("/");
    } catch (err) {
      console.error("Error during sign up:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const goToLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="w-full max-w-sm mx-auto my-20 p-5 border border-gray-300 rounded-lg bg-white shadow-md">
      <h2 className="text-lg font-bold mb-4 text-center">Sign Up</h2>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="border border-gray-300 p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="border border-gray-300 p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="border border-gray-300 p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          className="border border-gray-300 p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex flex-col mb-4">
          <span className="font-semibold text-gray-700 mb-2">
            Select User Type:
          </span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="viewer"
                className="cursor-pointer"
              />{" "}
              Viewer
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="admin"
                className="cursor-pointer"
              />{" "}
              Admin
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="manager"
                className="cursor-pointer"
              />{" "}
              Manager
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#509697] text-white p-2 rounded cursor-pointer hover:bg-[#3bc6b4] transition duration-300 mb-4"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-gray-600">
        Already have an account?{" "}
        <span
          onClick={goToLogIn}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          Log In
        </span>
      </p>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
}

export default SignUpComponent;
