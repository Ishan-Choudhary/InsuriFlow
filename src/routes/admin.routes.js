const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");
const adminController = require("../controllers/admin.controller");

const adminRouter = express.Router();

adminRouter.get("/claims", authenticateToken, authorizeAdmin, adminController.getAllClaims);

adminRouter.put("/claims/:id", authenticateToken, authorizeAdmin, adminController.updateClaimStatus);

module.exports = adminRouter;
