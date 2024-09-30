const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://pitchakorn:pitchakorn@cluster0.8kdxt.mongodb.net/')
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.error('MongoDB Connection Error: ', err.message));


const transactionSchema = new mongoose.Schema({
  amount: Number,
  date: String,
  type: String,
  note: String,
  user: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// เพิ่มรายการบันทึก
app.post('/api/transactions', (req, res) => {
  const transaction = new Transaction(req.body);
  transaction.save().then(() => res.status(201).send(transaction));
});

// ดึงรายการบันทึก
app.get('/api/transactions', (req, res) => {
  Transaction.find({ user: req.query.user }).then((transactions) => res.send(transactions));
});

// เข้าสู่ระบบและลงทะเบียน
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// ลงทะเบียนผู้ใช้
app.post('/api/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({ username: req.body.username, password: hashedPassword });
  user.save().then(() => res.status(201).send(user));
});

// เข้าสู่ระบบ
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));