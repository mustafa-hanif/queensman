$(document).ready(function () {
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    var table1 = '';
    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchWorkersForExport.php'
    var selected_callout = ''
    $.get(link, function (data) {
        $.each(data.server_response, function (index, item) {
            renderWorkerList(item.workers.id, item.workers.full_name, item.workers.email, item.workers.password, item.workers.phone, index,item.workers.description,item.workers.active)
        });
        $.extend($.fn.dataTable.defaults, {
            // searching: false,
            ordering: false,
            dom: 'Bfrtip',
            // info:false,

        });
        table1 = $('#worker_table').dataTable({
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Export Workers Table',
                    filename: 'Workers table',
                    autoFilter: true,
                    // exportOptions: {
                    //     columns: [ 0, 1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20 ]
                    // }
                }
              ]
        });

        // table1 = $('#worker_table').dataTable({
        //     dom: 'Bfrtip',
        //     buttons: [
        //         'excel',
        //       ]
        // });
        $('.dataTables_filter').css('display', 'none');
        $('#dislay_main_section').fadeIn('fast');
        $('#main_section_loader').fadeOut('fast');
    });
    // for (var i = 0; i < 40; i++) {
    //     renderWorkerList(i+1, 'soman', 'soman.baqai@gmail.com', 'baqai123', '03413160187')
    // }
    $(document).on('click', "tbody tr", function () {
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        selected_callout = $(this).attr("id");
        console.log(selected_callout)
    });

    function renderWorkerList(id, name, email, password, phone, index,description,active) {
        var htmlStr = '';
        htmlStr += '<tr id= '+id+'>'
        htmlStr += '<td>' + id + '</td>'
        htmlStr += '<td>' + name + '</td>'

        // if(table_id == 'render_client_list'){
        //     htmlStr += '<td> <span>' + password + ' </span><span class="fa fa-fw fa-eye field-icon toggle-password"></span></td>'
        // }else {
        //     htmlStr += '<td>' + password + '</td>'
        // }

        htmlStr += '<td >' + email + '</td>'
        // htmlStr += '<td>' + password + '</td>';
        htmlStr += '<td> <span class="hidetext">' + password + ' </span><span class="fa fa-eye-slash field-icon toggle-password"></span></td>'
        htmlStr += '<td>' + phone + '</td>'
        htmlStr += '<td>' + description + '</td>';
        if(active == 0){
            active = 'Inactive'
        }else {
            active = 'Active'
        }
        htmlStr += '<td>' + active + '</td>'
        // htmlStr += '<td><button id="' + index + '" type="button" class="btn btn-primary btn-sm">Show work log</button></td>'
        htmlStr += '</tr>'
        $('#render_worker_list').append(htmlStr);
    }

    $(document).on('click','.toggle-password' ,function () {
        $(this).toggleClass("fa-eye fa-eye-slash");


        if($(this).hasClass('fa-eye-slash')){
            // $(this).siblings().css('-webkit-text-security', value);
            $(this).siblings().addClass('hidetext');
        }else {
            $(this).siblings().removeClass('hidetext');
        }
   
            // var input = $($(this).attr("toggle"));
            // if (input.attr("type") == "password") {
            //   input.attr("type", "text");
            // } else {
            //   input.attr("type", "password");
            // }
    });
    $(document).on('input', '#search_workers', function () {
        // alert('sad')
        search_query = $(this).val();
        // alert(search_query)
        table1.fnFilter(search_query)

    });
    $('#modify_worker_btn').click(function (e) { 
        e.preventDefault();
        if(selected_callout != ''){
            // alert('selected');
            window.location.href = 'ModifyWorker.html?id=' + selected_callout;
        }else {
            $('#modal_select_worker').modal();
        }
    });
    $('#main_delete_worker_btn').click(function (e) { 
        e.preventDefault();
        if(selected_callout != ''){
            // alert('selected');
            // window.location.href = 'ModifyWorker.html?id=' + selected_callout;
            $('#modal_delete_worker').modal();
        }else {
            $('#modal_select_worker').modal();
        }
    });

    $('#modal_delete_worker_btn').click(function (e) { 
        e.preventDefault();
        $('#modal_delete_worker_footer').fadeOut();
        $('#modal_delete_wroker_txt').fadeOut();
        $('#main_section_loader_delete_worker').fadeIn();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteWorker.php?worker_id=' + selected_callout;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);

            $('#modal_delete_wroker_txt').text('The worker has been deleted successfully.');
            $('#modal_delete_wroker_txt').fadeIn();
            $('#main_section_loader_delete_worker').fadeOut();
            setTimeout(function () { window.location.reload(); }, 2500);

        });
    });


});