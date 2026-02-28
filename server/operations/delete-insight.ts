import { HasDBClient } from "../shared.ts";

type input = HasDBClient;

export default function deleteInsight(input: input, id: number): void {
  console.log("deleting insight with id: " + id);
  const deleteSQL = `DELETE FROM insights WHERE id = ${id}`;
  console.log("SQL:", deleteSQL);
  const result = input.db.exec(deleteSQL);
  console.log("Insight deleted successfully: ", result);
}
