import { passwordStrengthEnum } from '@/global/enums'
import { calcPercent } from '@/utils/calc'
import { Progress } from 'antd'
import { checkPasswordStrength } from './hooks'
interface Props {
  password: string
}

export default function PasswordStrengthChecker(props: Props) {
  const { password } = props

  const passwordStrength = checkPasswordStrength(password)
  return (
    <div>
      <span> 密码强度:</span>
      <Progress
        percent={calcPercent(passwordStrength, 4)}
        steps={5}
        strokeColor={['red', 'orange', 'orange', 'green']}
      />
      <span>{passwordStrengthEnum.getLabelByValue(passwordStrength)}</span>
    </div>
  )
}
