const { connectToWhatsApp } = require('./connection/whatsapp');
const { setupMessageHandler } = require('./handlers/message');

async function startBot() {
    console.log('🚀 Iniciando el bot...');
    
    const sock = await connectToWhatsApp();
    
    setupMessageHandler(sock);
}

startBot();