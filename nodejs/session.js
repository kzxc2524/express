var express = require('express');
var app = express();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
//세션을 파일로 관리하는 별도 모듈

//세션을 사용 할 때 필수적인 옵션들
app.use(session({
    secret: 'pantaminum', //외부에 절대 알려지면 안되는 코드
    resave: false, //세션 데이터 변경 유무에 따라 세션 값을 저장할지, true => 변경유무 상관없이 저장
    saveUninitialized: true, //세션이 필요하기 전까지 세션을 구동하지 앟는다, false => 필요유무 상관업싱 무조건 작동
    store: new FileStore() 
}));
 

app.get('/', (request, response) => {
    console.log(request.session);
    
    if (request.session.num === undefined){
        request.session.num = 1 ;
    }else{
        request.session.num += 1;
    }
    response.send('View' + request.session.num);
});

app.listen(5000);