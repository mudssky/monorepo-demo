import { useContext, useEffect, useRef, useState } from 'react'
import { PlaygroundContext } from '../ReactPlayground/PlaygroundContext'
import { IMPORT_MAP_FILE_NAME } from '../ReactPlayground/files'
import iframeRaw from './iframe.html?raw'
import { Message } from '../Message'
import CompilerWorker from './compile.worker?worker'
import { debounce } from 'lodash-es'

interface MessageData {
  data: {
    type: string
    message: string
  }
}

export default function Preview() {
  const { files } = useContext(PlaygroundContext)
  const [compiledCode, setCompiledCode] = useState('')
  const compilerWorkerRef = useRef<Worker>()
  const getIframeUrl = () => {
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${
          files[IMPORT_MAP_FILE_NAME].value
        }</script>`,
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`,
      )
    return URL.createObjectURL(new Blob([res], { type: 'text/html' }))
  }

  const [iframeUrl, setIframeUrl] = useState(getIframeUrl())

  const [error, setError] = useState('')

  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data
    if (type === 'ERROR') {
      setError(message)
    }
  }

  useEffect(() => {
    if (!compilerWorkerRef.current) {
      compilerWorkerRef.current = new CompilerWorker()
      compilerWorkerRef.current.addEventListener('message', (data) => {
        console.log('worker', data)

        if (data.type === 'COMPILED_CODE') {
          setCompiledCode(data.data)
        } else {
          //console.log('error', data);
        }
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    debounce(() => {
      // const res = compile(files)
      // setCompiledCode(res)
      compilerWorkerRef.current?.postMessage(files)
    }, 500),
    [files],
  )

  useEffect(() => {
    setIframeUrl(getIframeUrl())
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode])

  return (
    <div style={{ height: '100%' }}>
      <iframe
        src={iframeUrl}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          border: 'none',
        }}
      />
      {/* <Message type="warn" content={new Error().stack!.toString()}></Message> */}
      <Message type="error" content={error}></Message>
      {/* <Editor file={{
            name: 'dist.js',
            value: compiledCode,
            language: 'javascript'
        }}/> */}
    </div>
  )
}
