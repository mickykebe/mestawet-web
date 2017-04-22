const fs = require('fs');

fs.readdirSync(`${__dirname}/models`).forEach((file) => {
    require(`./models/${file}`);
});
