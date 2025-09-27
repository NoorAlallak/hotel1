import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth";
function LogInComponent() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: formData.get("email").trim(),
        password: formData.get("password").trim(),
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.userData.token);
      localStorage.setItem("user", JSON.stringify(response.data.userData));
      signIn(response.data.userData, response.data.userData.token);
      navigate("/");
    } catch (err) {
      console.error("Error during login:", err);
      setError("Invalid email or password");
    }
  }
  const goToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="w-full  max-w-sm mx-auto my-30 p-5 border border-gray-300 rounded-lg bg-white shadow-md h-full">
      <h2 className="text-lg font-bold mb-4 text-center">Log In</h2>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border border-gray-300 p-2 mb-4 w-full"
          name="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 mb-4 w-full"
          name="password"
        />

        <button
          type="submit"
          className="bg-[#509697] text-white p-2 rounded cursor-pointer hover:bg-[#3bc6b4] transition duration-300 my-4"
        >
          Log In
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{" "}
        <a
          onClick={goToSignUp}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          Sign Up
        </a>
      </p>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
}
export default LogInComponent;
