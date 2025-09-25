import axios from "axios";

const BASE = "http://localhost:3000/rooms";

const RoomApi = {
  getAll: () => axios.get(BASE),
  getOne: (id) => axios.get(`${BASE}/${id}`),
  create: (formData) =>
    axios.post(BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    axios.put(`${BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => axios.delete(`${BASE}/${id}`),
  deleteImage: (roomId, imageUrl) =>
    axios.delete(`${BASE}/${roomId}/images`, { data: { imageUrl } }),
  addSeasonalPrice: (roomId, spData) =>
    axios.post(`${BASE}/${roomId}/seasonal-prices`, spData),
  deleteSeasonalPrice: (spId) =>
    axios.delete(`${BASE}/seasonal-prices/${spId}`),
};

export default RoomApi;
