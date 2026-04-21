
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('PLAYING');
    onScoreUpdate(0);
  };

  const gameOver = () => {
    setGameState('GAME_OVER');
    if (score > highScore) setHighScore(score);
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, onScoreUpdate, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (gameState === 'PLAYING') {
      if (time - lastUpdateRef.current > speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(update);
    }
  }, [gameState, moveSnake, speed]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(update);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0k'; // Deep black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    snake.forEach((segment, index) => {
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 flex gap-8 font-mono text-sm uppercase tracking-widest text-cyan-400">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-cyan-400/50">Score</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-cyan-400/50">High Score</span>
          <span className="text-xl font-bold">{highScore}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border-4 border-cyan-500/30 bg-black shadow-[0_0_50px_rgba(0,255,255,0.1)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />

        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-4xl font-black text-transparent">
                NEON SNAKE
              </h2>
              <button
                onClick={() => setGameState('PLAYING')}
                className="group relative flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:bg-cyan-400"
              >
                <Play fill="currentColor" size={20} />
                START GAME
                <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-cyan-500 blur-xl opacity-50 group-hover:opacity-100" />
              </button>
              <p className="mt-8 text-xs text-white/40 font-mono uppercase tracking-[0.2em]">Use Arrow Keys to Move</p>
            </motion.div>
          )}

          {gameState === 'GAME_OVER' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <Trophy className="mb-4 text-fuchsia-500" size={64} />
              <h2 className="mb-2 text-3xl font-black text-white italic tracking-tight">GAME OVER</h2>
              <p className="mb-8 font-mono text-cyan-400">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 rounded-full border-2 border-fuchsia-500 px-8 py-3 font-bold text-fuchsia-500 transition-all hover:bg-fuchsia-500 hover:text-white"
              >
                <RotateCcw size={20} />
                TRY AGAIN
              </button>
            </motion.div>
          )}

          {gameState === 'PAUSED' && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <button
                  onClick={() => setGameState('PLAYING')}
                  className="rounded-full bg-white/10 p-6 text-white backdrop-blur-md hover:bg-white/20"
                >
                  <Play size={48} fill="currentColor" />
                </button>
             </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'PLAYING' && (
          <button
            onClick={() => setGameState('PAUSED')}
            className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
          >
            <Pause size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
