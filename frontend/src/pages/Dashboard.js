import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token) return navigate('/');
    axios.get('/api/reports/daily-sales',{ headers:{ Authorization: 'Bearer '+token }})
      .then(r=>setSales(r.data))
      .catch(()=> navigate('/'));
  },[navigate]);

  return (
    <div className='container'>
      <header className='header'>
        <img src='/logo.png' alt='logo' className='small-logo' />
        <h1>ABRIL TIENDA - Panel</h1>
      </header>
      <main>
        <section>
          <h2>Ventas del día</h2>
          <ul>
            {sales.map((s,i)=> <li key={i}>Venta {s.id} - Total: ${s.total} - {s.created_at}</li>)}
          </ul>
        </section>
        <section>
          <button onClick={()=>navigate('/products')}>Productos</button>
          <button onClick={()=>navigate('/pos')}>Ir a POS</button>
        </section>
      </main>
    </div>
  )
}
