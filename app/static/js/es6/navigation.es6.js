



(function(){
  'use strict';


  $(document).ready(initialize);

  function initialize(){
    $('#register-home').hide();
    $('#login-home').hide();
    $('#show-registration').click(showReg);
    $('#show-login').click(showLogin);

    initDialog();
    $('#registration-dialog').click(chooseExplorer);

  }


  function chooseExplorer(){
    $( '#dialog' ).dialog('open');
  }


  function showReg(){
    $('#register-home').show();

  }


  function showLogin(){
    $('#login-home').show();

  }

  function initDialog(){
    var windowHeight = $(window).height();
    var windowWidth= $(window).width();


    $( '#dialog' ).dialog({
      dialogClass: 'no-close',
      autoOpen: false,
      modal: true,
      height: windowHeight,
      width: windowWidth,
      buttons: [
                {
                  text: 'X',
                  click: function() {
                    $( this ).dialog( 'close' );
                  }
                }

              ]
    });

  }

})();
