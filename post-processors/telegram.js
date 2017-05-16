const https = require('https');

const fetchClientPostUrl = require('../utils').fetchClientPostUrl;

let channelUserName = '@mestawet';
const botToken = '370124055:AAGYWzIzSH25TJ0LSM49r7DBe7oWUiL6o6Y';
const telegramApiHost = 'api.telegram.org';
const telegramApiPath = `/bot${botToken}`;

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
    channelUserName = '@mestawet_test';
}

function getTelegramMessage(text) {
    const message = {
        chat_id: channelUserName,
        text,
        disable_notification: true,
    };
    return JSON.stringify(message);
}

function send(message) {
    return new Promise((resolve, reject) => {
        const telegramMessage = getTelegramMessage(message);
        const req = https.request({
            hostname: telegramApiHost,
            path: `${telegramApiPath}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(telegramMessage),
            },
        }, (res) => {
            let data = '';
            res.on('error', (e) => {
                reject(e);
            });
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const jsonResponse = JSON.parse(data);
                if (!jsonResponse.ok) {
                    reject(new Error(jsonResponse.description));
                } else {
                    resolve();
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(telegramMessage);
        req.end();
    })
    .catch(console.log);
}

function sendUrls(urls) {
    return urls.reduce((seq, url) => seq.then(() => send(url)),
        Promise.resolve());
}

module.exports = (posts) => {
    const postUrls = posts.map(fetchClientPostUrl);
    sendUrls(postUrls);
    // Promise.all(postUrls.map(send));
};
