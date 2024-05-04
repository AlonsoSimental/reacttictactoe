import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');  // Si ya existe un token, redirige al Dashboard
    }
  }, [navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password
      }, {
        withCredentials: true
      });
      console.log('Inicio de sesión exitoso:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');  // Redirige al usuario al dashboard después del login
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/users', {
        username,
        password
      });
      console.log('Registro exitoso:', response.data);
      handleLogin(); 
    } catch (error) {
      console.error('Error al registrar:', error.response?.data);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Java Spring and JS React Tic Tac Toe</h1>
      {isLogin ? (
        <>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button} onClick={handleLogin}>Login</button>
          <p style={styles.toggleText}>
            No tienes cuenta? <button onClick={toggleForm} style={styles.toggleButton}>Regístrate aquí!</button>
          </p>
        </>
      ) : (
        <>
          <input
            style={styles.input}
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button} onClick={handleRegister}>Registrarse</button>
          <p style={styles.toggleText}>
            Ya tienes cuenta? <button onClick={toggleForm} style={styles.toggleButton}>Inicia sesión aquí!</button>
          </p>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#0078b7',
  },
  title: {
    color: 'white',
    marginBottom: '20px',
    textAlign: 'center'
  },
  input: {
    height: '50px',
    width: '50%',
    marginBottom: '10px',
    borderWidth: '1px',
    borderColor: '#ccc',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: 'white',
    color: 'black',
  },
  button: {
    height: '50px',
    width: '50%',
    backgroundColor: '#ee528f',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    marginBottom: '20px'
  },
  toggleText: {
    color: 'white',
    cursor: 'pointer'
  },
  toggleButton: {
    background: 'none',
    color: 'yellow',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default Login;
