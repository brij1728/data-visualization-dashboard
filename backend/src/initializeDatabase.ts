import dotenv from "dotenv";

import jsonData from "./data/insights-data.json";
import { connectDB, InsightModel } from "./db";
import { Insight } from "./types";
import { validateEnv } from "./utils";

dotenv.config();
validateEnv();

const convertToNumber = (value: string | number | null) => {
  if (value === null || value === "") return null;
  if (typeof value === "number") return value;
  return parseFloat(value);
};

const insertData = async () => {
  await connectDB();

  if (await InsightModel.countDocuments()) {
    console.log("Data already exists");
    return;
  }

  for (const insight of jsonData) {
    const data: Insight = {
      end_year: convertToNumber(insight.end_year),
      intensity: convertToNumber(insight.intensity),
      sector: insight.sector,
      topic: insight.topic,
      insight: insight.insight,
      url: insight.url,
      region: insight.region,
      start_year: convertToNumber(insight.start_year),
      impact: convertToNumber(insight.impact),
      added: insight.added,
      published: insight.published,
      country: insight.country,
      relevance: convertToNumber(insight.relevance),
      pestle: insight.pestle,
      source: insight.source,
      title: insight.title,
      likelihood: convertToNumber(insight.likelihood),
    };
    const document = new InsightModel(data);
    await document.save();
    console.log("Data inserted");
  }
};

(async () => {
  try {
    await insertData();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
