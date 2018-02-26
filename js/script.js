//check authentication then update UI
updateUI();


function openNav() {
    document.getElementById("mySidenav").style.width = "330px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function showLoading() {
    $('.loading').load('./snippet/loading.html');
}

function loadSignUpPage(event) {
    event.preventDefault();
    $('#content').load('./snippet/sign-up.html');
}

function loadSignInPage(event) {
    event.preventDefault();
    $('#content').load('./snippet/sign-in.html');
}

function loadSignOutPage(event) {
    event.preventDefault();
    deleteCookie("uId", '');
    deleteCookie("accessToken", '');
    deleteCookie("client", '');
    $('#content').load('./snippet/sign-in.html', function () {
        updateUI();
    });
}

function setCookie(name, value) {
    var date = new Date();
    date.setTime(date.getTime() + (1000 * 60 * 60 * 24 * 7));
    var expire = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expire + ";path=/"
}

function deleteCookie(name, value) {
    var date = new Date();
    date.setTime(date.getTime() - (1000 * 60 * 60 * 24 * 7));
    var expire = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expire + ";path=/"
}

function getCookie(name) {
    var cookie = document.cookie;
    name = name + "=";
    var startIndex = cookie.indexOf(name);
    if (startIndex >= 0) {
        cookie = cookie.substr(startIndex + name.length);
        if (cookie.indexOf(";") > 0) {
            cookie = cookie.substring(0, cookie.indexOf(";"));
        }
        return cookie;
    } else {
        return "";
    }
}

function checkAuthentication() {
    var accessToken = getCookie("accessToken");
    var client = getCookie("client");
    var uId = getCookie("uId");
    if (accessToken == "" || client == "" || uId == "") {
        return false;
    } else {
        return true;
    }
}

function updateUI() {
    if (checkAuthentication()) {
        $('#mySidenav').load('./snippet/slide-nav-auth.html', function () {
            $("#user-email").append(" " + getCookie("uId"));
            loadTodoList();
        });
        $('#modal-group').load('./snippet/modal.html');
    } else {
        $('#mySidenav').load('./snippet/slide-nav.html');
    }
}

