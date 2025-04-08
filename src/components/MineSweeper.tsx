"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type Board = Cell[][];

const createEmptyBoard = (rows: number, cols: number): Board => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
};

const plantMines = (board: Board, mineCount: number): Board => {
  const rows = board.length;
  const cols = board[0].length;
  let minesPlanted = 0;
  while (minesPlanted < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlanted++;
    }
  }
  return board;
};

const calculateAdjacentMines = (board: Board): Board => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const rows = board.length;
  const cols = board[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].isMine) continue;
      let mineCount = 0;
      directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          board[newRow][newCol].isMine
        ) {
          mineCount++;
        }
      });
      board[row][col].adjacentMines = mineCount;
    }
  }
  return board;
};

const revealCell = (board: Board, row: number, col: number): Board => {
  if (
    row < 0 ||
    col < 0 ||
    row >= board.length ||
    col >= board[0].length ||
    board[row][col].isRevealed ||
    board[row][col].isFlagged
  )
    return board;

  board[row][col].isRevealed = true;

  if (board[row][col].adjacentMines === 0 && !board[row][col].isMine) {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    directions.forEach(([dx, dy]) => {
      revealCell(board, row + dx, col + dy);
    });
  }

  return board;
};

export default function MineSweeper() {
  const [board, setBoard] = useState<Board>([]);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    let newBoard = createEmptyBoard(10, 10);
    newBoard = plantMines(newBoard, 10);
    newBoard = calculateAdjacentMines(newBoard);
    setBoard([...newBoard]);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleClick = (row: number, col: number) => {
    if (gameOver || board[row][col].isRevealed) return;
    const updatedBoard = [...board];
    if (updatedBoard[row][col].isMine) {
      updatedBoard[row][col].isRevealed = true;
      setBoard(updatedBoard);
      setGameOver(true);
      return;
    }
    setBoard([...revealCell(updatedBoard, row, col)]);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Minesweeper</h1>
      <div className="grid grid-cols-10 gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              className={`w-10 h-10 text-sm p-0 ${
                cell.isRevealed ? "bg-gray-300" : "bg-blue-500"
              }`}
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {cell.isRevealed
                ? cell.isMine
                  ? "💣"
                  : cell.adjacentMines || ""
                : ""}
            </Button>
          ))
        )}
      </div>
      {gameOver && <div className="text-red-500 font-bold">Game Over!</div>}
      <Button onClick={initializeGame} className="mt-4">
        Restart
      </Button>
    </div>
  );
}
