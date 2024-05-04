import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/boards/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards(response.data);
    } catch (error) {
      console.error('Error al obtener los tableros:', error.response?.data);
    }
  };

  const handleCreateBoard = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/boards/${userId}`, {
        name: boardName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Tablero creado:', response.data);
      fetchBoards();
      setBoardName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear el tablero:', error.response?.data);
    }
  };

  const handleResumeBoard = boardId => {
    navigate(`/board/${boardId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleNameChange = (event) => setBoardName(event.target.value);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>Cerrar Sesión</button>
      </div>
      <button style={styles.button} onClick={openModal}>Crear Nuevo Tablero</button>
      <h2 style={styles.subtitle}>Mis Tableros</h2>
      {boards.length > 0 ? (
        <ul>
          {boards.map(board => (
            <li key={board.boardId} style={styles.item}>
              {board.name} - <button style={styles.button} onClick={() => handleResumeBoard(board.boardId)}>Reanudar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.message}>No tienes tableros creados.</p>
      )}
      {isModalOpen && (
        <div style={styles.modal}>
          <h2>Ingrese el nombre del tablero</h2>
          <input type="text" value={boardName} onChange={handleNameChange} />
          <button style={styles.button} onClick={handleCreateBoard}>Crear Tablero</button>
          <button style={styles.button} onClick={closeModal}>Cancelar</button>
        </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: '0 20px',
  },
  title: {
    color: 'white',
    flexGrow: 1,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff6347',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#ee528f',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  subtitle: {
    color: 'white',
    marginTop: '20px',
  },
  item: {
    color: 'white',
    marginTop: '10px',
  },
  message: {
    color: 'white',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    color: 'black',
    display: 'flex',
    flexDirection: 'column'
  }
};

export default Dashboard;
