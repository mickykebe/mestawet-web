const config = require('./config');

const baseClientUrl = `https://${config.clientHostName}`;

// https://gist.github.com/mathewbyrne/1280286
function slug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function youtubeVideoUrl(post) {
    if (post.videoId) {
        return `${baseClientUrl}/youtube/${post.videoId}`;
    }
    return null;
}

function articleUrl(post) {
    if (post.url) {
        return `${baseClientUrl}/article/${post._id}/${slug(post.title)}`;
    }
    return null;
}

function fetchClientPostUrl(post) {
    if (post.kind === 'youtubeVideo') {
        return youtubeVideoUrl(post);
    } else if (post.kind === 'article') {
        return articleUrl(post);
    }
    return null;
}

module.exports.fetchClientPostUrl = fetchClientPostUrl;