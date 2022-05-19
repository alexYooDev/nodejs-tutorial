const fs = require('fs');

// routes 로 분리하여 처리 로직과 서버 로직의 역할 분리
const requestHandler = (req, res) => {
  const { url, method } = req;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>enter message</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"></input><button type="submit">send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];

    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    return req.on('end', () => {
      // Buffer에 스트림의 데이터를 받아 문자열로 변환
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.text', message, (error) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title></title></head>');
  res.write('<body><h1>H!</h1></body>');
  res.write('</html>');
  res.end();
};

exports.requestHandler = requestHandler;
exports.someText = 'Some Text';
