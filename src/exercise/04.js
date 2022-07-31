// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from "../utils";

function Board({onClick, squares}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const getInitialState = () => [Array(9).fill(null)];
  const [history, setHistory] = useLocalStorageState('tic-tac-toe-jb:history', getInitialState);
  const [currentStep, setCurrentStep] = useLocalStorageState('tic-tac-toe-jb:step', 0);

  const currentSquares = history[currentStep];
  const winner = calculateWinner(currentSquares);
  const nextValue = calculateNextValue(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  // eslint-disable-next-line no-unused-vars
  function calculateNextValue(squares) {
    return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
  }

  // eslint-disable-next-line no-unused-vars
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  // eslint-disable-next-line no-unused-vars
  function calculateStatus(winner, squares, nextValue) {
    return winner
        ? `Winner: ${winner}`
        : squares.every(Boolean)
            ? `Scratch: Cat's game`
            : `Next player: ${nextValue}`
  }

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return;
    }

    const squaresCopy = [...currentSquares];
    squaresCopy[square] = nextValue;
    setHistory(prev => {
      const newHistory = [...prev];
      // truncate all from next step and replace all by a single squaresCopy
      newHistory.splice(currentStep + 1, Infinity, squaresCopy);
      return newHistory;
    });
    setCurrentStep(prev => prev + 1);
  }

  function restart() {
    setCurrentStep(0);
    setHistory(getInitialState());
  }

  function renderMoves() {
    let jsx = [];
    for (let i = 0; i < history.length; i++){
      const isOnCurrentStep = i === currentStep;
      let label = (i === 0 ? 'Go to game start' : `Go to move #${i}`) + (isOnCurrentStep ? " (current)": "");
      jsx.push(<ol key={i}>
        <button onClick={() => setCurrentStep(i)} disabled={isOnCurrentStep}>{label}</button>
      </ol> )
    }
    return jsx;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        {renderMoves()}
      </div>
    </div>
  )
}

function App() {
  return <Game />
}

export default App
