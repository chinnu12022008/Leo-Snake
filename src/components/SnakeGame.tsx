import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const SPEED = 110;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const dirQueue = useRef<Point[]>([]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
    setDir({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    dirQueue.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      const lastDir = dirQueue.current.length > 0 ? dirQueue.current[dirQueue.current.length - 1] : dir;
      let nextDir: Point | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y !== 1) nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y !== -1) nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x !== 1) nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x !== -1) nextDir = { x: 1, y: 0 };
          break;
      }
      if (nextDir) {
        dirQueue.current.push(nextDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        const currentDir = dirQueue.current.length > 0 ? dirQueue.current.shift()! : dir;
        if (dirQueue.current.length > 0 || currentDir !== dir) {
          setDir(currentDir);
        }

        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          
          let newFood;
          while (true) {
            newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            };
            // eslint-disable-next-line no-loop-func
            if (!newSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
              break;
            }
          }
          setFood(newFood);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [dir, food, gameOver, isPaused]);

  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isSnakeHead = snake[0].x === x && snake[0].y === y;
      const isSnakeBody = !isSnakeHead && snake.some((s) => s.x === x && s.y === y);
      const isFood = food.x === x && food.y === y;

      let className = "w-full h-full ";
      if (isSnakeHead) {
        className += "bg-white border-[2px] border-[#00FFFF]";
      } else if (isSnakeBody) {
        className += "bg-[#00FFFF] border-[1px] border-black scale-95";
      } else if (isFood) {
        className += "bg-[#FF00FF] animate-pulse scale-75";
      } else {
        className += "bg-transparent border border-[#00FFFF]/10";
      }

      cells.push(<div key={`${x}-${y}`} className={className} />);
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[440px]">
      <div className="flex justify-between items-center w-full mb-2 bg-[#FF00FF] text-black px-4 py-1 border-[2px] border-[#FF00FF] font-black text-xl tracking-widest uppercase shadow-[4px_4px_0_#00FFFF]">
        <span className="glitch-text" data-text={`DATA:${String(score).padStart(4, '0')}`}>DATA:{String(score).padStart(4, '0')}</span>
        {isPaused && !gameOver && (
          <span className="animate-pulse bg-black text-[#FF00FF] px-2 italic text-sm">INTERRUPT</span>
        )}
      </div>

      <div className="relative w-full border-[4px] border-[#00FFFF] p-1 bg-[#111] shadow-[-6px_6px_0_#FF00FF]">
        <div
          className="w-full aspect-square max-h-[440px] bg-black grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {cells}
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent z-20 overflow-hidden mix-blend-exclusion">
             <div className="absolute inset-0 bg-[#FF00FF] opacity-90 animate-[pulse_0.1s_infinite]"></div>
             <div className="relative z-30 text-center p-8 bg-black border-[4px] border-[#00FFFF] shadow-[10px_10px_0_#FF00FF]">
              <h2 className="text-4xl font-black text-[#FF00FF] mb-4 uppercase" style={{textShadow: '3px 3px 0 #00FFFF'}}>
                FATAL_ERR
              </h2>
              <p className="text-[#00FFFF] mb-6 font-bold text-xl uppercase tracking-widest border-b-[2px] border-[#FF00FF] pb-2">
                SCORE_DUMP: {String(score).padStart(4, '0')}
              </p>
              <button
                onClick={resetGame}
                className="w-full py-4 bg-transparent border-[4px] border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black font-black uppercase text-xl cursor-crosshair transition-none"
              >
                [ REBOOT ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
