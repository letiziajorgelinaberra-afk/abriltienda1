const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Simple auth route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (r.rowCount===0) return res.status(401).json({error:'Invalid'});
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({error:'Invalid'});
    const token = jwt.sign({id:user.id, email:user.email, role:user.role}, JWT_SECRET, {expiresIn:'12h'});
    res.json({token, user:{email:user.email, role:user.role}});
  } catch (e) {
    console.error(e);
    res.status(500).json({error:'server'});
  }
});

// Middleware
function auth(req,res,next){
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({error:'no token'});
  const token = h.split(' ')[1];
  try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  }catch(e){
    return res.status(401).json({error:'invalid token'});
  }
}

// Products: simple endpoints
app.get('/api/products', auth, async (req,res)=>{
  try{
    const r = await pool.query('SELECT p.*, pv.id AS variant_id, pv.variant_code, pv.size, pv.color, pv.barcode, pv.stock, pv.sale_price FROM products p LEFT JOIN product_variants pv ON pv.product_id = p.id');
    res.json(r.rows);
  }catch(e){ console.error(e); res.status(500).json({error:'server'}); }
});

app.post('/api/products', auth, async (req,res)=>{
  const { sku, name, description, category, brand, variants } = req.body;
  // variants: array of {variant_code, size, color, barcode, stock, sale_price}
  try{
    const prod = await pool.query('INSERT INTO products (sku,name,description,category,brand) VALUES ($1,$2,$3,$4,$5) RETURNING id', [sku,name,description,category,brand]);
    const pid = prod.rows[0].id;
    for(const v of variants){
      await pool.query('INSERT INTO product_variants (product_id,variant_code,size,color,barcode,stock,sale_price) VALUES ($1,$2,$3,$4,$5,$6,$7)', [pid,v.variant_code,v.size,v.color,v.barcode,v.stock,v.sale_price]);
    }
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({error:'server'}); }
});

// Sales
app.post('/api/sales', auth, async (req,res)=>{
  const { items, total } = req.body; // items: [{product_variant_id, qty, unit_price}]
  const client = await pool.connect();
  try{
    await client.query('BEGIN');
    const r = await client.query('INSERT INTO sales (user_id, total) VALUES ($1,$2) RETURNING id', [req.user.id, total]);
    const saleId = r.rows[0].id;
    for(const it of items){
      await client.query('INSERT INTO sale_items (sale_id, product_variant_id, qty, unit_price) VALUES ($1,$2,$3,$4)', [saleId, it.product_variant_id, it.qty, it.unit_price]);
      await client.query('UPDATE product_variants SET stock = stock - $1 WHERE id = $2', [it.qty, it.product_variant_id]);
      await client.query('INSERT INTO stock_movements (product_variant_id, qty, type, note) VALUES ($1,$2,$3,$4)', [it.product_variant_id, -it.qty, 'OUT', 'sale']);
    }
    await client.query('COMMIT');
    res.json({ok:true, saleId});
  }catch(e){ await client.query('ROLLBACK'); console.error(e); res.status(500).json({error:'server'}); } finally { client.release(); }
});

// Simple report
app.get('/api/reports/daily-sales', auth, async (req,res)=>{
  const date = req.query.date || new Date().toISOString().slice(0,10);
  try{
    const r = await pool.query("SELECT s.id, s.total, s.created_at, si.product_variant_id, si.qty, si.unit_price FROM sales s JOIN sale_items si ON si.sale_id = s.id WHERE s.created_at::date = $1", [date]);
    res.json(r.rows);
  }catch(e){ console.error(e); res.status(500).json({error:'server'}); }
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log('Backend running on', port));
