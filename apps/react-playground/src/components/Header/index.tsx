import logoSvg from '@/assets/react.svg'
import styles from './styles.module.scss'
import { useContext } from 'react'
import { PlaygroundContext } from '../ReactPlayground/PlaygroundContext'
import { MoonOutlined, ShareAltOutlined, SunOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { message } from 'antd'

export default function Header() {
  const { theme, setTheme } = useContext(PlaygroundContext)
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logoSvg} alt="logo" />
        <span>React Playground</span>
      </div>
      <div className={styles.links}>
        {theme === 'light' && (
          <MoonOutlined
            title="切换暗色主题"
            className={styles.theme}
            onClick={() => setTheme('dark')}
          />
        )}
        {theme === 'dark' && (
          <SunOutlined
            title="切换亮色主题"
            className={styles.theme}
            onClick={() => setTheme('light')}
          />
        )}
        <ShareAltOutlined
          style={{ marginLeft: '10px' }}
          onClick={() => {
            copy(window.location.href)
            message.success('分享链接已复制。')
          }}
        />
      </div>
    </div>
  )
}
