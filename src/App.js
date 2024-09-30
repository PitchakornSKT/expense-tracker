import React, { useState, useEffect } from 'react';
import TransactionChart from './ChartComponent';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('income');
  const [note, setNote] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [user, setUser] = useState('myuser'); // สมมติว่าผู้ใช้เข้าสู่ระบบแล้ว

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchTransactions = () => {
    fetch('http://localhost:5000/api/transactions?user=${user}')
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
        calculateTotals(data);
      })
      .catch(error => console.error('Error:', error));
  };

  // ฟังก์ชันสำหรับคำนวณยอดรวมรายรับและรายจ่าย
  const calculateTotals = (transactions) => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  // ฟังก์ชันสำหรับเพิ่มรายการใหม่
  const addTransaction = (e) => {
    e.preventDefault();
    const newTransaction = { amount: parseFloat(amount), date, type, note, user };

    fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    })
      .then(response => response.json())
      .then(data => {
        setTransactions([...transactions, data]);
        calculateTotals([...transactions, data]);
        clearForm();
      })
      .catch(error => console.error('Error:', error));
  };

  // ฟังก์ชันสำหรับเคลียร์ฟอร์มหลังจากเพิ่มรายการ
  const clearForm = () => {
    setAmount('');
    setDate('');
    setType('income');
    setNote('');
  };

  return (
    <div>
      <h1>บันทึกรายรับ-จ่าย</h1>

      {/* ฟอร์มสำหรับเพิ่มรายการ */}
      <form onSubmit={addTransaction}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />
        <button type="submit">เพิ่มข้อมูล</button>
      </form>

      <div class="history">
        <h3 class="income">
          <span class="amount">฿{totalIncome.toLocaleString()}</span>
          <span class="description">เงินเข้า</span>
        </h3>
        <h3 class="expense">
          <span class="amount">฿{totalExpense.toLocaleString()}</span>
          <span class="description">เงินออก</span>
        </h3>
        <h3 class="inEx">
          <span class="amount">฿{(totalIncome - totalExpense).toLocaleString()}</span>
          <span class="description">ยอดเงินคงเหลือ</span>
        </h3>
      </div>



      {/* รายการบันทึก */}
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.date} - {transaction.type === 'income' ? 'รายรับ' : 'รายจ่าย'}: {transaction.amount} บาท
            <br />
            Note: {transaction.note}
          </li>
        ))}
      </ul>

      {/* แสดงกราฟ */}
      <TransactionChart transactions={transactions} />
    </div>
  );
}

export default App;