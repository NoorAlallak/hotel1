import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "../CalendarView/Calendar";
import { useAuth } from "../Authentication/useAuth";

export default function HotelDetailsComponent() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);
  const { user } = useAuth();
  const currentUserId = user?.id;
  const location = useLocation();
  const guestsCount = location.state?.guests || 1;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/hotels/${id}`)
      .then((res) => setHotel(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`http://localhost:3000/rooms/hotel/${id}`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleBookClick = async (roomId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowModal(true);
      return;
    }

    if (!selectedCheckIn || !selectedCheckOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    try {
      console.log("Booking payload:", {
        roomId,
        userId: currentUserId,
        checkInDate: selectedCheckIn,
        checkOutDate: selectedCheckOut,
        guestsCount,
      });
      await axios.post(
        "http://localhost:3000/bookings/",
        {
          roomId: roomId,
          userId: currentUserId,
          checkInDate: selectedCheckIn.toISOString(),
          checkOutDate: selectedCheckOut.toISOString(),
          guestsCount,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPopup(true);
    } catch (err) {
      console.error(err);
      alert("Booking failed!");
    }
  };

  if (!hotel) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-4 bg-[#ebf5f4] min-h-screen">
      <Link
        to="/"
        className="text-teal-600 hover:underline mb-4 text-4xl"
        aria-label="Back to hotel list"
      >
        ←
      </Link>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6 mb-8">
        <img
          src={hotel.coverImage}
          alt={hotel.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
        <p className="text-gray-600 mb-2">
          {hotel.city} – {hotel.address}
        </p>
        <p className="text-gray-700 mb-4">{hotel.description}</p>

        <h2 className="text-2xl font-bold mb-4">Available Rooms:</h2>

        {rooms.length > 0 ? (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-100 p-3 rounded-lg flex flex-col gap-3"
              >
                <div>
                  <h3 className="font-semibold py-1">Room Type: {room.type}</h3>
                  <p className="py-1">Description: {room.description}</p>
                  <p className="py-1">Capacity: {room.capacity}</p>
                  <p className="py-1">Price: ${room.basePrice}</p>
                </div>

                <Calendar
                  roomId={room.id}
                  onDatesChange={(ci, co) => {
                    setSelectedCheckIn(ci);
                    setSelectedCheckOut(co);
                  }}
                />

                <button
                  onClick={() => handleBookClick(room.id)}
                  className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 cursor-pointer w-sm text-center ml-28 my-2"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No rooms available.</p>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              You must sign in to book a room
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 cursor-pointer"
              >
                Go to Sign In
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {popup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-green-600">
              Booking Successful!
            </h2>
            <p className="text-gray-700 mb-4">
              Your booking has been confirmed.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                Close
              </button>

              <Link
                to="/bookings"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 cursor-pointer"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
