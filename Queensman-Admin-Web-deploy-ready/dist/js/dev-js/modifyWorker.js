$(document).ready(function () {
    console.log('add worker.js ready');
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    $('.job_type_worker').css('cursor', 'pointer');
    var id = '';
    var full_name = '';
    var email = '';
    var password = '';
    var phone = '';
    var description = '';
    var active= '';
    var worker_id = getParameter('id');
    var color = '';
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchWorkerDetailsViaWorkerID.php?worker_id=' + worker_id;
    console.log(link)
    $.get(link,function (data, textStatus, jqXHR) {
        $('#inputID').val(data.server_response[0].workers.id)
        console.log(data.server_response)
        full_name = data.server_response[0].workers.full_name;
        email = data.server_response[0].workers.email;
        password = data.server_response[0].workers.password;
        phone = data.server_response[0].workers.phone;
        description = data.server_response[0].workers.description;
        active = data.server_response[0].workers.active;
        color = data.server_response[0].workers.color_code
        $('#inputEMAIL').val(email);
        $('#inputPASSWORD').val(password);
        $('#inputNAME').val(full_name);
        $('#inputPHONE').val(phone);
        $('#inputDESC').val(description);
        $('#inputColor').val(color);
        if( active == 1 ){
            active = 'Active'
        }else {
            active = 'Inactive'
        }
        $('#active_status').val(active);
    });
    $('#save_btn_main').click(function (e) { 
        e.preventDefault();
        $('#modal_txt').text('We hope that you have provided valid details');
        $('#modal_header').fadeIn();
        $('#modal_footer').fadeIn();
        $('#modal_txt').fadeIn();
        $('#main_section_loader_modify_worker').fadeOut();
        $('#modal_modify_worker').modal();
    });

    $('#save_worker_btn').click(function (e) {
        e.preventDefault();
        $('#modal_header').fadeOut();
        $('#modal_footer').fadeOut();
        $('#modal_txt').fadeOut();
        $('#main_section_loader_modify_worker').fadeIn();

        // id = $('#inputID').val().trim();
        // email = $('#inputEMAIL').val().trim();
        // password = $('#inputPASSWORD').val().trim();
        // full_name = $('#inputNAME').val().trim();
        // trim();
        // description = $('#inputDESC').val().trim();
        console.log(email + ' | ' + password + ' | ' + full_name + ' | ' + phone + ' | ' + description)
        isupdated = false;

        if(email != $('#inputEMAIL').val()){
            // update
            isupdated = true;
            email = $('#inputEMAIL').val()
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateWorkerEmail.php?worker_id=' + worker_id + '&email=' + email
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated email for this worker.") {
                    console.log(data.server_response)

                }
            });
        }
        if (password != $('#inputPASSWORD').val()) {
            // update
            isupdated = true;
            password = $('#inputPASSWORD').val()
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateWorkerPassword.php?worker_id=' + worker_id + '&password=' + password
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated password for this worker.") {
                    console.log(data.server_response)

                }
            });
        }
        if (full_name != $('#inputNAME').val()){
            //update
            isupdated = true;
            full_name = $('#inputNAME').val()
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateWorkerName.php?worker_id=' + worker_id + '&full_name=' + full_name
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated full_name for this worker.") {
                    console.log(data.server_response)

                }
            });
        }
        if (phone != $('#inputPHONE').val()){
            isupdated = true;
            phone = $('#inputPHONE').val();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateWorkerPhone.php?worker_id=' + worker_id + '&phone=' + phone
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated phone for this worker.") {
                    console.log(data.server_response)

                }
            });
        }
        if (description != $('#inputDESC').val()){
            isupdated = true;
            description = $('#inputDESC').val().trim();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateWorkerDescription.php?worker_id=' + worker_id + '&description=' + description
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated description for this worker.") {
                    console.log(data.server_response)

                }
            });
        }
        if (color != $('#inputColor').val()){
            isupdated = true;
            color = $('#inputColor').val();
            console.log(color)
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateWorkerColorCode.php?worker_id=' + worker_id + '&color_code=' + color
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data.server_response)
            });
        }
        if (active != $('#active_status').val()){
            isupdated = true;
            active = $('#active_status').val();
            if(active == 'Active'){
                active =1;
            }else {
                active =0;
            }
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateWorkerActive.php?worker_id=' + worker_id + '&active=' + active
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated active for this worker.") {
                    console.log(data.server_response)

                }
            });
        }

        if(isupdated){
            $('#modal_txt').text('Successfully updated worker data.');
            $('#modal_txt').fadeIn();
            $('#main_section_loader_modify_worker').fadeOut();
            setTimeout(function () { window.location.href = 'Workers.html'; }, 2500);s

        } else{
            $('#modal_txt').text('No change occur');
            $('#modal_txt').fadeIn();
            $('#main_section_loader_modify_worker').fadeOut();
        }
    });
    

    $('.job_type_worker').on('click', function () {
        job_type = $(this).children().text().toLowerCase();
        alert(job_type)
    });
    function getParameter(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }

});