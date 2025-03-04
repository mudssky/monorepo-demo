import { Button, Card } from 'antd'
import { useEffect, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

interface GameState {
  snake: Position[]
  food: Position
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  score: number
  gameOver: boolean
}

const initialGameState: GameState = {
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'RIGHT',
  score: 0,
  gameOver: false,
}
export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  // const [, forceUpdate] = useState(undefined)
  // 使用单个 gameState 存储所有游戏状态
  const gameStateRef = useRef<GameState>(initialGameState)
  const [gameStateOrigin, setGameStateOrigin] =
    useState<GameState>(initialGameState)
  const gridSize = 20
  const canvasSize = 600

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const currentDirection = gameStateRef.current.direction
      switch (e.key) {
        case 'ArrowUp':
          if (currentDirection !== 'DOWN') gameStateRef.current.direction = 'UP'
          break
        case 'ArrowDown':
          if (currentDirection !== 'UP') gameStateRef.current.direction = 'DOWN'
          break
        case 'ArrowLeft':
          if (currentDirection !== 'RIGHT')
            gameStateRef.current.direction = 'LEFT'
          break
        case 'ArrowRight':
          if (currentDirection !== 'LEFT')
            gameStateRef.current.direction = 'RIGHT'
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const generateFood = () => {
    gameStateRef.current.food = {
      x: Math.floor(Math.random() * (canvasSize / gridSize)),
      y: Math.floor(Math.random() * (canvasSize / gridSize)),
    }
  }

  const checkCollision = (head: Position) => {
    const { snake } = gameStateRef.current
    if (
      head.x < 0 ||
      head.x >= canvasSize / gridSize ||
      head.y < 0 ||
      head.y >= canvasSize / gridSize
    ) {
      return true
    }

    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true
      }
    }
    return false
  }

  const moveSnake = () => {
    const state = gameStateRef.current
    const newSnake = [...state.snake]
    const head = { ...newSnake[0] }

    switch (state.direction) {
      case 'UP':
        head.y -= 1
        break
      case 'DOWN':
        head.y += 1
        break
      case 'LEFT':
        head.x -= 1
        break
      case 'RIGHT':
        head.x += 1
        break
    }

    if (checkCollision(head)) {
      state.gameOver = true
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    newSnake.unshift(head)

    if (head.x === state.food.x && head.y === state.food.y) {
      state.score += 1
      generateFood()
    } else {
      newSnake.pop()
    }

    state.snake = newSnake
  }

  const drawGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current

    ctx.clearRect(0, 0, canvasSize, canvasSize)

    ctx.fillStyle = '#4CAF50'
    state.snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2,
      )
    })

    ctx.fillStyle = '#FF5722'
    ctx.fillRect(
      state.food.x * gridSize,
      state.food.y * gridSize,
      gridSize - 2,
      gridSize - 2,
    )
  }

  const startGame = () => {
    // 重置游戏状态
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: 'RIGHT',
      score: 0,
      gameOver: false,
    }
    generateFood()

    let lastTime = 0
    const frameInterval = 150

    const animate = (timestamp: number) => {
      if (!gameStateRef.current.gameOver) {
        drawGame()
        const deltaTime = timestamp - lastTime
        if (deltaTime >= frameInterval) {
          moveSnake()
          lastTime = timestamp
          setGameStateOrigin({ ...gameStateRef.current })
        }
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <Card title="贪吃蛇游戏" className="w-[1200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="text-lg">得分: {gameStateOrigin.score}</div>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border border-gray-300"
        />
        {gameStateOrigin.gameOver && (
          <div className="text-red-500 text-lg">游戏结束！</div>
        )}
        <Button type="primary" onClick={startGame}>
          {gameStateOrigin.gameOver ? '开始游戏' : '重新开始'}
        </Button>
        <div className="text-gray-500 text-sm">使用键盘方向键控制蛇的移动</div>
      </div>
    </Card>
  )
}
