'use client'

import BlogEditor from "@/components/blog/ckeditor"
import DropdownMenuCategory from "@/components/blog/dropDownMenuCategory";
import { useState } from "react";

interface Option {
  id: string | number;
  label: string;
  value: string;
}

const BlogEditorPage = () => {
  const TOKEN = process.env.NEXT_PUBLIC_API_KEY
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('')
  const [description, setContent] = useState('');
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<Option | null>(null);

  const opciones: Option[] = [
    { id: 'MOTOR', label: 'Motor', value: 'Motor' },
    { id: 'MINISPLIT', label: 'Minisplit', value: 'Minisplit' },
    { id: 'LAVADORA', label: 'Lavadora', value: 'Lavadora' },
    { id: 'VENTILADOR', label: 'Ventilador', value: 'Ventilador' },
    { id: 'SECADORA', label: 'Secadora', value: 'Secadora' },
    { id: 'REFRIGERADOR', label: 'Refrigerador', value: 'Refrigerador' },
    { id: 'ESTUFA', label: 'Estufa', value: 'Estufa' },
    { id: 'HORNO', label: 'Horno', value: 'Horno' },
    { id: 'MICROONDAS', label: 'Microondas', value: 'Microondas' },
    { id: 'LICUADORA', label: 'Licuadora', value: 'Licuadora' },
    { id: 'BATIDORA', label: 'Batidora', value: 'Batidora' },
    { id: 'TOSTADOR', label: 'Tostador', value: 'Tostador' },
    { id: 'CAFETERA', label: 'Cafetera', value: 'Cafetera' },
    { id: 'PLANCHA', label: 'Plancha', value: 'Plancha' },
    { id: 'ASPIRADORA', label: 'Aspiradora', value: 'Aspiradora' },
    { id: 'OTROS', label: 'Otros', value: 'Otros' },
  ];

  const handleSelect = (option: Option) => {
    setOpcionSeleccionada(option);
    console.log('Opción seleccionada:', option);
  };


  const handleSave = async () => {
    try {
      // Implementa aquí la lógica para guardar el blog
      const response = await fetch('http://127.0.0.1:8000/api/v1/blog/posts/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          slug,
          category: opcionSeleccionada?.value
        }),
      });

      if (response.ok) {
        alert('Blog guardado exitosamente');
        // Redirección o limpieza del formulario
      } else {
        alert('Error al guardar el blog');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el blog');
    }
  };

  return (
    <div className="container mx-auto p-4 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Editor de Blog</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Contenido</label>
        <BlogEditor
          initialValue=""
          onChange={setContent}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="w-64 mb-4">
        <DropdownMenuCategory
          options={opciones}
          onSelect={handleSelect}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
      >
        Guardar Entrada
      </button>
    </div>
  );
};

export default BlogEditorPage;