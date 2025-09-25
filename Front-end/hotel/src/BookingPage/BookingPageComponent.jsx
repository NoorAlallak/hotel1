import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/useAuth";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BookingPage() {
  const { authState } = useAuth();
  const user = authState?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/bookings/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(
        "Error fetching bookings:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    try {
      await axios.patch(
        `http://localhost:3000/bookings/${selectedBooking.id}`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error(
        "Error cancelling booking:",
        err.response?.data || err.message
      );
    } finally {
      setShowModal(false);
      setSelectedBooking(null);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-700">
          Please{" "}
          <Link to="/login" className="text-teal-600 hover:underline">
            sign in
          </Link>{" "}
          to view your bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Bookings
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>You have no bookings yet.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-teal-600 hover:underline"
          >
            Book a room now
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800 mb-2">
                  {b.room?.hotel?.name || "Hotel Name"}
                </h2>
                <p className="text-gray-600 mb-1">
                  Room: {b.room?.type || "Type"}
                </p>
                <p className="text-gray-600 mb-1">Guests: {b.guestsCount}</p>
                <p className="text-gray-600 mb-1">
                  {new Date(b.checkInDate).toLocaleDateString()} -{" "}
                  {new Date(b.checkOutDate).toLocaleDateString()}
                </p>
                <p className="text-gray-800 font-bold mt-2">
                  ${b.room?.basePrice || 0}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    b.status === "confirmed"
                      ? "bg-green-600"
                      : b.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>

                {b.status !== "cancelled" && (
                  <button
                    onClick={() => confirmCancel(b)}
                    className="border border-red-600 text-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                <Link
                  to={`/hotels/${b.room?.hotel?.id}`}
                  className="text-teal-600 hover:underline text-sm"
                >
                  View Hotel
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Cancel Booking</h2>
            <p className="mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                No
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
