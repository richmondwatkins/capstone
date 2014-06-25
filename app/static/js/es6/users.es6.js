



(function(){
  'use strict';


  $(document).ready(initialize);

  function initialize(){
    $('#register-form').hide();
    $('#login-form').hide();

    $('button#show-login').click(showLogin);
    $('#show-register').click(showRegister);

    $('body').on('click', '#login', loginUser);
    $('body').on('click', '#register', registerUser);

  }

  function showLogin(){
    alert('asdf');
    $('#login-form').slideToggle();
  }

  function showRegister(){
    $('#register-form').slideToggle();
  }

  function loginUser(e){
    var loginCreds = $('#login-form').serialize();

    ajax('/login', 'POST', loginCreds, res=>{
      console.log(res);
      $('#user').empty().append(res);
      $('.input').val('');
    });

    hideForms();
    e.preventDefault();
  }

  function registerUser(e){
    var userInfo = $('#register-form').serialize();
    console.log(userInfo);
    ajax('/register', 'POST', userInfo, res=>{
      console.log(res);
      // $('#user').empty().append(res);
      $('#user').empty().append(res);
      $('#paragraph').empty();
      $('.input').val('');
    });

    hideForms();
    e.preventDefault();
  }


  function hideForms(){
    $('#register-form').hide();
    $('#login-form').hide();
    $('button#show-login').hide();
    $('#show-register').hide();

  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}





})();
