const authRouter = require("./routes/auth.routes.js")
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "API is running" })
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
