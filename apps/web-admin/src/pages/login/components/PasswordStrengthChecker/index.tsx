import { passwordStrengthEnum } from '@/global/enums'
import { calcPercent } from '@/utils/calc'
import { calculatePasswordStrengthLevel } from '@mudssky/jsutils'
import { Progress } from 'antd'
interface Props {
  password: string
}

export default function PasswordStrengthChecker(props: Props) {
  const { password } = props

  const passwordStrength = calculatePasswordStrengthLevel(password)
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
