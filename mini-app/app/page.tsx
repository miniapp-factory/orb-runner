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
    setGameOver(false);
    setMessage("Find your way to the exit!");
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
      setMessage("You hit the boundary!");
      return;
    }
    if (maze[newY][newX] === 0) {
      setMessage("Blocked by a wall!");
      return;
    }
    const newMoves = moves + 1;
    setPlayerX(newX);
    setPlayerY(newY);
    setMoves(newMoves);
    setMessage(`You moved ${dir}. Moves: ${newMoves}`);
    if (newX === exitX && newY === exitY) {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    setMessage(`🏁 Escaped! Total moves: ${moves}`);
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <h1 className="text-2xl font-bold">Path Finder Puzzle</h1>
      <p>Player Position: ({playerX},{playerY})</p>
      <p>Exit: ({exitX},{exitY})</p>
      <p>Moves: {moves}</p>
      <p>{message}</p>
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
