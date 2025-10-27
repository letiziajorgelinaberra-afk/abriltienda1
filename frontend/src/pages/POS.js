import React, {useState} from 'react';
import axios from 'axios';

export default function POS(){
  const [items, setItems] = useState([]);
  const [code, setCode] = useState('');
  const token = localStorage.getItem('token');

  const addByBarcode = async () => {
    if(!code) return;
    try{
      const r = await axios.get('/api/products',{ headers:{ Authorization: 'Bearer '+token }});
      // buscar variante por barcode
      const found = r.data.find(row => row.barcode === code || row.barcode === code.trim());
      if(found){
        setItems([...items, {product_variant_id: found.variant_id, name: found.name, qty:1, unit_price: found.sale_price}]);
        setCode('');
      } else {
        alert('No encontrado');
      }
    }catch(e){ console.error(e); alert('error'); }
  };

  const total = items.reduce((s,i)=> s + i.qty * i.unit_price,0);

  const finish = async () => {
    try{
      await axios.post('/api/sales',{items, total}, { headers:{ Authorization: 'Bearer '+token }});
      alert('Venta registrada');
      setItems([]);
    }catch(e){ console.error(e); alert('error'); }
  };

  return (
    <div className='container'>
      <h2>Punto de Venta (POS)</h2>
      <div>
        <input placeholder='Escanear código' value={code} onChange={e=>setCode(e.target.value)} />
        <button onClick={addByBarcode}>Agregar</button>
      </div>
      <ul>
        {items.map((it,idx)=> <li key={idx}>{it.name} - {it.qty} x ${it.unit_price}</li>)}
      </ul>
      <h3>Total: ${total}</h3>
      <button onClick={finish}>Registrar venta</button>
    </div>
  )
}
