import express from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter.js';
import eventRouter from './routers/eventRouter.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/events", eventRouter);


app.use((req, res) => {
  res.status(404).json({ hiba: "Végpont nem található" });
});

app.listen(3000, () => {
  console.log("API fut: http://localhost:3000");
});