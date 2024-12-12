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
    // Realiza una petición POST con los parámetros en el cuerpo de la solicitud
    const response = await axios.post(`http://localhost:8080/usuarios/verificarPassword?usuario=${username}&contrasena=${password}`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Guardar detalles del usuario en la sesión si la autenticación es exitosa
    userSessions[chatId] = {
      username,
      ...response.data // Guarda otros datos devueltos por el backend
    };

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


// Comando para ver el menú
bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;

  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  try {
    const response = await axios.get('http://localhost:8080/menu');
    const menuItems = response.data;

    let menuMessage = 'Menú disponible:\n\n';
    menuItems.forEach((item, index) => {
      menuMessage += `${index + 1}. ${item.nombre} - $${item.precio}\n`;
    });

    bot.sendMessage(chatId, menuMessage + '\nPara agregar al carrito, usa: /agregar <número del plato> <cantidad>');
  } catch (error) {
    bot.sendMessage(chatId, 'Error al obtener el menú.');
  }
});

// Comando para agregar items al carrito
bot.onText(/\/agregar (\d+) (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const menuId = parseInt(match[1]);
  const cantidad = parseInt(match[2]);

  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  try {
    const response = await axios.post(`http://localhost:8080/carrito/agregar`, {
      usuario: userSessions[chatId].username,
      menuId,
      cantidad,
    });

    bot.sendMessage(chatId, `Producto agregado al carrito: ${cantidad}x del plato ${menuId}.`);
  } catch (error) {
    bot.sendMessage(chatId, 'Error al agregar el producto al carrito.');
  }
});

// Comando para ver el carrito
bot.onText(/\/carrito/, async (msg) => {
  const chatId = msg.chat.id;

  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/usuarios`);
    const user = response.data.find(u => u.username === userSessions[chatId].username);

    if (user && user.carrito && user.carrito.items.length > 0) {
      let cartMessage = 'Tu carrito actual:\n\n';
      user.carrito.items.forEach((item, index) => {
        cartMessage += `${index + 1}. ${item.menu.nombre} - ${item.cantidad}x - $${item.menu.precio * item.cantidad}\n`;
      });
      bot.sendMessage(chatId, cartMessage + '\nPara eliminar un item: /eliminar <carritoId> <itemId>');
    } else {
      bot.sendMessage(chatId, 'Tu carrito está vacío.');
    }
  } catch (error) {
    bot.sendMessage(chatId, 'Error al cargar el carrito.');
  }
});

// Comando para procesar el pago
bot.onText(/\/pagar/, async (msg) => {
  const chatId = msg.chat.id;

  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  try {
    const response = await axios.put(`http://localhost:8080/carrito/pagar/${userSessions[chatId].username}`);
    bot.sendMessage(chatId, 'Pago procesado exitosamente. ¡Gracias por tu compra!');
  } catch (error) {
    bot.sendMessage(chatId, 'Error al procesar el pago.');
  }
});

// Comando para ver el historial de pedidos
bot.onText(/\/historial/, async (msg) => {
  const chatId = msg.chat.id;

  if (!userSessions[chatId]) {
    bot.sendMessage(chatId, 'Por favor, inicia sesión primero con el comando /login.');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/historial/${userSessions[chatId].username}`);
    const pedidos = response.data;

    if (pedidos.length === 0) {
      bot.sendMessage(chatId, 'No tienes pedidos anteriores.');
      return;
    }

    let historialMessage = 'Historial de pedidos:\n\n';
    pedidos.forEach((pedido, index) => {
      historialMessage += `Pedido ${index + 1}: ${pedido.items.map(item => `${item.menu.nombre} (${item.cantidad}x)`).join(', ')} - Total: $${pedido.total}\n`;
    });

    bot.sendMessage(chatId, historialMessage);
  } catch (error) {
    bot.sendMessage(chatId, 'Error al obtener el historial de pedidos.');
  }
});

// Mensaje por defecto
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text.startsWith('/')) {
    bot.sendMessage(chatId, 'Comandos disponibles:\n/login <usuario> <contraseña>\n/menu\n/carrito\n/agregar <número del plato> <cantidad>\n/pagar\n/historial');
  }
});
