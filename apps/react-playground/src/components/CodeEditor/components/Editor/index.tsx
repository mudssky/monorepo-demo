import MonacoEditor, { EditorProps, OnMount } from '@monaco-editor/react'

import { createATA } from './ata'

export interface EditorFile {
  name: string
  value: string
  language: string
}

interface Props {
  file: EditorFile
  onChange?: EditorProps['onChange']
  options?: EditorProps['options']
}
export default function Editor(props: Props) {
  const { file, onChange, options } = props

  const handleEditorMount: OnMount = (editor, monaco) => {
    // 可以添加快捷键。
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      // 输出支持的actions
      const actions = editor.getSupportedActions().map((a) => a.id)
      console.log({ actions })
      editor.getAction('editor.action.formatDocument')?.run()
    })

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    })

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`,
      )
    })

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue())
    })

    ata(editor.getValue())
  }
  return (
    <MonacoEditor
      height="100%"
      // path={'test.tsx'}
      path={file.name}
      // language={'typescript'}
      language={file.language}
      value={file.value}
      onMount={handleEditorMount}
      onChange={onChange}
      options={{
        fontSize: 14,
        //  到了最后一行之后依然可以滚动一屏
        scrollBeyondLastLine: false,
        // 缩略图
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options,
      }}
    />
  )
}
