const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// บันทึกรายการรายรับรายจ่าย
router.post('/transaction', auth, async (req, res) => {
  const { type, amount, note } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.transactions.push({ type, amount, note });
    await user.save();
    res.status(201).json({ message: 'Transaction added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction' });
  }
});

// แสดงรายการทั้งหมด
router.get('/transactions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// ยอดรวมรายรับรายจ่าย
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const income = user.transactions.filter(tran => tran.type === 'income').reduce((sum, tran) => sum + tran.amount, 0);
    const expense = user.transactions.filter(tran => tran.type === 'expense').reduce((sum, tran) => sum + tran.amount, 0);

    res.json({ income, expense, balance: income - expense });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating balance' });
  }
});

module.exports = router;