$(document).on("click", "#sign-up-btn", function(){
  event.preventDefault();
  var email = $('#inputEmail').val();
  var password = $('#inputPassword').val();
  $.ajax({
    url: "https://todo-js-be.herokuapp.com/auth",
    method: "POST",
    data: {email: email, password: password},
    beforeSend: function() {
      showLoading();
    }
  }).done(function(data, textStatus, jqXHR) {
    $('.loading').html('<div class="alert alert-success" role="alert">Đăng ký thành công!</div>');
  }).fail(function(jqXHR, textStatus, errorThrown) {
    var error = jqXHR.responseJSON.errors.full_messages.join("<br>");
    $('.loading').html('<div class="alert alert-danger" role="alert">Lỗi rồi!<br>' + error + '</div>');
  });
});
