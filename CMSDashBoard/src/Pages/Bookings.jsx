import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../Context/LanguageContext";
import ExportButton from "../Components/ExportButton";

const Bookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    hotel: "all",
    dateRange: "",
  });
  const [hotels, setHotels] = useState([]);
  const token = localStorage.getItem("token");

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:3000/hotels");
      setHotels(Array.isArray(res.data.hotels) ? res.data.hotels : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchHotels();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/bookings/${bookingId}`, {
        status: newStatus.toLowerCase(),
      });
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus.toLowerCase() } : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (
      filters.status !== "all" &&
      booking.status.toLowerCase() !== filters.status.toLowerCase()
    )
      return false;
    if (filters.hotel !== "all" && booking.room?.hotel?.name !== filters.hotel)
      return false;
    if (filters.dateRange) {
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      const selectedDate = new Date(filters.dateRange);
      if (selectedDate < checkInDate || selectedDate > checkOutDate)
        return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("Bookings")}</h2>

        <ExportButton data={filteredBookings} filename="bookings.csv" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border p-2 w-full"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label>Hotel</label>
            <select
              value={filters.hotel}
              onChange={(e) =>
                setFilters({ ...filters, hotel: e.target.value })
              }
              className="border p-2 w-full"
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
            <label>Date</label>
            <input
              type="date"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              className="border p-2 w-full"
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
                <th className="px-6 py-3">Guest</th>
                <th className="px-6 py-3">Room/Hotel</th>
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    {booking.user?.username || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    <div>{booking.room?.type || "-"}</div>
                    <div className="text-gray-500">
                      {booking.room?.hotel?.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(booking.checkInDate)} to{" "}
                    {formatDate(booking.checkOutDate)}
                  </td>
                  <td className="px-6 py-4">${booking.room?.basePrice || 0}</td>
                  <td className="px-6 py-4">
                    <select
                      value={
                        booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)
                      }
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                      className="text-xs px-2 py-1 rounded"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
