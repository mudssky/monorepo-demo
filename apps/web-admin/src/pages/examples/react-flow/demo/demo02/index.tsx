import { Button } from 'antd'
import { createStyles } from 'antd-style'
import { useEffect, useMemo } from 'react'
const keys: Record<string, { frequency: number }> = {
  A: {
    frequency: 196,
  },
  S: {
    frequency: 220,
  },
  D: {
    frequency: 246,
  },
  F: {
    frequency: 261,
  },
  G: {
    frequency: 293,
  },
  H: {
    frequency: 329,
  },
  J: {
    frequency: 349,
  },
  K: {
    frequency: 392,
  },
}

const useStyles = createStyles(({ css }) => {
  const textStyle = css`
    line-height: 500px;
    text-align: center;
    font-size: 50px;
  `
  return {
    container: css`
      width: 800px;
      height: 400px;
      margin: 40px auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      overflow: hidden;
      .pressed {
        background: #aaa;
      }
    `,

    keyStyle: css`
      border: 4px solid black;
      background: #fff;
      flex: 1;
      ${textStyle}
      &:hover {
        background: #aaa;
      }
    `,
    text: {
      color: 'lightblue',
    },
  }
})
export default function Demo02() {
  const { styles } = useStyles()
  const context = useMemo(() => {
    return new AudioContext()
  }, [])
  const play = (key: string) => {
    const frequency = keys[key]?.frequency
    if (!frequency) {
      return
    }
    const osc = context.createOscillator()
    osc.type = 'sine'

    const gain = context.createGain()
    osc.connect(gain)
    gain.connect(context.destination)

    osc.frequency.value = frequency
    gain.gain.setValueAtTime(0, context.currentTime)
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01)

    osc.start(context.currentTime)

    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1)
    osc.stop(context.currentTime + 1)

    document.getElementById(`key-${key}`)?.classList.add('pressed')
    setTimeout(() => {
      document.getElementById(`key-${key}`)?.classList.remove('pressed')
    }, 100)
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      play(e.key.toUpperCase())
    })
  }, [])

  const map: Record<number, string> = {
    1: 'A',
    2: 'S',
    3: 'D',
    4: 'F',
    5: 'G',
    6: 'H',
    7: 'J',
    8: 'K',
  }

  function playMusic(music: number[][]) {
    let startTime = 0
    music.forEach((item) => {
      setTimeout(() => {
        play(map[item[0]])
      }, startTime * 0.5)
      startTime += item[1]
    })
  }
  function playSong2() {
    const music = [
      [6, 1000],
      [6, 1000],
      [6, 1000],
      [3, 500],
      [6, 500],
      [5, 1000],
      [3, 500],
      [2, 500],
      [3, 1000],
    ]

    playMusic(music)
  }
  return (
    <div className="bg-black">
      <section className={styles.container}>
        {Object.keys(keys).map((item: any) => {
          return (
            <div className={styles.keyStyle} key={item} id={`key-${item}`}>
              <div onClick={() => play(item)}>
                <span>{item}</span>
              </div>
            </div>
          )
        })}
      </section>
      <Button onClick={playSong2}>播放音乐</Button>
    </div>
  )
}
