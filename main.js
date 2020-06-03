var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser') 
// 넘겨받은 데이터를 처리하는 미들웨어 request.on('data'), request.on('end') 대체
var compression = require('compression')
//리소스를 압축형태로 만드는 미들웨어
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');

app.use(express.static('public')); //public 디렉토리를 정적 파일의 root root경로로 지정해줌

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//made middlewear 
app.get('*', (request, response, next) => { //get 방식으로 들어오는 모든 요청에서 작동 post에서는 작동 X
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});


app.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src='/images/hello.jpg' style="width:50%; display:block; margin:0 auto;">
      `,
      `<a href="/topic/create">create</a>`);
    response.send(html);
});

app.get('/topic/create', (request, response)=> {
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    response.send(html);
});

app.post('/topic/create_process', (request, response) => {
  console.log(request);
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
    response.redirect(`/topic/${title}`);
  });
});

app.get('/topic/update/:topicId', (request,response) => {
    var filteredId = path.parse(request.params.topicId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = request.params.topicId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );
      response.send(html);
    });
});

app.post('/topic/update_process', (request, response) => {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/topic/${title}`);
    })
  });
});

app.post('/topic/delete_process', (request,response) => {
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect('/')
  })
});

app.get('/topic/:topicId', (request, response) => {
    var filteredId = path.parse(request.params.topicId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = request.params.topicId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      response.send(html);
    });
});

app.get('/user/:id', function (req, res, next) {
  
  if (req.params.id === '0') next('route') // id가 0이면 다음 라우트 special을 실행
  else next() //0이 아니면 다음 미들웨어를 실행함 => regular
}, function (req, res, next) {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', function (req, res, next) {
  res.send('special')
})


app.listen(3000);
