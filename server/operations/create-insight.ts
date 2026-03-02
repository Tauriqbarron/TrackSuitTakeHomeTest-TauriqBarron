import type { HasDBClient } from "../shared.ts";
import type { Insert } from "$tables/insights.ts";
import { BRANDS } from "../../lib/consts.ts";

type Input = HasDBClient;

type CreateInsightResponse = {
  success: boolean;
  message: string;
};

export default function createInsights(
  input: Input,
  insertdata: Insert,
): CreateInsightResponse {
  console.log("creating insight");

  if (!insertdata.text || !insertdata.brand) {
    console.error("Missing required fields: brand and text");
    return {
      success: false,
      message: "Missing required fields: brand and text",
    };
  }

  if (
    typeof insertdata.text !== "string" || typeof insertdata.brand !== "number"
  ) {
    console.error("Invalid data types for brand or text");
    return { success: false, message: "Invalid data types for brand or text" };
  }

  if (BRANDS.find((b) => b.id === insertdata.brand) === undefined) {
    console.error("Invalid brand value: " + insertdata.brand);
    return {
      success: false,
      message: "Invalid brand value: " + insertdata.brand,
    };
  }
  insertdata.createdAt = new Date().toISOString();
  input.db.prepare(
    "INSERT INTO insights (brand, createdAt, text) VALUES (:brand, :createdAt, :text)",
  ).run(insertdata);
  console.log("Insight created successfully");
  return { success: true, message: "Insight created successfully" };
}
