const express = require("express");
const Transaction = require("../models/Transaction");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All routes below require a valid login token
router.use(protect);

// GET /api/transactions - get all transactions for logged-in user
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/transactions - add a new income/expense entry
router.post("/", async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const transaction = await Transaction.create({
      user: req.userId,
      type,
      amount,
      category,
      date,
      description,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/transactions/:id - delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.deleteOne();
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/transactions/summary - totals for income/expense/balance
router.get("/summary/totals", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    res.json({ income, expense, balance: income - expense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
