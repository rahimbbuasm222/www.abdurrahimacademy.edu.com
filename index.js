const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // CSS এবং ইমেজের জন্য

// মেমোরিতে কিছু ডিফল্ট নোটিশ রাখা হলো
let notices = [
    { id: 1, title: "২০২৫ শিক্ষাবর্ষের ভর্তি বিজ্ঞপ্তি", date: "2025-12-14" },
    { id: 2, title: "আব্দুর রহিম একাডেমির নতুন ল্যাব উদ্বোধন", date: "2025-12-10" },
    { id: 3, title: "আইটি প্রশিক্ষণ কর্মশালা - রেজিস্ট্রেশন শুরু", date: "2025-12-05" }
];

// ১. হোমপেজ রাউট (পাবলিক)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ২. অ্যাডমিন পেজ রাউট (নোটিশ আপলোড করার জন্য)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// ৩. নোটিশ পাওয়ার API
app.get('/api/notices', (req, res) => {
    res.json(notices);
});

// ৪. নতুন নোটিশ আপলোড করার API
app.post('/api/notices', (req, res) => {
    const newNotice = req.body;
    newNotice.id = notices.length + 1;
    notices.unshift(newNotice); // নতুন নোটিশ সবার উপরে থাকবে
    res.status(201).json({ message: "নোটিশ সফলভাবে প্রকাশিত হয়েছে!" });
});

app.listen(port, () => {
    console.log(`Academy Govt Style Site running at http://localhost:${port}`);
});