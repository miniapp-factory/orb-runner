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
    const newMaze = [
      [1,1,0,1,1],
      [0,1,0,1,0],
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,1,1,0,1]
    ];
    setMaze(newMaze);
    setPlayerX(0);
    setPlayerY(0);
    setExitX(4);
    setExitY(4);
    setMoves(0);
    setMonsterX(2);
    setMonsterY(2);
    setTimeLeft(20);
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

    if (newX < 0 || newY < 0 || newX > 4 || newY > 4) {
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
      setMessage(`🏆 You escaped! Moves: ${moves}`);
    } else {
      setMessage(`💀 The monster caught you!`);
    }
  };

  const monsterMove = () => {
    const dx = playerX - monsterX;
    const dy = playerY - monsterY;
    if (Math.abs(dx) > Math.abs(dy)) {
      setMonsterX(monsterX + Math.sign(dx));
    } else {
      setMonsterY(monsterY + Math.sign(dy));
    }
    if (monsterX === playerX && monsterY === playerY) {
      endGame(false);
    }
  };

  const buildGrid = () => {
    if (!maze || maze.length === 0) return "";
    let out = "";
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
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
      {!gameOver ? (
        <div className="flex gap-2">
          <Button onClick={() => move("Up")}>Up</Button>
          <Button onClick={() => move("Down")}>Down</Button>
          <Button onClick={() => move("Left")}>Left</Button>
          <Button onClick={() => move("Right")}>Right</Button>
        </div>
      ) : (
        <Button onClick={startGame}>Restart</Button>
      )}
    </main>
  );
}
