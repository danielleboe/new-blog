const Handlebars = require('handlebars');
const dayjs = require('dayjs');

Handlebars.registerHelper('formatDate', function(date) {
    return dayjs(date).format('MM/DD/YYYY');
});
