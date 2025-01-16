import { debounce } from '@mudssky/jsutils'
import { useContext } from 'react'
import { PlaygroundContext } from '../ReactPlayground/PlaygroundContext'
import Editor from './components/Editor/index'
import FileNameList from './components/FileNameList/index'

export default function CodeEditor() {
  const { theme, files, setFiles, selectedFileName } =
    useContext(PlaygroundContext)

  const file = files[selectedFileName]
  function onEditorChange(value?: string) {
    // console.log(...arguments)
    files[file.name].value = value!
    setFiles({ ...files })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FileNameList />
      <Editor
        file={file}
        options={{
          theme: `vs-${theme}`,
        }}
        onChange={debounce(onEditorChange)}
      />
    </div>
  )
}
