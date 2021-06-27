$(document).ready(function () {
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    var email = '';
    var password = '';
    var full_name = '';
    var phone = '';
    var secEmail = '';
    var secPhone = '';
    var account_type = '';
    var occupation = '';
    var organization = '';
    var age = '';
    var gender = '';
    var family = 0;
    
    var children_age = '';
    var earning = '';
    var nationality = '';
    var years = 0;
    var native_years = 0;
    var referred_by = 0;
    var other_prop = '';
    var contract_date = '';
    var contract_date_end = '';
    var link = '';
    $('#inputADMIN').val(admin_id);
    signup_date = new Date()
    $('#inputSIGNUPDATE').val(signup_date);


    $('#save_client_btn').click(function (e) {
        e.preventDefault();
        $('#modal_footer_btn').fadeIn();
        $('#modal_add_client').modal('toggle');
        email = $('#inputEMAIL').val();
        // password = $('#inputPASSWORD').val();
        full_name = $('#inputNAME').val();
        phone = $('#inputPHONE').val();
        secEmail = $('#inputSECEMAIL').val();
        secPhone = $('#inputSECPHONE').val();
        account_type = $('#account_type').val();
        occupation = $('#inputOCCUPATION').val();
        organization = $('#inputORGANIZATION').val();
        age = $('#inputAGE').val();
        gender = $('#inputGENDER').val();
        family = $('#inputFAMILY').val();
        children_age = $('#inputCHILDRENAGE').val();
        earning = $('#inputEARNING').val();
        nationality = $('#inputNATIONALITY').val();
        years = $('#inputYEARS').val();
        native_years = $('#inputNATIVE').val();
        referred_by = $('#inputREFERRED').val();
        other_prop = $('#inputPROPERTIES').val();
        contract_date = $('#inputCONTRACTDATE').val();
        contract_date_end = $('#inputCONTRACTDATEEND').val();
        console.log('ref: '  + referred_by)
        link='';
        if(family == ''){
            family = 0
        }
        if(years == ''){
            years = 0;
        }
        if(native_years == ''){
            native_years = 0
        }
        
        if(referred_by == ''){
            console.log('empty')
            referred_by = 0;
            link='https://www.queensman.com/phase_2/queens_admin_Apis/insertClient.php?full_name=' + full_name + '&email=' + email + '&sec_email='+secEmail + 
            '&phone=' + phone + '&sec_phone='+secPhone + '&account_type=' + account_type + '&occupation=' + occupation + '&organization=' + organization
             + '&age_range=' + age + '&gender=' +gender+ '&family_size=' + family + '&ages_of_children=' + children_age + '&earning_bracket=' + earning 
             + '&nationality=' + nationality+ '&years_expatriate='+ years + '&years_native=' + native_years + '&referred_by='+referred_by  + '&other_properties=' 
             + other_prop + '&contract_start_date=' + contract_date + '&contract_end_date=' + contract_date_end + '&uploaded_by=' + admin_id;
             
        }else {
            link='https://www.queensman.com/phase_2/queens_admin_Apis/insertClient.php?full_name=' + full_name + '&email=' + email + '&sec_email='+secEmail +
             '&phone=' + phone + '&sec_phone='+secPhone + '&account_type=' + account_type + '&occupation=' + occupation + '&organization=' + organization + 
             '&age_range=' + age + '&gender=' +gender+ '&family_size=' + family + '&ages_of_children=' + children_age + '&earning_bracket=' + earning + 
             '&nationality=' + nationality+ '&years_expatriate='+ years + '&years_native=' + native_years + '&referred_by=' + referred_by + 
             '&other_properties=' + other_prop + '&contract_start_date=' + contract_date + '&contract_end_date=' + contract_date_end + '&uploaded_by=' + admin_id;

        }

        if(email !='' && full_name != "" && phone !="" && account_type != "" && contract_date != "" && contract_date_end!=""){
            console.log(link);
           
            $('#text_error').text('We hope that you have provided valid details.');
            $('#text_error').fadeIn();
            $('#submit_btn').fadeIn('fast');
            $('#modal_loader').fadeOut();

        }else {
        //    alert('fill all fields');
            $('#submit_btn').fadeOut('fast');
            $('#text_error').fadeIn();

           $('#text_error').text('Please Fill all the required Fields.');
           $('#modal_loader').fadeOut();

        }


    });
    $('#submit_btn').click(function (e) { 
        e.preventDefault();
        $('#modal_footer_btn').fadeOut();
        $('#text_error').fadeOut();
        $('#modal_loader').fadeIn();
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data)
            if (data.server_response == 'Successfully Submitted Client Details'){
                 //alert('successfully submitted client');
                 var client_email_link = 'https://www.queensman.com/phase_2/queens_admin_Apis/sendWelcomeEmailToNewUser.php?user_email='+email+'&client_name='+full_name+'&client_phone='+phone;
                 $.get(client_email_link, function (data, textStatus, jqXHR) {
                     console.log(data)
                    $('#text_error').html('Successfully Added New Client Details. <br> Do you wish to add property for this client');
                    $('#modal_loader').fadeOut();
                    $('#submit_btn').fadeOut('fast');
                    $('#modal_footer_btn_for_add_prop').fadeIn();
                    $('#text_error').fadeIn();
                    setTimeout(function () { window.location.href = 'Clients.html'; }, 10000);
                    // $('#modal_footer_btn').fadeIn();
                    $('#modal_loader').fadeOut();
                
                 })

            }
            else if (data.server_response == "Duplicate entry '"+email.toLowerCase()+"' for key 'email'"){

                $('#text_error').html('There is already a client with this e-mail address registered in the database.<br>Kindly pick a different e-mail address.');
                $('#modal_loader').fadeOut();
                $('#submit_btn').fadeOut('fast');
                // $('#modal_footer_btn_for_add_prop').fadeIn();
                $('#text_error').fadeIn();
                // setTimeout(function () { window.location.href = 'Clients.html'; }, 10000);
                $('#modal_footer_btn').fadeIn();
                $('#modal_loader').fadeOut();
            }

        }); 
    });
    $('#close_btn_add_prop').click(function (e) {
        window.location.href = 'Clients.html';
        
    });
    $('#submit_btn_add_prop').click(function (e) { 
        link_get_id = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchLastClientID.php?email=' + email;
        console.log(link)
        $.get(link_get_id, function (data, textStatus, jqXHR) {
            // console.log(data.server_response_ID);
            window.location.href = 'AddProperty.html?cid=' + data.server_response_ID;
        });

        
    });
});
