const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const axios = require('axios');

// Token del bot de Telegram
const token = process.env.BOT_TOKEN;

// Crear el bot usando 'polling' para recibir actualizaciones
const bot = new TelegramBot(token, { polling: true });

// Estado para almacenar datos de sesión temporal
const userSessions = {};
const pendingSelections = {};

// Comando para loguearse
bot.onText(/\/login (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const credentials = match[1].split(' ');

  if (credentials.length !== 2) {
    bot.sendMessage(chatId, 'Formato incorrecto. Usa: /login <usuario> <contraseña>');
    return;
  }

  const [username, password] = credentials;

  try {
    // Verificar las credenciales mediante POST
    const response = await axios.post(`http://localhost:8080/usuarios/verificarPassword?usuario=${username}&contrasena=${password}`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Si las credenciales son correctas, hacer un GET para obtener todos los usuarios
    const usersResponse = await axios.get(`http://localhost:8080/usuarios`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Buscar el usuario por nombre de usuario (usuario)
    const user = usersResponse.data.find(u => u.usuario === username);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si el usuario es admin
    const isAdminResponse = await axios.get(`http://localhost:8080/usuarios/${user.id}/esAdmin`);
    const isAdmin = isAdminResponse.data;

    // Guardar los detalles del usuario y el estado de admin en la sesión
    userSessions[chatId] = {
      username,
      carritoId: user.carrito.id,  // Guardar el carritoId en la sesión
      isAdmin,  // Guardar el estado de admin
      ...user // Guardar los detalles completos del usuario
    };

    // Obtener el id del usuario
    const userId = user.id;

    // Realizar un GET para obtener el carrito del usuario usando su id
    const carritoResponse = await axios.get(`http://localhost:8080/carrito/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Mostrar el carrito al usuario (o hacer algo con la respuesta del carrito)
    bot.sendMessage(chatId, `¡Hola, ${username}! Te has logueado exitosamente. Usa el comando /comandos para ver lo que puedes hacer.`);

  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.status === 401) {
      bot.sendMessage(chatId, 'Credenciales incorrectas. Inténtalo de nuevo.');
    } else {
      bot.sendMessage(chatId, 'Error al iniciar sesión. Por favor, intenta más tarde.');
    }
  }
});


//comando para desloguear
bot.onText(/\/logout/, (msg) => {
  const chatId = msg.chat.id;

  if (userSessions[chatId]) {
    delete userSessions[chatId];
    bot.sendMessage(chatId, 'Has cerrado sesión exitosamente. ¡Hasta luego!');
  } else {
    bot.sendMessage(chatId, 'No hay una sesión activa para cerrar.');
  }
});

// Función para agregar al carrito
const addToCart = async (chatId, menuId, quantity) => {
  const userId = userSessions[chatId]?.id;

  if (!userId || !menuId || !quantity) {
    bot.sendMessage(chatId, "Faltan datos para agregar al carrito.");
    return;
  }

  try {
    // Convertir los valores a números para asegurar que se envíen correctamente
    const payload = {
      usuarioId: parseInt(userId, 10),
      menuId: parseInt(menuId, 10),
      cantidad: parseInt(quantity, 10),
    };

    const response = await axios.post(`http://localhost:8080/carrito/agregar`, payload);

    if (response.status === 200) {
      bot.sendMessage(chatId, `Platillo agregado al carrito con éxito.`);
    } else {
      bot.sendMessage(chatId, 'No se pudo agregar el item al carrito.');
    }
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    bot.sendMessage(chatId, 'Ocurrió un error al intentar agregar el item al carrito.');
  }
};

// Mostrar el menú con botones
bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;

  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  try {
    // Obtener el menú desde el backend
    const response = await axios.get(`http://localhost:8080/menu`);
    const menuItems = response.data;

    // Crear una lista de botones con los elementos del menú
    const buttons = menuItems.map((item) => [
      {
        text: `${item.nombre} - $${item.precio}`,
        callback_data: `select_${item.id}`,
      },
    ]);

    // Enviar el menú con botones
    bot.sendMessage(chatId, 'Menú disponible:', {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  } catch (error) {
    console.error('Error al obtener el menú:', error);
    bot.sendMessage(chatId, 'Error al obtener el menú.');
  }
});

bot.onText(/\/carrito/, async (msg) => {
  const chatId = msg.chat.id;

  // Verificar si el usuario está logueado
  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  const userId = userSessions[chatId].id;

  try {
    // Obtener el carrito del usuario desde el backend
    const carritoResponse = await axios.get(`http://localhost:8080/carrito/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const carrito = carritoResponse.data;

    if (carrito.items.length === 0) {
      bot.sendMessage(chatId, 'Tu carrito está vacío.');
      return;
    }

    // Inicializar el total a pagar
    let total = 0;
    
    // Construir un mensaje con los detalles del carrito
    let mensajeCarrito = '🛒 *Tu Carrito:*\n\n';
    const buttons = [];

    carrito.items.forEach((item, index) => {
      mensajeCarrito += `${index + 1}. *${item.menu.nombre}*\n   Cantidad: ${item.cantidad}\n   Precio: $${item.menu.precio}\n\n`;

      // Sumar el precio del ítem al total
      total += item.menu.precio * item.cantidad;

      // Crear el botón para eliminar el ítem
      buttons.push([{
        text: `Eliminar ${item.menu.nombre}`,
        callback_data: `eliminar_${item.id}`,  // Aquí pasamos el item ID para eliminarlo
      }]);
    });

    // Mostrar el total a pagar
    mensajeCarrito += `\n*Total a pagar:* $${total.toFixed(2)}`;

    // Enviar el mensaje del carrito con los botones para eliminar
    bot.sendMessage(chatId, mensajeCarrito, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: buttons
      }
    });

  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    bot.sendMessage(chatId, 'Ocurrió un error al obtener tu carrito. Intenta nuevamente más tarde.');
  }
});

// Manejador de callback para eliminar ítems del carrito
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data.split('_');
  const action = data[0];
  const itemId = data[1];

  if (action === 'select') {
    try {
      // Obtener información del menú seleccionado
      const menuResponse = await axios.get(`http://localhost:8080/menu`);
      const menuItem = menuResponse.data.find(item => item.id == itemId);

      if (!menuItem) {
        bot.sendMessage(chatId, 'No se encontró el menú seleccionado. Por favor, intenta nuevamente.');
        return;
      }

      // Guardar la selección pendiente para este chat
      pendingSelections[chatId] = { menuId: itemId, menuName: menuItem.nombre };

      bot.sendMessage(chatId, `Has seleccionado *${menuItem.nombre}*. Por favor, ingresa la cantidad que deseas agregar:`, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error al obtener el menú seleccionado:', error.message);
      bot.sendMessage(chatId, 'Ocurrió un error al obtener los detalles del menú seleccionado.');
    }
  } else if (action === 'eliminar') {
    try {
      const carritoId = userSessions[chatId].carritoId;
      const response = await axios.delete(`http://localhost:8080/carrito/eliminar/${carritoId}/${itemId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        bot.sendMessage(chatId, '¡El producto ha sido eliminado del carrito!');
        bot.emit('text', { chat: { id: chatId }, text: '/carrito' });
      } else {
        bot.sendMessage(chatId, 'Ocurrió un error al eliminar el producto. Intenta nuevamente más tarde.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      bot.sendMessage(chatId, 'Ocurrió un error al eliminar el producto. Intenta nuevamente más tarde.');
    }
  }
});


bot.onText(/\/pagar/, async (msg) => {
  const chatId = msg.chat.id;

  // Verificar si el usuario está logueado
  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  const carritoId = userSessions[chatId].carritoId;

  try {
    // Procesar el pago
    const response = await axios.put(`http://localhost:8080/carrito/pagar/${carritoId}`, {
      metodoPago: 'Efectivo', // Puedes cambiar esto por una lógica para seleccionar el método de pago
    });

    // Verificar si la respuesta del backend es exitosa
    if (response.status === 200) {
      bot.sendMessage(chatId, '¡Pago procesado con éxito! Tu carrito ha sido vaciado.');
    } else {
      throw new Error('Respuesta inesperada del servidor');
    }

  } catch (error) {
    console.error('Error al procesar el pago:', error);
  }
});

bot.onText(/\/historialVentas (diario|semanal|mensual|anual)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const rango = match[1]; // Rango elegido: diario, semanal, mensual, anual

  // Función para calcular el total de una venta
  const calcularTotalVenta = (detalles) => {
    return detalles.reduce((total, detalle) => {
      // Si tienes la cantidad de cada item, la puedes usar
      return total + (detalle.precio);
    }, 0);
  };

  // Verificar si el usuario está logueado y es administrador
  if (userSessions[chatId] && userSessions[chatId].isAdmin) {
    try {
      // Obtener las ventas del rango seleccionado para el usuario
      const userId = userSessions[chatId].id; // Obtener el ID del usuario desde la sesión
      const response = await axios.get(`http://localhost:8080/historial/ventas?userId=${userId}&rango=${rango}`);

      // Verificar si la respuesta es exitosa
      if (response.status === 200) {
        const ventas = response.data.historial;

        // Ordenar las ventas por fecha (descendente)
        const ventasOrdenadas = ventas.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));

        // Calcular el total de todas las ventas
        const totalVentas = ventas.reduce((total, venta) => total + calcularTotalVenta(venta.detalles), 0);

        // Formatear la respuesta para mostrar las ventas de forma legible
        let message = `Historial de ventas (${rango}):\n\n`;
        ventasOrdenadas.forEach(venta => {
          const totalVenta = calcularTotalVenta(venta.detalles);
          message += `Fecha: ${new Date(venta.fechaCompra).toLocaleString()}\nTotal: $${totalVenta.toFixed(2)}\n`;
          message += `Detalles:\n`;
          venta.detalles.forEach(detalle => {
            message += `  - ${detalle.nombreMenu} x${detalle.cantidad} = $${(detalle.precio).toFixed(2)}\n`;
          });
          message += `\n`; // Separar ventas
        });

        // Incluir el total de las ventas
        message += `Total de las ventas: $${totalVentas.toFixed(2)}\n`;

        if (ventasOrdenadas.length === 0) {
          message = `No se encontraron ventas en el rango ${rango}.`;
        }

        bot.sendMessage(chatId, message);
      } else {
        bot.sendMessage(chatId, 'No se pudo obtener el historial de ventas. Intenta más tarde.');
      }
    } catch (error) {
      console.error('Error al obtener el historial de ventas:', error);
      bot.sendMessage(chatId, 'Hubo un error al intentar obtener el historial de ventas.');
    }
  } else {
    bot.sendMessage(chatId, 'No tienes permisos para acceder al historial de ventas.');
  }
});


// Escuchar la respuesta con la cantidad y agregar al carrito
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (pendingSelections[chatId]) {
    const { menuId, menuName } = pendingSelections[chatId];
    const quantity = parseInt(msg.text, 10);

    if (isNaN(quantity) || quantity <= 0) {
      bot.sendMessage(chatId, 'Cantidad inválida. Intenta nuevamente.');
      return;
    }

    try {
      // Llamar a la función para agregar al carrito
      const userId = userSessions[chatId]?.id;
      const payload = {
        usuarioId: parseInt(userId, 10),
        menuId: parseInt(menuId, 10),
        cantidad: parseInt(quantity, 10),
      };

      const response = await axios.post(`http://localhost:8080/carrito/agregar`, payload);

      if (response.status === 200) {
        bot.sendMessage(chatId, `¡${menuName} ha sido agregado al carrito con éxito!`);
      } else {
        bot.sendMessage(chatId, 'No se pudo agregar el item al carrito.');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error.message);
      bot.sendMessage(chatId, 'Ocurrió un error al intentar agregar el item al carrito.');
    }

    // Limpiar la selección pendiente
    delete pendingSelections[chatId];
  }
});

// Comando para mostrar la lista de comandos disponibles
bot.onText(/\/comandos/, (msg) => {
  const chatId = msg.chat.id;

  const comandos = `
📜 *Lista de Comandos Disponibles:*
  
1. *\/login <usuario> <contraseña>*  
   Inicia sesión en el sistema.

2. *\/logout*  
   Cierra tu sesión actual.

3. *\/menu*  
   Muestra el menú disponible con los platillos y precios.

4. *\/carrito*  
   Muestra los artículos en tu carrito de compras.

5. *\/pagar*  
   Procesa el pago de tu carrito y lo vacía.

6. *\/comandos*  
   Muestra esta lista de comandos.

🛠 Si tienes dudas, no dudes en usar este comando nuevamente.
  `;

  bot.sendMessage(chatId, comandos, { parse_mode: 'Markdown' });
});
