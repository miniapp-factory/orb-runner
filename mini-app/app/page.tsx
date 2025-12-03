"use client";

import { description, title, url } from "@/lib/metadata";
import { Share } from "@/components/share";
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

  const initGame = () => {
    const rows = 10;
    const cols = 10;
    const newMaze: number[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    );
    let x = 0;
    let y = 0;
    newMaze[y][x] = 1;
    while (x !== cols - 1 || y !== rows - 1) {
      if (Math.random() < 0.5 && x < cols - 1) {
        x += 1;
      } else if (y < rows - 1) {
        y += 1;
      }
      newMaze[y][x] = 1;
    }
    for (let i = 0; i < 40; i++) {
      const rx = Math.floor(Math.random() * cols);
      const ry = Math.floor(Math.random() * rows);
      newMaze[ry][rx] = 1;
    }
    setPlayerX(0);
    setPlayerY(0);
    let monsterX = cols - 1;
    let monsterY = rows - 1;
    if (newMaze[monsterY][monsterX] === 0) {
      outer: for (let yy = rows - 1; yy >= 0; yy--) {
        for (let xx = cols - 1; xx >= 0; xx--) {
          if (newMaze[yy][xx] === 1) {
            monsterX = xx;
            monsterY = yy;
            break outer;
          }
        }
      }
    }
    setMonsterX(monsterX);
    setMonsterY(monsterY);
    let exitX = Math.floor(Math.random() * cols);
    let exitY = Math.floor(Math.random() * rows);
    while (
      newMaze[exitY][exitX] !== 1 ||
      (exitX === 0 && exitY === 0) ||
      (exitX === monsterX && exitY === monsterY)
    ) {
      exitX = Math.floor(Math.random() * cols);
      exitY = Math.floor(Math.random() * rows);
    }
    setExitX(exitX);
    setExitY(exitY);
    setMaze(newMaze);
    setMoves(0);
    setTimeLeft(30);
    setGameOver(false);
    setMessage("Escape the maze! Use buttons. Restart always available.");
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
      return;
    }
    if (maze[newY][newX] === 0) {
      return;
    }

    const newMoves = moves + 1;
    setPlayerX(newX);
    setPlayerY(newY);
    setMoves(newMoves);
    const newTimeLeft = timeLeft - 1;
    setTimeLeft(newTimeLeft);

    if (newX === exitX && newY === exitY) {
      endGame(true);
      return;
    }

    const [newMonsterX, newMonsterY] = monsterMove();

    if (newMonsterX === newX && newMonsterY === newY) {
      endGame(false);
      return;
    }

    if (newTimeLeft <= 0) {
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

  const monsterMove = (): [number, number] => {
    if (gameOver) return [monsterX, monsterY];
    const dx = playerX - monsterX;
    const dy = playerY - monsterY;
    const options: [number, number][] = [];
    if (Math.abs(dx) >= Math.abs(dy)) {
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

    let newX = monsterX;
    let newY = monsterY;
    for (const [ox, oy] of options) {
      if (ox >= 0 && oy >= 0 && ox < maze[0].length && oy < maze.length) {
        if (maze[oy][ox] === 1) {
          newX = ox;
          newY = oy;
          break;
        }
      }
    }
    setMonsterX(newX);
    setMonsterY(newY);

    return [newX, newY];
  };

  const buildGrid = () => {
    if (!maze || maze.length === 0) return "";
    let out = "";
    const rows = maze.length;
    const cols = maze[0]?.length ?? 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (x === playerX && y === playerY) {
          out += "🧍";
        } else if (x === monsterX && y === monsterY) {
          out += "👹";
        } else if (x === exitX && y === exitY) {
          out += "🟧";
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
    initGame();
  }, []);

  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm">{message}</p>
      <Share text={`${description} ${url}`} />
      <pre className="text-4xl font-mono whitespace-pre">{buildGrid()}</pre>
      <div className="flex gap-2">
        <Button onClick={() => move("Up")}>Up</Button>
        <Button onClick={() => move("Down")}>Down</Button>
        <Button onClick={() => move("Left")}>Left</Button>
        <Button onClick={() => move("Right")}>Right</Button>
        <Button onClick={initGame}>Restart</Button>
      </div>
    </main>
  );
}
