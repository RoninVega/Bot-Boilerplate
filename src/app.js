const { connectToWhatsApp } = require('./connection/whatsapp');

async function startBot() {
    console.log('🚀 Iniciando el bot...');
    await connectToWhatsApp();
}

startBot();