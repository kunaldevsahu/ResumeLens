import "./config/env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "resumelens-api",
  });
});

const PORT = process.env.PORT|| 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
