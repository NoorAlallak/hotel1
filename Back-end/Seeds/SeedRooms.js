const Room = require("../Models/Room");
const sequelize = require("../db");

const rooms = [
  {
    hotelId: 31,
    type: "single",
    capacity: 2,
    basePrice: 150,
    description: "Elegant suite, city views",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh6rPd9hx_fUGzorshx1fG5kzUM5FGCSYmm2YBuLU3uSFFI5BviIWd6hrHbw&s",
    createdAt: "2025-09-22 11:14:27",
    updatedAt: "2025-09-22 11:14:27",
  },
  {
    hotelId: 32,
    type: "family",
    capacity: 4,
    basePrice: 220,
    description: "Spacious room, beach access",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3cuh5zK82K_1j6DvwkFFqazqrC_kkT9_1tHvgfuPPWRaXMe_5",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 33,
    type: "suite",
    capacity: 3,
    basePrice: 180,
    description: "Cozy loft, mountain sunrise",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlTxmzotpbRhNoAGHBiKkRpSbMBkBKD11gw6DNKFlDLm1BcD87",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 34,
    type: "double",
    capacity: 2,
    basePrice: 170,
    description: "Private terrace, sea views",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh6rPd9hx_fUGzorshx1fG5kzUM5FGCSYmm2YBuLU3uSFFI5BviIWd6hrHbw&s",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 35,
    type: "double",
    capacity: 2,
    basePrice: 130,
    description: "Antique decor, city-centre location",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3cuh5zK82K_1j6DvwkFFqazqrC_kkT9_1tHvgfuPPWRaXMe_5",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 36,
    type: "family",
    capacity: 4,
    basePrice: 350,
    description: "Large living space, luxury amenities",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlTxmzotpbRhNoAGHBiKkRpSbMBkBKD11gw6DNKFlDLm1BcD87",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 37,
    type: "double",
    capacity: 2,
    basePrice: 120,
    description: "Tranquil views, nature-inspired",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh6rPd9hx_fUGzorshx1fG5kzUM5FGCSYmm2YBuLU3uSFFI5BviIWd6hrHbw&s",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 38,
    type: "single",
    capacity: 2,
    basePrice: 400,
    description: "Finest dining, elegant design",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3cuh5zK82K_1j6DvwkFFqazqrC_kkT9_1tHvgfuPPWRaXMe_5",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 39,
    type: "suite",
    capacity: 3,
    basePrice: 250,
    description: "Room with Petra monuments view",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlTxmzotpbRhNoAGHBiKkRpSbMBkBKD11gw6DNKFlDLm1BcD87",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
  {
    hotelId: 40,
    type: "family",
    capacity: 4,
    basePrice: 300,
    description: "Beachfront room, stunning sea views",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh6rPd9hx_fUGzorshx1fG5kzUM5FGCSYmm2YBuLU3uSFFI5BviIWd6hrHbw&s",
    createdAt: "2025-09-22 11:24:47",
    updatedAt: "2025-09-22 11:24:47",
  },
];

(async () => {
  try {
    await sequelize.sync();
    await Room.bulkCreate(rooms);
    console.log("Sample rooms inserted successfully");
    process.exit();
  } catch (err) {
    console.error("Error inserting rooms:", err);
  }
})();
