function parseCookies(cookieHeader = '') {
  const result = {};

  cookieHeader.split(';').forEach((part) => {
    const [key, ...valueParts] = part.trim().split('=');

    if (!key) {
      return;
    }

    result[key] = decodeURIComponent(valueParts.join('='));
  });

  return result;
}

module.exports = { parseCookies };