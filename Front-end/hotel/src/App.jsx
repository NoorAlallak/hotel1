import Home from "./HomePage/Home";
import LogIn from "./LogIn/LogIn";
import SignUp from "./SignUp/SignUp";
import HotelPage from "./HotelDetailsPage/HotelPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookingPage from "./BookingPage/BookingPage";
import Favorite from "./FavoritePage/Favorite";
import ContactUs from "./ContactUs/ContactUs";
function App() {
  return (
    <div className="bg-[#ebf5f4] min-h-screen flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/hotels/:id" element={<HotelPage />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
