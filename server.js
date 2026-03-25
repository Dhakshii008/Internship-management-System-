const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // 🔥 THIS LINE FIXES YOUR PROBLEM

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/internshipDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const InternshipSchema = new mongoose.Schema({
  internship_id: Number,
  title: String,
  company_id: Number,
  stipend: Number
});

// Model
const Internship = mongoose.model("internships", InternshipSchema);

// GET
app.get("/internships", async (req, res) => {
  const data = await Internship.find();
  res.json(data);
});

// POST
app.post("/internships", async (req, res) => {
  console.log("DATA RECEIVED:", req.body);

  const newIntern = new Internship(req.body);
  await newIntern.save();

  res.json(newIntern);
});

// DELETE
app.delete("/internships/:id", async (req, res) => {
  await Internship.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});