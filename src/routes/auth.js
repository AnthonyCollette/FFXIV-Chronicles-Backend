const { User } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = (app) => {
  app.post("/api/login", (req, res) => {
    User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        console.log("USER : " + user);
        if (!user) {
          const message = "L'utilisateur demandé n'existe pas.";
          return res.status(404).json({ message });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((isPasswordValid) => {
            if (!isPasswordValid) {
              const message = `Le mot de passe est incorrect`;
              return res.status(401).json({ message });
            }
            const token = jwt.sign(
              { userId: user.id },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token });
          });
      })
      .catch((error) => {
        const message =
          "L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.";
        return res.json({ message, data: error });
      });
  });

  app.post("/api/register", async (req, res) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      !req.body.username ||
      req.body.username === "" ||
      req.body.username === undefined
    ) {
      return res.status(400).json({
        errors: ["Un nom d'utilisateur est obligatoire"],
      });
    }
    if (
      !req.body.email ||
      req.body.email === "" ||
      req.body.email === undefined
    ) {
      return res.status(400).json({
        errors: ["Une adresse email est obligatoire"],
      });
    }
    if (req.body.password === "" || req.body.password === undefined || req.body.password === null) {
      return res.status(400).json({
        errors: ["Un mot de passe est obligatoire"],
      });
    }
    if (!regex.test(req.body.email)) {
      return res.status(400).json({
        errors: [
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
        ],
      });
    }

    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        username: req.body.username,
        password: hash,
        email: req.body.email,
      });
    } catch (error) {
      console.log(error);

      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          errors: error.errors.map((err) => err.message),
        });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
    return res.json({ message: "L'utilisateur a été créé avec succès" });
  });
};
