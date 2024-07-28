import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// interface Props extends DndProviderProps {

// }
interface Props {
  children: React.ReactNode
}
export default function CustomReactDndProvider(props: Props) {
  return <DndProvider backend={HTML5Backend} {...props}></DndProvider>
}
