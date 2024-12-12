const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const axios = require('axios');

// Token del bot de Telegram
const token = process.env.BOT_TOKEN;

// Crear el bot usando 'polling' para recibir actualizaciones
const bot = new TelegramBot(token, { polling: true });

// Estado para almacenar datos de sesión temporal
const userSessions = {};

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
    const usersResponse = await axios.get('http://localhost:8080/usuarios', {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Buscar el usuario por nombre de usuario (usuario)
    const user = usersResponse.data.find(u => u.usuario === username);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Guardar los detalles del usuario en la sesión
    userSessions[chatId] = {
      username,
      carritoId: user.carrito.id,  // Guardar el carritoId en la sesión
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
    bot.sendMessage(chatId, `¡Hola, ${username}! Te has logueado exitosamente.`);

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

bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;

  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  try {
    // Obtener el menú desde el backend
    const response = await axios.get('http://localhost:8080/menu');
    const menuItems = response.data;

    // Formar el mensaje con los detalles del menú, incluyendo el ID real
    let menuMessage = 'Menú disponible:\n\n';
    menuItems.forEach((item, index) => {
      menuMessage += `${index + 1}. ${item.nombre} - $${item.precio} (ID: ${item.id})\n`;
    });

    // Enviar el mensaje al usuario
    bot.sendMessage(chatId, menuMessage + '\nPara agregar al carrito, usa: /agregar <número del plato> <cantidad>');
  } catch (error) {
    console.error('Error al obtener el menú:', error);
    bot.sendMessage(chatId, 'Error al obtener el menú.');
  }
});



const addToCart = async (chatId, menuId, quantity) => {
  const userId = userSessions[chatId]?.id;  // Asegúrate de que el usuario esté autenticado y tenga un id

  if (!userId || !menuId || !quantity) {
      bot.sendMessage(chatId, "Faltan datos para agregar al carrito.");
      return;
  }

  try {
      // Obtener el ítem del menú (simulado, debes adaptarlo a tu lógica)
      const menuItem = { id: menuId, nombre: "Nombre del Platillo" }; // Aquí deberías buscar el platillo en tu base de datos o en un arreglo

      // Enviar solicitud POST al backend para agregar al carrito
      const response = await axios.post('http://localhost:8080/carrito/agregar', {
          usuarioId: userId,
          menuId: menuItem.id,
          cantidad: quantity,
      });

      // Verificar si la respuesta fue exitosa
      if (response.status === 200) {
          bot.sendMessage(chatId, `${menuItem.nombre} agregado al carrito con éxito.`);
      } else {
          bot.sendMessage(chatId, 'No se pudo agregar el item al carrito.');
      }
  } catch (error) {
      console.error('Error al agregar al carrito:', error);
      bot.sendMessage(chatId, 'Ocurrió un error al intentar agregar el item al carrito.');
  }
};

// Listener para manejar mensajes del bot
bot.onText(/\/agregar (\d+) (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const menuId = parseInt(match[1], 10); // El ID del menú del mensaje
  const quantity = parseInt(match[2], 10); // La cantidad del mensaje

  // Llamar a la función para agregar al carrito
  await addToCart(chatId, menuId, quantity);
});

// Mensaje por defecto
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = userSessions[chatId]?.id;
  const selectedMenuId = userSessions[chatId]?.selectedMenuId;

  if (!userId || !selectedMenuId) return;

  const quantity = parseInt(msg.text);

  if (isNaN(quantity) || quantity <= 0) {
    bot.sendMessage(chatId, 'Por favor, ingresa una cantidad válida.');
    return;
  }

  // Llamar a la función para agregar al carrito
  addToCart(chatId, selectedMenuId, quantity);

  // Limpiar la selección del menú para evitar que el bot siga pidiendo cantidades
  delete userSessions[chatId].selectedMenuId;
});