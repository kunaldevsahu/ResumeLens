import "./config/env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import paymentRoutes from "./routes/payment.routes";
import atsRoutes from "./routes/ats.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ats", atsRoutes);

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
