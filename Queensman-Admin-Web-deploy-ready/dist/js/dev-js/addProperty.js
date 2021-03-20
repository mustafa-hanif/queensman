$(document).ready(function () {
    console.log('add property.js ready')
    // localStorage.setItem('admin_1d', 1);
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name);
    });
    
    var id = '';
    var city = '';
    var country = '';
    var address = '';
    var community = '';
    var reg_date = '';
    var property_type = 'OWNED';
    var lease_start_date = '';
    var lease_end_date = '';
    var selected_client = ''
    var comments ='';
    var propertyType = '';
    if(getParameter('cid') != null){

        selected_client = getParameter('cid');
    }
    $('#modal_add_prop_btn').click(function (e) {
        e.preventDefault();
        $('#modal_add_property_header').fadeOut();
        $('#modal_add_property_footer').fadeOut();
        $('#modal_add_property_txt').fadeOut();
        $('#main_section_loader_add_property').fadeIn();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertProperty.php?address=' + address + '&community=' + community + '&city=' + city + '&country=' + country + '&uploaded_by=' + admin_id + '&comments = '+comments + '&property_type='+propertyType;
        console.log(link)
        $.get(link, function (data) {
            console.log(data);
            if (data.server_response == 'Successfully Submitted Property Details') {
                // console.log('property successfully submitted');
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchCurrentPropertyID.php?address=' + address;
                console.log(link);
                $.get(link, function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (parseInt(data.server_response_ID) > 0) {
          
                        if (property_type.toLowerCase() == 'leased') {
                            lease_start_date = $('#inputLEASESTART').val();
                            // lease_start_date = date_obj.split('-');
                            // lease_start_date = lease_start_date.pop() + '-' + lease_start_date.pop() + '-' + lease_start_date.pop();

                            lease_end_date = $('#inputLEASEEND').val();
                            // date_obj = $('#inputLEASEEND').val();
                            // lease_end_date = date_obj.split('-');
                            // lease_end_date = lease_end_date.pop() + '-' + lease_end_date.pop() + '-' + lease_end_date.pop();
                            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignLeasedProperty.php?property_id=' + data.server_response_ID + '&client_id=' + selected_client + '&lease_start_date=' + lease_start_date + '&lease_end_date=' + lease_end_date + '&uploaded_by=' + admin_id;
                            console.log(link);
                            $.get(link, function (data, textStatus, jqXHR) {
                                console.log(data);
                                if (data.server_response == 'Successfully Assigned Leased Property To Client.') {
                                    $('#modal_add_property_txt').text('Successfully Assigned Leased Property To Client.');
                                    $('#modal_add_property_txt').fadeIn();
                                    $('#main_section_loader_add_property').fadeOut();
                                    setTimeout(function () { window.location.href = 'Properties.html'; }, 2500);
                                }

                            });
                        } else {
                            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignOwnedProperty.php?property_id=' + data.server_response_ID + '&client_id=' + selected_client + '&uploaded_by=' + admin_id;
                            console.log(link);
                            $.get(link, function (data, textStatus, jqXHR) {
                                console.log(data);
                                if (data.server_response == 'Successfully Assigned Owned Property To Client.') {
                                    $('#modal_add_property_txt').text('Successfully Assigned Owned Property To Client.');
                                    $('#modal_add_property_txt').fadeIn();
                                    $('#main_section_loader_add_property').fadeOut();
                                    setTimeout(function () { window.location.href = 'Properties.html'; }, 2500);
                                }
                            });
                        }

                    } else {
                        alert('failed to fetch prop id')
                    }

                })
            } else {
                alert('failed to submit property. plese try again')
            }

        }).fail(function (error) {
            console.log('ajax failed');
            console.log(error);
        });
    });



    $('#add_property_btn').click(function (e) {
        e.preventDefault();
        // id = $('#inputID').val().trim();
        city = $('#inputCITY').val().trim();
        country = $('#inputCOUNTRY').val().trim();
        address = $('#inputADDRESS').val().trim();
        community = $('#inputCOMUNITY').val().trim();
        propertyType = $('#property-type').val();
        comments = $('#comments').val()
        reg_date = '';

        date_obj = $('#inputDATE').val();
        reg_date = date_obj.split('-');
        reg_date = reg_date.pop() + '-' + reg_date.pop() + '-' + reg_date.pop();
        property_type = $('#inputPROPTYPE').val();
        if (selected_client != '') {
            if (city != "" && country != "" && address != "" && community != "" && reg_date != "" && property_type != "")  {
                $('#modal_add_property').modal();
            } else {
                // alert('please fill all the required fields.');
                $('#modal_empty_field').modal();
            }
        } else {
            // alert('please select client.')
            $('#modal_select_client_add_prop').modal();
        }

    });
    $('#cancel_property_btn').click(function (e) {
        e.preventDefault();
        window.location.reload();
    });
    $(document).on('input', '#inputPROPTYPE', function () {
        // alert('ad');
        console.log()
        if ($(this).val().toLowerCase() == 'leased') {
            $('#lease_details_div').fadeIn();
        } else {
            $('#lease_details_div').fadeOut();

        }

    });
    $(document).on('click', '.client_checkbox', function () {

        if (!$(this).is(':checked')) {
            // alert('oye checked hai ye');
            if (selected_client == $(this).val()) {
                selected_client = '';
                $('.selected_client').removeClass('selected_client');
                // w1 = selected_worker1;

            }
            return;
        }
        if (selected_client == '') {
            console.log('in if')
            selected_client = $(this).val();
            $(this).addClass('selected_client');
            console.log(selected_client)
            // w1 = selected_worker1;
            // $(this).prop("checked", true);
            // alert('w1=' + selected_worker1)

        } else {
            // $(this).prop("checked", false);
            console.log('in else')
            selected_client = $(this).val();
            $('.selected_client').prop("checked", false);
            $('.selected_client').removeClass('selected_client');
            $(this).addClass('selected_client');
            console.log(selected_client)
            // alert('select only 1 client: selected client value(ID) = ' + selected_client);

        }
        // alert('In render worker: w1=' + w1 +' w2=' +w2 + ' w3='+w3)

    });

    function getParameter(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }

    

});