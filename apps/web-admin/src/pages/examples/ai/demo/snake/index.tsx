import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
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
  isPaused: boolean
}

const initialGameState: GameState = {
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'RIGHT',
  score: 0,
  gameOver: false,
  isPaused: false,
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const gameStateRef = useRef<GameState>(initialGameState)
  const [gameStateOrigin, setGameStateOrigin] =
    useState<GameState>(initialGameState)
  const gridSize = 20
  const canvasSize = 600

  // 抽离绘制边界的函数
  const drawBorders = (ctx: CanvasRenderingContext2D) => {
    const borderSize = 1
    ctx.fillStyle = '#34495e'
    // 上墙
    ctx.fillRect(0, 0, canvasSize, borderSize)
    // 下墙
    ctx.fillRect(0, canvasSize - borderSize, canvasSize, borderSize)
    // 左墙
    ctx.fillRect(0, 0, borderSize, canvasSize)
    // 右墙
    ctx.fillRect(canvasSize - borderSize, 0, borderSize, canvasSize)
  }

  // 抽离绘制蛇头的函数
  const drawSnakeHead = (
    ctx: CanvasRenderingContext2D,
    segment: Position,
    direction: string,
  ) => {
    ctx.fillStyle = '#2E7D32' // 深绿色蛇头
    // 绘制圆角矩形作为蛇头
    const radius = 4
    const x = segment.x * gridSize
    const y = segment.y * gridSize
    const width = gridSize - 2
    const height = gridSize - 2

    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()

    // 添加眼睛
    ctx.fillStyle = 'white'
    const eyeSize = 3
    const eyeOffset = 5
    // 根据方向调整眼睛位置
    switch (direction) {
      case 'RIGHT':
        ctx.fillRect(x + width - eyeOffset, y + eyeOffset, eyeSize, eyeSize)
        ctx.fillRect(
          x + width - eyeOffset,
          y + height - eyeOffset - eyeSize,
          eyeSize,
          eyeSize,
        )
        break
      case 'LEFT':
        ctx.fillRect(x + eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize)
        ctx.fillRect(
          x + eyeOffset - eyeSize,
          y + height - eyeOffset - eyeSize,
          eyeSize,
          eyeSize,
        )
        break
      case 'UP':
        ctx.fillRect(x + eyeOffset, y + eyeOffset - eyeSize, eyeSize, eyeSize)
        ctx.fillRect(
          x + width - eyeOffset - eyeSize,
          y + eyeOffset - eyeSize,
          eyeSize,
          eyeSize,
        )
        break
      case 'DOWN':
        ctx.fillRect(x + eyeOffset, y + height - eyeOffset, eyeSize, eyeSize)
        ctx.fillRect(
          x + width - eyeOffset - eyeSize,
          y + height - eyeOffset,
          eyeSize,
          eyeSize,
        )
        break
    }
  }

  // 抽离绘制蛇身的函数
  const drawSnakeBody = (ctx: CanvasRenderingContext2D, segment: Position) => {
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2,
    )
  }

  // 抽离绘制食物的函数
  const drawFood = (ctx: CanvasRenderingContext2D, food: Position) => {
    ctx.fillStyle = '#FF5722'
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2,
    )
  }

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

    // 绘制边界
    drawBorders(ctx)

    // 绘制蛇
    state.snake.forEach((segment, index) => {
      if (index === 0) {
        // 绘制蛇头
        drawSnakeHead(ctx, segment, state.direction)
      } else {
        // 绘制蛇身
        drawSnakeBody(ctx, segment)
      }
    })

    // 绘制食物
    drawFood(ctx, state.food)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-[1200px]">
      <div className="text-xl font-bold mb-4">贪吃蛇游戏</div>
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
    </div>
  )
}
