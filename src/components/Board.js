import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Board() {
  const [board, setBoard] = useState(null);
  const [movements, setMovements] = useState([]);
  const { boardId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBoard();
    fetchMovements();
  }, []);

  const fetchBoard = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoard(response.data);
    } catch (error) {
      console.error('Error al obtener los detalles del tablero:', error);
    }
  };

  const fetchMovements = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/movements/board/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovements(response.data);
    }catch(error) {
        console.error('Error al obtener los detalles de los movimientos:', error);
    }
  };

  const handleCellClick = async (rowIndex, cellIndex) => {
    const index = rowIndex * 3 + cellIndex;
    if (board.state[index] === '-' && board.winner == null) {
        try { 
            console.log("Celda clickeable:", index);
            const newState = updateBoardState(board.state, index, 'X');
            await axios.patch(`http://localhost:8080/boards/${boardId}`, {
                state: newState,
                currentTurn: 'O' 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const movementPosition = index+1;
            await axios.post(`http://localhost:8080/movements/${boardId}`, {
                position: movementPosition,
                player: 'X'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBoard();
            fetchMovements();
        } catch (error) {
            console.error("Error al actualizar el tablero y registrar el movimiento:", error);
        }
    } else {
      console.log("Celda no modificable:", index);
    }
  };
  

  const updateBoardState = (currentState, index, player) => {
    return currentState.substring(0, index) + player + currentState.substring(index + 1);
  };

  const deleteBoard = async () => {
    try {
      await axios.delete(`http://localhost:8080/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error al borrar el tablero:', error);
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  
  const rows = [];
  for (let i = 0; i < 9; i += 3) {
    rows.push(board.state.substring(i, i + 3).split(''));
  }

  return (
    <div style={styles.container}>
      <div style={styles.gameSection}>
        <h1 style={styles.title}>{board.name}</h1>
        {}
        {board.winner && (
          <h2 style={styles.winnerMessage}>
            Ganador: {board.winner === 'X' ? localStorage.getItem('username') : 'CPU'}
          </h2>
        )}
        <div style={styles.board}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} style={styles.cell} onClick={() => handleCellClick(rowIndex, cellIndex)}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button onClick={deleteBoard} style={styles.button}>Borrar Tablero</button>
      </div>
      <div style={styles.movementsContainer}>
        <h2>Movimientos</h2>
        {movements.map((movement, index) => (
          <div key={index} style={styles.movement}>
            <p>Jugador: {movement.player}, Posición: {movement.position}, Fecha: {new Date(movement.moveDate).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-around', 
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0078b7',
    padding: '20px',
  },
  gameSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    marginBottom: '20px',
  },
  board: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
  },
  cell: {
    width: '60px',
    height: '60px',
    border: '2px solid #FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: 'white',
    margin: '5px',
  },
  button: {
    backgroundColor: '#ff6347',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  movementsContainer: {
    color: 'white',
    maxWidth: '300px', 
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#454545' 
  },
  movement: {
    margin: '10px 0',
  }, 
  winnerMessage: {
    color: 'gold',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
};

export default Board;
