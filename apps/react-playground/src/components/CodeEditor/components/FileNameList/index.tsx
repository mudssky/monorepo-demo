import { PlaygroundContext } from '@/components/ReactPlayground/PlaygroundContext'
import { useContext, useEffect, useState } from 'react'
import { FileNameItem } from './components/FileNameItem'
import styles from './components/FileNameItem/index.module.scss'
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

  useEffect(() => {
    setTabs(Object.keys(files))
  }, [files])

  return (
    <div className={styles.tabs}>
      {tabs.map((item, index) => (
        <FileNameItem
          key={item + index}
          onClick={() => setSelectedFileName(item)}
          actived={selectedFileName === item}
          value={item}
        ></FileNameItem>
      ))}
    </div>
  )
}
