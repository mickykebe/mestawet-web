export function getJSON(url) {
    return fetch(url)
        .then((response) => {
        if (!response.ok) {
            throw new Error('Problem fetching posts')
        }
        return response.json();
    });
};