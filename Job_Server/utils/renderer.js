const handlebars = require('handlebars');

module.exports = function renderHTML(templateHTML, data, css) {
  const compiled = handlebars.compile(templateHTML);
  const rendered = compiled(data);
  return `
    <html>
      <head>
        <style>${css || ''}</style>
      </head>
      <body>${rendered}</body>
    </html>
  `;
};
