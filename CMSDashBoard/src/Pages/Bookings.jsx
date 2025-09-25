import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../Context/LanguageContext";

const Bookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    hotel: "all",
    dateRange: "",
  });
  const [hotels, setHotels] = useState([]);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        console.error("Unexpected response format:", res.data);
        setBookings([]); // fallback
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]); // fallback
    }
  };

  // Fetch hotels for filter dropdown
  const fetchHotels = async () => {
    try {
      const res = await axios.get("/hotels"); // adjust the endpoint
      if (Array.isArray(res.data)) {
        setHotels(res.data);
      } else {
        console.error("Unexpected response format for hotels:", res.data);
        setHotels([]); // fallback
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchHotels();
  }, []);

  // Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/bookings/${bookingId}`, { status: newStatus });
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error("Failed to update booking status:", err);
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filters.status !== "all" && booking.status !== filters.status)
      return false;
    if (filters.hotel !== "all" && booking.hotel !== filters.hotel)
      return false;
    if (filters.dateRange) {
      const selectedDate = new Date(filters.dateRange);
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      if (selectedDate < checkInDate || selectedDate > checkOutDate)
        return false;
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Guest",
      "Room",
      "Hotel",
      "Check-In",
      "Check-Out",
      "Status",
      "Amount",
    ];
    const csvData = filteredBookings.map((booking) => [
      booking.id,
      booking.guest,
      booking.room,
      booking.hotel,
      booking.checkInDate,
      booking.checkOutDate,
      booking.status,
      `$${booking.amount}`,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("bookings")}</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportToCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i className="fas fa-file-export mr-2"></i>
            Export CSV
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <i className="fas fa-plus mr-2"></i>
            New Booking
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hotel
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.hotel}
              onChange={(e) =>
                setFilters({ ...filters, hotel: e.target.value })
              }
            >
              <option value="all">All Hotels</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.name}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room/Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.guest}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Room {booking.room}
                    </div>
                    <div className="text-sm text-gray-500">{booking.hotel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.checkInDate} to {booking.checkOutDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${booking.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                      className={`text-xs font-semibold rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500
                        ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
