import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import { useEffect, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

// 在 GameState 接口中添加暂停状态
interface GameState {
  snake: Position[]
  food: Position
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  score: number
  gameOver: boolean
  isPaused: boolean // 新增
}

const initialGameState: GameState = {
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'RIGHT',
  score: 0,
  gameOver: false,
  isPaused: false, // 新增
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
      // 添加空格键暂停功能
      if (e.code === 'Space') {
        gameStateRef.current.isPaused = !gameStateRef.current.isPaused
        setGameStateOrigin({ ...gameStateRef.current })
        return
      }

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
    // 如果游戏结束，直接返回
    if (state.gameOver) {
      return
    }

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

    const borderSize = 1
    // 绘制墙壁
    ctx.fillStyle = '#34495e'
    // 上墙
    ctx.fillRect(0, 0, canvasSize, borderSize)
    // 下墙
    ctx.fillRect(0, canvasSize - borderSize, canvasSize, borderSize)
    // 左墙
    ctx.fillRect(0, 0, borderSize, canvasSize)
    // 右墙
    ctx.fillRect(canvasSize - borderSize, 0, borderSize, canvasSize)

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
  function updateUI() {
    setGameStateOrigin({ ...gameStateRef.current })
  }
  const startGame = () => {
    // 重置游戏状态
    gameStateRef.current = { ...initialGameState }
    generateFood()

    let lastTime = 0
    const frameInterval = 150

    const animate = (timestamp: number) => {
      // 增加暂停判断
      if (!gameStateRef.current.isPaused) {
        drawGame()
        const deltaTime = timestamp - lastTime
        if (deltaTime >= frameInterval) {
          moveSnake()
          lastTime = timestamp
          updateUI()
        }
        animationFrameRef.current = requestAnimationFrame(animate)
      } else if (gameStateRef.current.isPaused) {
        // 暂停时继续保持动画循环
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    drawGame()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // 在返回的 JSX 中替换空 div
  return (
    <Card title="贪吃蛇游戏" className="w-[1200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 justify-end w-full mr-[10px]">
          {!gameStateOrigin.gameOver && (
            <div
              className="text-2xl cursor-pointer"
              onClick={() => {
                gameStateRef.current.isPaused = !gameStateRef.current.isPaused
                updateUI()
              }}
            >
              {gameStateOrigin.isPaused ? (
                <PlayCircleOutlined className="text-green-500" />
              ) : (
                <PauseCircleOutlined className="text-blue-500" />
              )}
            </div>
          )}
        </div>
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
        {gameStateOrigin.isPaused && !gameStateOrigin.gameOver && (
          <div className="text-yellow-500 text-lg">游戏暂停</div>
        )}
        <Button type="primary" onClick={startGame}>
          {gameStateOrigin.gameOver ? '重新开始' : '开始游戏'}
        </Button>
        <div className="text-gray-500 text-sm">
          使用键盘方向键控制蛇的移动，空格键暂停/继续
        </div>
      </div>
    </Card>
  )
}
