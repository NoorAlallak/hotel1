import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Authentication/useAuth";

export default function FavoriteComponent() {
  const { user } = useAuth();
  const [favoriteHotels, setFavoriteHotels] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const res = await axios.get("http://localhost:3000/favorites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Backend returns favorites with hotel included
        setFavoriteHotels(res.data.map((f) => f.Hotel));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!favoriteHotels.length) return <p className="p-4">No favorites yet.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold my-6 ">
        My Favorite Hotels ({favoriteHotels.length})
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favoriteHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white p-4 rounded-lg shadow flex flex-col cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={hotel.coverImage}
              alt={hotel.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{hotel.name}</h2>
            <p className="text-gray-600">{hotel.city}</p>
            <p className="text-gray-600 mb-2">{hotel.address}</p>
            <div className="flex justify-between mt-auto">
              <Link
                to={`/hotels/${hotel.id}`}
                className="text-teal-600 hover:underline"
              >
                View
              </Link>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `http://localhost:3000/favorites/${hotel.id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                    setFavoriteHotels((prev) =>
                      prev.filter((h) => h.id !== hotel.id)
                    );
                  } catch (err) {
                    console.error("Failed to remove favorite:", err);
                  }
                }}
                className="text-red-500  hover:scale-110 transition cursor-pointer text-2xl"
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
