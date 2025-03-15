import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser";
import sequelize from "./src/db/sequelize.js"
import login from "./src/routes/auth.js";
import dotenv from "dotenv"

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev")).use(bodyParser.json());

sequelize.initDb()

login(app)

app.use(({res}) => {
  const message = "Bienvenue sur l'API d'FFXIV Chronicles !"
  res.status(404).json({message})
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
