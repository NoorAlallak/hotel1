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
  const [showCelebration, setShowCelebration] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [couponError, setCouponError] = useState("");

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

  const handleCheckout = async (bookingId, couponCode) => {
    try {
      setCouponError("");

      const res = await axios.post(
        `http://localhost:3000/checkout/${bookingId}`,
        { couponCode: couponCode || "" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Only show celebration if checkout success
      if (!res.data.success) {
        setCouponError(res.data.message || "Invalid coupon or checkout failed");
        return;
      }

      setCheckoutData({
        totalPrice: res.data.totalPrice,
        originalPrice: res.data.originalPrice,
        discount: res.data.discount || 0,
        couponCode: couponCode || "",
        basePrice: res.data.basePrice,
      });
      setShowCelebration(true);

      // Update booking status only if checkout succeeded
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "completed" } : b
        )
      );
    } catch (err) {
      console.error("Checkout failed:", err.response?.data || err.message);
      setCouponError(
        err.response?.data?.message || "Checkout failed. Try again."
      );
    }
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setCheckoutData(null);
    setCouponError("");
  };

  const statusColor = {
    confirmed: "bg-green-600",
    completed: "bg-blue-600",
    pending: "bg-yellow-500",
    cancelled: "bg-red-500",
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

      {/* Celebration Popup */}
      {showCelebration && checkoutData && (
        <>
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  top: "-10px",
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
              style={{ animation: "scaleIn 0.5s ease-out" }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold mb-4 text-green-600 animate-bounce">
                Payment Successful! 🎉
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-lg text-gray-700 mb-2">
                  Your stay is confirmed!
                </p>

                {checkoutData?.couponCode && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Coupon Applied:{" "}
                      <span className="font-semibold">
                        {checkoutData.couponCode}
                      </span>
                    </p>
                    {checkoutData.discount > 0 && (
                      <p className="text-sm text-green-600 font-semibold">
                        You saved ${checkoutData.discount}!
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>
                      ${checkoutData?.basePrice || checkoutData?.originalPrice}
                    </span>
                  </div>
                  {checkoutData?.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${checkoutData.discount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-gray-600 font-semibold">
                    Total Paid:
                  </span>
                  <span className="text-2xl font-bold text-teal-600">
                    ${checkoutData?.totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={closeCelebration}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 cursor-pointer transition-all duration-200 hover:scale-105 font-semibold"
                >
                  Continue Exploring
                </button>
                <Link
                  to="/"
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 cursor-pointer transition-all duration-200 text-center"
                  onClick={closeCelebration}
                >
                  Book Another Stay
                </Link>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes scaleIn {
              from {
                transform: scale(0.7);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}

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
                    statusColor[b.status] || "bg-gray-400"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>

                {b.status === "confirmed" && (
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

              {b.status === "confirmed" && (
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (optional)"
                    value={b.couponCode || ""}
                    onChange={(e) => {
                      setBookings((prev) =>
                        prev.map((bk) =>
                          bk.id === b.id
                            ? { ...bk, couponCode: e.target.value }
                            : bk
                        )
                      );
                      if (couponError) setCouponError("");
                    }}
                    className={`border px-2 py-1 rounded text-sm ${
                      couponError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1">{couponError}</p>
                  )}
                  <button
                    onClick={() => handleCheckout(b.id, b.couponCode)}
                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 text-sm cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    Checkout & Pay
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
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
