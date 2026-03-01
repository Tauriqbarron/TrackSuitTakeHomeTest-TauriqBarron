import type { HasDBClient } from "../shared.ts";

type input = HasDBClient;

export default function deleteInsight(input: input, id: number): void {
  console.log("deleting insight with id: " + id);
  input.db.prepare("DELETE FROM insights WHERE id = ?").run(id);
  console.log("Insight deleted successfully");
}
