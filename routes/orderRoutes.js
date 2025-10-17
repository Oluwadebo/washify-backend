// routes/orderRoutes.js
import express from "express";
const router = express.Router();

// temporary test route
router.get("/", (req, res) => {
  res.json({ message: "Orders route working!" });
});

export default router;
