$(document).ready(function () {
    $('#demo').carousel({
        interval: false,
        wrap: false
    });
    var admin_id = localStorage.getItem('admin_1d');
    var img1 = '';
    var img2 = '';
    var img3 = '';
    var img4 = '';
    var img1_name = '';
    var img2_name = '';
    var img3_name = '';
    var img4_name = '';
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    var selected_client = '';
    var owned_property = new Array();
    var leased_property = new Array();
    var selected_property = '';
    var job_type = '';
    var urgency_level = '';
    var description = '';
    var planned_date = '';
    var callout_status = '';
    var category = '';
    $(document).on('click', '.client_checkbox', function () {
        $('#prop_indicator').fadeOut();

        if (!$(this).is(':checked')) {
            // alert('oye checked hai ye');
            if (selected_client == $(this).val()) {
                selected_client = '';
                $('#property_slider').empty();
                $('#prop_indicator').text('Select Client to display respective property(s).');
                $('#prop_indicator').fadeIn();

                // w1 = selected_worker1;

            }
            return;
        }
        if (selected_client == '') {
            selected_client = $(this).val();
            $(this).addClass('selected_client');
            console.log(selected_client)
            // w1 = selected_worker1;
            // $(this).prop("checked", true);
            // alert('w1=' + selected_worker1)

        } else {
            console.log('in else')
            selected_client = $(this).val();
            $('.selected_client').prop("checked", false);
            $('.selected_client').removeClass('selected_client');
            $(this).addClass('selected_client');
            console.log(selected_client)
            // $(this).prop("checked", false);
            // $('#modal_sel_client_id').text(selected_client);
            // $('#modal_client_selected').modal();
            // alert('select only 1 client: selected client value(ID) = ' + selected_client)
        }
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientOwnedPropertiesViaClientID.php?ID=' + selected_client;
        owned_property = new Array();
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.server_response != -1) {
                $.each(data.server_response, function (index, item) {
                    owned_property.push(item);
                });
            }
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientLeasedPropertiesViaClientID.php?ID=' + selected_client;
            leased_property = new Array();
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data)
                if (data.server_response != -1) {
                    $.each(data.server_response, function (index, item) {
                        leased_property.push(item);
                    });
                }
                renderProperties();
                console.log(leased_property);
                console.log(owned_property)
            });
        });

    });

    function renderProperties() {
        $('#property_slider').empty();
        // $('#property_slider').html();
        isowned = false;
        for (var i = 0; i < owned_property.length; i++) {
            var htmlstr = '';
            isowned = true;
            if (i == 0) {
                htmlstr += '<div class="item active">'
            } else {
                htmlstr += '<div class="item">'
            }
            // htmlstr += '<div class="modal-body">'
            // htmlstr += '<h5 class="modal-client">CLIENT DETAILS1</h5>'
            // htmlstr += '<p class="details">Callout ID: 2791</p>'
            // htmlstr += '<p class="details">Client Name: Saad Ali</p>'
            // htmlstr += '<p class="details">Phone: +428717293</p>'
            // htmlstr += '<p class="details">Client Email: spence@gmail.com</p>'
            // htmlstr += '<p class="details">CNIC: 32201-12342343-8</p>'
            // htmlstr += '<p class="details">Date Joined: 17/10/90</p>'
            // htmlstr += '<p class="details">Address: G13 Street 4</p>     '
            // htmlstr += '<h5 class="modal-client">CALLOUT DETAILS</h5>'
            // htmlstr += '<p class="details">DOB: 17/10/90</p>'
            // htmlstr += '<p class="details">Job Type: Woodworks</p>'
            // htmlstr += '<p class="details">Location: United Arab Emirates</p>'
            // htmlstr += '<p class="details">Rating: 4.5</p>'
            // htmlstr += '<p class="details">Total Callout: 20</p>'

            htmlstr += '<h5 class="modal-client">PROPERTY DETAILS</h5>'
            htmlstr += '<p class="details">Property ID:' + owned_property[i].owned_properties.property_id + '</p>'
            htmlstr += '<p class="details">Country: ' + owned_property[i].owned_properties.country + '</p>'
            htmlstr += '<p class="details">Property Address: ' + owned_property[i].owned_properties.address + '</p>'
            htmlstr += '<p class="details">Comunity: ' + owned_property[i].owned_properties.community + '</p>'
            htmlstr += '<p class="details">City: ' + owned_property[i].owned_properties.city + '</p>'
            htmlstr += '<div class="jobdetails" >'
            htmlstr += '<button id="' + owned_property[i].owned_properties.property_id + '-owned" type="button" class="btn btn-pri btn-sm select_prop_btn">Select This Property</button>'
            htmlstr += '</div>'
            htmlstr += '</div>'
            htmlstr += "</div>"
            $('#property_slider').append(htmlstr);
        }
        var isLeased = false;
        for (var i = 0; i < leased_property.length; i++) {
            isLeased =true;
            var htmlstr = '';
            console.log(isowned)
            if (i == 0 && isowned == false) {
                htmlstr += '<div class="item active">'
            } else {
                htmlstr += '<div class="item">'
            }
            htmlstr += '<div class="modal-body">'
            // htmlstr += '<h5 class="modal-client">CLIENT DETAILS1</h5>'
            // htmlstr += '<p class="details">Callout ID: 2791</p>'
            // htmlstr += '<p class="details">Client Name: Saad Ali</p>'
            // htmlstr += '<p class="details">Phone: +428717293</p>'
            // htmlstr += '<p class="details">Client Email: spence@gmail.com</p>'
            // htmlstr += '<p class="details">CNIC: 32201-12342343-8</p>'
            // htmlstr += '<p class="details">Date Joined: 17/10/90</p>'
            // htmlstr += '<p class="details">Address: G13 Street 4</p>     '
            // htmlstr += '<h5 class="modal-client">CALLOUT DETAILS</h5>'
            // htmlstr += '<p class="details">DOB: 17/10/90</p>'
            // htmlstr += '<p class="details">Job Type: Woodworks</p>'
            // htmlstr += '<p class="details">Location: United Arab Emirates</p>'
            // htmlstr += '<p class="details">Rating: 4.5</p>'
            // htmlstr += '<p class="details">Total Callout: 20</p>'

            htmlstr += '<h5 class="modal-client">PROPERTY DETAILS</h5>'
            htmlstr += '<p class="details">Property ID:' + leased_property[i].leased_properties.property_id + '</p>'
            htmlstr += '<p class="details">Country: ' + leased_property[i].leased_properties.country + '</p>'
            htmlstr += '<p class="details">Property Address: ' + leased_property[i].leased_properties.address + '</p>'
            htmlstr += '<p class="details">Comunity: ' + leased_property[i].leased_properties.community + '</p>'
            htmlstr += '<p class="details">City: ' + leased_property[i].leased_properties.city + '</p>'
            htmlstr += '<p class="details">Lease ID: ' + leased_property[i].leased_properties.lease_id + '</p>'
            htmlstr += '<p class="details">Lease Start Date: ' + leased_property[i].leased_properties.lease_start + '</p>'
            htmlstr += '<p class="details">Lease End Date: ' + leased_property[i].leased_properties.lease_end + '</p>'
            htmlstr += '<div class="jobdetails" >'
            htmlstr += '<button id="' + leased_property[i].leased_properties.property_id + '-leased" type="button" class="btn btn-pri btn-sm select_prop_btn">Select This Property</button>'
            htmlstr += '</div>'
            htmlstr += '</div>'
            htmlstr += "</div>"
            $('#property_slider').append(htmlstr);
        }

        if(isowned || isLeased){
            console.log('yes prop');
        }else {
        $('#prop_indicator').text('No property(s) found for this client.');

        $('#prop_indicator').fadeIn();

        }
    }
    $(document).on('click', '.select_prop_btn', function () {
        selected_property = $(this).attr('id');
        console.log(selected_property.split('-'));
    });
    $('#modal_save_btn').click(function (e) {
        e.preventDefault();
        $('#modal_header').fadeOut();
        $('#modal_txt').fadeOut();
        $('#modal_footer').fadeOut();
        $('#main_section_loader_add_services').fadeIn();
        var link = ''
        if(callout_status == 'Planned'){
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/submitPlannedCallOut.php?client_id=' + selected_client + '&prop_id=' + selected_property.split('-')[0] + '&job=' + job_type + '&describe=' + description + '&urg_lvl=' + urgency_level + '&picture1=' + img1_name + '&picture2=' + img2_name +'&picture3=' + img3_name +'&picture4=' + img4_name +'&planned_time=' + planned_date + '&category='+ category;
        }else {
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertService.php?client_id=' + selected_client + 
            '&property_id=' 
            + selected_property.split('-')[0] + '&job_type=' + job_type + '&description=' + description +
             '&status=Requested'+
             '&urgency_level=' + urgency_level + '&picture1=' + img1_name + '&picture2=' + img2_name +'&picture3=' + 
             img3_name +'&picture4=' + img4_name + '&category='+ category;

        }
        console.log(link)
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.server_response == 'Successfully Submitted Callout Details' || data.server_response == 'Successfully Submitted Planned Callout Details') {
                // alert('Successfully Submitted Callout Details');
               
                
                if(img1 != ''){
                    console.log('in upload img1')
                    formdata1 = new FormData();
                    file1 = img1;
                    formdata1.append("photo", file1);
                    // // console.log(formdata);
                    $.ajax({
                        url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                        type: "POST",
                        data: formdata1,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            console.log(result);
                            if(img2 != ''){
                                console.log('in upload img2')
            
                                formdata2 = new FormData();
                                file2 = img2;
                                formdata2.append("photo", file2);
                                // // console.log(formdata);
                                $.ajax({
                                    url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                    type: "POST",
                                    data: formdata2,
                                    processData: false,
                                    contentType: false,
                                    success: function (result) {
                                        console.log(result);
                                        if(img3 != ''){
                                            console.log('in upload img3')
                        
                                            formdata3 = new FormData();
                                            file3 = img3;
                                            formdata3.append("photo", file3);
                                            // // console.log(formdata);
                                            $.ajax({
                                                url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                                type: "POST",
                                                data: formdata3,
                                                processData: false,
                                                contentType: false,
                                                success: function (result) {
                                                    console.log(result);
                                                    if(img4 != ''){
                                                        console.log('in upload img4')
                                    
                                                        formdata4 = new FormData();
                                                        file4 = img4;
                                                        formdata4.append("photo", file4);
                                                        // // console.log(formdata);
                                                        $.ajax({
                                                            url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                                            type: "POST",
                                                            data: formdata4,
                                                            processData: false,
                                                            contentType: false,
                                                            success: function (result) {
                                                                console.log(result);
                                                                setTimeout(function () { window.location.href = 'Services.html'; }, 2500);

                                                            },
                                                            error: function (data) { 
                                                                console.log(data)
                                                                },
                                                        });
                                                    }
                                                },
                                                error: function (data) { 
                                                    console.log(data)
                                                    },
                                            });
                                        }
                                    },
                                    error: function (data) { 
                                        console.log(data)
                                        },
                                });
                            }
                        },
                        error: function (data) {
                             console.log(data);
                             if(img2 != ''){
                                console.log('in upload img2')
            
                                formdata2 = new FormData();
                                file2 = img2;
                                formdata2.append("photo", file2);
                                // // console.log(formdata);
                                $.ajax({
                                    url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                    type: "POST",
                                    data: formdata2,
                                    processData: false,
                                    contentType: false,
                                    success: function (result) {
                                        console.log(result);
                                        if(img3 != ''){
                                            console.log('in upload img3')
                        
                                            formdata3 = new FormData();
                                            file3 = img3;
                                            formdata3.append("photo", file3);
                                            // // console.log(formdata);
                                            $.ajax({
                                                url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                                type: "POST",
                                                data: formdata3,
                                                processData: false,
                                                contentType: false,
                                                success: function (result) {
                                                    console.log(result);
                                                    if(img4 != ''){
                                                        console.log('in upload img4')
                                    
                                                        formdata4 = new FormData();
                                                        file4 = img4;
                                                        formdata4.append("photo", file4);
                                                        // // console.log(formdata);
                                                        $.ajax({
                                                            url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                                            type: "POST",
                                                            data: formdata4,
                                                            processData: false,
                                                            contentType: false,
                                                            success: function (result) {
                                                                console.log(result);
                                                                setTimeout(function () { window.location.href = 'Services.html'; }, 2500);

                                                            },
                                                            error: function (data) { 
                                                                console.log(data)
                                                                },
                                                        });
                                                    }
                                                },
                                                error: function (data) { 
                                                    console.log(data)
                                                    },
                                            });
                                        }
                                    },
                                    error: function (data) { 
                                        console.log(data)
                                        if(img3 != ''){
                                            console.log('in upload img3')
                        
                                            formdata3 = new FormData();
                                            file3 = img3;
                                            formdata3.append("photo", file3);
                                            // // console.log(formdata);
                                            $.ajax({
                                                url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                                type: "POST",
                                                data: formdata3,
                                                processData: false,
                                                contentType: false,
                                                success: function (result) {
                                                    console.log(result);
                                                    if(img4 != ''){
                                                        console.log('in upload img4')
                                    
                                                        formdata4 = new FormData();
                                                        file4 = img4;
                                                        formdata4.append("photo", file4);
                                                        // // console.log(formdata);
                                                        $.ajax({
                                                            url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                                            type: "POST",
                                                            data: formdata4,
                                                            processData: false,
                                                            contentType: false,
                                                            success: function (result) {
                                                                console.log(result);
                                                                $('#modal_txt').text('Successfully Submitted Callout Details.');
                                                                $('#modal_txt').fadeIn();
                                                                $('#main_section_loader_add_services').fadeOut();
                                                                setTimeout(function () { window.location.href = 'Services.html'; }, 2500);

                                                            },
                                                            error: function (data) { 
                                                                console.log(data)
                                                                $('#modal_txt').text('Successfully Submitted Callout Details.');
                                                                $('#modal_txt').fadeIn();
                                                                $('#main_section_loader_add_services').fadeOut();
                                                                },
                                                        });
                                                    }
                                                },
                                                error: function (data) { 
                                                    console.log(data)
                                                    if(img4 != ''){
                                                        console.log('in upload img4')
                                    
                                                        formdata4 = new FormData();
                                                        file4 = img4;
                                                        formdata4.append("photo", file4);
                                                        // // console.log(formdata);
                                                        $.ajax({
                                                            url: 'https://www.queensman.com/phase_2/queens_client_Apis/uploadPhoto.php',
                                                            type: "POST",
                                                            data: formdata4,
                                                            processData: false,
                                                            contentType: false,
                                                            success: function (result) {
                                                                console.log(result);
                                                                $('#modal_txt').text('Successfully Submitted Callout Details.');
                                                                $('#modal_txt').fadeIn();
                                                                $('#main_section_loader_add_services').fadeOut();
                                                                // setTimeout(function () { window.location.href = 'Services.html'; }, 2500);

                                                            },
                                                            error: function (data) { 
                                                                console.log(data)
                                                                $('#modal_txt').text('Successfully Submitted Callout Details.');
                                                                $('#modal_txt').fadeIn();
                                                                $('#main_section_loader_add_services').fadeOut();
                                                                // setTimeout(function () { window.location.href = 'Services.html'; }, 2500);

                                                                },
                                                        });
                                                    }else {
                                                        $('#modal_txt').text('Successfully Submitted Callout Details.' );
                                                        $('#modal_txt').fadeIn();
                                                        $('#main_section_loader_add_services').fadeOut();
                                                        setTimeout(function () { window.location.href = 'Services.html'; }, 2500);
                                                    }
                                                    },
                                            });
                                        }else {
                                            $('#modal_txt').text('Successfully Submitted Callout Details.' );
                                            $('#modal_txt').fadeIn();
                                            $('#main_section_loader_add_services').fadeOut();
                                            setTimeout(function () { window.location.href = 'Services.html'; }, 2500);
                                        }
                                        },
                                });
                            }else {
                                $('#modal_txt').text('Successfully Submitted Callout Details.' );
                                $('#modal_txt').fadeIn();
                                $('#main_section_loader_add_services').fadeOut();
                                setTimeout(function () { window.location.href = 'Services.html'; }, 2500);
                            }
                            },
                    });
                }else {
                    $('#modal_txt').text('Successfully Submitted Callout Details.' );
                    $('#modal_txt').fadeIn();
                    $('#main_section_loader_add_services').fadeOut();
                    setTimeout(function () { window.location.href = 'Services.html'; }, 2500);

                }
                
                
                
            }
        });
    });
