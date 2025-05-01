
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Basit test endpoint
app.get("/", (req, res) => {
  res.send("TKGM Backend Çalışıyor");
});

// Sunucu başlat
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Sunucu çalışıyor:", PORT);
});
