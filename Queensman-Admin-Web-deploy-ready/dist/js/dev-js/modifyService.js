modify_client_id = ''

$(document).ready(function () {
    $('#demo').carousel({
        interval: false,
        wrap: false
    });
    var admin_id = localStorage.getItem('admin_1d');
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
    var feedback = '';
    var instructions = '';
    var status = '';
    var category ='';
    var planned_date = '';
    var action = '';
    var solution = '';
    var active = '';
    var callout_id = getParameter('id');
    var client_id = '';
    var prop_id = '';
    $('#current_callout_id').text(callout_id);
    
    function getParameter(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }
    // alert(callout_id);
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchServiceDetailsViaServiceID.php?callout_id=' + callout_id;

    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data.server_response);
        job_type = data.server_response[0].services.job_type;
        urgency_level = data.server_response[0].services.urgency_level;
        description = data.server_response[0].services.description;
        feedback = data.server_response[0].services.feedback;
        instructions = data.server_response[0].services.instructions;
        status = data.server_response[0].services.status;
        category = data.server_response[0].services.category;
        action = data.server_response[0].services.action;
        solution = data.server_response[0].services.solution;
        selected_client = data.server_response[0].services.client_id;
        client_id = data.server_response[0].services.client_id;
        if(data.server_response[0].services.active == 0){
            active = 'Inactive'
        }else {
            active = 'Active'
        }
        // modify_client_id = client_id;
        selected_property = data.server_response[0].services.property_id;
        prop_id = data.server_response[0].services.property_id;
        $('#prop_indicator').fadeOut();
        renderClientProperty()
        // $('.client_checkbox').click();
        // $('.radio_urgent :input[value="'+urgency_level+'"]').val();
        // alert('value="'+data.server_response[0].services.client_id+'"')
        // console.log($("#start").find('1').val();
        modify_client_id = data.server_response[0].services.client_id;
        var elems = $('.client_checkbox').filter(function() {
            return this.value.length == data.server_response[0].services.client_id;
        });
        console.log(data.server_response[0].services.client_id)
        console.log( $('.client_checkbox'))
        $('input[value="'+urgency_level+'"]').prop("checked", true);
        $('input[value="'+category+'"]').prop("checked", true);
        var now = new Date(data.server_response[0].services.planned_time);
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

       planned_date = now.getFullYear()+"-"+(month)+"-"+(day) ;

        if(status == 'Planned'){
            $('#planned_date_div').fadeIn();

            $('#planned_date').val(planned_date);

        }else {
            $('#planned_date_div').fadeOut();
        }

        // alert(data.server_response[0].services.planned_time)
        console.log($('.client_checkbox :input[value="'+data.server_response[0].services.client_id+'"]').val());
        // checkContainer(selected_client);
        $('#description').val(description);
        $('#status_callout').val(status);
        $('#inputFEEDBACK').val(feedback);
        $('#inputINSTRUCTIONS').val(instructions);
        $('#job_type').val(job_type)
        $('#inputACTION').val(action);
        $('#inputSolutions').val(solution);
        $('#active_callout').val(active);
    });
    $('#status_callout').change(function (e) { 
        e.preventDefault();
        if($(this).val() == 'Planned'){
            $('#planned_date_div').fadeIn();
            planned_date = data.server_response[0].services.planned_time;
            $('#planned_date').fadeIn();

        }else {
            $('#planned_date_div').fadeOut();
        }
        
    });
    // ("input[name='status']").change(function (e) { 
    //     e.preventDefault();
    //     status = $("input[name='status']:checked").val();
    //     if($("input[name='status']:checked").val() == 'Planned'){
    //         $('#planned_div').fadeIn();
    //     }else {
    //         $('#planned_div').fadeOut();
    //     }
    
        
    // });
    $(document).on('click', '.client_checkbox', function () {
        $('#prop_indicator').fadeOut();

        if (!$(this).is(':checked')) {
            // alert('oye checked hai ye');
            if (selected_client == $(this).val()) {
                selected_client = '';
                $('.selected_client').removeClass('selected_client');
                console.log(selected_client)
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
            // $(this).prop("checked", false);
            // alert('select only 1 client: selected client value(ID) = ' + selected_client)
             // $(this).prop("checked", false);
             console.log('in else')
             selected_client = $(this).val();
             $('.selected_client').prop("checked", false);
             $('.selected_client').removeClass('selected_client');
             $(this).addClass('selected_client');
             console.log(selected_client)
        }
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientOwnedPropertiesViaClientID.php?ID=' + selected_client;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.server_response != -1) {
                $.each(data.server_response, function (index, item) {
                    owned_property.push(item);
                });
            }
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientLeasedPropertiesViaClientID.php?ID=' + selected_client;
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

    function renderClientProperty(){
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientOwnedPropertiesViaClientID.php?ID=' + selected_client;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.server_response != -1) {
                $.each(data.server_response, function (index, item) {
                    owned_property.push(item);
                });
            }
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientLeasedPropertiesViaClientID.php?ID=' + selected_client;
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
    }

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
        for (var i = 0; i < leased_property.length; i++) {
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
        isDataChanged = false;
        if(selected_client != client_id){
            // alert('updte client');
            client_id = selected_client;
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutClientID.php?callout_id=' + callout_id + '&client_id=' + client_id;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(selected_property != prop_id){
            // alert('update property')
            prop_id = selected_property;
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutPropertyID.php?callout_id=' + callout_id + '&property_id=' + prop_id;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(job_type != $('#job_type').val()){
            // alert('update job type')
            job_type =  $('#job_type').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutJobType.php?callout_id=' + callout_id + '&job_type=' + job_type;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(urgency_level != $("input[name='urgency']:checked").val()){
            // alert('update urgency level');
            urgency_level = $("input[name='urgency']:checked").val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutUrgencyLevel.php?callout_id=' + callout_id + '&urgency_level=' + urgency_level;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        
        if(category != $("input[name='category']:checked").val()){
            // alert('update urgency level');
            category = $("input[name='category']:checked").val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutCategory.php?callout_id=' + callout_id + '&category=' + category;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(status != $('#status_callout').val()){
            // alert('update description');
            status = $('#status_callout').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutStatus.php?callout_id=' + callout_id + '&status=' + status;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(planned_date != $('#planned_date').val()){
            // alert('update description');
            planned_date = $('#planned_date').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutPlannedTime.php?callout_id=' + callout_id + '&planned_time=' + planned_date;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(description != $('#description').val()){
            // alert('update description');
            description = $('#description').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutDescription.php?callout_id=' + callout_id + '&description=' + description;
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(feedback != $('#inputFEEDBACK').val()){
            // alert('update description');
            feedback = $('#inputFEEDBACK').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutFeedback.php?callout_id=' + callout_id + '&feedback=' + feedback;
            console.log(link);
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(instructions != $('#inputINSTRUCTIONS').val()){
            // alert('update description');
            instructions = $('#inputINSTRUCTIONS').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutInstructions.php?callout_id=' + callout_id + '&instructions=' + instructions;
            console.log(link)
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(action != $('#inputACTION').val()){
            // alert('update description');
            action = $('#inputACTION').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutAction.php?callout_id=' + callout_id + '&action=' + action;
            console.log(link)
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(solution != $('#inputSolutions').val()){
            // alert('update description');
            solution = $('#inputSolutions').val();
            isDataChanged = true;
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutSolution.php?callout_id=' + callout_id + '&solution=' + solution;
            console.log(link)
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }
        if(active != $('#active_callout').val()){
            // alert('update description');
            active = $('#active_callout').val();
            if(active == 'Active'){
                active =1;
            }else {
                active =0;
            }
            isDataChanged = true;
            // alert(active);
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateCalloutActive.php?callout_id=' + callout_id + '&active=' + active;
            console.log(link)
            $.get(link,function (data, textStatus, jqXHR) {
                console.log(data.server_response);        
            });
        }

        if(isDataChanged){
            // alert('data update')
            $('#modal_txt').text('Successfully updated callout details');
            $('#modal_txt').fadeIn();
            $('#main_section_loader_add_services').fadeOut();
            setTimeout(function () { window.location.href = 'Services.html'; }, 2500);

        }else {
        //    alert('nothing to update')
            $('#modal_txt').text('Nothing to be updated');
            $('#modal_txt').fadeIn();
            $('#main_section_loader_add_services').fadeOut();
        }
        // link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertService.php?client_id=' + selected_client + '&property_id=' + selected_property.split('-')[0] + '&job_type=' + job_type + '&description=' + description + '&status=' + status + '&urgency_level=' + urgency_level
        // $.get(link, function (data, textStatus, jqXHR) {
        //     console.log(data);
        //     if (data.server_response == 'Successfully Submitted Callout Details') {
        //         // alert('Successfully Submitted Callout Details');
        //         $('#modal_txt').text('Successfully Submitted Callout Details.');
        //         $('#modal_txt').fadeIn();
        //         $('#main_section_loader_add_services').fadeOut();
        //         setTimeout(function () { window.location.reload(); }, 4000);
        //     }
        // });
    });

    $('#save_service_btn').click(function (e) {
        // e.preventDefault();
        // job_type = $('#job_type').val();
        // urgency_level = $("input[name='urgency']:checked").val();
        // description = $('#description').val();
        // status = 'Scheduled'
        // console.log(selected_client + '| ' + selected_property + '| ' + job_type + '| ' + urgency_level + '| ' + description)
        // if (selected_client != '') {
        //     if (selected_property != '') {
        //         if (job_type != '' && urgency_level != '' && description != '') {
        //             if (job_type != 'AC' && job_type != 'Plumbing' && job_type != 'Masonry' && job_type != 'Paintwork' && job_type != 'Electric' && job_type != 'Woodworks') {
        //                 job_type = 'Other:' + job_type;
        //             }
                    $('#modal_add_service').modal();
                    
        //             console.log(selected_client + '| ' + selected_property.split('-')[0] + '| ' + job_type + '| ' + urgency_level + '| ' + description)
        //         } else {
        //             // alert('insert respective data.')
        //             $('#modal_job_details').modal();

        //         }

        //     } else {
        //         // alert('select property');
        //     $('#modal_select_property').modal();

        //     }

        // } else {
        //     // alert('select client')
        //     $('#modal_select_client').modal();
        // }


    });

});