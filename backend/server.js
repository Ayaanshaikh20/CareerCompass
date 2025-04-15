const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.get('/api/career-advice', (req, res) => {
    const advice = [
        'Start with what you know',
        'Learn by doing',
        'Build a portfolio',
        'Network with professionals',
        'Stay updated with industry trends'
    ];
    
    res.json({
        advice: advice[Math.floor(Math.random() * advice.length)]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
