// var http = require('http');
// var cookie = require('cookie');

// var app = http.createServer((request, response)=>{
//     var cookies = '';
    

//     if(request.headers.cookie !== undefined ){
//         cookies = cookie.parse(request.headers.cookie);
//     }
//     response.writeHead(200, {
//         'Set-cookie':[
//             'cookie1=choco',
//             'cookie2=strawberry',
//             `Permanent=cookies; Max-Age=${60*60*24*30}`, //permanent ckooike는 지속 시간을 초단위로 지정할 수 있음
//             'Secure=Secure; Secure',    //requestHeader에 쿠키가 보이지 않게 하는 보안 속성
//             'HttpOnly=HttpOnly; HttpOnly', //script(document.cookie)를 통해 접근하지 못하도록하는 속성
//             'Path=Path; Path=/cookie', //특정 path에서만 작동되도록 제한하는 속성
//             'Domain=Domain; Domain=o2.org' //특정 도메인에서 작동되도록 제한하는 속성 
//         ]
//     });
//     //쿠키 생성 : 쿠키를 복수 생성할 때는 배열로 작성
//     console.log(cookies);
//     response.end();
//     //쿠키를 읽는 방법
// });

// app.listen(5000);


//express에서 cookie 제어

// var express = require('express');
// var app2 = express();
// var cookieParser = require('cookie-parser');

// app2.use(cookieParser());

// app2.get('/', (request, response) => {
//     response.cookie('test','1',{
//         maxAge:60*60*24*30,
//         path:'/',
//         domain:'o2.org',
//         secure:true,
//         httpOnly:true,
//         //signed:true
//     });
//     response.end('');
// });

// app2.listen(5000);