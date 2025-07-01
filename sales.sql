CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  target NUMERIC(12, 2),
  january NUMERIC(12, 2),
  february NUMERIC(12, 2),
  march NUMERIC(12, 2),
  april NUMERIC(12, 2),
  may NUMERIC(12, 2),
  june NUMERIC(12, 2),
  july NUMERIC(12, 2),
  august NUMERIC(12, 2),
  september NUMERIC(12, 2),
  october NUMERIC(12, 2),
  november NUMERIC(12, 2),
  december NUMERIC(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);