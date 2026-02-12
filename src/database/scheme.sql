CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    created_at DATE UNIQUE NOT NULL DEFAULT (DATE('now'))
);

CREATE TABLE IF NOT EXISTS log_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    sights TEXT,
    time TEXT,
    types TEXT NOT NULL, -- 'tasks', 'notes', 'ideas'
    FOREIGN KEY (log_id) REFERENCES logs (id) ON DELETE CASCADE
);