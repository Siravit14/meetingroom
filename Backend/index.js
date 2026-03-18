const express = require('express');
const app = express();
const port = 3000;

const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'booking_db'
})

db.connect((err) => {
    if (err){
        console.error('เชื่อมต่อ Database ไม่สำเร็จ' + err.stack)
        return;
    }
    console.log('เชื่อมต่อ Database สำเร็จ')
})

app.use(express.json())


app.post('/api/booking',(req,res)=>{
    const {room_id,start_time,end_time} = req.body;
    const checkSql = `
      SELECT * FROM bookings
      WHERE room_id = ?
      AND (start_time < ? AND end_time > ?)
      `;
    db.query(checkSql,[room_id,end_time,start_time],(err,results) => {
        if (err) return res.status(500).json({error: err.message})
        if (results.length > 0){
            return res.status(400).json({message: "ห้องนี้มีคนจองแล้วครับ"})
        }    
        const insertSql = 'INSERT INTO bookings (room_id, start_time, end_time) VALUES (?, ?, ?)';
        db.query(insertSql,[room_id, start_time, end_time], (err, result) =>{
          if (err) return res.status(500).json({error: err.message})
          res.status(201).json({
            message: "จองสำเร็จแล้ว",
            bookingId: result.insertId
         })
        })
      })
    })

app.get('/api/room', (req,res)=>{
    db.query('SELECT * FROM rooms',(err, results)=>{
        if (err){
            return res.status(500).json({error: err.message})
        }
        res.json(results)
    })
})

app.get('/api/booking',(req,res)=>{
    const sql = 'SELECT * FROM bookings';
    db.query(sql,(err,result)=>{
        if (err) return res.status(500).json({ error:err.message});
        res.json(result)
    })
})

app.delete('/api/booking',(req,res)=>{
    const id = parseInt(req.params.id)
    const initialLenght = bookings.length;
    bookings = bookings.filter(b => b !== id);
    if (bookings.length<initialLenght){
        res.json({message:`ยกเลิกการจองหมายเลข ${id} สำเร็จแล้ว`})
    } else{
        res.status(404).json({message:"ไม่พบหมายเลขการจองนี้"})
    }
})

app.listen(port,()=>{
    console.log(`Server เปิดแล้ว http://localhost:${port}`);
})
