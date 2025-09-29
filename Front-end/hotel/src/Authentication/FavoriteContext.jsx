import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Authentication/useAuth";

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await axios.get("http://localhost:3000/favorites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const addFavorite = async (hotelId) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/favorites",
        { hotelId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFavorites((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add favorite:", err);
    }
  };

  const removeFavorite = async (hotelId) => {
    try {
      await axios.delete(`http://localhost:3000/favorites/${hotelId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFavorites((prev) => prev.filter((f) => f.hotelId !== hotelId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const isFavorite = (hotelId) => favorites.some((f) => f.hotelId === hotelId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => useContext(FavoritesContext);
