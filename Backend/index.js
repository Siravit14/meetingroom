const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

let bookings = []
app.post('/api/booking',(req,res)=>{
    const {roomId,startTime,endTime} = req.body;
    const isConflict = bookings.some(booking =>{
        return booking.roomId === roomId &&
        (startTime < booking.endTime) &&
        (endTime > booking.startTime);
    })
    if (isConflict){
        return res.status(400).json({message:"ห้องนี้มีคนจองแล้วครับ"})
    }
    const newBooking = {
        id: bookings.length+1,
        roomId: roomId,
        startTime: startTime,
        endTime: endTime
    }
    bookings.push(newBooking);
    res.status(201).json({
        message:"จองห้องสำเร็จ",
        booking: newBooking
    })
})

app.get('/api/booking',(req,res)=>{
    res.json(bookings)
})

app.listen(port,()=>{
    console.log(`Server เปิดแล้ว http://localhost:${port}`);
})
