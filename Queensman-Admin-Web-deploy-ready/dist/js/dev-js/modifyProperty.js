$(document).ready(function () {
    console.log('add property.js ready')
    // localStorage.setItem('admin_1d', 1);
    var admin_id = localStorage.getItem('admin_1d');
    var id = '';
    var city = '';
    var country = '';
    var address = '';
    var community = '';
    var propertyType = '';
    var comments = '';
    var reg_date = '';
    var property_type = '';
    var lease_start_date = '';
    var lease_end_date = '';
    var selected_client = '';
    var prop_client = ''
    var active = '';
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    var prop_id = getParameter('id');
    var prop_type = getParameter('type');

    if(prop_type.toLowerCase()== 'owned'){
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchOwnedPropertyDetailsViaPropertyID.php?property_id=' + prop_id + '&client_id=' +getParameter('cid');
        $.get(link,function (data, textStatus, jqXHR) {
            console.log(data.server_response)
            city = data.server_response.city;
            address = data.server_response.address;
            community = data.server_response.community;
            country = data.server_response.country;
            property_type = prop_type;
            active = data.server_response.active;
            $('#inputCOUNTRY').val(country)
            $('#inputCITY').val(city)
            $('#inputADDRESS').val(address)
            $('#inputCOMUNITY').val(community)
            $('#inputPROPTYPE').val(property_type.toUpperCase())
            $('#inputPROPTYPE').val(property_type.toUpperCase())
            $('#property-type').val(data.server_response.type);
            $('#comments').val(data.server_response.comments)
    
            if( active == 1 ){
                active = 'Active'
            }else {
                active = 'Inactive'
            }
            $('#active_status').val(active)

            
        });
    }else {
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchLeasedPropertyDetailsViaPropertyID.php?property_id=' + prop_id + '&client_id=' +getParameter('cid');
        console.log(link)
        $.get(link,function (data, textStatus, jqXHR) {
            console.log(data.server_response)
            city = data.server_response.city;
            address = data.server_response.address;
            community = data.server_response.community;
            country = data.server_response.country;
            property_type = prop_type;
            $('#property-type').val(data.server_response.type);
            $('#comments').val(data.server_response.comments)
    
            $('#inputCOUNTRY').val(country)
            $('#inputCITY').val(city)
            $('#inputADDRESS').val(address)
            $('#inputCOMUNITY').val(community)
            $('#inputPROPTYPE').val(property_type.toUpperCase());

            var now = new Date(data.server_response.lease_start);
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var today = now.getFullYear() + "-" + (month) + "-" + (day);
            lease_start_date = today
            $('#inputLEASESTART').val(today);
            var now = new Date(data.server_response.lease_end);
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var today = now.getFullYear() + "-" + (month) + "-" + (day);
            lease_end_date = today
            $('#inputLEASEEND').val(today)
            $('#lease_details_div').fadeIn();
        });
    }
    
    
    // alert(prop_id);

    $('#add_property_btn').click(function (e) {
        e.preventDefault();
        $('#modify_prop_modal').modal('toggle');
        // id = $('#inputID').val().trim();
        // city = $('#inputCITY').val().trim();
        // country = $('#inputCOUNTRY').val().trim();
        // address = $('#inputADDRESS').val().trim();
        // community = $('#inputCOMUNITY').val().trim();
        // reg_date = '';

        // date_obj = $('#inputDATE').val();
        // reg_date = date_obj.split('-');
        // reg_date = reg_date.pop() + '-' + reg_date.pop() + '-' + reg_date.pop();
        // property_type = $('#inputPROPTYPE').val();



    });
    $('#update_data_btn').click(function (e) {
        e.preventDefault();
        $('#modal_header').fadeOut();
        $('#modal_txt').fadeOut();
        $('#modal_footer').fadeOut();
        $('#main_section_loader').fadeIn();
        ischanged = false;
        if ($('#inputCITY').val().trim() != city) {
            // update city
            // alert('update city')
            city = $('#inputCITY').val().trim();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyCity.php?property_id=' + prop_id + '&city=' + city
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated city for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });
        }
        if ($('#inputCOUNTRY').val().trim() != country) {
            // update country
           
            country = $('#inputCOUNTRY').val().trim();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyCountry.php?property_id=' + prop_id + '&country=' + country
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated country for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        if ($('#inputADDRESS').val().trim() != address) {
            // update address
            // alert('update address')
            address = $('#inputADDRESS').val().trim();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyAddress.php?property_id=' + prop_id + '&address=' + address
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated address for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });


        }
        if ($('#inputCOMUNITY').val().trim() != community) {
            // update community
          
            community = $('#inputCOMUNITY').val().trim();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyCommunity.php?property_id=' + prop_id + '&community=' + community
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated community for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        
        if ($('#property-type').val() != propertyType) {
            // update community
          
            propertyType = $('#property-type').val();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyType.php?property_id=' + prop_id + '&property_type=' + propertyType
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated type for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        
        if ($('#comments').val() != comments) {
            // update community
          
            comments = $('#comments').val();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyComments.php?property_id=' + prop_id + '&comments=' + comments
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated comments for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        // date_obj = $('#inputDATE').val();
        // date_obj = date_obj.split('-');
        // date_obj = date_obj.pop() + '-' + date_obj.pop() + '-' + date_obj.pop();
        // if (date_obj != reg_date) {
        //     // update date
        //     alert('update reg date')
        //     ischanged = true;
        //     city = $('#inputCITY').val().trim();
        //     link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyCity.php?property_id=' + prop_id + '&city=' + city
        //     $.get(link, function (data, textStatus, jqXHR) {
        //         if (data.server_response == "Successfully updated city for this property.") {
        //             ischanged = true;
        //             console.log(data.server_response)

        //         }
        //     });


        // }
        // if ($('#inputPROPTYPE').val().toLowerCase() != property_type) {
        //     // update property
        //     // alert('update prop type')
        //     ischanged = true;
        //     city = $('#inputCITY').val().trim();
        //     link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyCity.php?property_id=' + prop_id + '&city=' + city
        //     $.get(link, function (data, textStatus, jqXHR) {
        //         if (data.server_response == "Successfully updated city for this property.") {
        //             ischanged = true;
        //             console.log(data.server_response)

        //         }
        //     });
        // }
        if (lease_start_date != $('#inputLEASESTART').val()) {
            // update lease start date
            
            lease_start_date = $('#inputLEASESTART').val();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyLeaseStart.php?property_id=' + prop_id + '&lease_start=' + lease_start_date
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated lease_start for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        if (lease_end_date != $('#inputLEASEEND').val()) {
            // update lease end date
           
            lease_end_date = $('#inputLEASEEND').val();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyLeaseEnd.php?property_id=' + prop_id + '&lease_end=' + lease_end_date
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated lease_end for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        if (prop_client != selected_client) {
            // update client for property
            prop_client = selected_client
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updatePropertyOwner.php?property_id=' + prop_id + '&owner_id=' + selected_client
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated owner_id for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        if (active !== $('#active_status').val()) {
            // update lease end date
           
            active = $('#active_status').val();
            if(active == 'Active'){
                active =1;
            }else {
                active =0;
            }
            var link ='';
            if(prop_type.toLowerCase()== 'owned'){
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateOwnedPropertyActive.php?property_id=' + prop_id +'&client_id=' + getParameter('cid') + '&active=' + active;
            }else {
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateLeasedPropertyActive.php?property_id=' + prop_id +'&client_id=' + getParameter('cid') + '&active=' + active;
            }
            
           console.log(link)
            $.get(link, function (data, textStatus, jqXHR) {
                if (data.server_response == "Successfully updated active for this property.") {
                    ischanged = true;
                    console.log(data.server_response)

                }
            });

        }
        
        
            $('#modal_txt').text('Successfully updated data.');
            $('#modal_txt').fadeIn();
            $('#main_section_loader').fadeOut();
            setTimeout(function () { window.location.href = 'Properties.html'; }, 2500);


     
            // $('#modal_txt').text('no new data to be updated. Nothing has changed.');
            // $('#modal_txt').fadeIn();
            // $('#main_section_loader').fadeOut();
        
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
                selected_client = ''
                // w1 = selected_worker1;

            }
            return;
        }
        if (selected_client == '') {
            selected_client = $(this).val();
            // w1 = selected_worker1;
            // $(this).prop("checked", true);
            // alert('w1=' + selected_worker1)

        } else {
            $(this).prop("checked", false);
            alert('select only 1 client: selected client value(ID) = ' + selected_client)
        }
        // alert('In render worker: w1=' + w1 +' w2=' +w2 + ' w3='+w3)

    });

    function getParameter(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }



});