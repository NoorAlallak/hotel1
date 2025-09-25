import React, { useState, useEffect } from "react";
import { useLanguage } from "../Context/LanguageContext";
import ExportButton from "../Components/ExportButton";
import axios from "axios";
const Hotels = () => {
  const { t } = useLanguage();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    coverImage: "",
    manager: "",
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:3000/hotels");

        if (response.data.hotels) {
          setHotels(response.data.hotels);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name || "",
      city: hotel.city || "",
      address: hotel.address || "",
      description: hotel.description || "",
      coverImage: hotel.coverImage || "",
      manager: hotel.manager || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/hotels/${id}`
        );

        if (response.status === 200) {
          setHotels(hotels.filter((hotel) => hotel.id !== id));
        } else {
          alert("Error deleting hotel");
        }
      } catch (error) {
        console.error("Error deleting hotel:", error);
        alert("Error deleting hotel");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.city ||
      !formData.address ||
      !formData.description ||
      !formData.coverImage ||
      !formData.manager
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      let response;

      if (editingHotel) {
        response = await axios.put(
          `http://localhost:3000/hotels/${editingHotel.id}`,
          formData
        );
      } else {
        response = await axios.post("http://localhost:3000/hotels", formData);
      }

      if (response.status === 200 || response.status === 201) {
        const savedHotel = response.data;

        if (editingHotel) {
          setHotels(
            hotels.map((hotel) =>
              hotel.id === editingHotel.id ? savedHotel : hotel
            )
          );
        } else {
          setHotels([...hotels, savedHotel]);
        }

        setShowForm(false);
        setEditingHotel(null);
        setFormData({
          name: "",
          city: "",
          address: "",
          description: "",
          coverImage: "",
          manager: "",
        });
      } else {
        alert(`Error: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving hotel:", error);
      alert("Error saving hotel");
    }
  };

  // Prepare data for export
  const exportData = hotels.map((hotel) => ({
    ID: hotel.id,
    Name: hotel.name,
    City: hotel.city,
    Address: hotel.address,
    Manager: hotel.manager,
    Description: hotel.description,
    "Cover Image": hotel.coverImage,
    "Created At": hotel.createdAt,
    "Updated At": hotel.updatedAt,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading hotels...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("hotels")}</h2>
        <div className="flex space-x-2">
          <ExportButton data={exportData} filename="hotels" />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            {t("addNew")} {t("hotels")}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t("hotelList")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("totalHotels")}: {hotels.length}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {hotel.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {hotel.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{hotel.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{hotel.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{hotel.manager}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="text-blue-600 hover:text-blue-900 mr-4 p-2 rounded hover:bg-blue-50"
                      title={t("edit") || "Edit"}
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                      title={t("delete") || "Delete"}
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">
            {editingHotel ? t("edit") : t("addNew")} Hotel
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manager *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.manager}
                  onChange={(e) =>
                    setFormData({ ...formData, manager: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingHotel(null);
                  setFormData({
                    name: "",
                    city: "",
                    address: "",
                    description: "",
                    coverImage: "",
                    manager: "",
                  });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {hotels.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-hotel text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("noHotelsFound")}
          </h3>
          <p className="text-gray-500">{t("addFirstHotel")}</p>
        </div>
      )}
    </div>
  );
};

export default Hotels;
