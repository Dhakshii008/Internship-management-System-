const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ VERY IMPORTANT (YOU MISSED THIS)
app.use(express.static(__dirname));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const schema = new mongoose.Schema({}, { strict: false });
const Internship = mongoose.model("Internship", schema);

// ✅ SHOW index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET
app.get("/internships", async (req, res) => {
  const data = await Internship.find();
  res.json(data);
});

// POST
app.post("/internships", async (req, res) => {
  const newData = new Internship(req.body);
  await newData.save();
  res.json(newData);
});

// DELETE
app.delete("/internships/:id", async (req, res) => {
  await Internship.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});