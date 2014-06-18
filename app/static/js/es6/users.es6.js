



(function(){
  'use strict';


  $(document).ready(initialize);

  function initialize(){
    $('body').on('click', '#login', loginUser);
    $('body').on('click', '#register', registerUser);

  }

  function loginUser(e){

    var loginCreds = $('#login-form').serialize();

    ajax('/login', 'POST', loginCreds, res=>{
      console.log(res);
      $('#user').empty().append(res);
    });

    e.preventDefault();
  }

  function registerUser(e){
    var userInfo = $('#register-form').serialize();
    console.log(userInfo);
    ajax('/register', 'POST', userInfo, res=>{
      console.log(res);
      // $('#user').empty().append(res);
      $('#dashboard').empty().append(res);
    });

    e.preventDefault();
  }



  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}


})();
