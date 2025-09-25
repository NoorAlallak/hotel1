import React, { useState, useEffect } from "react";
import RoomApi from "../Apis/RoomApi"; // your API functions
import axios from "axios";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showSeasonalPriceModal, setShowSeasonalPriceModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form state
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = async (index, imageUrl) => {
    if (editingRoom && typeof imageUrl === "string") {
      try {
        await RoomApi.deleteImage(editingRoom.id, imageUrl);
      } catch (err) {
        alert("Error deleting image: " + err.message);
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

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

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rooms</h2>
        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Add Room
        </button>
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
                      setSelectedRoom(room);
                      setShowSeasonalPriceModal(true);
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingRoom ? "Edit Room" : "Add Room"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Hotel</label>
                  <select
                    required
                    value={formData.hotelId}
                    onChange={(e) =>
                      setFormData({ ...formData, hotelId: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value=""></option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Base Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.images.map((image, i) => (
                    <div key={i} className="relative">
                      {image instanceof File ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <img
                          src={`http://localhost:3000${image}`}
                          alt="Room"
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i, image)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingRoom ? "Update Room" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seasonal Price Modal */}
      {showSeasonalPriceModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Seasonal Prices for {selectedRoom.hotel?.name}
            </h3>
            <form onSubmit={handleAddSeasonalPrice} className="space-y-4">
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
                  step="0.01"
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

              {selectedRoom.seasonalPrices?.length > 0 && (
                <div>
                  <h4 className="font-semibold mt-2 mb-1">
                    Existing Seasonal Prices
                  </h4>
                  <ul className="space-y-1">
                    {selectedRoom.seasonalPrices.map((price) => (
                      <li
                        key={price.id}
                        className="flex justify-between bg-gray-50 p-2 rounded"
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

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSeasonalPriceModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Seasonal Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
