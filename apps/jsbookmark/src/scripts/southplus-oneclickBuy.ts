import { jumpBuyArea } from './deprecated/southplus-JumpBuy'

const buyArea = jumpBuyArea()

if (!document.querySelector('.blockquote.jumbotron')) {
  ;(buyArea.querySelector('input[type="button"]') as HTMLButtonElement).click()
}
