const { response } = require('express');

const requestHandler = (req, res) => {
  const { url, method } = req;

  const users = ['user1', 'user2', 'user3', 'user4', 'user5'];

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>main</title></head>');
    res.write('<body>');
    res.write('<p>Hello!</p>');
    res.write(
      '<form action="/create-user" method="POST"><input type="text" name="username"><button>보내기</button></form>'
    );
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Server Assignment</title></head>');
    res.write('<body>');
    res.write('<ul>');
    users.forEach((user) => {
      res.write(`<li>${user}</li>`);
    });
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      const parseBody = Buffer.concat(body).toString();
      const [_, input] = parseBody.split('=');
      console.log(input);
      res.statusCode = 302;
      res.setHeader('Location', '/users');
      res.end();
    });
  }
};

exports.requestHandler = requestHandler;
