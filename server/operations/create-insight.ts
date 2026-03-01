import type { HasDBClient } from "../shared.ts";
import type { Insert } from "$tables/insights.ts";
import { BRANDS } from "../../lib/consts.ts";

type Input = HasDBClient;

export default function createInsights(input: Input, insertdata: Insert): void {
  console.log("creating insight");
  insertdata.createdAt = new Date().toISOString();
  if (!insertdata.text || !insertdata.brand) {
    console.error("Missing required fields: brand and text");
    return;
  }

  if (
    typeof insertdata.text !== "string" || typeof insertdata.brand !== "number"
  ) {
    console.error("Invalid data types for brand or text");
    return;
  }

  if (BRANDS.find((b) => b.id === insertdata.brand) === undefined) {
    console.error("Invalid brand value: " + insertdata.brand);
    return;
  }

  input.db.prepare(
    "INSERT INTO insights (brand, createdAt, text) VALUES (@brand, @createdAt, @text)",
  ).run(insertdata);
  console.log("Insight created successfully");
}
