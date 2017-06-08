//https://gist.github.com/mathewbyrne/1280286
export function slug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        //.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function flatten(obj) {
    const list = [];
    for(const key in obj) {
        if(obj.hasOwnProperty(key))
            list.push(obj[key]);
    }
    return list;
}

function filterByIds(posts, ids) {
    return posts.filter((post) => ids.indexOf(post._id) !== -1);
}

export function flatFilter(postsObj, ids) {
    return filterByIds(flatten(postsObj), ids);
}

export function sortByDate(posts) {
    return posts.sort((p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime());
}