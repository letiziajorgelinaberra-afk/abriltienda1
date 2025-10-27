const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();
(async ()=>{
  try{
    const pool = new Pool();
    const email = process.env.ADMIN_EMAIL || 'admin@abriltienda.local';
    const pass = process.env.ADMIN_PASSWORD || 'Dosmil25';
    const hash = await bcrypt.hash(pass, 10);
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'admin', created_at TIMESTAMP DEFAULT now())`);
    await pool.query('INSERT INTO users (email, password_hash, role) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING', [email, hash, 'admin']);
    console.log('Admin seed done:', email);
    process.exit(0);
  }catch(e){ console.error(e); process.exit(1); }
})();
