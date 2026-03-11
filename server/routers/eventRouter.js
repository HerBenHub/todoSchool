import db from '../db.js';
import express from 'express';

const eventRouter = express.Router();

eventRouter.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events");
    res.json(rows);
  } catch (error) {
    console.error("Hiba az események lekérésekor:", error);
    res.status(500).json({ hiba: "Szerverhiba történt" });
  }
});

eventRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ hiba: "Esemény nem található" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Hiba az esemény lekérésekor:", error);
    res.status(500).json({ hiba: "Szerverhiba történt" });
  }
});

eventRouter.post("/", async (req, res) => {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
        return res.status(400).json({ hiba: "A 'title', 'description' és 'userId' mezők kötelezőek" });
    }

    try {
        const userCheck = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        if (userCheck.length === 0) {
            return res.status(400).json({ hiba: "A megadott user_id nem létezik" });
        }

        const result = await db.query(
            "INSERT INTO events (title, description, date, user_id) VALUES (?, ?, NOW(), ?)",
            [title, description, userId]
        );


        res.status(201).json({ uzenet: "Esemény sikeresen létrehozva", event: result.insertId });
    } catch (error) {
        console.error("Hiba az esemény létrehozásakor:", error.message);
        res.status(500).json({ hiba: "Szerverhiba történt" });
    }
});

eventRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ hiba: "A mezők kötelezők!" });
    }
    
    try {
        const rows = await db.query(
        "UPDATE `events` SET `title`=?,`description`=? WHERE id = ?",
        [title, description, id]
        );
        if (rows.length === 0) {
        return res.status(404).json({ hiba: "Esemény nem található" });
        }
        res.json({ message: "Esemény sikeresen módosítva", id: rows.affectedRows });
    } catch (error) {
        console.error("Hiba az esemény frissítésekor:", error);
        res.status(500).json({ hiba: "Szerverhiba történt" });
    }
});

eventRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
        "DELETE FROM events WHERE id = ?",
        [id]
        );
        if (rows.length === 0) {
        return res.status(404).json({ hiba: "Esemény nem található" });
        }
        res.json({ message: "Esemény sikeresen törölve" });
    } catch (error) {
        console.error("Hiba az esemény törlésekor:", error);
        res.status(500).json({ hiba: "Szerverhiba történt" });
    }
});

export default eventRouter;