module.exports = (request, response) => {
    var ownerUse = false;
    if(request.cookies.userId !== undefined){
      if(request.cookies.userPw !== undefined){
        ownerUse = true;
      }
    }
    return ownerUse;
}