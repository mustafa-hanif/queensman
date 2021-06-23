w1 = '';
w2 = '';
w3 = '';
$(document).ready(function () {
    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchWorkers.php';
    var selected_worker1 = ''
    var selected_worker2 = ''
    var selected_worker3 = ''

    var selected_worker_array = {};
    var worker_list = new Array();
    $.get(link, function (data) {
        $.each(data.server_response, function (index, item) {
            worker_list.push(item)
            renderWorker(index, item.workers.full_name, item.workers.id);

        });
    }).fail((error) => {
        console.log(error);

    });

    function renderWorker(index, name, id) {
        var htmlStr = '';
        htmlStr += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        htmlStr += '<div class="image-parent">'
        htmlStr += '<img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">'
        htmlStr += '</div>'
        htmlStr += '<p class="client-name"> ' + name + '</p>'
        htmlStr += '<div id=' + (index + 1) + ' class="checkbox checkbox-warning checkbox-circle">'
        htmlStr += '<input style="outline: none !important" class="wokrer_checkbox" id="chkWarning" type="checkbox" unchecked value=' + id + ' />'
        htmlStr += '<label style="outline: none !important" for='+id+'>'
        htmlStr += '  </label>'
        htmlStr += '</div>'
        htmlStr += '</li>'
        $('#worker_list').append(htmlStr);
    }
    $(document).on('click', '.wokrer_checkbox', function () {

        if (!$(this).is(':checked')) {
            // alert('oye checked hai ye');
            if (selected_worker1 == $(this).val()) {
                delete selected_worker_array[selected_worker1]  
                selected_worker1 = ''
                w1 = selected_worker1;

            } else if (selected_worker2 == $(this).val()) {
                delete selected_worker_array[selected_worker2]  
                selected_worker2 = ''    
                w2 = selected_worker2;

            } else if (selected_worker2 == $(this).val()) {
                delete selected_worker_array[selected_worker3]                    
                selected_worker3 = ''
                w3 = selected_worker3;

            }
            console.log('worker_array')
            console.log(selected_worker_array)
            // console.log(selected_worker_array.length)
            return;
        }
        if (selected_worker1 == '') {
            selected_worker1 = $(this).val();
            // selected_worker_array[selected_worker1] = 
            w1 = selected_worker1;
            selected_worker_array[selected_worker1] = $(this).parent().parent();
            // $(this).prop("checked", true);
            // alert('w1=' + selected_worker1)
        } else if (selected_worker2 == '') {
            selected_worker2 = $(this).val();
            w2 = selected_worker2;
            selected_worker_array[selected_worker2] = $(this).parent().parent();


            // alert('w2=' + selected_worker2)

        } else if (selected_worker3 == '') {
            selected_worker3 = $(this).val();
            w3 = selected_worker3;
            selected_worker_array[selected_worker2] = $(this).parent().parent();


            // alert('w3=' + selected_worker3)

        } else {
            $(this).prop("checked", false);
            alert('upto 3 workers are allowed')
        }
        // alert('In render worker: w1=' + w1 +' w2=' +w2 + ' w3='+w3)
        console.log('worker_array')
        console.log(selected_worker_array)
        // console.log(selected_worker_array.length)

    });

    $('.SearchButtonWorker').click(function (e) { 
        e.preventDefault();
        query = $('#search_worker_by_name').val().toString().toLowerCase();
            isfound = false;
            $('#worker_list').empty();
            worker_obj_keys = Object.keys(selected_worker_array)
            // console.log(Object.keys(selected_worker_array));
            if(worker_obj_keys.length > 0){
                for(var i = 0; i<worker_obj_keys.length;i++){
                    $('#worker_list').append(selected_worker_array[worker_obj_keys[i]]);
                    isfound = true;
                }
            }
            
            for (var i = 0; i < worker_list.length; i++) {
                if (worker_list[i].workers.full_name.toString().toLowerCase().includes(query)) {
                    // alert('found');
                    if(selected_worker1 != worker_list[i].workers.id && selected_worker2 != worker_list[i].workers.id && selected_worker3 != worker_list[i].workers.id){
                        renderWorker(i, worker_list[i].workers.full_name, worker_list[i].workers.id);
                        isfound = true;
                    }
                    
                }
            }
            if (!isfound) {
                $('#worker_list').html('<p>not found</p>');
            }
    });

    $('#search_worker_by_name').keyup(function (e) {
        if (e.keyCode == 13) {
            query = $(this).val().toString().toLowerCase();
            isfound = false;
            $('#worker_list').empty();
            worker_obj_keys = Object.keys(selected_worker_array)
            // console.log(Object.keys(selected_worker_array));
            if(worker_obj_keys.length > 0){
                for(var i = 0; i<worker_obj_keys.length;i++){
                    $('#worker_list').append(selected_worker_array[worker_obj_keys[i]]);
                    isfound = true;
                }
            }
            
            for (var i = 0; i < worker_list.length; i++) {
                if (worker_list[i].workers.full_name.toString().toLowerCase().includes(query)) {
                    // alert('found');
                    if(selected_worker1 != worker_list[i].workers.id && selected_worker2 != worker_list[i].workers.id && selected_worker3 != worker_list[i].workers.id){
                        renderWorker(i, worker_list[i].workers.full_name, worker_list[i].workers.id);
                        isfound = true;
                    }
                    
                }
            }
            if (!isfound) {
                $('#worker_list').html('<p>not found</p>');
            }
        }
    });
});