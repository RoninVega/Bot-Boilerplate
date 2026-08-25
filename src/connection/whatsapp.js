const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }) 
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.clear(); 
            
            console.log('==================================================');
            console.log('Escanea este QR con el WhatsApp del cliente');
            console.log('==================================================');
            qrcode.generate(qr, { small: true }); 
            
            console.log('⏳ Esperando escaneo... (El código se renueva automáticamente por seguridad)');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('⚠️ Conexión cerrada. ¿Reconectando?:', shouldReconnect);
            
            if (shouldReconnect) {
                connectToWhatsApp(); 
            } else {
                console.log('❌ El cliente cerró sesión desde su celular. Hay que borrar la carpeta de auth y generar nuevo QR.');
            }
        } else if (connection === 'open') {
            console.log('✅ ¡Bot conectado a WhatsApp exitosamente!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    return sock;
}

module.exports = { connectToWhatsApp };