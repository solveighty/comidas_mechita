import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../styles/AddMenu.css'; // Importar archivo CSS con el estilo mejorado
import url_Backend from './config';

const AddMenu = ({ userId, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(null);
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);

  const categorias = [
    { label: 'Platos Especiales', value: 'PLATOS_ESPECIALES' },
    { label: 'Comidas Rápidas', value: 'COMIDAS_RAPIDAS' },
    { label: 'Bocaditos', value: 'BOCADITOS' },
  ];

  const handleSubmit = async () => {
    if (!nombre || !descripcion || !precio || !imagen || !categoria) {
      toast.current.show({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor, complete todos los campos.',
        life: 3000,
      });
      return;
    }

    const nuevoMenu = {
      nombre,
      descripcion,
      precio,
      imagen,
      categoria,
    };

    setLoading(true);
    try {
      const response = await fetch(
        `http://${url_Backend}:8080/menu/crearmenu?userId=${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoMenu),
        }
      );

      if (!response.ok) {
        throw new Error('No se pudo crear el menú. Verifique si el usuario es administrador.');
      }

      toast.current.show({
        severity: 'success',
        summary: 'Menú creado',
        detail: 'El menú se ha creado exitosamente.',
        life: 3000,
      });

      // Reiniciar los campos
      setNombre('');
      setDescripcion('');
      setPrecio(null);
      setImagen('');
      setCategoria(null);
      onClose(); // Cierra el diálogo
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-container">
      <Toast ref={toast} />
      <div className="form-container">
        <h2 className="form-title">Crear Nuevo Menú</h2>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12">
            <label htmlFor="nombre">Nombre del Menú</label>
            <InputText
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre del menú"
              className="input-field"
            />
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="descripcion">Descripción</label>
            <InputTextarea
              id="descripcion"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese una descripción"
              className="input-field"
            />
          </div>
          <div className="p-field p-col-6">
            <label htmlFor="precio">Precio</label>
            <InputNumber
              id="precio"
              value={precio}
              onValueChange={(e) => setPrecio(e.value)}
              mode="currency"
              currency="USD"
              locale="en-US"
              className="input-field"
            />
          </div>
          <div className="p-field p-col-6">
            <label htmlFor="categoria">Categoría</label>
            <Dropdown
              id="categoria"
              value={categoria}
              options={categorias}
              onChange={(e) => setCategoria(e.value)}
              placeholder="Seleccione una categoría"
              className="input-field"
            />
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="imagen">URL de la Imagen</label>
            <InputText
              id="imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="Ingrese la URL de la imagen"
              className="input-field"
            />
          </div>
        </div>
        <div className="button-container">
          <Button
            label="Crear Menú"
            icon="pi pi-check"
            onClick={handleSubmit}
            className="submit-button"
            loading={loading}
          />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
