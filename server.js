const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

/* =========================
   Schema & Model
========================= */
const InternshipSchema = new mongoose.Schema({
  internship_id: Number,
  title: String,
  company_id: Number,
  stipend: Number
});

const Internship = mongoose.model("Internship", InternshipSchema);

/* =========================
   Routes
========================= */

// Root check
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully");
});

// Get all internships
app.get("/internships", async (req, res) => {
  try {
    const data = await Internship.find();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add internship
app.post("/internships", async (req, res) => {
  try {
    const newInternship = new Internship(req.body);
    await newInternship.save();
    res.json(newInternship);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete internship
app.delete("/internships/:id", async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   Server Start
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});