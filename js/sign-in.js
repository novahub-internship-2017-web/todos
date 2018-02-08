$(document).on("click", "#sign-in-btn", function(){
  var form = $('#form-sign-in');
  form.validate();
  if ($("#form-sign-in").valid()) {
    event.preventDefault();
    var email = $('#inputEmail').val();
    var password = $('#inputPassword').val();
    $.ajax({
      url: "http://herokutuan.herokuapp.com/auth/sign_in",
      method: "POST",
      data: {email: email, password: password},
      beforeSend: function() {
        showLoading();
      }
    }).done(function(data, textStatus, jqXHR) {
      var uId = jqXHR.getResponseHeader("Uid");
      var accessToken = jqXHR.getResponseHeader("Access-Token");
      var client = jqXHR.getResponseHeader("Client");

      setCookie("uId", uId);
      setCookie("accessToken", accessToken);
      setCookie("client", client);
      $('#content').load('./snippet/user-info.html', function() {
        //update UI
        updateUI();
      });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      var error = jqXHR.responseJSON.errors[0];
      $('.loading').html('<div class="alert alert-danger" role="alert">Lỗi rồi!<br>' + error + '</div>');
    });
  }
});
