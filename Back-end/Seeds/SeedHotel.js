const Hotel = require("../Models/Hotel");
const sequelize = require("../db");

const hotels = [
  {
    name: "Desert Oasis Resort",
    city: "Aqaba",
    address: "45 Red Sea Blvd",
    description: "Relax by the Red Sea with amazing views.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvgHBf_6AwnAxjEoQlyUXS_6n-WslCmeSndg&s",
    manager: "Bob Smith",
  },
  {
    name: "City Center Inn",
    city: "Irbid",
    address: "12 Downtown Avenue",
    description: "Affordable comfort near the city center.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS27aaRrY9bLN1nr7SGoF7ezhMLk5LKziWoZQ&s",
    manager: "Carol White",
  },
  {
    name: "Mountain View Lodge",
    city: "Ajloun",
    address: "89 Hilltop Road",
    description: "Enjoy breathtaking mountain scenery.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR33PWe8Opg3CoGZniQvJgjdT38iomBo-h6Dw&s",
    manager: "David Green",
  },
  {
    name: "Seaside Escape",
    city: "Aqaba",
    address: "22 Coral Street",
    description: "Perfect for sun, sand, and relaxation.",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXUKJJvZ5PtLbhRs6bsboj-0rT0CD_rHbbIQ&s",
    manager: "Ella Brown",
  },
  {
    name: "Historic Downtown Hotel",
    city: "Amman",
    address: "5 Old Town Road",
    description: "Experience the charm of the old city.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7liG4ElULbiRNpzB2dKgA2Rd2GwbHtF4XA&s",
    manager: "Frank Lee",
  },
  {
    name: "Luxury Suites Amman",
    city: "Amman",
    address: "77 King Abdullah St",
    description: "Upscale suites with premium amenities.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzOqIHo8D6g3bO1uQXrXaMEUb_mQ5rYX4pQ&s",
    manager: "Grace Kim",
  },
  {
    name: "Jordan Valley Retreat",
    city: "Jerash",
    address: "30 Valley View Lane",
    description: "Peaceful retreat surrounded by nature.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxOoekB_I8qUek6c2bMrr7OsDbf7vv_5tvtg&s",
    manager: "Henry Adams",
  },
  {
    name: "Royal Amman Hotel",
    city: "Amman",
    address: "10 Royal Street",
    description: "Elegant hotel with fine dining options.",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYGxVx4JZ9gLBPwzdl6rwirt10Ara__3vxAg&s",
    manager: "Isabella Moore",
  },
  {
    name: "Red Rock Hotel",
    city: "Petra",
    address: "50 Ancient Way",
    description: "Stay close to the wonders of Petra.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbGpqv3J9YDb8zVFGr6RwWOpwWiDUhtqjybQ&s",
    manager: "Jack Wilson",
  },
  {
    name: "Blue Lagoon Resort",
    city: "Aqaba",
    address: "9 Lagoon Blvd",
    description: "Dive into luxury and stunning sea views.",
    coverImage:
      "	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0TlO7BQYwIV0YRZWuzIcu843yN3aT7SBdyA&s",
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
