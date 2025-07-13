const prisma = require("../lib/prisma.js");

const claimController = {
  createClaim: async (req, res) => {
    const { description, dateOfService, cost } = req.body;

    if (!description || !dateOfService || !cost) {
      return res.status(400).json({ "status": "ERROR", "message": "Missing fields" })
    }

    const userId = req.user.userId;

    try {
      const serviceDate = new Date(dateOfService);

      if (isNaN(serviceDate.getTime())) {
        return res.status(400).json({ "status": "ERROR", "message": "Invalid date format" })
      }

      const newClaim = await prisma.claim.create({
        data: {
          user: {
            connect: { id: userId }
          },
          description: description,
          dateOfService: serviceDate,
          cost: cost,
        }
      })

      return res.status(201).json({ "status": "SUCCESS", "message": "Claim created successfully", "claim": newClaim })
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ "status": "ERROR", "message": "Internal server error" })
    }
  },

  getClaimsList: async (req, res) => {
    const userId = req.user.userId;

    try {
      const claims = await prisma.claim.findMany({ where: { userId: userId }, orderBy: { createdAt: "desc" } })

      return res.status(200).json({ "status": "SUCCESS", "result": claims })
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ "status": "ERROR", "message": "Internal server error" })
    }
  }
}

module.exports = claimController;
