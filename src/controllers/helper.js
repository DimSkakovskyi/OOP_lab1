const React = require('react');
const ReactDOMServer = require('react-dom/server');

function renderReactView(res, Component, props = {}) {
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Component, props)
  );

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });

  res.end(`<!DOCTYPE html>${html}`);
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
  renderReactView,
  redirect,
  sendError,
};