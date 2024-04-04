import mongoose from "mongoose";

import { Insight } from "./types";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const insightsSchema = new mongoose.Schema<Insight>({
  end_year: Number,
  intensity: Number,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: Number,
  impact: Number,
  added: String,
  published: String,
  country: String,
  relevance: Number,
  pestle: String,
  source: String,
  title: String,
  likelihood: Number,
});

const InsightModel = mongoose.model<Insight>("Insights", insightsSchema);

export { connectDB, InsightModel };
