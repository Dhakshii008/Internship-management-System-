const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ SERVE FRONTEND FILES
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Flexible schema
const productSchema = new mongoose.Schema({}, { strict: false });
const Internship = mongoose.model("Internship", productSchema);

// ================= ROUTES =================

// Home route → show index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET all internships
app.get("/internships", async (req, res) => {
  const data = await Internship.find();
  res.json(data);
});

// ADD internship
app.post("/internships", async (req, res) => {
  const newData = new Internship(req.body);
  await newData.save();
  res.json(newData);
});

// DELETE internship
app.delete("/internships/:id", async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});