import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import portfolioRoutes from "./routes/portfolio.routes.js";
import projectRoutes from "./routes/project.routes.js";
import expRoutes from "./routes/experience.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";

// import path from "path";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://aakash-shrestha.onrender.com",
    ],
    credentials: true,
  }),
);
app.use("/uploads", express.static("uploads"));

//Api's
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api", portfolioRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/exp", expRoutes);
app.use("/api/achievement", achievementRoutes);

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
