
import db from '../db.js';
import express from 'express';

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Hiba a felhasználók lekérésekor:", error);
    res.status(500).json({ hiba: "Szerverhiba történt" });
  }
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ hiba: "Felhasználó nem található" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Hiba a felhasználó lekérésekor:", error);
    res.status(500).json({ hiba: "Szerverhiba történt" });
  }
});

userRouter.post("/", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ hiba: "A 'name' és 'email' mezők kötelezőek" });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );

        res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
        console.error("Hiba a felhasználó létrehozásakor:", error.message);
        res.status(500).json({ hiba: "Szerverhiba történt" });
    }
});

userRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name) {
        return res.status(400).json({ hiba: "A 'name' mező kötelező" });
    }
    
    try {
        const [rows] = await db.query(
        "UPDATE `users` SET `name`= ?,`email`= ? WHERE `id` = ?",
        [name, email, id]
        );
        if (rows.length === 0) {
        return res.status(404).json({ hiba: "Felhasználó nem található" });
        }
        res.json(rows);
    } catch (error) {
        console.error("Hiba a felhasználó frissítésekor:", error);
        res.status(500).json({ hiba: "Szerverhiba történt" });
    }
});

userRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
        "DELETE FROM users WHERE id = ?",
        [id]
        );
        if (rows.length === 0) {
        return res.status(404).json({ hiba: "Felhasználó nem található" });
        }
        res.json({ message: "Felhasználó sikeresen törölve" });
    } catch (error) {
        console.error("Hiba a felhasználó törlésekor:", error);
        res.status(500).json({ hiba: "Szerverhiba történt" });
    }
});

export default userRouter;