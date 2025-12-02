"use client";

import { description, title } from "@/lib/metadata";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [maze, setMaze] = useState<number[][]>([]);
  const [playerX, setPlayerX] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  const [moves, setMoves] = useState(0);
  const [monsterX, setMonsterX] = useState(0);
  const [monsterY, setMonsterY] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    // Generate a random 10x10 maze with outer walls
    const rows = 10;
    const cols = 10;
    const newMaze: number[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() < 0.3 ? 0 : 1))
    );
    // Ensure outer borders are walls
    for (let i = 0; i < cols; i++) {
      newMaze[0][i] = 0;
      newMaze[rows - 1][i] = 0;
    }
    for (let i = 0; i < rows; i++) {
      newMaze[i][0] = 0;
      newMaze[i][cols - 1] = 0;
    }
    // Place player at top-left corner
    setPlayerX(1);
    setPlayerY(1);
    newMaze[1][1] = 1;
    // Place monster at bottom-right corner
    setMonsterX(cols - 2);
    setMonsterY(rows - 2);
    newMaze[rows - 2][cols - 2] = 1;
    // Random exit not on walls or player/monster
    let exitX = 1;
    let exitY = 1;
    do {
      exitX = Math.floor(Math.random() * (cols - 2)) + 1;
      exitY = Math.floor(Math.random() * (rows - 2)) + 1;
    } while (newMaze[exitY][exitX] === 0 || (exitX === 1 && exitY === 1) || (exitX === cols - 2 && exitY === rows - 2));
    setExitX(exitX);
    setExitY(exitY);
    newMaze[exitY][exitX] = 1;
    setMaze(newMaze);
    setMoves(0);
    setTimeLeft(60);
    setGameOver(false);
    setMessage("Escape the maze! The monster is chasing you!");
  };

  const move = (dir: string) => {
    if (gameOver) return;
    let newX = playerX;
    let newY = playerY;
    if (dir === "Up") newY -= 1;
    if (dir === "Down") newY += 1;
    if (dir === "Left") newX -= 1;
    if (dir === "Right") newX += 1;

    if (newX < 0 || newY < 0 || newX > 9 || newY > 9) {
      setMessage("Boundary!");
      return;
    }
    if (maze[newY][newX] === 0) {
      setMessage("You hit a wall!");
      return;
    }

    const newMoves = moves + 1;
    setPlayerX(newX);
    setPlayerY(newY);
    setMoves(newMoves);
    setTimeLeft(timeLeft - 1);
    setMessage(`You moved ${dir}. Time left: ${timeLeft - 1}`);

    if (newX === exitX && newY === exitY) {
      endGame(true);
      return;
    }

    monsterMove();

    if (timeLeft - 1 <= 0) {
      setMessage("⏳ Time is up!");
      endGame(false);
      return;
    }
  };

  const endGame = (won: boolean) => {
    setGameOver(true);
    if (won) {
      setMessage(`🏆 Escaped! Moves: ${moves}`);
    } else {
      setMessage(`💀 Caught by monster!`);
    }
  };

  const monsterMove = () => {
    const dx = playerX - monsterX;
    const dy = playerY - monsterY;
    let moved = false;
    // Try horizontal move if path is clear
    if (dx !== 0) {
      const nx = monsterX + Math.sign(dx);
      if (maze[monsterY][nx] === 1) {
        setMonsterX(nx);
        moved = true;
      }
    }
    // If not moved, try vertical
    if (!moved && dy !== 0) {
      const ny = monsterY + Math.sign(dy);
      if (maze[ny][monsterX] === 1) {
        setMonsterY(ny);
        moved = true;
      }
    }
    // If still blocked, stay in place
    if (monsterX === playerX && monsterY === playerY) {
      endGame(false);
    }
  };

  const buildGrid = () => {
    if (!maze || maze.length === 0) return "";
    let out = "";
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (x === playerX && y === playerY) {
          out += "🧍";
        } else if (x === monsterX && y === monsterY) {
          out += "👾";
        } else if (x === exitX && y === exitY) {
          out += "🟩";
        } else if (maze[y][x] === 0) {
          out += "🟥";
        } else {
          out += "🟦";
        }
      }
      out += "\n";
    }
    return out;
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>Player Position: ({playerX},{playerY})</p>
      <p>Monster Position: ({monsterX},{monsterY})</p>
      <p>Exit: ({exitX},{exitY})</p>
      <p>Moves: {moves}</p>
      <p>Time Left: {timeLeft}</p>
      <p>{message}</p>
      <pre className="text-sm font-mono whitespace-pre-wrap">{buildGrid()}</pre>
      <div className="flex gap-2">
        <Button onClick={() => move("Up")}>Up</Button>
        <Button onClick={() => move("Down")}>Down</Button>
        <Button onClick={() => move("Left")}>Left</Button>
        <Button onClick={() => move("Right")}>Right</Button>
        <Button onClick={startGame}>Restart</Button>
      </div>
    </main>
  );
}
