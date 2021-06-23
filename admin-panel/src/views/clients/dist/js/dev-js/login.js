$(document).ready(function () {
    var userEmail = '';
    var password = '';
    $('#proceedButton').click(function (e) {
        $('#login_error_div').fadeOut();
        $('#main_section_loader').fadeIn();
        e.preventDefault();
        userEmail = $('#username_field').val();
        password = $('#password_field').val();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/login.php?email=' + userEmail + '&password=' + password;
        console.log(link);
        if (userEmail != "" && password != "") {
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.server_response != -1 && data.server_response != "") {
                    console.log('done');
                    localStorage.setItem('admin_1d', data.server_response);
                    setTimeout(function () { window.location.replace('Home.html'); }, 1000);
                } else {
                    $('#login_error_div').children().text('Wrong credentials provided. Please provide valid credentials.');
                    $('#login_error_div').fadeIn();
                    $('#main_section_loader').fadeOut();
                    console.log('failed');
                }
            });
        }else {
            $('#login_error_div').children().text('Provide all the fields.');
            $('#login_error_div').fadeIn();
            $('#main_section_loader').fadeOut();
        }
    });
});