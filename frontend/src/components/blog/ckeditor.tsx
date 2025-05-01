'use client'

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface BlogEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
}

const TOKEN = process.env.NEXT_TINY_CKEDITOR_API

const BlogEditor = ({ initialValue, onChange }: BlogEditorProps) => {
    const editorRef = useRef<any>(null);
    
    console.log(TOKEN)
  return (
    <div className="blog-editor">
      <Editor
        apiKey='anvs5tf93oc5h7hmikre5x6jt4hpmtfkpn3alpfkiksc8cxx'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={initialValue}
        onEditorChange={(newContent) => onChange(newContent)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | image link media',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          // Configuración para imágenes
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          // Estas opciones puedes adaptarlas según tu configuración de API para subir imágenes
          images_upload_handler: function (blobInfo, progress) {
            return new Promise((resolve, reject) => {
              // Aquí implementarías tu lógica para subir imágenes a tu servidor/almacenamiento
              // Este es solo un ejemplo de la estructura
              const formData = new FormData();
              formData.append('file', blobInfo.blob(), blobInfo.filename());
              
              fetch('/api/upload-image', {
                method: 'POST',
                body: formData
              })
              .then(response => response.json())
              .then(result => {
                resolve(result.location);
              })
              .catch(error => {
                reject(error.message);
              });
            });
          }
        }}
      />
    </div>
  );
};

export default BlogEditor;