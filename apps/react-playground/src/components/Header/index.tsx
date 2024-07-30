import logoSvg from '@/assets/react.svg'
import styles from './styles.module.scss'

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logoSvg} alt="logo" />
        <span>React Playground</span>
      </div>
    </div>
  )
}
