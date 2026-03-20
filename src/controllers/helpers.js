const path = require('path');
const ejs = require('ejs');

async function renderView(res, viewName, data = {}) {
  const filePath = path.join(__dirname, '..', 'views', viewName);

  const html = await ejs.renderFile(filePath, data);

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });

  res.end(html);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end(message);
}

module.exports = {
  renderView,
  redirect,
  sendError,
};