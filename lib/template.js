module.exports = {
  HTML: function (title, list, body, control, logInOut, authUI){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${logInOut}
      ${authUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },logInOut:function(ownerUse){
    var logInOut = '';
    if(ownerUse){
      logInOut = `<p><a href='/logout_process'>logout</a></p>`
    }else{
      logInOut = `<p><a href='/login'>login</a></p>`
    }
    return logInOut;
  }, authUI: (authUse, nickName) => {
    var authUI = '';
    if (authUse) {
      authUI = `<p>${nickName} | <a href='/auth/logout_process'>session_logout</a></p>`
    } else {
      authUI = `<p><a href='/auth/login'>session_login</a></p>`
    }
    return authUI;
  }
}
