module.exports = {
  cookie : (request, response) => {
    var ownerUse = false;
    if(request.cookies.userId !== undefined){
      if(request.cookies.userPw !== undefined){
        ownerUse = true;
      }
    }
    return ownerUse;
},
  session: (request, response) => {
    if (request.session.userAuth == true) {
      return true;
    } else {
      return false;
    } 
  }
}