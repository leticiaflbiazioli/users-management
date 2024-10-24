import "dotenv/config";
import express from "express";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
