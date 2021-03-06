//CRUD for todo list

//load todo list
function loadTodoList() {
    //show your task list
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists",
        method: "GET",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
        beforeSend: function () {
            $('.todo-list-group').html('<div class="spinner"><i class="fas fa-spinner fa-spin" style="color:Tomato"></i></div>');
        }
    }).done(function (data, textStatus, jqXHR) {
        $('.todo-list-group').html("");
        for (var i = 0; i < data.length; i++) {
            $('.todo-list-group').append('<div class="todo-list"><a href="#" class="title-todo-list" list-id="' + data[i].id + '">' + data[i].name + '</a><a href="#" class="edit-todo-list" list-id="' + data[i].id + '"><i class="far fa-edit"></i></a><a href="#" class="share-todo-list" list-id="' + data[i].id + '"><i class="fas fa-share"></i></a><a href="#" class="delete-todo-list" list-id="' + data[i].id + '"><i class="far fa-trash-alt"></i></a></div>');
        }
    });
    //show shared task list
    $.ajax({
        url: "https://herokutuan.herokuapp.com/shared",
        method: "GET",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
        beforeSend: function () {
            $('.shared-todo-list-group').html('<div class="spinner"><i class="fas fa-spinner fa-spin" style="color:Tomato"></i></div>');
        }
    }).done(function (data, textStatus, jqXHR) {
        $('.shared-todo-list-group').html("");
        for (var i = 0; i < data.length; i++) {
            $('.shared-todo-list-group').append('<div class="todo-list"><a href="#" class="title-todo-list" list-id="' + data[i].id + '">' + data[i].name + '</a></div>');
        }
    });
}

//create todo_list
$(document).on("click", "#btn-create-todo-list", function () {
    var listName = {name: $('#input-create-title').val()};
    $('#input-create-title').val("");
    $.ajax({
        url: "http://herokutuan.herokuapp.com/task_lists",
        method: "POST",
        contentType: 'application/json',
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
        data: JSON.stringify(listName)
    }).done(function (data, textStatus, jqXHR) {
        updateUI();
    })
});
//show todos in list
$(document).on("click", ".title-todo-list", function () {
    var listId = $(this).attr('list-id');
    $('#content').load('./snippet/todos.html', function () {
        $('#input-create-todo').attr("list-id", listId);
        $('#btn-mark-all').attr("list-id", listId);
        //load todo here
        updateTodoUI()
    });
});

//edit task_lists
$(document).on("click", ".edit-todo-list", function () {
    var id = $(this).attr("list-id");
    $('#btn-edit-todo-list').attr("list-id", id);
    $('#editTodoList').modal('show');
});

$(document).on("click", "#btn-edit-todo-list", function () {
    var id = $(this).attr("list-id");
    var listName = {name: $('#input-edit-title').val()};
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists/" + id,
        method: "PATCH",
        contentType: 'application/json',
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
        data: JSON.stringify(listName)
    }).done(function (data, textStatus, jqXHR) {
        updateUI();
    })
});

//delete task_lists
$(document).on("click", ".delete-todo-list", function () {
    var id = $(this).attr("list-id");
    $('#btn-delete-todo-list').attr("list-id", id);
    $('#deleteTodoList').modal('show');
});

$(document).on("click", "#btn-delete-todo-list", function () {
    var id = $(this).attr("list-id");
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists/" + id,
        method: "DELETE",
        contentType: 'application/json',
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")}
    }).done(function (data, textStatus, jqXHR) {
        updateUI();
    })
});
//share task list
$(document).on("click", ".share-todo-list", function () {
    var id = $(this).attr("list-id");
    $("#btn-share-todo-list").attr("list-id", id);
    $("#shareTodoList").modal('show');
    //load all users
    $.ajax({
        url: "https://herokutuan.herokuapp.com/users",
        method: "GET",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")}
    }).done(function (data, textStatus, jqXHR) {
        for (var i = 0; i < data.length; i++) {
            $("#select-user").append('<option value="' + data[i].id + '">' + data[i].email + '</option>');
        }
    });
});

$(document).on("click", "#btn-share-todo-list", function () {
    var userId = $("#select-user").val();
    var listId = $(this).attr("list-id");
    var isWrite = document.querySelector("#cb-is-write").checked;
    var data = {user_id: userId, is_write: isWrite};
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists/" + listId + "/share/",
        method: "POST",
        contentType: "application/json",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
        data: JSON.stringify(data)
    });
});
//CRUD for todo

//create todo
$(document).on("keypress", "#input-create-todo", function () {
    if (event.which === 13) {
        var listId = $(this).attr('list-id');
        var todoName = {name: $(this).val()};
        $(this).val("");
        $.ajax({
            url: "https://herokutuan.herokuapp.com/task_lists/" + listId + "/todos",
            method: "POST",
            contentType: 'application/json',
            headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
            data: JSON.stringify(todoName)
        }).done(function (data, textStatus, jqXHR) {
            //update todo UI
            updateTodoUI();
        })
    }
});

//show todo
function updateTodoUI() {
    var listId = $("#input-create-todo").attr('list-id');
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists/" + listId + "/todos",
        method: "GET",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")}
    }).done(function (data, textStatus, jqXHR) {
        $("#not-done").html("");
        $("#already-done").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].done == null) {
                $("#not-done").append('<div class="todo-item form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input" todo-id="' + data[i].id + '">' + data[i].name + '</label></div>');
            } else {
                $("#already-done").append('<div class="todo-item form-check"><p><del>' + data[i].name + '</del></p><div class="btn-delete-todo" todo-id="' + data[i].id + '"><i class="far fa-window-close"></i></div></div>');
            }
        }
    })
}

//mark todo is done
$(document).on("click", "#not-done .form-check-input", function () {
    var listId = $("#input-create-todo").attr('list-id');
    var todoId = $(this).attr("todo-id");
    var todoStatus = {done: true};
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists/" + listId + "/todos/" + todoId,
        method: "PATCH",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
        contentType: 'application/json',
        data: JSON.stringify(todoStatus)
    }).done(function (data, textStatus, jqXHR) {
        //update todo ui
        updateTodoUI();
    });
});
//detele todo
$(document).on("click", ".btn-delete-todo", function () {
    var listId = $("#input-create-todo").attr('list-id');
    var todoId = $(this).attr("todo-id");
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists/" + listId + "/todos/" + todoId,
        method: "DELETE",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")},
    }).done(function (data, textStatus, jqXHR) {
        //update todo ui
        updateTodoUI();
    });
});
//mark all as done
$(document).on("click", "#btn-mark-all", function () {
    var listId = $("#input-create-todo").attr("list-id");
    $.ajax({
        url: "https://herokutuan.herokuapp.com/task_lists/" + listId + "/todos",
        method: "GET",
        headers: {"access-token": getCookie("accessToken"), "client": getCookie("client"), "uid": getCookie("uId")}
    }).done(function (data, textStatus, jqXHR) {
        for (var i = 0; i < data.length; i++) {
            var todoId = data[i].id;
            var todoStatus = {done: true};
            $.ajax({
                url: "https://herokutuan.herokuapp.com/task_lists/" + listId + "/todos/" + todoId,
                method: "PATCH",
                headers: {
                    "access-token": getCookie("accessToken"),
                    "client": getCookie("client"),
                    "uid": getCookie("uId")
                },
                contentType: 'application/json',
                data: JSON.stringify(todoStatus)
            }).done(function (data, textStatus, jqXHR) {
                //update todo ui
                updateTodoUI();
            });
        }
    })
});
