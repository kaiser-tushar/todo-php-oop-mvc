$(document).ready(function () {
    init();
    $('#task_name').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            addTask();
        }
    });
    $("#clear_completed_link").on('click',function () {
        removeCompleted();
    });
});
function getTaskList(element,type) {
    $("#clear_completed_link").hide();
    $("#taskTabs").find('.nav-link').removeClass('border border-todo-grey');
    element.addClass('border border-todo-grey');
    var url = './task/index';
    if(!isEmpty(type)){
        url += '/'+type;
    }
    TODO.ajaxLoadCallback(url,function (response) {
        if(!isEmpty(response)){
            if(!isEmpty(response) && response.status == 'success'){
                var data = buildTaskList(response.data);
                $("#show_below_arrow_in_task_form").show();
                $("#task_tabs").show();
                if(!isEmpty(response.pending)){
                    $("#pending_task_count").show();
                    $("#pending_task_count").html(response.pending+ ((response.pending == 1)?' item':' items') + ' left');
                }
                else{
                    $("#pending_task_count").hide();
                }
                if(isEmpty(response.total)){
                    $("#task_tabs").hide();
                    $("#show_below_arrow_in_task_form").hide();
                    $("#taskList").hide();
                    removeShadow();

                }
                if(!isEmpty(response.total)){
                    if(response.total - response.pending > 0){
                        $("#clear_completed_link").show();
                    }
                    addBoxShadow();
                    $("#taskList").show();
                }
                $("#taskList").html(data.html);
                addDeleteButton();
            }else{
                if(!isEmpty(response.message)){
                    console.error(response.message);
                    toastr.error(response.message);
                }else{
                    console.error('Information not found.');
                }

            }
        }
    });
}
function buildTaskList(response) {
    var html = '';
    var total = 0;
    if(!isEmpty(response)){
        total = response.length;
        var completed_icon = '<img class="task-status-icon" alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzIiIGhlaWdodD0iMzIiCnZpZXdCb3g9IjAgMCAyMjYgMjI2IgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDIyNnYtMjI2aDIyNnYyMjZ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgaWQ9IkxheWVyXzEiPjxwYXRoIGQ9Ik0xMTMsMTUuODkwNjNjLTUzLjYzMjAzLDAgLTk3LjEwOTM3LDQzLjQ3NzM1IC05Ny4xMDkzNyw5Ny4xMDkzOGMwLDUzLjYzMjAzIDQzLjQ3NzM1LDk3LjEwOTM4IDk3LjEwOTM4LDk3LjEwOTM4YzUzLjYzMjAzLDAgOTcuMTA5MzgsLTQzLjQ3NzM1IDk3LjEwOTM4LC05Ny4xMDkzN2MwLC01My42MzIwMyAtNDMuNDc3MzUsLTk3LjEwOTM3IC05Ny4xMDkzNywtOTcuMTA5Mzd6IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTExMywyMTUuNDA2MjVjLTU2LjUsMCAtMTAyLjQwNjI1LC00NS45MDYyNSAtMTAyLjQwNjI1LC0xMDIuNDA2MjVjMCwtNTYuNSA0NS45MDYyNSwtMTAyLjQwNjI1IDEwMi40MDYyNSwtMTAyLjQwNjI1YzU2LjUsMCAxMDIuNDA2MjUsNDUuOTA2MjUgMTAyLjQwNjI1LDEwMi40MDYyNWMwLDU2LjUgLTQ1LjkwNjI1LDEwMi40MDYyNSAtMTAyLjQwNjI1LDEwMi40MDYyNXpNMTEzLDIxLjE4NzVjLTUwLjY3MzQ0LDAgLTkxLjgxMjUsNDEuMTM5MDYgLTkxLjgxMjUsOTEuODEyNWMwLDUwLjY3MzQ0IDQxLjEzOTA2LDkxLjgxMjUgOTEuODEyNSw5MS44MTI1YzUwLjY3MzQ0LDAgOTEuODEyNSwtNDEuMTM5MDYgOTEuODEyNSwtOTEuODEyNWMwLC01MC42NzM0NCAtNDEuMTM5MDYsLTkxLjgxMjUgLTkxLjgxMjUsLTkxLjgxMjV6IiBmaWxsPSIjY2NjY2NjIj48L3BhdGg+PHBhdGggZD0iTTEwOS40Njg3NSwxMzkuNDg0Mzh2MGMtMS40MTI1LDAgLTIuODI1LC0wLjcwNjI1IC0zLjg4NDM4LC0xLjc2NTYybC0yMy4xMjk2OSwtMjQuNzE4NzVjLTEuOTQyMTksLTIuMTE4NzUgLTEuOTQyMTksLTUuNDczNDQgMC4zNTMxMywtNy40MTU2M2MyLjExODc1LC0xLjk0MjE5IDUuNDczNDQsLTEuOTQyMTkgNy40MTU2MywwLjM1MzEzbDE5LjI0NTMxLDIwLjQ4MTI1bDM2LjkwMTU2LC0zOC40OTA2MmMxLjk0MjE5LC0yLjExODc1IDUuMjk2ODgsLTIuMTE4NzUgNy40MTU2MywtMC4xNzY1NmMyLjExODc1LDEuOTQyMTkgMi4xMTg3NSw1LjI5Njg4IDAuMTc2NTYsNy40MTU2M2wtNDAuNjA5MzcsNDIuNzI4MTJjLTEuMDU5MzgsMS4wNTkzOCAtMi40NzE4OCwxLjU4OTA2IC0zLjg4NDM4LDEuNTg5MDZ6IiBmaWxsPSIjMWFiYzljIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4="/>';
        for(var i = 0;i < total;i++ ){
            html +='<div class="row task-item">';
            html +=     '<div class=" input-group-prepend border-white">';
            html +=         '<div class="input-group-text bg-white border-white text-light">';
            html +=             !isEmpty(response[i].status)?completed_icon:'<i class="task-status-icon fa fa-2x fa-circle-o" onclick="completeTask('+response[i].id+')"></i>';
            html +=         '</div>';
            html +=     '</div>';
            html +=     '<div class="col-9 form-control-lg todo-title-div">';
            html +=             !isEmpty(response[i].status)?('<span class="text-todo-grey todo-title" onclick="editTitle($(this),'+response[i].id+')"><s>'+response[i].title+'</s></span>'):('<span class="text-dark todo-title" onclick="editTitle($(this),'+response[i].id+')">'+response[i].title+'</span>');
            html +=     '</div>';
            html +=     '<div class="col-1 float-right mt-2"><span class="float-right task_cancel text-white"><i class="fa fa-2x fa-times" onclick="deleteTask('+response[i].id+')"></i></span></div> ';
            html +='</div>';
            // html +='<hr>';
        }
    }
    return {'html' : html, 'total' : total};
}
function addTask() {
    var title = $("#task_name").val();
    if(!isEmpty($.trim(title))){
        var url = './task/add';
        TODO.ajaxSubmitDataCallback(url,{'title' : title},'json',function (response) {
            if(!isEmpty(response) && response.status == 'success'){
                init();
                $("#task_name").val('');
            }else{
                if(!isEmpty(response.message)){
                    console.error(response.message);
                    toastr.error(response.message);
                }else{
                    console.error('Information not found.');
                }

            }
        })
    }else{
        console.error('Nothing to add');
    }
}
function init() {
    $("#taskTabs").find('.border-todo-grey').trigger('click');
}
function completeTask(id) {
    if(!isEmpty(parseInt(id))){
        var url = './task/complete';
        TODO.ajaxSubmitDataCallback(url,{'id' : id},'json',function (response) {
            if(!isEmpty(response) && response.status == 'success'){
                init();
            }else{
                if(!isEmpty(response.message)){
                    console.error(response.message);
                    toastr.error(response.message);
                }else{
                    console.error('Information not found.');
                }

            }
        })
    }else{
        console.error('Nothing to complete');
    }
}
function deleteTask(id) {
    if(!isEmpty(parseInt(id))){
        var url = './task/delete';
        TODO.ajaxSubmitDataCallback(url,{'id' : id},'json',function (response) {
            if(!isEmpty(response) && response.status == 'success'){
                init();
            }else{
                if(!isEmpty(response.message)){
                    console.error(response.message);
                    toastr.error(response.message);
                }else{
                    console.error('Information not found.');
                }

            }
        })
    }else{
        console.error('Nothing to complete');
    }
}
function removeCompleted() {
    var url = './task/removeCompleted';
    TODO.ajaxSubmitDataCallback(url,{},'json',function (response) {
        if(!isEmpty(response) && response.status == 'success'){
            init();
        }else{
            if(!isEmpty(response.message)){
                console.error(response.message);
                toastr.error(response.message);
            }else{
                console.error('Information not found.');
            }

        }
    })
}
function addDeleteButton() {
    $(".task-item").hover(function () {
        $(this).find('.task_cancel').toggleClass('task-times-button');
        $(this).find('.task_cancel').css('cursor','pointer');
    })
}
function editTitle(element,id) {
    var title = $.trim(element.text());
    if(!isEmpty(title)){
        element.closest('.task-item').find('.task_cancel').parent().remove();
        element.closest('.task-item').find('.task-status-icon').hide();
        element.parent().toggleClass('col-9 col-11');
        element.closest('.todo-title-div').css('overflow','hidden');
        element.html('<input class="edit_task_name form-control form-control-md border-white" data-id="'+id+'" class="" type="text" placeholder="What needs to be done?" value="'+title+'">');
        $('.edit_task_name').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                editTask($(this));
            }
        });
        element.focusout(function (){
            init();
        });
        element.find('.edit_task_name').trigger('focus');
        element.find('.edit_task_name').val('');
        element.find('.edit_task_name').val(title);
    }
}
function editTask(element) {
    if(!isEmpty(element)){
        var id = element.data('id');
        var title = $.trim(element.val());
        if(!isEmpty(title) && !isEmpty(id)){
            var url = './task/edit';
            TODO.ajaxSubmitDataCallback(url,{'title' : title,'id' : id},'json',function (response) {
                if(!isEmpty(response) && response.status == 'success'){
                    init();
                }else{
                    if(!isEmpty(response.message)){
                        console.error(response.message);
                        toastr.error(response.message);
                    }else{
                        console.error('Information not found to edit.');
                    }

                }
            })
        }
    }
}
function addBoxShadow() {
    var shadow = "white 0 10px 0 -5px,#f0f2f4 0 12px 0px -5px,white 0 22px 0 -10px,#f0f2f4 0 24px 0px -10px";
    $("#todo-container").css( {"box-shadow":shadow});
    $("#todo-container").addClass( "border-bottom-task-list");
}
function removeShadow() {
    $("#todo-container").css( 'box-shadow','none');
    $("#todo-container").removeClass( "border-bottom-task-list");
}