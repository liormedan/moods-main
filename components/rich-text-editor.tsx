"use client"

import { memo, useEffect, useRef } from "react"
import EditorJS, { type OutputData } from "@editorjs/editorjs"
import { EDITOR_TOOLS } from "@/lib/editorjs-config"

interface RichTextEditorProps {
  data?: OutputData
  onChange: (data: OutputData) => void
  holder: string
  placeholder?: string
}

function RichTextEditor({ data, onChange, holder, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<EditorJS | null>(null)

  useEffect(() => {
    if (!editorRef.current) {
      try {
        const editor = new EditorJS({
          holder: holder,
          tools: EDITOR_TOOLS,
          data: data,
          placeholder: placeholder || "התחל לכתוב...",
          onChange: async (api) => {
            const content = await api.saver.save()
            onChange(content)
          },
          minHeight: 150,
          i18n: {
            direction: "rtl",
          },
          onReady: () => {
            // Suppress keyboard API errors in preview environment
            const originalError = console.error
            console.error = (...args) => {
              if (args[0]?.toString().includes("getLayoutMap")) {
                return
              }
              originalError(...args)
            }
          },
        })

        editorRef.current = editor
      } catch (error) {
        // Silently handle initialization errors in preview environment
        console.log("[v0] Editor initialization skipped:", error)
      }
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [])

  return <div id={holder} className="prose prose-slate dark:prose-invert max-w-none" />
}

export default memo(RichTextEditor)
