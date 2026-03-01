import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { BRANDS } from "../../../../lib/consts.ts";
import { Modal } from "../modal/modal.tsx";
import { useState } from "react";
import { Button } from "../button/button.tsx";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onInsightDeleted: () => void;
};

interface InsightItemProps {
  insight: Insight;
  onDelete: (id: number) => Promise<Response>;
}

async function deleteInsight(id: number): Promise<Response> {
  return await fetch(`/api/insights/delete?id=${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

const InsightItem = ({ insight, onDelete }: InsightItemProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");

    const response = await onDelete(insight.id);
    if (!response.ok) {
      setError("Failed to delete insight");
      return;
    }
    setConfirmOpen(false);
  };

  return (
    <div className={styles.insight} key={insight.id}>
      <div className={styles["insight-meta"]}>
        <span>{BRANDS.find((f) => f.id === insight.brand)?.name}</span>
        <div className={styles["insight-meta-details"]}>
          <span>{new Date(insight.createdAt).toLocaleString()}</span>
          <Trash2Icon
            className={styles["insight-delete"]}
            onClick={() => setConfirmOpen(true)}
          />
          <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            {error && <p style={{ color: "var(--color-red-500)" }}>{error}</p>}
            <p>Are you sure you want to delete this insight?</p>
            <Button
              theme="primary"
              style={{ marginRight: "1rem" }}
              type="button"
              onClick={handleDelete}
              label="Yes"
            />
            <Button
              theme="secondary"
              type="button"
              onClick={() => setConfirmOpen(false)}
              label="Cancel"
            />
          </Modal>
        </div>
      </div>
      <p className={styles["insight-content"]}>{insight.text}</p>
    </div>
  );
};

export const Insights = ({
  insights,
  className,
  onInsightDeleted,
}: InsightsProps) => {
  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length ? (
          insights.map((insight) => (
            <InsightItem
              key={insight.id}
              insight={insight}
              onDelete={async (id) => {
                const response = await deleteInsight(id);
                if (response.ok) {
                  onInsightDeleted();
                }
                return response;
              }}
            ></InsightItem>
          ))
        ) : (
          <p>We have no insight!</p>
        )}
      </div>
    </div>
  );
};
