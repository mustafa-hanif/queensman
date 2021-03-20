$(document).ready(function () {
    console.log('add worker.js ready');
    $('.job_type_worker').css('cursor', 'pointer');
    // localStorage.setItem('admin_1d', 1);
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    var id = '';
    var full_name = '';
    var email = '';
    var password = '';
    var phone = '';
    var description = '';
    var color = '';
    $('#save_client_btn').click(function (e) {
        e.preventDefault();
        // id = $('#inputID').val().trim();
        email = $('#inputEMAIL').val().trim();
        password = $('#inputPASSWORD').val().trim();
        full_name = $('#inputNAME').val().trim();
        phone = $('#inputPHONE').val().trim();
        description = $('#inputDESC').val().trim();
        color = $('#inputColor').val();
        console.log(email + ' | ' + password + ' | ' + full_name + ' | ' + phone + ' | ' + description , color)
        if (email != "" && password != "" && full_name != "" && phone != "" && description != "" && color != "") {
            $('#modal_add_wroker').modal();
        } else {
            // alert('please fill all the required fields.');
            $('#modal_empty_worker_details').modal();
        }


    });

    $('#save_worker_btn').click(function (e) {
        e.preventDefault();

        $('#modal_header').fadeOut();
        $('#modal_footer').fadeOut();
        $('#modal_txt').fadeOut();
        $('#main_section_loader_add_worker').fadeIn();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertWorker.php?full_name=' + full_name + '&email=' + email + '&phone=' + phone + '&password=' + password + '&description=' + description+'&color_code='+color;
        console.log(link)
        // alert('Worker successfully submitted');
        $.get(link, function (data) {
            console.log(data);
            if (data.server_response == 'Successfully Submitted Worker Details') {
                // alert('property successfully submitted');
                $('#modal_text').text('Successfully Submitted Worker Details.');
                $('#modal_text').fadeIn();
                $('#main_section_loader_add_worker').fadeOut();
                setTimeout(function () { window.location.href = 'Workers.html'; }, 2500);

            } else {
                // alert('failed to submit Worker. plese try again')
            }

        }).fail(function (error) {
            console.log('ajax failed');
            console.log(error);
        });
        // id = $('#inputID').val().trim();


    });
    $('#cancel_worker_btn').click(function (e) {
        e.preventDefault();
        window.location.reload();
    });

    $('.job_type_worker').on('click', function () {
        job_type = $(this).children().text().toLowerCase();
        alert(job_type)
    });

});