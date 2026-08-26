const { generateResponse } = require('../services/gemini'); // 1. Importamos el cerebro

async function setupMessageHandler(sock) {
    sock.ev.on('messages.upsert', async (payload) => {
        const msg = payload.messages[0];
        if (!msg.message) return;

        const senderId = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        // 🛑 MODO SANDBOX (Pruebas Seguras) 🛑
        const GRUPO_DE_PRUEBAS = '120363419444683941@g.us'; 
        if (senderId !== GRUPO_DE_PRUEBAS) return; 

        // 🛡️ ANTI-BUCLE INFINITO
        if (text.startsWith('🤖')) return;

        console.log(`[TESTING] Cliente dice: ${text}`);

        // 2. Construimos el contexto (El "System Prompt" + El mensaje del usuario)
        // Acá es donde le damos la personalidad al bot
        const contextoCliente = `
Eres un asistente virtual de ventas para una zapatería llamada "Pisadas Rápidas".
Debes ser amable, conciso y ayudar al cliente a elegir zapatillas.
Reglas:
1. Precios: Zapatillas comunes $50.000, deportivas $80.000, lujo $120.000. (Precios en pesos argentinos).
2. Solo vendes zapatillas. Si preguntan por remeras o pantalones, di que no trabajas eso.
3. Intenta cerrar la venta pidiendo el talle.
4. Responde SIEMPRE de forma corta, como si fuera un chat de WhatsApp (máximo 2 párrafos cortos).

El cliente acaba de decir: "${text}"
Tu respuesta:
`;

        try {
            // 3. Le mandamos el texto a Gemini y esperamos que piense
            const respuestaIA = await generateResponse(contextoCliente);

            // 4. Respondemos en WhatsApp (con el emoji para no hacer bucle)
            await sock.sendMessage(senderId, { 
                text: `🤖 ${respuestaIA}` 
            });
            
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
            await sock.sendMessage(senderId, { text: '🤖 Hubo un problema técnico, intenta de nuevo.' });
        }
    });
}

module.exports = { setupMessageHandler };