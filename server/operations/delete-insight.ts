import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient;

type DeleteInsightResponse = {
  success: boolean;
  message: string;
};

export default function deleteInsight(
  input: Input,
  id: number,
): DeleteInsightResponse {
  if (isNaN(id)) {
    return { success: false, message: "Invalid id parameter" };
  }
  console.log("deleting insight with id: " + id);
  const result = input.db.prepare("DELETE FROM insights WHERE id = ?").run(id);

  if (result === 0) {
    return { success: false, message: "Insight not found" };
  }
  console.log("Insight deleted successfully");

  return { success: true, message: "Insight deleted successfully" };
}
