var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var template = require('../lib/template.js');
var log = require('../lib/log.js');
var sanitizeHtml = require('sanitize-html');
var passport = require('../lib/passport.js')(app);

var db = require('../lib/db.js')

const shortid = require('shortid');

router.get('/regist', (request, response) => {
  var fmsg = request.flash();
  console.log(fmsg);
  var feedback = '';
  if (fmsg.error) {
    feedback = `<p style="color:red;">${fmsg.error[0]}</p>`;
  }
  var title = 'User Regist';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <h2>${title}</h2>
    <form action="/auth/regist_process" method="post">
      <p>E-mail<br><input type="email" name="userId" placeholder="user@example.com" required /></p>
      <p>Password<br><input type="password" name="userPw" required /></p>
      <p>Password Check<br><input type="password" name="userPw2" required /></p>
      <p>Nick Name<br><input type="text" name="nickId"></p>
      ${feedback}
      <p><input type="submit" value="Join" /></p>
    </form>
  `, '', '', '');
  response.send(html);
});

router.post('/regist_process', (request, response) => {
  var post = request.body;
  var userId = post.userId;
  var userPw = post.userPw;
  var userPw2 = post.userPw2;
  var nickId = post.nickId;
 
  if (userPw == userPw2){
    var user = {
      id: shortid.generate(),
      email: userId,
      password: userPw,
      nickName: nickId
    }
    db.get('users').push(user).write();
    
      return response.redirect('/');
    
  }else{
    request.flash('error',"Password must same!");
    response.redirect('/auth/regist');
  }
  
});



router.get('/login', (request,response)=>{
  var fmsg = request.flash();
  console.log(fmsg);
  var feedback = '';
  if (fmsg.error){
    feedback = `<p style="color:red;">${fmsg.error[0]}</p>`;
  }
  var title = 'Session Login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <h2>${title}</h2>
    <form action="/auth/login_process" method="post">
      <p><input type="email" name="userId" placeholder="userid@example.com" required /></p>
      <p><input type="password" name="userPw" required /></p>
      ${feedback}
      <p><input type="submit" value="Login" /></p>
    </form>
  `, '', '', '');
  response.send(html);
});

//passport
router.post('/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true, // 실패시 메세지
    successFlash: true  // 성공시 메세지
  })
);


//express session
// router.post('/login_process', (request, response) => {
//     var post = request.body;
//     var userId = post.userId;
//     var userPw = post.userPw;
//     if (userId == authData.email && userPw == authData.password) {
//         request.session.userAuth = true;
//         request.session.userNick = authData.nickname;
//         request.session.save(()=>{
//             response.redirect(302, '/');
//         });
//         //세션 객체에 있는 데이터를 세션 스토어에 반영하는 작업을 바로 시작하고 작업이 끝나면 콜백 함수 실행
        
//         response.end('Welcome');
//     } else {
//         response.end('Confirm Your Acount')
//     }
// });

router.get('/logout_process', (request, response) => {
    // request.session.destroy( (err) => {
    //     response.redirect(302, '/');
    //     response.end();
    // });
    request.logout();
    request.session.save(function(){
        response.redirect('/');
    });
});


module.exports = router;