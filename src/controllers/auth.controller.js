const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  signup: async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ "status": "ERROR", "message": "All fields are required" });
    }

    try {
      const user = await prisma.user.findUnique(
        {
          where: { email: email }
        }
      )

      if (user) {
        return res.status(409).json({ "status": "ERROR", "message": "An account with this email already exists" });
      }

      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: hashedPass,
          firstName: firstName,
          lastName: lastName,
        }
      }
      );
      const jwtToken = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      return res.status(201).json({
        "status": "CREATED", "message": "Account created succesfully", "data": {
          "email": email,
          "firstName": firstName,
          "lastName": lastName,
          "jwt": jwtToken,
        }
      })

    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ "status": "ERROR", "message": "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ "status": "ERROR", "message": "All fields are required" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email: email } });

      if (!user) {
        return res.status(401).json({ "status": "ERROR", "message": "Invalid email or password" });
      }

      const checkPwd = await bcrypt.compare(password, user.password);

      if (!checkPwd) {
        return res.status(401).json({ "status": "ERROR", "message": "Invalid email or password" });
      }

      const jwtToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      return res.status(200).json({
        "status": "LOGGED IN", "message": "Logged in succesfully", "data": {
          "email": user.email,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "jwt": jwtToken,
        }
      });
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ "status": "ERROR", "message": "Internal server error" });
    }
  },
}
module.exports = authController
