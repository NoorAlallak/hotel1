import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns";
import axios from "axios";

export default function Calendar({ roomId, onDatesChange }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeInput, setActiveInput] = useState("checkin");
  const [bookedDates, setBookedDates] = useState([]);
  const today = new Date();

  // Parse DATE string as UTC to avoid timezone shift
  const parseDateUTC = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };

  // Fetch booked dates from API
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/bookings/calendar-events?room_id=${roomId}`
        );
        const formattedDates = res.data.map((event) => ({
          start: parseDateUTC(event.start),
          end: parseDateUTC(event.end),
        }));
        setBookedDates(formattedDates);
      } catch (err) {
        console.error("Error fetching booked dates:", err);
      }
    };
    if (roomId) fetchBookedDates();
  }, [roomId]);

  // Check if a date is booked
  const isDateBooked = (date) =>
    bookedDates.some(
      (b) =>
        (isAfter(date, b.start) && isBefore(date, b.end)) ||
        isSameDay(date, b.start) ||
        isSameDay(date, b.end)
    );

  const handleDateClick = (date) => {
    if (activeInput === "checkin") {
      setCheckIn(date);
      setCheckOut(null);
      setActiveInput("checkout");
    } else {
      if (!checkIn || date <= checkIn) {
        setCheckIn(date);
        setCheckOut(null);
        setActiveInput("checkout");
      } else {
        setCheckOut(date);
        setShowCalendar(false);
        onDatesChange(checkIn, date);
      }
    }
  };

  const handleInputClick = (inputType) => {
    setActiveInput(inputType);
    setShowCalendar(true);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const date = day;
        const isDisabled =
          !isSameMonth(date, monthStart) || isBefore(date, today);
        const isBooked = isDateBooked(date);
        const isSelected =
          (checkIn && isSameDay(date, checkIn)) ||
          (checkOut && isSameDay(date, checkOut));
        const inRange =
          checkIn &&
          checkOut &&
          isAfter(date, checkIn) &&
          isBefore(date, checkOut);

        const dayClass = `h-10 w-10 flex items-center justify-center rounded-full text-sm transition-colors ${
          isDisabled
            ? "text-gray-300 cursor-not-allowed"
            : isBooked
            ? "bg-red-100 text-red-400 line-through cursor-not-allowed"
            : isSelected
            ? "bg-blue-600 text-white cursor-pointer"
            : inRange
            ? "bg-blue-100 text-blue-800 cursor-pointer"
            : "text-gray-700 hover:bg-gray-100 cursor-pointer"
        }`;

        days.push(
          <div
            key={date.toISOString()}
            className={dayClass}
            onClick={() => !isDisabled && !isBooked && handleDateClick(date)}
          >
            {format(date, "d")}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  return (
    <div className="max-w-sm mx-auto p-6 relative">
      <div className="flex gap-4 mb-4 mx-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Check-in</label>
          <input
            value={checkIn ? format(checkIn, "MMM dd, yyyy") : ""}
            placeholder="Select date"
            readOnly
            onClick={() => handleInputClick("checkin")}
            className="w-full p-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Check-out</label>
          <input
            value={checkOut ? format(checkOut, "MMM dd, yyyy") : ""}
            placeholder="Select date"
            readOnly
            onClick={() => handleInputClick("checkout")}
            className={`w-full p-2 border rounded-lg ${
              checkIn
                ? "cursor-pointer focus:ring-2 focus:ring-blue-500"
                : "cursor-not-allowed bg-gray-100"
            }`}
          />
        </div>
      </div>

      {showCalendar && (
        <div className="absolute top-20 left-0 right-0 bg-white border rounded-lg shadow-lg p-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <span className="font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-sm font-medium text-gray-500"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="space-y-1">{renderCalendar()}</div>

          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Selected</span>
            </div>
          </div>

          <button
            onClick={() => setShowCalendar(false)}
            className="w-full mt-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
