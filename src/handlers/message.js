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

        // 🛡️ ANTI-BUCLE INFINITO PARA TESTING PROPIO
        // Si el mensaje empieza con el robot, es el bot respondiendo. Lo ignoramos.
        if (text.startsWith('🤖')) return;

        console.log(`[TESTING] Mensaje recibido: ${text}`);

        // Le clavamos el emoji adelante para que el próximo ciclo lo ignore
        await sock.sendMessage(senderId, { 
            text: `🤖 Sandbox configurada a prueba de balas. ¡Preparando el cerebro de la IA!` 
        });
    });
}

module.exports = { setupMessageHandler };