"use client"

import { useEffect, useState, useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"

interface BlogEditorProps {
  value?: string
  onChange?: (content: string) => void
  dark?: boolean
}

const TOKEN = process.env.NEXT_PUBLIC_TINYMCE_API_KEY // Usa tu env en `.env.local`

export default function RichEditor({ value = "", onChange, dark = false }: BlogEditorProps) {
  const [ready, setReady] = useState(false)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div
        className={`h-64 w-full animate-pulse rounded-lg border ${dark ? 'border-white/10 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="prose max-w-none prose-sm sm:prose-base">
      <Editor
        apiKey={TOKEN || "anvs5tf93oc5h7hmikre5x6jt4hpmtfkpn3alpfkiksc8cxx"}
        onInit={(_, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(newContent) => onChange?.(newContent)}
        init={{
          height: 500,
          menubar: true,
          skin: dark ? "oxide-dark" : "oxide",
          content_css: dark ? "dark" : "default",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help | image link media",
          content_style: dark
            ? "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #1e293b; color: #e2e8f0; }"
            : "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          images_upload_handler: function (blobInfo) {
            return new Promise((resolve, reject) => {
              const formData = new FormData()
              formData.append("file", blobInfo.blob(), blobInfo.filename())

              fetch("/api/upload-image", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((result) => {
                  resolve(result.location)
                })
                .catch((error) => {
                  reject(error.message)
                })
            })
          },
        }}
      />
    </div>
  )
}
