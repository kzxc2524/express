var express = require('express');
var app = express();
var fs = require('fs');

var timeout = require('connect-timeout');

var cookieParser = require('cookie-parser');
//쿠키 핸들링하는 미들웨어

var bodyParser = require('body-parser');
// 넘겨받은 데이터를 처리하는 미들웨어 request.on('data'), request.on('end') 대체

var compression = require('compression')
//리소스를 압축형태로 만드는 미들웨어

var helmet = require('helmet');
//자주 일어나는 보안적 문제를 해결해주는 모듈
//nsp check도 자주 해주면 좋음

app.use(helmet());

var topicRouter = require('./routers/topic.js');
var homeRouter = require('./routers/home.js');
var logInOut = require('./routers/logInOut.js');

app.use(cookieParser());
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

app.use('/', logInOut);

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
  response.status(500).send('Something Broke!');
});

app.listen(3000);
