import axios from "axios";
export const getRoomsByHotel = (hotelId) =>
  axios.get(`/rooms/hotel/${hotelId}`);

export const createRoom = (roomData, token) =>
  axios.post("/rooms", roomData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateRoom = (roomId, roomData, token) =>
  axios.put(`/rooms/${roomId}`, roomData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteRoom = (roomId, token) =>
  axios.delete(`/rooms/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
