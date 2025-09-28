import React, { useEffect, useState } from "react";
import axios from "axios";

const SeasonalPrices = ({ roomId }) => {
  const [room, setRoom] = useState(null);
  const [seasonalPrices, setSeasonalPrices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    price: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (roomId) {
          // Fetch a single room
          const res = await axios.get(`http://localhost:3000/rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRoom(res.data);
          setSeasonalPrices(res.data.seasonalPrices);
        } else {
          // Fetch all rooms and combine seasonal prices
          const res = await axios.get("http://localhost:3000/rooms", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const allSeasonal = res.data.flatMap((r) =>
            r.seasonalPrices.map((sp) => ({ ...sp, room: r }))
          );
          setRoom(null); // no specific room
          setSeasonalPrices(allSeasonal);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [roomId, token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!roomId)
      return alert("Cannot add seasonal price without selecting a room");
    try {
      const res = await axios.post(
        `http://localhost:3000/rooms/${roomId}/seasonal-prices`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSeasonalPrices([res.data, ...seasonalPrices]);
      setFormData({ name: "", startDate: "", endDate: "", price: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this seasonal price?")) return;
    try {
      await axios.delete(`http://localhost:3000/rooms/seasonal-prices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeasonalPrices(seasonalPrices.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {room
          ? `Seasonal Prices for ${room.type} - ${room.hotel?.name}`
          : "All Seasonal Prices"}
      </h2>

      {roomId && (
        <form
          onSubmit={handleAdd}
          className="bg-white p-4 rounded-lg shadow space-y-4"
        >
          <input
            type="text"
            placeholder="Season Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border p-2 rounded-md w-full"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required
              className="border p-2 rounded-md w-full"
            />
          </div>
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            className="border p-2 rounded-md w-full"
          />
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
            Add Seasonal Price
          </button>
        </form>
      )}

      {seasonalPrices.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {!room && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hotel
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Season Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seasonalPrices.map((s) => (
                  <tr key={s.id}>
                    {!room && (
                      <>
                        <td className="px-6 py-4">{s.room?.type}</td>
                        <td className="px-6 py-4">{s.room?.hotel?.name}</td>
                      </>
                    )}
                    <td className="px-6 py-4">{s.name}</td>
                    <td className="px-6 py-4">{s.startDate?.slice(0, 10)}</td>
                    <td className="px-6 py-4">{s.endDate?.slice(0, 10)}</td>
                    <td className="px-6 py-4">${s.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonalPrices;
