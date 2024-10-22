import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.player;
  } else if (!squares.includes(null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => {
    const isWinningSquare = winningSquares?.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={isWinningSquare}
      />
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < 3; row++) {
      const rowSquares = [];
      for (let col = 0; col < 3; col++) {
        rowSquares.push(renderSquare(row * 3 + col));
      }
      board.push(<div key={row} className="board-row">{rowSquares}</div>);
    }
    return board;
  };

  return (
    <>
      <div className="status">{status}</div>
      {renderBoard()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), move: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const winningInfo = calculateWinner(currentSquares);
  const winningSquares = winningInfo ? winningInfo.line : null;

  function handlePlay(nextSquares, moveIndex) {
    const nextHistory = history.slice(0, currentMove + 1).concat([
      { squares: nextSquares, move: moveIndex },
    ]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleMoveOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((step, move) => {
    const { move: moveIndex } = step;
    const row = moveIndex !== null ? Math.floor(moveIndex / 3) + 1 : null;
    const col = moveIndex !== null ? (moveIndex % 3) + 1 : null;
    const description =
      move > 0 ? `Go to move #${move} (${row}, ${col})` : 'Go to game start';

    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move} ({row}, {col})</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winningSquares={winningSquares}
        />
      </div>
      <div className="game-info">
        <button onClick={toggleMoveOrder}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
