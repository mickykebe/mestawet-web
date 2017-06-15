const https = require('https');

const fetchClientPostUrl = require('../utils').fetchClientPostUrl;

const botToken = '370124055:AAGYWzIzSH25TJ0LSM49r7DBe7oWUiL6o6Y';
const telegramApiHost = 'api.telegram.org';
const telegramApiPath = `/bot${botToken}`;

function channelUserName(postType) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        return '@mestawet';
    }
    return postType === 'article' ? '@mestawet_news' : '@mestawet_videos';
}

function htmlMessage(post) {
    return `${post.source.title}
            ${post.thumbnailUrl ? `<a href="${post.thumbnailUrl}">&#8205;</a>` : ''} <a href="${fetchClientPostUrl(post)}">${post.title}</a>
            ${post.description ? post.description : ''}`;
}

function textMessage(post) {
    return fetchClientPostUrl(post);
}

function telegramMessage(post) {
    const message = {
        chat_id: channelUserName(post.kind),
        text: textMessage(post),
        //parse_mode: 'HTML',
        disable_notification: true,
    };
    return JSON.stringify(message);
}

function send(post) {
    return new Promise((resolve, reject) => {
        const message = telegramMessage(post);
        const req = https.request({
            hostname: telegramApiHost,
            path: `${telegramApiPath}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(message),
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

        req.write(message);
        req.end();
    })
    .catch(console.log);
}

module.exports = posts =>
    posts.reduce((seq, post) =>
        seq.then(() => {
            if (post) {
                send(post);
            }
        }),
        Promise.resolve());
