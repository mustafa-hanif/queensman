$(document).ready(function () {
    var admin_id = localStorage.getItem('admin_1d');
    if(admin_id == null){
        window.location.replace('index.html');
    }
    
    $('#save-pass-btn-setting').click(function (e) { 
        e.preventDefault();
        $('#modal_loader_change_pass').fadeIn();
        $('#change_pass_txt').fadeOut();
        curr_pass = $('#curr-pass-setting').val();
        new_pass = $('#new-pass-setting').val();
        retype_pass = $('#cnfrm-pass-setting').val();
        console.log(curr_pass + ' | ' + new_pass + ' | ' + retype_pass)
        if(curr_pass != '' && new_pass != "" && retype_pass != ""){
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchPasswordViaID.php?id=' + admin_id;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response.password)
                if(data.server_response.password == curr_pass){
                    if(new_pass == retype_pass){
                        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePasswordViaID.php?id=' + admin_id  + '&password=' + new_pass;
                        $.get(link,function (data, textStatus, jqXHR) {
                            console.log(data.server_response);
                            $('#change_pass_txt').text('Successfully updated password.');
                            $('#change_pass_txt').fadeIn();
                            $('#modal_loader_change_pass').fadeOut();

                            setTimeout(function () { window.location.reload(); }, 2500);


                        });
                    }else {
                        $('#change_pass_txt').text('New password do not match with re-type password.');
                        $('#change_pass_txt').fadeIn();
                        $('#modal_loader_change_pass').fadeOut();

                    }

                }else {
                    $('#change_pass_txt').text('Incorrect current password.');
                    $('#change_pass_txt').fadeIn();
                    $('#modal_loader_change_pass').fadeOut();

                }
                
            });
        }else {
            $('#change_pass_txt').text('Please enter all te required fields.');
            $('#change_pass_txt').fadeIn();
            $('#modal_loader_change_pass').fadeOut();


        }
        
    });
    $('#sign_out_btn').click(function (e) { 
        localStorage.clear();
        window.location.replace('index.html')
        
    });
});