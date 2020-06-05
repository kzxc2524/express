var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var template = require('../lib/template.js');
var log = require('../lib/log.js');
var sanitizeHtml = require('sanitize-html');



var authData = {
    email : 'test2@test.com',
    password:'12345678',
    nickname:'test2'
}

router.get('/login', (request,response)=>{
    var title = 'Session Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <h2>${title}</h2>
      <form action="/auth/login_process" method="post">
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
    if (userId == authData.email && userPw == authData.password) {
        request.session.userAuth = true;
        request.session.userNick = authData.nickname;
        request.session.save(()=>{
            response.redirect(302, '/');
        });
        //세션 객체에 있는 데이터를 세션 스토어에 반영하는 작업을 바로 시작하고 작업이 끝나면 콜백 함수 실행
        
        response.end('Welcome');
    } else {
        response.end('Confirm Your Acount')
    }
});

router.get('/logout_process', (request, response) => {
    request.session.destroy( (err) => {
        response.redirect(302, '/');
        response.end();
    });    
});


module.exports = router;