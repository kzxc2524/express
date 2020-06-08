var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var log = require('../lib/log.js');



router.get('/', (request, response) => {
  
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var ownerUse = log.cookie(request, response);
    var authUse = log.session(request, response);
    var logInOut = template.logInOut(ownerUse);
    var authUI = template.authUI(request, response, authUse);
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
      <img src='/images/hello.jpg' style="width:50%; display:block; margin:0 auto;">
      `,
        `<a href="/topic/create">create</a>`,
        logInOut, authUI);
    response.send(html);
});

module.exports = router;