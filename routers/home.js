var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var log = require('../lib/log.js');

router.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var ownerUse = log(request, response);
    var logInOut = template.logInOut(ownerUse);
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
      <img src='/images/hello.jpg' style="width:50%; display:block; margin:0 auto;">
      `,
        `<a href="/topic/create">create</a>`,
        logInOut);
    response.send(html);
});

module.exports = router;