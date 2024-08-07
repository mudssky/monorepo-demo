import { PropsWithChildren, useEffect, useState } from 'react'
import { Files, PlaygroundContext, Theme } from './PlaygroundContext'
import { compress, fileName2Language, getFilesFromUrl } from '@/utils'
import { initFiles } from './files'

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props
  const [files, setFiles] = useState<Files>(initFiles)

  const [selectedFileName, setSelectedFileName] = useState('App.tsx')
  const [theme, setTheme] = useState<Theme>('light')
  const addFile = (name: string) => {
    files[name] = {
      name,
      language: fileName2Language(name),
      value: '',
    }
    setFiles({ ...files })
  }

  const removeFile = (name: string) => {
    delete files[name]
    setFiles({ ...files })
  }

  const updateFileName = (oldFieldName: string, newFieldName: string) => {
    if (
      !files[oldFieldName] ||
      newFieldName === undefined ||
      newFieldName === null
    )
      return
    const { [oldFieldName]: value, ...rest } = files
    const newFile = {
      [newFieldName]: {
        ...value,
        language: fileName2Language(newFieldName),
        name: newFieldName,
      },
    }
    setFiles({
      ...rest,
      ...newFile,
    })
  }

  // 加载链接中的信息
  useEffect(() => {
    const files = getFilesFromUrl()
    if (files) {
      setFiles(files)
    }

    return () => {}
  }, [])
  useEffect(() => {
    const hash = compress(JSON.stringify(files))
    window.location.hash = hash

    return () => {}
  }, [files])

  return (
    <PlaygroundContext.Provider
      value={{
        theme,
        setTheme,
        files,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}
