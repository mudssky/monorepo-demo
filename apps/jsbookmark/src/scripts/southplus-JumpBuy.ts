export const jumpBuyArea = () => {
  const buyArea = document.querySelector('.quote.jumbotron') as HTMLDivElement
  buyArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return buyArea
}
jumpBuyArea()
