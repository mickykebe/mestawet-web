export function getJSON(url) {
    return fetch(url)
        .then((response) => {
        if (!response.ok) {
            throw new Error('Problem fetching posts')
        }
        return response.json();
    }).then((result) => {
        if(result.error) {
            throw new Error(result.error);
        }
        return result;
    });
};

//https://gist.github.com/mathewbyrne/1280286
export function slug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        //.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}