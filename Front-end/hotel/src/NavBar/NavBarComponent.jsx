import logo from "./hotel-img.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth";

function NavBarComponent() {
  const navigate = useNavigate();
  const { authState, signOut } = useAuth();

  const goToLogin = () => navigate("/login");
  const goToSignUp = () => navigate("/signup");
  const goToFavorites = () => navigate("/favorites");
  const goToContact = () => navigate("/contact");
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
      <ul className="flex text-xl font-medium  ml-40">
        <li className="hover:text-gray-300 text-white transition text-center ">
          <a href="/">Home</a>
        </li>
        <li
          className="hover:text-gray-300 text-white transition text-center ml-10 cursor-pointer"
          onClick={goToContact}
        >
          ContactUs
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
              onClick={goToFavorites}
              className="bg-transparent text-white font-semibold rounded border border-white px-3 py-1 cursor-pointer hover:bg-white hover:text-[#509697] transition"
            >
              Favorites
            </button>
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
