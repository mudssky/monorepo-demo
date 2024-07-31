/* eslint-disable prefer-rest-params */
import FileNameList from './components/FileNameList/index'
import Editor from './components/Editor/index'
import { useContext } from 'react'
import { PlaygroundContext } from '../ReactPlayground/PlaygroundContext'
import { debounce } from '@mudssky/jsutils'

export default function CodeEditor() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { files, setFiles, selectedFileName, setSelectedFileName } =
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
      <Editor file={file} onChange={debounce(onEditorChange)} />
    </div>
  )
}
