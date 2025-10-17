// routes/expenseRoutes.js
import express from "express";
const router = express.Router();

// temporary test route
router.get("/", (req, res) => {
  res.json({ message: "Expenses route working!" });
});

export default router;
