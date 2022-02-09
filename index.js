const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = "./session.json";

const country_code = "58424";
const number = "8318037";
const msg = "Hola Ricardo";

let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData,
});

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('El cliente esta listo');

    let chatId = country_code + number + "@c.us";

    client.sendMessage(chatId, msg)
        .then((response) => {
            if (response.id.fromMe) {
                console.log('El mensaje fue enviado');
            }
        })
});

client.on('authenticated', (session) => {
    sessionData = session;

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.log(err);
        }
    });
});

client.on('auth_failure', (msg) => {
    console.error('Ocurrio un fallo en la autenticación');
})

client.on('message', msg => {
    if (msg.body === "hola bot") {
        client.sendMessage(msg.from, "Hola que tal");
    }
});