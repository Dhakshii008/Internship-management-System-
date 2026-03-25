const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 Serve frontend files (VERY IMPORTANT)
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Flexible schema
const internshipSchema = new mongoose.Schema({}, { strict: false });
const Internship = mongoose.model("Internship", internshipSchema);

// =======================
// ROUTES
// =======================

// 🔹 Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 🔹 GET all internships
app.get("/internships", async (req, res) => {
  try {
    const data = await Internship.find();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 ADD internship
app.post("/internships", async (req, res) => {
  try {
    const newIntern = new Internship(req.body);
    await newIntern.save();
    res.json({ message: "Added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 DELETE internship
app.delete("/internships/:id", async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});