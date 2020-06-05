var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var template = require('../lib/template.js');
var log = require('../lib/log.js');
var sanitizeHtml = require('sanitize-html');

router.get('/create', (request, response) => {
    var title = 'WEB - create';
    var ownerUse = log.cookie(request, response);
    var authUse = log.session(request, response);
    var logInOut = template.logInOut(ownerUse);
    var authUI = template.authUI(authUse, request.session.userNick);
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
    `, '',
    logInOut, authUI);
    response.send(html);
});

router.post('/create_process', (request, response) => {
    var ownerUse = log.cookie(request, response);
    var authUse = log.session(request, response);
    if (ownerUse === false && authUse === false){
        response.end('Retry after LOGIN!');
        return false;
    }
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
        response.redirect(`/topic/${title}`);
    });
});

router.get('/update/:topicId', (request, response) => {
    var filteredId = path.parse(request.params.topicId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = request.params.topicId;
        var ownerUse = log.cookie(request, response);
        var authUse = log.session(request, response);
        var logInOut = template.logInOut(ownerUse);
        var authUI = template.authUI(authUse, request.session.userNick);
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
        `,'',
        logInOut, authUI
        );
        response.send(html);
    });
});

router.post('/update_process', (request, response) => {
    var ownerUse = log.cookie(request, response);
    var authUse = log.session(request, response);
    if (ownerUse === false && authUse === false) {
        response.end('Retry after LOGIN!');
        return false;
    }
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            response.redirect(`/topic/${title}`);
        })
    });
});

router.post('/delete_process', (request, response) => {
    var ownerUse = log.cookie(request, response);
    var authUse = log.session(request, response);
    if (ownerUse === false && authUse === false) {
        response.end('Retry after LOGIN!');
        return false;
    }
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
        response.redirect('/')
    })
});

router.get('/:topicId', (request, response, next) => {
    var filteredId = path.parse(request.params.topicId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        if (err) {
            next(err); //에러가 있을때 err 데이터를 던져줌
        } else {
            var title = request.params.topicId;
            var ownerUse = log.cookie(request, response);
            var authUse = log.session(request, response);
            var logInOut = template.logInOut(ownerUse);
            var authUI = template.authUI(authUse, request.session.userNick);
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(request.list);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`,
            logInOut, authUI
            );
            response.send(html);
        }
    });
});

module.exports = router;