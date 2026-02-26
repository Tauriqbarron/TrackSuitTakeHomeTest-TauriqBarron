import type { HasDBClient } from "../shared.ts";
import { type Insert, insertStatement } from "$tables/insights.ts";

type Input = HasDBClient;

export default function createInsights(input: Input, insertdata: Insert): void {
  console.log("creating insight");
  console.log("text:" + insertdata.text);
  console.log("brand:" + insertdata.brand);
  insertdata.createdAt = new Date().toISOString();
  const insertSQL = insertStatement(insertdata);
  console.log("SQL:", insertSQL);
  const result = input.db.exec(insertSQL);

  console.log("Insight created successfully: ", result);
}
