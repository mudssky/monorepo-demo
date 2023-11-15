export const jumpBuyArea = () => {
  const buyArea = document.querySelector('.quote.jumbotron') as HTMLDivElement
  // 立刻执行，如果换成smooth，接下来的scrollTo会覆盖
  buyArea.scrollIntoView({ behavior: 'instant', block: 'start' })
  window.scrollTo({
    top: window.scrollY - 100,
    behavior: 'smooth',
  })
  return buyArea
}
jumpBuyArea()
