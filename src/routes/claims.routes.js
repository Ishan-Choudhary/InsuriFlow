const express = require("express");

const authenticateToken = require("../middleware/auth.middleware.js");
const claimController = require("../controllers/claims.controller.js");

const claimsRouter = express.Router();

claimsRouter.post("/", authenticateToken, claimController.createClaim);
claimsRouter.get("/", authenticateToken, claimController.getClaimsList);

module.exports = claimsRouter;
