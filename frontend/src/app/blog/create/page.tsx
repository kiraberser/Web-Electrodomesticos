'use client'

import { useState } from "react";
import axios from 'axios';

import BlogEditor from "@/components/blog/ckeditor";
import DropdownMenuCategory from "@/components/blog/dropDownMenuCategory";

import { options } from "@/data/optionsPost";

interface Option {
  id: string | number;
  label: string;
  value: string;
}

const BlogEditorPage = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    console.log('Opción seleccionada:', option);
  };

  const handleSave = async () => {
    if (!title || !slug || !description) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('category', selectedOption?.value || 'Otros');
      if (file) {
        formData.append('image', file); // Asegúrate que tu backend acepte este campo
      }

      const response = await axios.post(
        'http://localhost:8000/api/v1/blog/posts/create/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        alert('Blog guardado exitosamente');
        // Limpieza del formulario
        setTitle('');
        setSlug('');
        setDescription('');
        setSelectedOption(null);
        setFile(null);
      } else {
        alert('Hubo un problema al guardar el blog.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el blog');
    }
  };

  return (
    <div className="container mx-auto p-4 w-full max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Editor de Blog</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Escribe el título del post"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Contenido</label>
        <BlogEditor initialValue="" onChange={setDescription} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Subir imagen (opcional)</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="ej. como-reparar-un-ventilador"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <DropdownMenuCategory options={options} onSelect={handleSelect} />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        Guardar entrada
      </button>
    </div>
  );
};

export default BlogEditorPage;
