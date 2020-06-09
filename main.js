var express = require('express');
var app = express();
var fs = require('fs');

var timeout = require('connect-timeout');

var cookieParser = require('cookie-parser');
//쿠키 핸들링하는 미들웨어

var session = require('express-session');
//세션을 핸들링하는 미들웨어
var FileStore = require('session-file-store')(session);
//세션을 파일로 관리하는 별도 모듈

var bodyParser = require('body-parser');
// 넘겨받은 데이터를 처리하는 미들웨어 request.on('data'), request.on('end') 대체

var compression = require('compression');
//리소스를 압축형태로 만드는 미들웨어

var helmet = require('helmet');
//자주 일어나는 보안적 문제를 해결해주는 모듈
//nsp check도 자주 해주면 좋음

app.use(helmet());

var topicRouter = require('./routers/topic.js');
var homeRouter = require('./routers/home.js');
var logInOut = require('./routers/logInOut.js');
var authRouter = require('./routers/auth.js');

app.use(cookieParser());
app.use(session({
  secret: 'pantaminum', //외부에 절대 알려지면 안되는 코드
  resave: false, //세션 데이터 변경 유무에 따라 세션 값을 저장할지, true => 변경유무 상관없이 저장
  saveUninitialized: true, //세션이 필요하기 전까지 세션을 구동하지 앟는다, false => 필요유무 상관업싱 무조건 작동
  store: new FileStore()
}));



app.use(express.static('public')); //public 디렉토리를 정적 파일의 root root경로로 지정해줌

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(timeout('1s'));
//made middlewear 
app.get('*', (request, response, next) => { //get 방식으로 들어오는 모든 요청에서 작동 post에서는 작동 X
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

//made middlewear 
app.get('*', (request, response, next) => { //get 방식으로 들어오는 모든 요청에서 작동 post에서는 작동 X
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

//passport
var authData = {
  email: 'test2@test.com',
  password: '12345678',
  nickname: 'test2'
}

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
    //로컬방식(아이디와 비번을 이용하는 방식)으로 로그인하는 전략
var flash = require('connect-flash');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());//내부적으로 세션을 사용하기 때문에 반드시 세션 다음에 와야함


passport.serializeUser(function (user, done) {
  console.log('serializeUser', user);
  done(null, user.email); //식별 가능한 값을 넣어줌
});//로그인 성공시 세션에 정보를 저장함(로그인 성공시 한번만 작동)

passport.deserializeUser(function (id, done) {//serializeUser에서 저장된 식별자 값을 받음
  console.log('deserializeUser', id, authData);
  done(null, authData); // => request.user 객체로 전달됨
});//세션에 저장된 정보를 페이지 로드시 불러옴

passport.use(new LocalStrategy({
  usernameField: 'userId',
  passwordField: 'userPw'
},
  function (username, password, done) {
    if (username === authData.email){
      if (password === authData.password){
        return done(null, authData); //=>serializeUser의 user 인자로 전달되어 세션에 저장됨
      }else{
        return done(null, false, { message: 'Incorrect password.' });
      }
    }else{
      return done(null, false, { message: 'Incorrect username.' });
    }
  }
));

app.post('/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true, // 실패시 메세지
    successFlash: true  // 성공시 메세지
  })
);

app.use('/', logInOut);
app.use('/auth', authRouter);
app.use('/', homeRouter);

app.use('/topic', topicRouter);




// app.get('/user/:id', function (req, res, next) {
  
//   if (req.params.id === '0') next('route') // id가 0이면 다음 라우트 special을 실행
//   else next() //0이 아니면 다음 미들웨어를 실행함 => regular
// }, function (req, res, next) {
//   // send a regular response
//   res.send('regular')
// })

// // handler for the /user/:id path, which sends a special response
// app.get('/user/:id', function (req, res, next) {
//   res.send('special')
// })


//에러처리 라우터 or 미들웨어는  끝에 위치해야함
app.use((request, response, next) => { 
  response.status(404).send('Not Found Page');
});

app.use((err, request, response, next) => {// 에러처리 미들웨어의 약속된 4개의 인자
  response.status(500).send(`Something Broke!${err}`);
});

app.listen(3000);
