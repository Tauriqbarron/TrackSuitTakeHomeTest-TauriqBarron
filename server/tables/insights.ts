// updated to be idempotent.
export const createTable = `
  CREATE TABLE IF NOT EXISTS insights ( 
    id INTEGER PRIMARY KEY ASC NOT NULL,
    brand INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    text TEXT NOT NULL
  )
`;

export type Row = {
  id: number;
  brand: number;
  createdAt: string;
  text: string;
};

export type Insert = {
  brand: number;
  createdAt?: string;
  text: string;
};

// escaping single quotes in text to prevent SQL injection and syntax errors. Could be improved by using parameterized queries as SQLite supports them, but this is a simple improvement for now.
export const insertStatement = (item: Insert) =>
  `INSERT INTO insights (brand, createdAt, text) VALUES (${item.brand}, '${item.createdAt}', '${
    item.text.replace(/'/g, "''")
  }')`;
