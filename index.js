require('dotenv').config(); // সিকিউরিটি কনফিগারেশন
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // মঙ্গোডিবি প্যাকেজ

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---------------------------------------------
// ১. MongoDB কানেকশন (Database Connection)
// ---------------------------------------------
const mongoUri = process.env.MONGO_URI; 

mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ---------------------------------------------
// ২. স্কিমা ও মডেল তৈরি (Data Structure)
// ---------------------------------------------
const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now } // অটোমেটিক সময় সেভ হবে
});

const Notice = mongoose.model('Notice', NoticeSchema);

// ---------------------------------------------
// ৩. রাউটস (Routes)
// ---------------------------------------------

// হোমপেজ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// অ্যাডমিন পেজ
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API: সব নোটিশ দেখা (Database থেকে আনবে)
app.get('/api/notices', async (req, res) => {
    try {
        // নতুন নোটিশ সবার উপরে দেখাবে (sort by createdAt descending)
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notices" });
    }
});

// API: নতুন নোটিশ আপলোড করা (Database এ সেভ করবে)
app.post('/api/notices', async (req, res) => {
    try {
        const newNotice = new Notice({
            title: req.body.title,
            date: req.body.date
        });
        await newNotice.save(); // ডাটাবেসে সেভ হচ্ছে
        res.status(201).json({ message: "নোটিশ সফলভাবে প্রকাশিত হয়েছে!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving notice" });
    }
});

// সার্ভার স্টার্ট
app.listen(port, () => {
    console.log(`Academy Site running with MongoDB at port ${port}`);
});