import { PlaygroundContext } from '@/components/ReactPlayground/PlaygroundContext'
import { useContext, useEffect, useState } from 'react'
import { FileNameItem } from './components/FileNameItem'
import styles from './components/FileNameItem/index.module.scss'
import {
  APP_COMPONENT_FILE_NAME,
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
} from '@/components/ReactPlayground/files'
export default function FileNameList() {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext)
  const [tabs, setTabs] = useState([''])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    setTabs(Object.keys(files))
  }, [files])

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name)
    setSelectedFileName(name)
    setCreating(false)
  }

  const addTab = () => {
    const newFileName = 'Comp' + Math.random().toString().slice(2, 8) + '.tsx'
    addFile(newFileName)
    setSelectedFileName(newFileName)
    setCreating(true)
  }

  const handleRemove = (name: string) => {
    removeFile(name)
    setSelectedFileName(ENTRY_FILE_NAME)
  }
  const readonlyFilenames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_FILE_NAME,
  ]
  return (
    <div className={styles.tabs}>
      {tabs.map((item, index) => (
        <FileNameItem
          creating={creating}
          readonly={readonlyFilenames.includes(item)}
          key={item + index}
          onClick={() => setSelectedFileName(item)}
          actived={selectedFileName === item}
          value={item}
          onEditComplete={handleEditComplete}
          onRemove={() => {
            handleRemove(item)
          }}
        ></FileNameItem>
      ))}
      <div className={styles.add} onClick={addTab}>
        +
      </div>
    </div>
  )
}
