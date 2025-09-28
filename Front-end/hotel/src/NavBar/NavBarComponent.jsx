import logo from "./hotel-img.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth";

function NavBarComponent() {
  const navigate = useNavigate();
  const { authState, signOut } = useAuth();

  const goToLogin = () => navigate("/login");
  const goToSignUp = () => navigate("/signup");

  return (
    <div
      className="w-full bg-[#509697] px-4 py-2 flex flex-col md:flex-row 
                 items-center justify-between shadow-md"
    >
      <img
        src={logo}
        alt="Hotel Logo"
        className="w-16 h-13 shadow-md bg-cover mix-blend-multiply rounded-full ml-4"
      />
      <ul className="flex space-x-4 text-lg font-medium gap-6 ml-20">
        <li className="hover:text-gray-300 text-white transition">
          <a href="/">Home</a>
        </li>
      </ul>

      <div className="flex space-x-2 mr-4">
        {!authState.isAuthenticated ? (
          <>
            <button
              onClick={goToLogin}
              className="bg-transparent text-white font-semibold rounded border border-white px-3 py-1 cursor-pointer hover:bg-white hover:text-[#509697] transition"
            >
              Login
            </button>
            <button
              onClick={goToSignUp}
              className="bg-transparent text-white font-semibold rounded border border-white px-3 py-1 cursor-pointer hover:bg-white hover:text-[#509697] transition"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/bookings")}
              className="bg-transparent text-white font-semibold rounded border border-white px-3 py-1 cursor-pointer hover:bg-white hover:text-[#509697] transition"
            >
              My Bookings
            </button>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="bg-transparent text-white font-semibold rounded border border-white px-3 py-1 cursor-pointer hover:bg-white hover:text-[#509697] transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBarComponent;
