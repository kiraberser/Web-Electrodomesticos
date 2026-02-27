"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExt from "@tiptap/extension-underline"
import LinkExt from "@tiptap/extension-link"
import PlaceholderExt from "@tiptap/extension-placeholder"
import TextAlignExt from "@tiptap/extension-text-align"
import ImageExt from "@tiptap/extension-image"
import { useEffect, useCallback } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  ImageIcon,
  Minus,
  Pilcrow,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogEditorProps {
  value?: string
  onChange?: (content: string) => void
  dark?: boolean
}

// ─── Toolbar primitives ───────────────────────────────────────────────────────

function TBtn({
  active = false,
  disabled = false,
  dark,
  title,
  onClick,
  children,
}: {
  active?: boolean
  disabled?: boolean
  dark: boolean
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded p-1.5 transition-colors disabled:opacity-30",
        active
          ? dark
            ? "bg-blue-500/30 text-blue-300"
            : "bg-blue-100 text-blue-700"
          : dark
            ? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function Sep({ dark }: { dark: boolean }) {
  return <span className={`mx-0.5 h-5 w-px self-center ${dark ? "bg-white/10" : "bg-gray-200"}`} />
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ editor, dark }: { editor: Editor; dark: boolean }) {
  const addLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("URL del enlace:", prev ?? "https://")
    if (url === null) return
    if (!url) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt("URL de la imagen:")
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const b = (props: Omit<Parameters<typeof TBtn>[0], "dark">) => (
    <TBtn dark={dark} {...props} />
  )

  return (
    <div
      className={`flex flex-wrap items-center gap-0.5 border-b p-2 ${
        dark ? "border-white/10 bg-slate-900" : "border-gray-200 bg-gray-50"
      }`}
    >
      {/* History */}
      {b({ title: "Deshacer (Ctrl+Z)", disabled: !editor.can().undo(), onClick: () => editor.chain().focus().undo().run(), children: <Undo2 className="h-4 w-4" /> })}
      {b({ title: "Rehacer (Ctrl+Y)", disabled: !editor.can().redo(), onClick: () => editor.chain().focus().redo().run(), children: <Redo2 className="h-4 w-4" /> })}

      <Sep dark={dark} />

      {/* Headings */}
      {b({ active: editor.isActive("heading", { level: 1 }), title: "Título 1", onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), children: <Heading1 className="h-4 w-4" /> })}
      {b({ active: editor.isActive("heading", { level: 2 }), title: "Título 2", onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), children: <Heading2 className="h-4 w-4" /> })}
      {b({ active: editor.isActive("heading", { level: 3 }), title: "Título 3", onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), children: <Heading3 className="h-4 w-4" /> })}
      {b({ active: editor.isActive("paragraph"), title: "Párrafo", onClick: () => editor.chain().focus().setParagraph().run(), children: <Pilcrow className="h-4 w-4" /> })}

      <Sep dark={dark} />

      {/* Text formatting */}
      {b({ active: editor.isActive("bold"),      title: "Negrita (Ctrl+B)",   onClick: () => editor.chain().focus().toggleBold().run(),      children: <Bold        className="h-4 w-4" /> })}
      {b({ active: editor.isActive("italic"),    title: "Cursiva (Ctrl+I)",   onClick: () => editor.chain().focus().toggleItalic().run(),    children: <Italic      className="h-4 w-4" /> })}
      {b({ active: editor.isActive("underline"), title: "Subrayado (Ctrl+U)", onClick: () => editor.chain().focus().toggleUnderline().run(), children: <Underline   className="h-4 w-4" /> })}
      {b({ active: editor.isActive("strike"),    title: "Tachado",            onClick: () => editor.chain().focus().toggleStrike().run(),    children: <Strikethrough className="h-4 w-4" /> })}
      {b({ active: editor.isActive("code"),      title: "Código en línea",    onClick: () => editor.chain().focus().toggleCode().run(),      children: <Code        className="h-4 w-4" /> })}

      <Sep dark={dark} />

      {/* Alignment */}
      {b({ active: editor.isActive({ textAlign: "left" }),   title: "Alinear izquierda", onClick: () => editor.chain().focus().setTextAlign("left").run(),   children: <AlignLeft   className="h-4 w-4" /> })}
      {b({ active: editor.isActive({ textAlign: "center" }), title: "Centrar",            onClick: () => editor.chain().focus().setTextAlign("center").run(), children: <AlignCenter className="h-4 w-4" /> })}
      {b({ active: editor.isActive({ textAlign: "right" }),  title: "Alinear derecha",   onClick: () => editor.chain().focus().setTextAlign("right").run(),  children: <AlignRight  className="h-4 w-4" /> })}

      <Sep dark={dark} />

      {/* Lists & blocks */}
      {b({ active: editor.isActive("bulletList"),  title: "Lista con viñetas", onClick: () => editor.chain().focus().toggleBulletList().run(),  children: <List         className="h-4 w-4" /> })}
      {b({ active: editor.isActive("orderedList"), title: "Lista numerada",    onClick: () => editor.chain().focus().toggleOrderedList().run(), children: <ListOrdered  className="h-4 w-4" /> })}
      {b({ active: editor.isActive("blockquote"),  title: "Cita",              onClick: () => editor.chain().focus().toggleBlockquote().run(),  children: <Quote        className="h-4 w-4" /> })}
      {b({ active: editor.isActive("codeBlock"),   title: "Bloque de código",  onClick: () => editor.chain().focus().toggleCodeBlock().run(),   children: <Code2        className="h-4 w-4" /> })}
      {b({                                          title: "Separador",         onClick: () => editor.chain().focus().setHorizontalRule().run(), children: <Minus        className="h-4 w-4" /> })}

      <Sep dark={dark} />

      {/* Link & image */}
      {b({ active: editor.isActive("link"), title: "Insertar enlace",         onClick: addLink,   children: <Link2     className="h-4 w-4" /> })}
      {b({                                  title: "Insertar imagen (URL)",    onClick: addImage,  children: <ImageIcon className="h-4 w-4" /> })}
    </div>
  )
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export default function RichEditor({ value = "", onChange, dark = false }: BlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExt,
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-500 underline cursor-pointer" },
      }),
      TextAlignExt.configure({ types: ["heading", "paragraph"] }),
      ImageExt.configure({ inline: false, allowBase64: true }),
      PlaceholderExt.configure({
        placeholder: "Escribe el contenido del artículo aquí…",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: [
          "prose max-w-none min-h-[400px] px-4 py-3 focus:outline-none",
          dark ? "prose-invert" : "",
        ].join(" "),
      },
    },
  })

  // Sync external value changes (e.g. form reset) — `false` avoids re-triggering onUpdate
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  if (!editor) {
    return (
      <div
        className={`h-[400px] w-full animate-pulse rounded-lg border ${
          dark ? "border-white/10 bg-slate-800" : "border-gray-200 bg-gray-50"
        }`}
      />
    )
  }

  return (
    <>
      {/* Placeholder CSS — Tiptap doesn't include it by default */}
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          color: ${dark ? "#64748b" : "#9ca3af"};
        }
        .tiptap:focus { outline: none; }
        .tiptap img { max-width: 100%; height: auto; border-radius: 0.5rem; }
        .tiptap a { color: #3b82f6; text-decoration: underline; cursor: pointer; }
        .tiptap code { background: ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em; }
        .tiptap pre { background: ${dark ? "#0f172a" : "#f1f5f9"}; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
        .tiptap blockquote { border-left: 3px solid ${dark ? "rgba(255,255,255,0.2)" : "#e5e7eb"}; padding-left: 1rem; color: ${dark ? "#94a3b8" : "#6b7280"}; }
        .tiptap hr { border: none; border-top: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}; margin: 1rem 0; }
      `}</style>

      <div
        className={`overflow-hidden rounded-lg border ${
          dark ? "border-white/10" : "border-gray-200"
        }`}
      >
        <Toolbar editor={editor} dark={dark} />
        <div className={dark ? "bg-slate-800 text-gray-200" : "bg-white"}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  )
}
