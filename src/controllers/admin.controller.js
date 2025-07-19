const prisma = require("../lib/prisma.js");

const adminController = {
  getAllClaims: async (req, res) => {

    try {

      const claimsList = await prisma.claim.findMany(
        {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true }
            }
          }
        }
      )

      return res.status(200).json({ "status": "SUCCESS", "result": claimsList });
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ "status": "ERROR", "message": "Internal server error" });
    }
  },

  updateClaimStatus: async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if ((status !== "APPROVED") && (status !== "DENIED")) {
      return res.status(400).json({ "status": "ERROR", "message": "Bad request" })
    }

    try {
      //Pre-flight checks
      const getClaim = await prisma.claim.findUnique({
        where: { id: id },
      })

      if (!getClaim) {
        return res.status(404).json({ "status": "ERROR", "message": "Claim not found" })
      }
      if (getClaim.status === status) {
        return res.status(200).json({ "status": "SUCCESS", "message": "Claim was already updated to desired status", data: getClaim });
      }

      if (getClaim.status !== "PENDING") {
        return res.status(409).json({ "status": "ERROR", "message": "Claim has already been processed." })
      }

      //Updating claim
      const updatedClaim = await prisma.$transaction(async (tx) => {

        if (status === "APPROVED") {
          const policy = await tx.policy.findUnique({ where: { id: getClaim.policyId } });

          if (!policy) throw new Error("Associated policy not found during transaction.");

          const newDeductible = Math.max(0, policy.deductibleRemaining - getClaim.cost);

          const policyUpdate = await tx.policy.update(
            {
              where: { id: policy.id },
              data: {
                deductibleRemaining: newDeductible,
              }
            }
          )
        }
        const finalClaim = await tx.claim.update(
          {
            where: { id: getClaim.id },
            data: { status: status },
            include: { policy: true },
          }
        )

        return finalClaim;
      })

      return res.status(200).json({ status: "SUCCESS", message: "Claim status updated successfully", data: updatedClaim });
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ "status": "ERROR", "message": "An internal server error occured" })
    }
  }

}

module.exports = adminController;
