import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Products(){
  const [products,setProducts] = useState([]);
  const [form, setForm] = useState({sku:'', name:'', description:'', category:'', brand:'', variants:[]});
  const token = localStorage.getItem('token');

  useEffect(()=>{
    if(!token) return;
    axios.get('/api/products',{ headers:{ Authorization: 'Bearer '+token }})
      .then(r=>setProducts(r.data))
      .catch(console.error);
  },[token]);

  const submit = async (e) =>{
    e.preventDefault();
    try{
      await axios.post('/api/products', form, { headers:{ Authorization: 'Bearer '+token }});
      alert('Producto creado');
    }catch(e){ console.error(e); alert('Error'); }
  };

  return (
    <div className='container'>
      <h2>Productos</h2>
      <form onSubmit={submit}>
        <input placeholder='SKU' value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} />
        <input placeholder='Nombre' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <textarea placeholder='Descripción' value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button type='submit'>Crear producto (sin variantes)</button>
      </form>

      <h3>Lista</h3>
      <ul>
        {products.map((p,i)=> <li key={i}>{p.name} - {p.sku}</li>)}
      </ul>
    </div>
  )
}
