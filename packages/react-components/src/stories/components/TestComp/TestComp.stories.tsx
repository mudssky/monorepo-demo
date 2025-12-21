import React from 'react'

interface AaaProps {
  children: React.ReactNode
}

const Aaa: React.FC<AaaProps> = (props) => {
  const { children } = props

  return (
    <div className="container">
      {React.Children.map(children, (item) => {
        return <div className="item">{item}</div>
      })}
    </div>
  )
}

const meta = {
  title: 'TestComp',
  component: Aaa,
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    // value: {
    //   //   control: 'date',
    // },
  },
}

export default meta

export const TestReactChildren = {
  args: {},
  render() {
    return (
      <Aaa>
        <a href="#">111</a>
        <a href="#">222</a>
        <a href="#">333</a>
      </Aaa>
    )
  },
}
