



(function(){
  'use strict';


  $(document).ready(initialize);

  function initialize(){
    $('#register-home').hide();
    $('#login-home').hide();
    $('#show-registration').click(showReg);
    $('#show-login').click(showLogin);

  }

  function showReg(){
    $('#register-home').show();

  }


  function showLogin(){
    $('#login-home').show();

  }

})();
