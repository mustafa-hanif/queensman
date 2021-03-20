$(document).ready(function () {
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    var client_id = getParameter('id');
    

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
    var family = '';
    var children_age = '';
    var earning = '';
    var nationality = '';
    var years = '';
    var native_years = '';
    var referred_by = '';
    var other_prop = '';
    var contract_date = '';
    var contract_date_end = '';
    var active = '';
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientDetailsViaClientID.php?ID=' + client_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('#inputID').val(data.server_response.id);
        email= data.server_response.email
        password = data.server_response.password
        full_name = data.server_response.full_name;
        phone = data.server_response.phone;
        secEmail = data.server_response.sec_email;
        secPhone = data.server_response.sec_phone;
        account_type = data.server_response.account_type;
        occupation = data.server_response.occupation;
        organization = data.server_response.organization;
        age = data.server_response.age_range
        gender = data.server_response.gender;
        family = data.server_response.family_size;
        children_age = data.server_response.ages_of_children;
        earning = data.server_response.earning_bracket
        nationality = data.server_response.nationality;
        years = data.server_response.years_expatriate;
        native_years = data.server_response.years_native;
        referred_by = data.server_response.referred_by
        other_prop = data.server_response.other_properties;
        contract_date = data.server_response.contract_start_date;
        contract_date_end = data.server_response.contract_end_date;
        active = data.server_response.active;
        if( active == 1 ){
            active = 'Active'
        }else {
            active = 'Inactive'
        }
        
        $('#inputEMAIL').val(email);
        $('#inputPASSWORD').val(password);
        $('#inputNAME').val(full_name);
        $('#inputPHONE').val(phone);
        $('#inputSECEMAIL').val(secEmail);
        $('#inputSECPHONE').val(secPhone);
        $('#account_type').val(account_type);
        $('#inputOCCUPATION').val(occupation);
        $('#inputORGANIZATION').val(organization);
        $('#inputAGE').val(age);
        $('#inputGENDER').val(gender);
        $('#inputFAMILY').val(family);
        $('#inputCHILDRENAGE').val(children_age);
        $('#inputEARNING').val(earning);
        $('#inputNATIONALITY').val(nationality);
        $('#inputYEARS').val(years)
        $('#inputNATIVE').val(native_years)
        $('#inputREFERRED').val(referred_by)
        $('#inputPROPERTIES').val(other_prop);
        $('#active_status').val(active);
        var now = new Date(contract_date);
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#inputCONTRACTDATE').val(today)
       
        var now1 = new Date(contract_date_end);
        var day = ("0" + now1.getDate()).slice(-2);
        var month = ("0" + (now1.getMonth() + 1)).slice(-2);

        var today1 = now1.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#inputCONTRACTDATEEND').val(today1)

    });
    var link = '';
    $('#inputADMIN').val(admin_id);
    signup_date = new Date()
    $('#inputSIGNUPDATE').val(signup_date);
    $('#update_data_btn').click(function (e) {
        e.preventDefault();
        $('#modal_header').fadeOut();
        $('#modal_txt').fadeOut();
        $('#modal_footer').fadeOut();
        $('#main_section_loader').fadeIn();
        ischanged = false;
        
        // if ($('#inputEMAIL').val() != email){
        //     ischanged = true;
        //     email = $('#inputEMAIL').val();
        //     link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientEmail.php?client_id=' + client_id + '&email=' + email;
        //     $.get(link, function (data, textStatus, jqXHR) {
        //         if (data.server_response == "Successfully updated email for this client.") {
        //             ischanged = true;
        //             console.log(data.server_response)

        //         }
        //     });

        // }

       
        if ($('#inputNAME').val() != full_name){
            ischanged = true;
            full_name = $('#inputNAME').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientName.php?client_id=' + client_id + '&full_name=' + full_name;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated full_name for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if ($('#inputPHONE').val() != phone){
            ischanged = true;
            phone = $('#inputPHONE').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientPhone.php?client_id=' + client_id + '&phone=' + phone;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated phone for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputSECEMAIL').val() != secEmail){
            ischanged = true;
            secEmail = $('#inputSECEMAIL').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientSecEmail.php?client_id=' + client_id + '&sec_email=' + secEmail;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated sec_email for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputSECPHONE').val() != secPhone){
            ischanged = true;
            secPhone = $('#inputSECPHONE').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientSecPhone.php?client_id=' + client_id + '&sec_phone=' + secPhone;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated sec_phone for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        
        }
        console.log(account_type +  ' | ' + $('#account_type').val())
        if($('#account_type').val() != account_type){
            ischanged = true;
            account_type = $('#account_type').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientAccountType.php?client_id=' + client_id + '&account_type=' + account_type;
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data.server_response)
                if (data.server_response == "Successfully updated account_type for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputOCCUPATION').val() != occupation){
            ischanged = true;
            occupation = $('#inputOCCUPATION').val();;
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientOccupation.php?client_id=' + client_id + '&occupation=' + occupation;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated occupation for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputORGANIZATION').val() != organization){
            ischanged = true;
            organization = $('#inputORGANIZATION').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientOrganization.php?client_id=' + client_id + '&organization=' + organization;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated organization for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputAGE').val() != age){
            ischanged = true;
            age = $('#inputAGE').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientAgeRange.php?client_id=' + client_id + '&age_range=' + age;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated age_range for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if ($('#inputGENDER').val() != gender){
            ischanged = true;
            gender = $('#inputGENDER').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientGender.php?client_id=' + client_id + '&gender=' + gender;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated gender for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputFAMILY').val() != family){
            ischanged = true;
            family = $('#inputFAMILY').val();
            if(family == ''){
                family=0;
            }
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientFamilySize.php?client_id=' + client_id + '&family_size=' + family;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated family_size for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
            
        }
        if($('#inputCHILDRENAGE').val() != children_age){
            ischanged = true;
            children_age = $('#inputCHILDRENAGE').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientAgesOfChildren.php?client_id=' + client_id + '&ages_of_children=' + children_age;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated ages_of_children for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputEARNING').val() != earning){
            ischanged = true;
            earning = $('#inputEARNING').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientEarningBracket.php?client_id=' + client_id + '&earning_bracket=' + earning;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated earning_bracket for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputNATIONALITY').val() != nationality){
            nationality = $('#inputNATIONALITY').val();
            ischanged = true;
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientNationality.php?client_id=' + client_id + '&nationality=' + nationality;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated nationality for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputYEARS').val() != years){
            years = $('#inputYEARS').val();
            if(years == ''){
                years= 0;
            }
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientYearsExpatriate.php?client_id=' + client_id + '&years_expatriate=' + years;
            ischanged = true;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated years_expatriate for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputNATIVE').val() != native_years){
            native_years = $('#inputNATIVE').val();
            if(native_years == ''){
                native_years = 0;
            }
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientYearsNative.php?client_id=' + client_id + '&years_native=' + native_years;
            ischanged = true;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated years_native for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputREFERRED').val() != referred_by){
            referred_by = $('#inputREFERRED').val();
            if(referred_by == ''){
                referred_by = 0;
            }
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientReferredBy.php?client_id=' + client_id + '&referred_by=' + referred_by;
            ischanged = true;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated referred_by for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputPROPERTIES').val() != other_prop){
            other_prop = $('#inputPROPERTIES').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientOtherProperties.php?client_id=' + client_id + '&other_properties=' + other_prop;
            ischanged = true;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated other_properties for this client.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if($('#inputCONTRACTDATE').val() != contract_date){
            contract_date = $('#inputCONTRACTDATE').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientContractStartDate.php?client_id=' + client_id + '&contract_start_date=' + contract_date;
            ischanged = true;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated contract_start_date for this client.") {
                    
                    console.log(data.server_response)

                }
            });
        }
        
        if($('#inputCONTRACTDATEEND').val() != contract_date_end){
            contract_date_end = $('#inputCONTRACTDATEEND').val();
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientContractEndDate.php?client_id=' + client_id + '&contract_end_date=' + contract_date_end;
            ischanged = true;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated contract_end_date for this client.") {
                    
                    console.log(data.server_response)

                }
            });
        }
        // alert($('#active_status').val())
        if($('#active_status').val() != active){
            active = $('#active_status').val();
            if(active == 'Active'){
                active =1;
            }else {
                active =0;
            }
            link  = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateClientActive.php?client_id=' + client_id + '&active=' + active;
            ischanged = true;
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated active for this client.") {
                    
                    console.log(data.server_response)

                }
            });
        }
        console.log(ischanged)
        if (ischanged) {
            $('#modal_txt').text('Successfully updated data.');
            $('#modal_txt').fadeIn();
            $('#main_section_loader').fadeOut();
            setTimeout(function () { window.location.href = 'Clients.html'; }, 2500);


        } else {
            $('#modal_txt').text('no new data to be updated. Nothing has changed.');
            $('#modal_txt').fadeIn();
            $('#main_section_loader').fadeOut();
        }
    });

    $('#save_client_btn').click(function (e) {
        e.preventDefault();
        $('#modify_prop_modal').modal('toggle');        
 

    });
    $('#submit_btn').click(function (e) { 
        e.preventDefault();
        $('#modal_footer_btn').fadeOut();
        $('#text_error').fadeOut();
        $('#modal_loader').fadeIn();
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data)
            if (data.server_response == 'Successfully Submitted Client Details'){
                alert('successfully submitted client');
                $('#text_error').text('Successfully Added New Client Details.');
                $('#modal_loader').fadeOut();
                $('#submit_btn').fadeOut('fast');
                $('#text_error').fadeIn();
                setTimeout(function () { window.location.reload(); }, 3500);
                // $('#modal_footer_btn').fadeIn();
                // $('#modal_loader').fadeOut();
            }

        }); 
    });

    function getParameter(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }
});