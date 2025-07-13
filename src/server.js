const express = require("express");
const authRouter = require("./routes/auth.routes.js");
const claimsRouter = require("./routes/claims.routes.js");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use("/api/auth", authRouter);
app.use("/api/claims", claimsRouter)

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "API is running" })
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
