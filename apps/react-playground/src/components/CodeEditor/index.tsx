/* eslint-disable prefer-rest-params */
import FileNameList from './components/FileNameList/index'
import Editor from './components/Editor/index'

export default function CodeEditor() {
  const file = {
    name: 'test.tsx',
    value: 'import lodash from "lodash";\n\nconst a = <div>test</div>',
    language: 'typescript',
  }
  function onEditorChange() {
    console.log(...arguments)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FileNameList />
      <Editor file={file} onChange={onEditorChange} />
    </div>
  )
}