$("input[name='status']").change(function (e) { 
    e.preventDefault();
    callout_status = $("input[name='status']:checked").val();
    if($("input[name='status']:checked").val() == 'Planned'){
        $('#planned_div').fadeIn();
    }else {
        $('#planned_div').fadeOut();
    }

    
});
    $('#save_service_btn').click(function (e) {
        e.preventDefault();
        job_type = $('#job_type').val();
        urgency_level = $("input[name='urgency']:checked").val();
        category = $("input[name='category']:checked").val();
        description = $('#description').val();
        planned_date = $('#planned_job_date').val()
        // status = 'Scheduled'
        console.log(selected_client + '| ' + selected_property + '| ' + job_type + '| ' + urgency_level + '| ' + description +'| '+ category)
        if (selected_client != '') {
            if (selected_property != '') {
                if (job_type != '' && urgency_level != '' && description != '') {
                    if (job_type != 'AC' && job_type != 'Plumbing' && job_type != 'Masonry' && job_type != 'Paintwork' && job_type != 'Electric' && job_type != 'Woodworks') {
                        job_type = 'Other:' + job_type;
                    }
                    if (callout_status == 'Planned'){
                        if(planned_date != ''){
                            $('#modal_add_service').modal();
                        }else {
                            $('#modal_select_planned_date').modal();
                        }
                        
                    }else {
                        $('#modal_add_service').modal();
                    }
                    
                    
                    console.log(selected_client + '| ' + selected_property.split('-')[0] + '| ' + job_type + '| ' + urgency_level + '| ' + description)
                } else {
                    // alert('insert respective data.')
                    $('#modal_job_details').modal();

                }

            } else {
                // alert('select property');
            $('#modal_select_property').modal();

            }

        } else {
            // alert('select client')
            $('#modal_select_client').modal();
        }


    });
    $(document).on('change', '#job_image_upload', function () { readURL(this); });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            // console.log(input.files[0])
            reader.onload = function (e) {

                if (img1 == '') {
                    img1 = input.files[0];
                    console.log('in img1');
                    console.log(img1.name)
                    img1_name = img1.name
                    // $('#blah').attr('src', e.target.result);

                } else if (img2 == '') {
                    img2 = input.files[0];
                    console.log('in img2')
                    img2_name = img2.name

                    // $('#blah2').attr('src', e.target.result);

                    // console.log('in img 2')
                    // console.log(e.target)
                } else if (img3 == '') {
                    img3 = input.files[0];
                    console.log('in img3')
                    img3_name = img3.name

                    // $('#blah3').attr('src', e.target.result);
                    // console.log('in img 3')
                    // console.log(e.target)
                } else if (img4 == '') {
                    img4 = input.files[0];
                    console.log('in img4')

                    img4_name = img4.name
                    // $('#blah4').attr('src', e.target.result);
                    // console.log('in img 4')
                    // console.log(e.target)
                } else {
                    $('#modal_job_images').modal();
                }
            };
           
            reader.readAsDataURL(input.files[0]);
        }
    }

    

});