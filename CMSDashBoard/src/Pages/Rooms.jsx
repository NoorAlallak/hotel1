import React, { useState, useEffect } from "react";
import RoomApi from "../Apis/RoomApi";
import axios from "axios";
import ExportButton from "../Components/ExportButton";

export default function Rooms({ setActivePage, setSelectedRoomId }) {
  const [rooms, setRooms] = useState([]);
  const [, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showSeasonalPriceModal, setShowSeasonalPriceModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [formData, setFormData] = useState({
    hotelId: "",
    type: "",
    capacity: 2,
    basePrice: "",
    description: "",
    images: [],
  });

  const [seasonalPriceData, setSeasonalPriceData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    price: "",
  });

  // Fetch rooms and hotels
  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await RoomApi.getAll();
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching rooms: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:3000/hotels/");
      setHotels(res.data.hotels);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images") data.append(key, formData[key]);
    });
    formData.images.forEach((file) => data.append("images", file));

    try {
      if (editingRoom) {
        await RoomApi.update(editingRoom.id, data);
      } else {
        await RoomApi.create(data);
      }
      setShowModal(false);
      setEditingRoom(null);
      setFormData({
        hotelId: "",
        type: "single",
        capacity: 2,
        basePrice: "",
        description: "",
        images: [],
      });
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Error saving room: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      hotelId: room.hotelId,
      type: room.type,
      capacity: room.capacity,
      basePrice: room.basePrice,
      description: room.description || "",
      images: room.images || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      setLoading(true);
      await RoomApi.delete(id);
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Error deleting room: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add seasonal price
  const handleAddSeasonalPrice = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await RoomApi.addSeasonalPrice(selectedRoom.id, seasonalPriceData);
      setSeasonalPriceData({ name: "", startDate: "", endDate: "", price: "" });
      setShowSeasonalPriceModal(false);
      fetchRooms();
    } catch (err) {
      alert("Error adding seasonal price: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete seasonal price
  const handleDeleteSeasonalPrice = async (id) => {
    try {
      setLoading(true);
      await RoomApi.deleteSeasonalPrice(id);
      fetchRooms();
    } catch (err) {
      alert("Error deleting seasonal price: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    return rooms.map((room) => ({
      ID: room.id,
      Hotel: room.hotel?.name,
      Type: room.type,
      Capacity: room.capacity,
      BasePrice: room.basePrice,
      Description: room.description,
    }));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rooms</h2>
        <div className="space-x-2 flex items-center ">
          <ExportButton data={exportData()} filename="rooms" />
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Add Room
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      {/* Rooms Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4">{room.hotel?.name}</td>
                <td className="px-6 py-4">{room.type}</td>
                <td className="px-6 py-4">{room.capacity}</td>
                <td className="px-6 py-4">${room.basePrice}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setActivePage("seasonal-prices");
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    Seasonal Price
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Modal content */}
        </div>
      )}

      {/* Seasonal Price Modal */}
      {showSeasonalPriceModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 overflow-y-auto max-h-[80vh]">
            <h3 className="text-lg font-semibold mb-4">
              Seasonal Prices for {selectedRoom.type} -{" "}
              {selectedRoom.hotel?.name}
            </h3>

            {/* Add New Seasonal Price Form */}
            <form onSubmit={handleAddSeasonalPrice} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium">Season Name</label>
                <input
                  type="text"
                  required
                  value={seasonalPriceData.name}
                  onChange={(e) =>
                    setSeasonalPriceData({
                      ...seasonalPriceData,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={seasonalPriceData.startDate}
                    onChange={(e) =>
                      setSeasonalPriceData({
                        ...seasonalPriceData,
                        startDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    required
                    value={seasonalPriceData.endDate}
                    onChange={(e) =>
                      setSeasonalPriceData({
                        ...seasonalPriceData,
                        endDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={seasonalPriceData.price}
                  onChange={(e) =>
                    setSeasonalPriceData({
                      ...seasonalPriceData,
                      price: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Seasonal Price
                </button>
              </div>
            </form>

            {/* Existing Seasonal Prices */}
            {selectedRoom.seasonalPrices?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Existing Seasonal Prices</h4>
                <ul className="divide-y divide-gray-200">
                  {selectedRoom.seasonalPrices.map((price) => (
                    <li
                      key={price.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1"
                    >
                      <div>
                        {price.name} (
                        {new Date(price.startDate).toLocaleDateString()} -{" "}
                        {new Date(price.endDate).toLocaleDateString()}) - $
                        {price.price}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSeasonalPrice(price.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowSeasonalPriceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
