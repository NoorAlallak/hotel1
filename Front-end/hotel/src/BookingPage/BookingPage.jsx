import BookingPageComponent from "./BookingPageComponent";
import NavBar from "../NavBar/NavBar";
function BookingPage() {
  return (
    <div className="bg-[#ebf5f4] min-h-screen flex flex-col">
      <NavBar />
      <BookingPageComponent />
    </div>
  );
}
export default BookingPage;
