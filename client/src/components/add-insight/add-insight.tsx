import { useState } from "react";
import { BRANDS } from "../../../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  onInsightAdded: () => void;
};

export const AddInsight = (props: AddInsightProps) => {
  const [text, setInsightText] = useState("");
  const [brand, setBrand] = useState(1); // default to first brand in dropdown
  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/insights/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brand, text }),
    });
    props.onInsightAdded();
    setInsightText("");
    setBrand(1);
    props.onClose();
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select
            className={styles["field-input"]}
            value={brand}
            onChange={(e) => setBrand(Number(e.target.value))}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={(e) => setInsightText(e.target.value)}
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
