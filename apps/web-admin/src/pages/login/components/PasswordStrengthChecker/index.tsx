import { Progress } from 'antd'
import { checkPasswordStrength } from './hooks'
interface Props {
  password: string
}

export default function PasswordStrengthChecker(props: Props) {
  const { password } = props
  return (
    <div>
      <span> 密码强度:</span>
      <Progress
        percent={(checkPasswordStrength(password) * 100) / 5}
        steps={5}
        strokeColor={['red', 'red', 'orange', 'orange', 'green']}
      />
    </div>
  )
}
