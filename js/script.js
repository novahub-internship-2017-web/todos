//check authentication then update UI
updateUI();

function checkAuthentication() {
    var accessToken = getCookie("accessToken");
    var client = getCookie("client");
    var uId = getCookie("uId");
    return !(accessToken === "" || client === "" || uId === "");
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

function loadViewPage(event) {
    $('#content').load('./snippet/view-task-list.html', function () {
        loadTodoList();
    });
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

var allTaskList = [];
var correctResult = [];
var number = 5;
function loadManagementPage(event) {
    $('#content').load('./snippet/management.html', function () {
        showLoading();
        allTaskList = [];
        //load own task list
        $.ajax({
            url: "https://herokutuan.herokuapp.com/task_lists",
            method: "GET",
            headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")}
        }).done(function (data, textStatus, jqXHR) {
            var uId = getCookie("uId");
            for (var i = 0; i < data.length; i++) {
                allTaskList.push(data[i]);
                allTaskList[allTaskList.length - 1].user = uId;
            }
            //load shared task list
            $.ajax({
                url: "https://herokutuan.herokuapp.com/shared",
                method: "GET",
                headers: {
                    "access-token": getCookie("accessToken"),
                    "client": getCookie("client"),
                    "uid": getCookie("uId")
                }
            }).done(function (data, textStatus, jqXHR) {
                var sharedTaskList = data;
                //load users to get username
                $.ajax({
                    url: "https://herokutuan.herokuapp.com/users",
                    method: "GET",
                    headers: {
                        "access-token": getCookie("accessToken"),
                        "client": getCookie("client"),
                        "uid": getCookie("uId")
                    }
                }).done(function (data, textStatus, jqXHR) {
                    for (var i = 0; i < sharedTaskList.length; i++) {
                        allTaskList.push(sharedTaskList[i]);
                        var shareUser = "";
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].id === sharedTaskList[i].user_id) {
                                shareUser = data[j].email;
                                break;
                            }
                        }
                        allTaskList[allTaskList.length - 1].user = shareUser;
                        allTaskList[allTaskList.length - 1].share_count = '';
                        allTaskList[allTaskList.length - 1].todo_count = '';
                        allTaskList[allTaskList.length - 1].done_count = '';
                    }
                    //show all task list
                    correctResult = allTaskList.slice();
                    number = 5;
                    showTaskList(correctResult, 1);
                    makePagination(correctResult);
                });
            });
        });
    });
}

//search task list
$(document).on('keyup', '#search-box', function () {
    var keyWord = $(this).val().toLowerCase();
    correctResult = [];
    for (var taskList of allTaskList) {
        if (taskList.name.toLowerCase().indexOf(keyWord) >= 0) {
            correctResult.push(taskList);
        }
    }
    showTaskList(correctResult, 1);
    makePagination(correctResult);
});

//show task list and make pagination
function makePagination(taskLists) {
    var numberPages = Math.ceil(taskLists.length / number);
    $(".pagination").html("");
    if (taskLists.length > number) {
        for (var i = 1; i <= numberPages; i++) {
            $(".pagination").append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
        }
    }
}

function showTaskList(taskLists, pageNumber) {
    var numberPages = Math.ceil(taskLists.length / number);
    $('table tbody').html("");
    for (var k = (pageNumber - 1) * number; (k < pageNumber * number) && (taskLists[k] !== undefined); k++) {
        $('table tbody').append('<tr>' + '<td>' + taskLists[k].name + '</td>' + '<td>' + taskLists[k].user + '</td>' + '<td>' + taskLists[k].share_count + '</td>' + '<td>' + taskLists[k].todo_count + '</td>' + '<td>' + taskLists[k].done_count + '</td>' + '</tr>');
    }
}

//change page by clicking button
$(document).on("click", ".page-link", function (event) {
    event.preventDefault();
    var pageNumber = $(this).text();
    showTaskList(correctResult, pageNumber);
});

//change number item on a page
$(document).on("change", "#number-item", function () {
    number = parseInt($(this).val());
    showTaskList(correctResult, 1);
    makePagination(correctResult);
});

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

