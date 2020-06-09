module.exports = function (app){
   
    //passport
    var authData = {
        email: 'test2@test.com',
        password: '12345678',
        nickname: 'test2'
    }

    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;
    //로컬방식(아이디와 비번을 이용하는 방식)으로 로그인하는 전략

    app.use(passport.initialize());
    app.use(passport.session());

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
            if (username === authData.email) {
                if (password === authData.password) {
                    return done(null, authData); //=>serializeUser의 user 인자로 전달되어 세션에 저장됨
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } else {
                return done(null, false, { message: 'Incorrect username.' });
            }
        }
    ));
    return passport;
}