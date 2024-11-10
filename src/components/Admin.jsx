import { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

function Admin() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    image: ''
  });
  const toast = useRef(null);

  const handleAddItem = () => {
    // Lógica para agregar item
    setShowDialog(false);
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Item agregado correctamente'
    });
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setNewItem(item);
    setShowDialog(true);
  };

  const handleDeleteItem = (item) => {
    // Lógica para eliminar item
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Item eliminado correctamente'
    });
  };

  return (
    <div className="admin-container">
      <Toast ref={toast} />
      
      <h1>Panel de Administración</h1>
      
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Menú">
          <div className="card">
            <Button 
              label="Agregar Item" 
              icon="pi pi-plus" 
              onClick={() => {
                setSelectedItem(null);
                setNewItem({
                  name: '',
                  description: '',
                  price: 0,
                  image: ''
                });
                setShowDialog(true);
              }}
              className="mb-3"
            />
            
            <DataTable value={menuItems} responsiveLayout="scroll">
              <Column field="name" header="Nombre" />
              <Column field="description" header="Descripción" />
              <Column field="price" header="Precio" />
              <Column 
                body={(rowData) => (
                  <div className="flex gap-2">
                    <Button 
                      icon="pi pi-pencil" 
                      className="p-button-rounded p-button-warning" 
                      onClick={() => handleEditItem(rowData)}
                    />
                    <Button 
                      icon="pi pi-trash" 
                      className="p-button-rounded p-button-danger" 
                      onClick={() => handleDeleteItem(rowData)}
                    />
                  </div>
                )}
              />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>

      <Dialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        header={selectedItem ? "Editar Item" : "Agregar Item"}
      >
        <div className="flex flex-column gap-3">
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label htmlFor="description">Descripción</label>
            <InputText
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label htmlFor="price">Precio</label>
            <InputNumber
              id="price"
              value={newItem.price}
              onValueChange={(e) => setNewItem({...newItem, price: e.value})}
              mode="currency"
              currency="USD"
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label htmlFor="image">URL de Imagen</label>
            <InputText
              id="image"
              value={newItem.image}
              onChange={(e) => setNewItem({...newItem, image: e.target.value})}
              className="w-full"
            />
          </div>
          
          <Button 
            label={selectedItem ? "Guardar Cambios" : "Agregar"}
            onClick={handleAddItem}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default Admin; 