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
  const [animStep, setAnimStep] = useState(0);
  const [animMax, setAnimMax] = useState(2);
  const [monsterX, setMonsterX] = useState(0);
  const [monsterY, setMonsterY] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const initGame = () => {
    const rows = 10;
    const cols = 10;
    const newMaze: number[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 1)
    );
    let px = 0;
    let py = 0;
    newMaze[py][px] = 0;
    while (px !== cols - 1 || py !== rows - 1) {
      if (Math.random() < 0.5 && px < cols - 1) {
        px += 1;
      } else if (py < rows - 1) {
        py += 1;
      }
      newMaze[py][px] = 0;
    }
    for (let i = 0; i < 40; i++) {
      const rx = Math.floor(Math.random() * cols);
      const ry = Math.floor(Math.random() * rows);
      newMaze[ry][rx] = 0;
    }
    setPlayerX(0);
    setPlayerY(0);
    setExitX(cols - 1);
    setExitY(rows - 1);
    setMonsterX(cols - 1);
    setMonsterY(rows - 2);
    setMaze(newMaze);
    setMoves(0);
    setTimeLeft(30);
    setGameOver(false);
    setAnimStep(0);
    setAnimMax(2);
    setMessage("Escape the maze!");
  };

  const move = (dir: string) => {
    if (gameOver) return;
    let newX = playerX;
    let newY = playerY;
    if (dir === "Up") newY -= 1;
    if (dir === "Down") newY += 1;
    if (dir === "Left") newX -= 1;
    if (dir === "Right") newX += 1;

    if (newX < 0 || newY < 0 || newX >= 10 || newY >= 10) {
      setMessage("Boundary!");
      return;
    }
    if (maze[newY][newX] === 1) {
      setMessage("You hit a wall!");
      return;
    }

    const newMoves = moves + 1;
    setPlayerX(newX);
    setPlayerY(newY);
    setMoves(newMoves);
    setTimeLeft(prev => prev - 1);
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
      setMessage(`🏆 You escaped! Moves: ${moves}`);
    } else {
      setMessage(`💀 The monster caught you!`);
    }
  };

  const monsterMove = () => {
    const dx = playerX - monsterX;
    const dy = playerY - monsterY;
    const options: [number, number][] = [];
    if (Math.abs(dx) > Math.abs(dy)) {
      options.push([monsterX + Math.sign(dx), monsterY]);
      options.push([monsterX, monsterY + Math.sign(dy)]);
    } else {
      options.push([monsterX, monsterY + Math.sign(dy)]);
      options.push([monsterX + Math.sign(dx), monsterY]);
    }
    options.push([monsterX + 1, monsterY]);
    options.push([monsterX - 1, monsterY]);
    options.push([monsterX, monsterY + 1]);
    options.push([monsterX, monsterY - 1]);

    for (const [ox, oy] of options) {
      if (ox >= 0 && oy >= 0 && ox < 10 && oy < 10) {
        if (maze[oy][ox] === 0) {
          setMonsterX(ox);
          setMonsterY(oy);
          break;
        }
      }
    }

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
          out += "🟩";
        } else if (x === monsterX && y === monsterY) {
          out += "🟪";
        } else if (x === exitX && y === exitY) {
          out += "🟧";
        } else if (maze[y][x] === 0) {
          out += "🟦";
        } else {
          out += "🟥";
        }
      }
      out += "\n";
    }
    return out;
  };

  useEffect(() => {
    initGame();
  }, []);

  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm">{message}</p>
      <pre className="text-sm font-mono whitespace-pre-wrap">{buildGrid()}</pre>
      <div className="flex gap-2">
        {!gameOver && (
          <>
            <Button onClick={() => move("Up")}>Up</Button>
            <Button onClick={() => move("Down")}>Down</Button>
            <Button onClick={() => move("Left")}>Left</Button>
            <Button onClick={() => move("Right")}>Right</Button>
          </>
        )}
        {gameOver && <Button onClick={initGame}>Restart</Button>}
      </div>
    </main>
  );
}
