var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');


router.get('/login', (request, response) => {
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/login_process" method="post">
        <p><input type="email" name="userId" placeholder="userid@example.com" required /></p>
        <p><input type="password" name="userPw" required /></p>
        <p><input type="submit" value="Login" /></p>
      </form>
    `, '', '', '');
    response.send(html);

});

router.post('/login_process', (request, response) => {
    var post = request.body;
    var userId = post.userId;
    var userPw = post.userPw;
    if(userId == 'test@test.com' && userPw == '1111'){
        response.cookie('userId',`${userId}`, {
            maxAge:60*60*24
        })
        response.cookie('userPw',`${userPw}`, {
            maxAge:60*60*24
        })
        response.redirect(302,'/');
        response.end();
    }else{
        response.end('Confirm Your Acount')
    }
    
});

router.get('/logout_process', (request, response) => {
    response.cookie('userId',``, {
        maxAge:0
    })
    response.cookie('userPw',``, {
        maxAge:0
    })
    response.redirect(302,'/');
    response.end();
});

module.exports = router;