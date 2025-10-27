import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const r = await axios.post('/api/auth/login',{email,password});
      localStorage.setItem('token', r.data.token);
      navigate('/dashboard');
    }catch(e){
      alert('Login falló');
    }
  };

  return (
    <div className='login-page'>
      <div className='login-box'>
        <img src='/logo.png' alt='logo' className='logo' />
        <h2>ABRIL TIENDA</h2>
        <form onSubmit={submit}>
          <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder='Contraseña' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
          <button className='btn-primary' type='submit'>Ingresar</button>
        </form>
      </div>
    </div>
  )
}
