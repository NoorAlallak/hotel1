import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomeComponent() {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:3000/hotels/")
      .then((res) => setHotels(res.data.hotels))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/search?city=${encodeURIComponent(
          city
        )}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
      const availableHotels = res.data.map((item) => item.hotel);
      setHotels(availableHotels);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#ebf5f4] min-h-screen my-8">
      <div className="max-w-5xl mx-auto mb-8 p-4 bg-white rounded-3xl shadow-md flex flex-col md:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
        <input
          type="number"
          placeholder="Number Of Guests"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-45 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-center"
        />
        <button
          onClick={handleSearch}
          className="bg-[#509697] text-white px-6 py-3 rounded-full hover:bg-teal-700 transition shadow-md hover:shadow-lg cursor-pointer"
        >
          Search
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all px-4 pb-8">
        {hotels.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No hotels found.
          </p>
        ) : (
          hotels.map((hotel) => (
            <Link
              key={hotel.id}
              to={`/hotels/${hotel.id}`}
              state={{
                guests,
                checkIn,
                checkOut,
              }}
            >
              <div className="rounded-lg shadow bg-white hover:shadow-lg transition-shadow duration-300">
                <img
                  src={hotel.coverImage}
                  alt={hotel.name}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{hotel.name}</h2>
                  <p className="text-gray-600">{hotel.city}</p>
                  <p className="mt-2 text-sm text-gray-700">
                    {hotel.description}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeComponent;
