const Hotel = require("../Models/Hotel");
const sequelize = require("../db");

const hotels = [
  {
    name: "Desert Oasis Resort",
    city: "Aqaba",
    address: "45 Red Sea Blvd",
    description: "Relax by the Red Sea with amazing views.",
    coverImage: "http://localhost:3000/uploads/DesertOasisResort.jpeg",
    manager: "Bob Smith",
  },
  {
    name: "City Center Inn",
    city: "Irbid",
    address: "12 Downtown Avenue",
    description: "Affordable comfort near the city center.",
    coverImage: "http://localhost:3000/uploads/CityCenterInn.jpeg",
    manager: "Carol White",
  },
  {
    name: "Mountain View Lodge",
    city: "Ajloun",
    address: "89 Hilltop Road",
    description: "Enjoy breathtaking mountain scenery.",
    coverImage: "http://localhost:3000/uploads/MountainViewLodge.jpeg",
    manager: "David Green",
  },
  {
    name: "Seaside Escape",
    city: "Aqaba",
    address: "22 Coral Street",
    description: "Perfect for sun, sand, and relaxation.",
    coverImage: "http://localhost:3000/uploads/SeasideEscape.jpeg",
    manager: "Ella Brown",
  },
  {
    name: "Historic Downtown Hotel",
    city: "Amman",
    address: "5 Old Town Road",
    description: "Experience the charm of the old city.",
    coverImage: "http://localhost:3000/uploads/HistoricDowntownHotel.jpeg",
    manager: "Frank Lee",
  },
  {
    name: "Luxury Suites Amman",
    city: "Amman",
    address: "77 King Abdullah St",
    description: "Upscale suites with premium amenities.",
    coverImage: "http://localhost:3000/uploads/LuxurySuitsAmman.jpeg",
    manager: "Grace Kim",
  },
  {
    name: "Jordan Valley Retreat",
    city: "Jerash",
    address: "30 Valley View Lane",
    description: "Peaceful retreat surrounded by nature.",
    coverImage: "http://localhost:3000/uploads/JordranValleyRetreat.jpeg",
    manager: "Henry Adams",
  },
  {
    name: "Royal Amman Hotel",
    city: "Amman",
    address: "10 Royal Street",
    description: "Elegant hotel with fine dining options.",
    coverImage: "http://localhost:3000/uploads/RoyalAmmanHotel.jpeg",
    manager: "Isabella Moore",
  },
  {
    name: "Red Rock Hotel",
    city: "Petra",
    address: "50 Ancient Way",
    description: "Stay close to the wonders of Petra.",
    coverImage: "http://localhost:3000/uploads/RedRockHotel.jpeg",
    manager: "Jack Wilson",
  },
  {
    name: "Blue Lagoon Resort",
    city: "Aqaba",
    address: "9 Lagoon Blvd",
    description: "Dive into luxury and stunning sea views.",
    coverImage: "http://localhost:3000/uploads/BlueLagoonResort.jpeg",
    manager: "Karen Taylor",
  },
];

(async () => {
  try {
    await sequelize.sync();
    await Hotel.bulkCreate(hotels);
    console.log("10 hotels inserted successfully");
    process.exit();
  } catch (err) {
    console.error("Error inserting hotels:", err);
  }
})();
