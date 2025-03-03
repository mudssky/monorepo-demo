import { Button, Card } from 'antd'
import { useEffect, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameLoop, setGameLoop] = useState<number | null>(null)

  const gridSize = 20
  const canvasSize = 400

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction])

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * (canvasSize / gridSize)),
      y: Math.floor(Math.random() * (canvasSize / gridSize)),
    }
    setFood(newFood)
  }

  const checkCollision = (head: Position) => {
    // 检查是否撞墙
    if (
      head.x < 0 ||
      head.x >= canvasSize / gridSize ||
      head.y < 0 ||
      head.y >= canvasSize / gridSize
    ) {
      return true
    }

    // 检查是否撞到自己
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true
      }
    }

    return false
  }

  const moveSnake = () => {
    const newSnake = [...snake]
    const head = { ...newSnake[0] }

    switch (direction) {
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
      setGameOver(true)
      if (gameLoop) clearInterval(gameLoop)
      return
    }

    newSnake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1)
      generateFood()
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }

  const drawGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // 绘制蛇
    ctx.fillStyle = '#4CAF50'
    snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2,
      )
    })

    // 绘制食物
    ctx.fillStyle = '#FF5722'
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2,
    )
  }

  useEffect(() => {
    drawGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snake, food])

  const startGame = () => {
    setGameOver(false)
    setScore(0)
    setSnake([{ x: 10, y: 10 }])
    generateFood()
    setDirection('RIGHT')

    if (gameLoop) clearInterval(gameLoop)
    const newGameLoop = window.setInterval(moveSnake, 150)
    setGameLoop(newGameLoop)
  }

  return (
    <Card title="贪吃蛇游戏" className="w-[500px]">
      <div className="flex flex-col items-center gap-4">
        <div className="text-lg">得分: {score}</div>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border border-gray-300"
        />
        {gameOver && <div className="text-red-500 text-lg">游戏结束！</div>}
        <Button type="primary" onClick={startGame}>
          {gameOver ? '重新开始' : '开始游戏'}
        </Button>
      </div>
    </Card>
  )
}
