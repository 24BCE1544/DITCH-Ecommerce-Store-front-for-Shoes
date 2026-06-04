const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const REPAIRS_FILE = path.join(__dirname, 'repairs.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.use(cors());
app.use(express.json());

if (!fs.existsSync(REPAIRS_FILE)) { fs.writeFileSync(REPAIRS_FILE, JSON.stringify([])); }
if (!fs.existsSync(ORDERS_FILE)) { fs.writeFileSync(ORDERS_FILE, JSON.stringify([])); }

app.post('/api/repair', (req, res) => {
    try {
        const data = req.body;
        data.timestamp = new Date().toISOString();
        data.id = 'REP-' + Date.now();
        const repairs = JSON.parse(fs.readFileSync(REPAIRS_FILE, 'utf8'));
        repairs.push(data);
        fs.writeFileSync(REPAIRS_FILE, JSON.stringify(repairs, null, 2));
        res.status(201).json({ success: true, id: data.id });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/repair', (req, res) => {
    try { res.json(JSON.parse(fs.readFileSync(REPAIRS_FILE, 'utf8'))); } 
    catch (e) { res.status(500).json([]); }
});

app.delete('/api/repair/:id', (req, res) => {
    try {
        const id = req.params.id;
        let repairs = JSON.parse(fs.readFileSync(REPAIRS_FILE, 'utf8'));
        const before = repairs.length;
        repairs = repairs.filter((r) => r.id !== id);
        if (repairs.length === before) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        fs.writeFileSync(REPAIRS_FILE, JSON.stringify(repairs, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

app.post('/api/order', (req, res) => {
    try {
        const data = req.body;
        data.timestamp = new Date().toISOString();
        const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
        orders.push(data);
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
        res.status(201).json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/order', (req, res) => {
    try { res.json(JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))); } 
    catch (e) { res.status(500).json([]); }
});

app.delete('/api/order', (req, res) => {
    try {
        const timestamp = req.body && req.body.timestamp;
        if (!timestamp) {
            return res.status(400).json({ success: false, message: 'timestamp required' });
        }
        let orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
        const before = orders.length;
        orders = orders.filter((o) => o.timestamp !== timestamp);
        if (orders.length === before) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Live Backend Server running at http://localhost:${PORT}`);
});
