const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "API is running" })
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
