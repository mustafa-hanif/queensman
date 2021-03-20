$(document).ready(function () {
    // localStorage.setItem('admin_1d', 1);
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name);
    });
    var selected_callout = '';
    var jobs_list = new Array();
    var selected_tab = '#All';
    var table1 = ''
    var table2 = ''
    var table3 = ''
    var table4 = ''
    var table5 = ''
    var table6 = ''
    var table11 = ''
    var table12 = ''
    var table13 = ''
    var table14 = ''
    var table15 = ''
    var table16 = '';
    var img1 = '';
    var img2 = '';
    var img3 = '';
    var img4 = '';
    var img1_name = '';
    var img2_name = '';
    var img3_name = '';
    var img4_name = '';

    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchServicesForExport.php';
    $.get(link, function (data) {
        console.log(data);
        $.each(data.server_response, function (index, item) {
            jobs_list.push(item);
            render_Jobs('render_all_jobs', index, item)
            // renderJobs(item.services.id, item.services.client_username, item.services.address, item.services.job_type, item.services.status, item.services.urgency_level, item.services.category, 'render_all_jobs', index, item);
            if (item.services.status == 'Requested') {
                render_Jobs( 'render_schedule_jobs', index, item);
            } else if (item.services.status == 'Planned') {
                render_Jobs( 'render_planned_jobs', index, item);

            }  else if (item.services.status == 'Job Assigned') {
                render_Jobs( 'render_assigned_jobs', index, item);

            } else if (item.services.status == 'In Progress') {
                render_Jobs( 'render_progress_jobs', index, item);

            } else if (item.services.status == 'Closed') {
                render_Jobs( 'render_closed_jobs', index, item);

            } else if (item.services.status == 'Cancelled') {
                render_Jobs( 'render_cancelled_jobs', index, item);

            }
        });
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchServicesForExport.php'
        $.get(link, function (data, textStatus, jqXHR) {
            $.each(data.server_response, function (index, item) {
                jobs_list.push(item);
                render_Jobs( 'render_all_jobs_for_export', index, item);
                if (item.services.status == 'Requested') {
                    render_Jobs( 'render_schedule_jobs_for_export', index, item);
                } else if (item.services.status == 'Planned') {
                    render_Jobs( 'render_planned_jobs_for_export', index, item);
                } else if (item.services.status == 'Job Assigned') {
                    render_Jobs( 'render_assigned_jobs_for_export', index, item);

                } else if (item.services.status == 'In Progress') {
                    render_Jobs( 'render_progress_jobs_for_export', index, item);

                } else if (item.services.status == 'Closed') {
                    render_Jobs( 'render_closed_jobs_for_export', index, item);

                } else if (item.services.status == 'Cancelled') {
                    render_Jobs( 'render_cancelled_jobs_for_export', index, item);

                }
            });
            table11 = $('#all_jobs_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: 'Export All Jobs Table',
                    filename: 'All jobs table',
                    attr: {
                        title: 'Copy',
                        id: 'export_all_jobs_btn'
                    },
                    autoFilter: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,14, 15, 16, 17, 18, 19, 20, 21, 22]
                       
                    }
                }]
            });
            table12 = $('#schedule_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: 'Export Scheduled Jobs Table',
                    filename: 'Scheduled jobs table',
                    attr: {
                        title: 'Copy',
                        id: 'export_schedule_jobs_btn'
                    },
                    autoFilter: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,14, 15, 16, 17, 18, 19, 20, 21, 22]
                        
                       
                    }
                }]
            });
            table13 = $('#assigned_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: 'Export Assigned Jobs Table',
                    filename: 'Assigned jobs table',
                    attr: {
                        title: 'Copy',
                        id: 'export_assigned_jobs_btn'
                    },
                    autoFilter: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,14, 15, 16, 17, 18, 19, 20, 21, 22]
                        
                        
                    }
                }]
            });
            table14 = $('#progress_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: 'Export In Progress Jobs Table',
                    filename: 'In progress jobs table',
                    attr: {
                        title: 'Copy',
                        id: 'export_progress_jobs_btn'
                    },
                    autoFilter: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,14, 15, 16, 17, 18, 19, 20, 21, 22]
                        
                        
                    }
                }]
            });
            table15 = $('#closed_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: 'Export Closed Jobs Table',
                    filename: 'Closed jobs table',
                    attr: {
                        title: 'Copy',
                        id: 'export_closed_jobs_btn'
                    },
                    autoFilter: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,14, 15, 16, 17, 18, 19, 20, 21, 22]
                       
                    }
                }]
            });
            table16 = $('#cancelled_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: 'Export Cancelled Jobs Table',
                    filename: 'Cancelled jobs table',
                    attr: {
                        title: 'Copy',
                        id: 'export_cancelled_jobs_btn'
                    },
                    autoFilter: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,14, 15, 16, 17, 18, 19, 20, 21, 22]
                       
                        
                    }
                }]
            });
            table16 = $('#planned_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: 'Export Cancelled Jobs Table',
                    filename: 'Planned jobs table',
                    attr: {
                        title: 'Copy',
                        id: 'export_planned_jobs_btn'
                    },
                    autoFilter: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,14, 15, 16, 17, 18, 19, 20, 21, 22]
                       
                        
                    }
                }]
            });
        });
        $.extend($.fn.dataTable.defaults, {
            // searching: false,
            ordering: false,
            // info:false,

        });
        table1 = $('#all_jobs_table').dataTable();
        table7 = $('#planned_table').dataTable();
        table2 = $('#schedule_table').dataTable();
        table3 = $('#assigned_table').dataTable();
        table4 = $('#progress_table').dataTable();
        table5 = $('#closed_table').dataTable();
        table6 = $('#cancelled_table').dataTable();
        $('.dataTables_filter').css('display', 'none');

        $('#dislay_main_section').fadeIn('fast');
        $('#main_section_loader').fadeOut('fast');
    });
    $(document).on('click', "tbody tr", function () {
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        selected_callout = $(this).attr("id");
        // console.log(jobs_list[selected_callout])
    });

    function renderJobImages(item, obj_id, type) {
        var htmlStr = '';
        htmlStr += '<div class="col-md-4">'
        htmlStr += '<div class="thumbnail">'
        htmlStr += '<a href="' + item.services.picture_location + '">'
        htmlStr += '<img src="' + item.services.picture_location + '" target="_blank" alt="User Image" style="width:100%">'
        // htmlStr += '<div class="caption">'
        // htmlStr += '<p>Lorem ipsum...</p>'
        // htmlStr += '</div>'
        htmlStr += ' </a>'
        htmlStr += '<center><a class = "delete_' + obj_id + '">Delete</a></center>'
        htmlStr += '</div>'
        htmlStr += '</div>'
        $('#' + obj_id).append(htmlStr);
    }
    $(document).on('click', ".show_detail_btn", function () {

        $('#no_op_team_error').fadeOut();

        selected_callout = $(this).attr("id");

        console.log(selected_callout ,jobs_list[selected_callout]);
        $('#render_pre_image').empty();
        $('#modal_render_callout_worker').empty();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchServicePrePictures.php?callout_id=' + jobs_list[selected_callout].services.id
        $.get(link, function (data, textStatus, jqXHR) {
            if (data.server_response != "") {
                $.each(data.server_response, function (index, item) {
                    renderJobImages(item, 'render_pre_image', 'pre');

                });
            } else {
                $('#pre_image_error').fadeIn();
            }

        });
        $('#render_post_image').empty();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchServicePostPictures.php?callout_id=' + jobs_list[selected_callout].services.id
        $.get(link, function (data, textStatus, jqXHR) {
            if (data.server_response != "") {
                $.each(data.server_response, function (index, item) {
                    renderJobImages(item, 'render_post_image', 'post');

                });
            } else {
                $('#post_image_error').fadeIn();
            }
        });
        $('#render_notes').empty();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchServiceNotes.php?callout_id=' + jobs_list[selected_callout].services.id
        $.get(link, function (data, textStatus, jqXHR) {
            if (data.server_response != "") {
                $.each(data.server_response, function (index, item) {
                    var htmlStr = '';
                    htmlStr += '<p>' + item.services.note + '</p>'
                    $('#render_notes').append(htmlStr);


                });
            } else {
                $('#notes_error').fadeIn();
            }
        });

        // alert('sda')
        link = 'https://www.queensman.com/phase_2/queens_worker_Apis/fetchJobWorkers.php?ID=' + jobs_list[selected_callout].services.id;
        console.log(link)
        $.get(link, function (data, textStatus, jqXHR) {
            if (data.server_response != -1) {
                $.each(data.server_response, function (index, item) {
                    console.log(item);
                    var htmlStr = '';

                    htmlStr += '<h5 class="modal-client">Ops Member ID: ' + item.id + '</h5>'
                    htmlStr += '<p id="callout_id" class="details">Full Name: ' + item.full_name + '</p>'
                    htmlStr += '<p id="callout_job_type" class="details">Phone:' + item.phone + '</p>'
                    htmlStr += '<p id="callout_req_time" class="details">Email: ' + item.email + '</p>'
                    $('#modal_render_callout_worker').append(htmlStr);

                });
            } else {
                $('#no_op_team_error').fadeIn();
            }
        });

        link = 'https://www.queensman.com/phase_2/queens_client_Apis/fetchSingleJobHistory.php?callout_id='+jobs_list[selected_callout].services.id;
        console.log(link)
        $.get(link, function (data, textStatus, jqXHR) {
            console.log('job history => ',data)
            if (data.server_response != -1) {
                if(data.server_response.length === 0){
                    $('#job-history').html('No History')
                }
                else{
                    var htmlStr1=''
                    htmlStr1 += '<ol type="1" >'
                    $.each(data.server_response, function (index, item) {
                        htmlStr1 += '<li>Status Update: '+item.job_history.status_update+' <br> '
                        htmlStr1 += 'Updated By: '+item.job_history.updated_by+'<br> '
                        htmlStr1 += 'Updated At: '+item.job_history.time+'</li><br>'
                    });    
                    htmlStr1 += '</ol>'
                    console.log(htmlStr1)  
                    $('#job-history').html(htmlStr1)

                }
            } else {
                $('#no_op_team_error').fadeIn();
            }
        });
        
        $('#req_time').text('Request Time: ' + jobs_list[selected_callout].services.request_time);
        $('#job_type').text('Job Type: ' + jobs_list[selected_callout].services.job_type);

        $('#client_id').text('Client ID: ' + jobs_list[selected_callout].services.client_id);
        $('#client_name').text('Client Name:' + jobs_list[selected_callout].services.client_name);
        $('#client_email').text('Client Email: ' + jobs_list[selected_callout].services.client_username);

        $('#callout_id').text('Callout ID: ' + jobs_list[selected_callout].services.id);
        $('#callout_job_type').text('Job Type: ' + jobs_list[selected_callout].services.job_type);
        $('#callout_req_time').text('Request Time: ' + jobs_list[selected_callout].services.request_time);
        $('#callout_urgency').text('Urgency Level: ' + jobs_list[selected_callout].services.urgency_level);
        $('#category').text('Category: ' + jobs_list[selected_callout].services.category);
        $('#status').text('Status: ' + jobs_list[selected_callout].services.status);
        if( jobs_list[selected_callout].services.status == 'Planned'){
            $('#planned_time_modal').text('Planned Date: ' + jobs_list[selected_callout].services.planned_time);
            $('#planned_time_modal').fadeIn();
        }else {
            $('#planned_time_modal').fadeOut();

        }
        $('#description').text('Description: ' + jobs_list[selected_callout].services.description);
        $('#instructions').text('Instructions: ' + jobs_list[selected_callout].services.instructions);
        $('#actions').text('Action: ' + jobs_list[selected_callout].services.action);
        $('#solutions').text('Solution: ' + jobs_list[selected_callout].services.solution);
        if (jobs_list[selected_callout].services.feedback != null) {
            $('#callout_feedback').text(jobs_list[selected_callout].services.feedback);
        } else {
            $('#callout_feedback').text('No customer feedback found');
        }
        if (jobs_list[selected_callout].services.rating != null) {
            var rating = parseInt(jobs_list[selected_callout].services.rating);
            var htmlStr = '';
            var oHtml = $.parseHTML(htmlStr);
            $("#modal_rating_services").html(oHtml);
            for (var i = 1; i <= 5; i++) {
                if (i <= rating) {
                    htmlStr += '<span style="color:golden" class="fa fa-star checked gold_star"></span>'
                    // // console.log(i)
                } else {
                    htmlStr += '<span class="fa fa-star"></span>'
                    // // console.log('empty star')
                }
                // $("#modal_rating_services").html(htmlStr);
            }
            $("#modal_rating_services").html(htmlStr)
        } else {
            $("#modal_rating_services").html('No Ratings Found');

        }
        // alert(jobs_list[selected_callout].services.signature);
        // $('#modal_signature').attr('src','https://www.queensman.com/phase_2/queens_client_Apis/photos/0690da3e-9c38-4a3f-ba45-8971697bd925.jpg');
        // $('#modal_signature').attr(attributeName, value);

        $("#modal_signature").attr("src", jobs_list[selected_callout].services.signature);
        $('#modal_signature_href').attr('href', jobs_list[selected_callout].services.signature);
        $('#prop_id').text('Property ID: ' + jobs_list[selected_callout].services.property_id);
        $('#prop_address').text('Address: ' + jobs_list[selected_callout].services.address);
        $('#prop_community').text('Community: ' + jobs_list[selected_callout].services.community);
        $('#prop_city').text('City: ' + jobs_list[selected_callout].services.city);
        $('#prop_country').text('Country: ' + jobs_list[selected_callout].services.country);
        console.log(jobs_list[selected_callout].services.type)
        $('#prop_type').text('Type: ' + jobs_list[selected_callout].services.type);
        $('#prop_comments').text('Comments: ' + jobs_list[selected_callout].services.comments);
        $('#myModal').modal('toggle');
        $('#render_callout_image').empty();
        $('#callout_image_error').fadeIn();
        img1 = '';
        img2 = '';
        img3 = '';
        img4 = '';

        if (jobs_list[selected_callout].services.picture1 != "" && jobs_list[selected_callout].services.picture1 != null && jobs_list[selected_callout].services.picture1.split('/').pop() != "") {
            $('#callout_image_error').fadeOut();
            img1 = jobs_list[selected_callout].services.picture1;
            var htmlStr = '';
            htmlStr += '<div class="col-md-4">'
            htmlStr += '<div class="thumbnail">'
            htmlStr += '<a target="_blank" href="' + jobs_list[selected_callout].services.picture1 + '">'
            htmlStr += '<img src="' + jobs_list[selected_callout].services.picture1 + '" alt="User Image" style="width:100%">'
            // htmlStr += '<div class="caption">'
            // htmlStr += '<p>Lorem ipsum...</p>'
            // htmlStr += '</div>'
            htmlStr += '</a>'
            htmlStr += '<center><a class= "delete_callout_image_btn" id="DelLink">Delete</a></center>'
            htmlStr += '</div>'
            htmlStr += '</div>'
            $('#render_callout_image').append(htmlStr);
        }
        if (jobs_list[selected_callout].services.picture2 != "" && jobs_list[selected_callout].services.picture2 != null && jobs_list[selected_callout].services.picture2.split('/').pop() != "") {
            $('#callout_image_error').fadeOut();
            img2 = jobs_list[selected_callout].services.picture2;
            var htmlStr = '';
            htmlStr += '<div class="col-md-4">'
            htmlStr += '<div class="thumbnail">'
            htmlStr += '<a target="_blank" href="' + jobs_list[selected_callout].services.picture2 + '">'
            htmlStr += '<img src="' + jobs_list[selected_callout].services.picture2 + '" alt="User Image" style="width:100%">'
            // htmlStr += '<div class="caption">'
            // htmlStr += '<p>Lorem ipsum...</p>'
            // htmlStr += '</div>'
            htmlStr += '</a>'
            htmlStr += '<center><a class= "delete_callout_image_btn" id="DelLink">Delete</a></center>'
            htmlStr += '</div>'
            htmlStr += '</div>'
            $('#render_callout_image').append(htmlStr);

        }
        if (jobs_list[selected_callout].services.picture3 != "" && jobs_list[selected_callout].services.picture3 != null && jobs_list[selected_callout].services.picture3.split('/').pop() != "") {
            $('#callout_image_error').fadeOut();
            img3 = jobs_list[selected_callout].services.picture3;
            var htmlStr = '';
            htmlStr += '<div class="col-md-4">'
            htmlStr += '<div class="thumbnail">'
            htmlStr += '<a target="_blank" href="' + jobs_list[selected_callout].services.picture3 + '">'
            htmlStr += '<img src="' + jobs_list[selected_callout].services.picture3 + '" alt="User Image" style="width:100%">'
            // htmlStr += '<div class="caption">'
            // htmlStr += '<p>Lorem ipsum...</p>'
            // htmlStr += '</div>'
            htmlStr += '</a>'
            htmlStr += '<center><a class= "delete_callout_image_btn">Delete</a></center>'
            htmlStr += '</div>'
            htmlStr += '</div>'
            $('#render_callout_image').append(htmlStr);

        }
        if (jobs_list[selected_callout].services.picture4 != "" && jobs_list[selected_callout].services.picture4 != null && jobs_list[selected_callout].services.picture4.split('/').pop() != "") {
            $('#callout_image_error').fadeOut();
            img4 = jobs_list[selected_callout].services.picture4;
            var htmlStr = '';
            htmlStr += '<div class="col-md-4">'
            htmlStr += '<div class="thumbnail">'
            htmlStr += '<a target="_blank" href="' + jobs_list[selected_callout].services.picture4 + '">'
            htmlStr += '<img src="' + jobs_list[selected_callout].services.picture4 + '" alt="User Image" style="width:100%">'
            // htmlStr += '<div class="caption">'
            // htmlStr += '<p>Lorem ipsum...</p>'
            // htmlStr += '</div>'
            htmlStr += '<center><a class= "delete_callout_image_btn">Delete</a></center>'
            htmlStr += '</a>'
            htmlStr += '</div>'
            htmlStr += '</div>'
            $('#render_callout_image').append(htmlStr);

        }
    });

    function renderJobs(id, name, address, job_type, status, urgency_level, category, table_id, index, item) {
      
        var active = '';
        var htmlStr = ''
        htmlStr += '<tr id=' + index + '>'
        htmlStr += '<td>' + id + '</td>'
        htmlStr += '<td style="display:none">' + item.services.client_id + '</td>'
        htmlStr += '<td style="display:none">' + item.services.client_name + '</td>'
        htmlStr += '<td>' + name + '</td>'
        htmlStr += '<td style="display:none">' + item.services.property_id + '</td>'
        htmlStr += '<td>' + address + '</td>'
        htmlStr += '<td style="display:none">' + item.services.community + '</td>'
        htmlStr += '<td style="display:none">' + item.services.city + '</td>'
        htmlStr += '<td style="display:none">' + item.services.country + '</td>'

        htmlStr += '<td>' + job_type + '</td>'
        htmlStr += '<td>' + status + '</td>'
        htmlStr += '<td>' + urgency_level + '</td>'
        htmlStr += '<td>' + category + '</td>'
        if(item.services.active ==1 ) {
            active = 'Active'
        } else{
            active= 'Inactive'
        }
        htmlStr += '<td >' + active + '</td>'
        htmlStr += '<td>'
        htmlStr += '<div class="jobdetails">'
        htmlStr += '<button id=' + index + ' type="button" class="btn btn-pri btn-sm show_detail_btn" >Show job details</button>'
        htmlStr += '</div>'
        htmlStr += '</td> '
        htmlStr += '<td style="display:none">' + item.services.description + '</td>'
        htmlStr += '<td style="display:none">' + item.services.request_time + '</td>'
        htmlStr += '<td style="display:none">' + item.services.resolved_time + '</td>'
        htmlStr += '<td style="display:none">' + item.services.action + '</td>'
        htmlStr += '<td style="display:none">' + item.services.feedback + '</td>'
        htmlStr += '<td style="display:none">' + item.services.instructions + '</td>'
        htmlStr += '<td style="display:none">' + item.services.solution + '</td>'
        htmlStr += '<td style="display:none">' + item.services.rating + '</td>'
        htmlStr += '<td style="display:none">' + item.services.planned_time + '</td>'



        htmlStr += '</tr>'
        $('#' + table_id).append(htmlStr);
    }
// renderJobs( item.services.urgency_level, item.services.category, 'render_all_jobs', index, item);
    function render_Jobs( table_id, index, item) {
      
        var active = '';
        var htmlStr = ''
        htmlStr += '<tr id=' + index + '>'
        htmlStr += '<td>' + item.services.id + '</td>'
        htmlStr += '<td style="display:none">' + item.services.client_id + '</td>'
        htmlStr += '<td style="display:none">' + item.services.client_username + '</td>'
        htmlStr += '<td>' + item.services.client_username + '</td>'
        htmlStr += '<td style="display:none">' + item.services.property_id + '</td>'
        htmlStr += '<td>' + item.services.address + '</td>'
        htmlStr += '<td style="display:none">' + item.services.community + '</td>'
        htmlStr += '<td style="display:none">' + item.services.city + '</td>'
        htmlStr += '<td style="display:none">' + item.services.country + '</td>'

        htmlStr += '<td>' + item.services.job_type + '</td>'
        htmlStr += '<td>' + item.services.status + '</td>'
        htmlStr += '<td>' + item.services.urgency_level + '</td>'
        htmlStr += '<td>' + item.services.category + '</td>'
        if(item.services.active ==1 ) {
            active = 'Active'
        } else{
            active= 'Inactive'
        }
        htmlStr += '<td >' + active + '</td>'
        htmlStr += '<td>'
        htmlStr += '<div class="jobdetails">'
        htmlStr += '<button id=' + index + ' type="button" class="btn btn-pri btn-sm show_detail_btn" >Show job details</button>'
        htmlStr += '</div>'
        htmlStr += '</td> '
        htmlStr += '<td style="display:none">' + item.services.description + '</td>'
        htmlStr += '<td style="display:none">' + item.services.request_time + '</td>'
        htmlStr += '<td style="display:none">' + item.services.resolved_time + '</td>'
        htmlStr += '<td style="display:none">' + item.services.action + '</td>'
        htmlStr += '<td style="display:none">' + item.services.feedback + '</td>'
        htmlStr += '<td style="display:none">' + item.services.instructions + '</td>'
        htmlStr += '<td style="display:none">' + item.services.solution + '</td>'
        htmlStr += '<td style="display:none">' + item.services.rating + '</td>'
        htmlStr += '<td style="display:none">' + item.services.planned_time + '</td>'



        htmlStr += '</tr>'
        $('#' + table_id).append(htmlStr);
    }

    $('#assign_callout_btn').click(function (e) {
        // alert('In render job: w1=' + w1 +' w2=' +w2 + ' w3='+w3)
        if (selected_callout != '') {
            if (w1 != '' && w2 != '' && w3 != '') {
                $('#assign_job_modal').modal();
                // alert('successfully assign job');


            } else {
                // please select three workers
                // alert('please select three workers')
                $('#modal_select_worker').modal();

            }
        } else {
            // error please select callout
            // alert('error please select callout')
            $('#modal_select_callout').modal();

        }


    });

    $('#save_change_btn_assign_job').click(function (e) {
        e.preventDefault();
        $('#modal_header').fadeOut();
        $('#modal_txt').fadeOut();
        $('#modal_footer').fadeOut();
        $('#main_section_loader_assign_job').fadeIn();
        assignJob();
    });

    // function assignJob() {
    //     callout_id = jobs_list[selected_callout].services.id;
    //     worker_id = w1;
    //     instruction = 'no instruction mentioned.'
    //     link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignJob.php?worker_id=' + worker_id + '&callout_id=' + callout_id + '&instructions=' + instruction;
    //     console.log(link);
    //     $.get(link, function (data) {
    //         console.log(data);
    //         worker_id = w2;
    //         instruction = 'no instruction mentioned.'
    //         link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignJob.php?worker_id=' + worker_id + '&callout_id=' + callout_id + '&instructions=' + instruction;
    //         $.get(link, function (data) {
    //             console.log(data);
    //             worker_id = w3;
    //             instruction = 'no instruction mentioned.'
    //             link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignJob.php?worker_id=' + worker_id + '&callout_id=' + callout_id + '&instructions=' + instruction;
    //             $.get(link, function (data) {
    //                 console.log(data);
    //                 alert('successfully assign job');

    //             });
    //         });
    //     });
    // }
    function assignJob() {
        callout_id = jobs_list[selected_callout].services.id;
        worker_id = w1;
        // instruction = 'no instruction mentioned.'
        instruction = $('#assign_job_instructions').val();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignJobToSingleWorker.php?worker_id=' + worker_id + '&callout_id=' + callout_id
        console.log(link);
        $.get(link, function (data) {
            console.log(data);
            worker_id = w2;
            // instruction = 'no instruction mentioned.'
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignJobToSingleWorker.php?worker_id=' + worker_id + '&callout_id=' + callout_id
            $.get(link, function (data) {
                console.log(data);
                worker_id = w3;
                // instruction = 'no instruction mentioned.'
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignJobToSingleWorker.php?worker_id=' + worker_id + '&callout_id=' + callout_id
                $.get(link, function (data) {
                    console.log(data);
                    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignJob.php?worker_id=' + worker_id + '&callout_id=' + callout_id + '&instructions=' + instruction;
                    $.get(link, function (data) {
                        console.log(data);
                        // alert('successfully assign job');
                        $('#modal_txt').text('Successfully assign job.');
                        $('#modal_txt').fadeIn();
                        $('#main_section_loader_assign_job').fadeOut();
                        setTimeout(function () {
                            window.location.reload();
                        }, 2500);

                    });
                    // alert('successfully assign job');


                });
            });
        });
    }
    $('#modify_prop_btn').click(function (e) {
        e.preventDefault();
        if (selected_callout != "") {
            window.location.href = 'ModifyService.html?id=' + jobs_list[selected_callout].services.id + '&cid=' + jobs_list[selected_callout].services.client_id;
        } else {
            // alert('please select service first');
            $('#modal_select_worker').modal();

        }

    });
    $('#withdraw').click(function (e) {
        e.preventDefault();
        if (selected_callout != "") {
            console.log(jobs_list[selected_callout].services.status)
            console.log('selected_callout => ', selected_callout)
            if(jobs_list[selected_callout].services.status==='Job Assigned'){
                $.get('https://www.queensman.com/phase_2/queens_admin_Apis/withdrawAssignedJob.php?callout_id='+jobs_list[selected_callout].services.id,function(data){
                    console.log(data)
                    if(data.server_response=="Successfully updated job_worker table."){
                        $('#modal_withdraw_success').modal();
                        setTimeout(()=>{
                            window.location.reload()
                        },1000)
                    }
                })
                .fail(err=>{
                    console.log(err)
                })
            }
            else{
                $('#modal_withdraw').modal();
            }
        } else {
            // alert('please select service first');
            $('#modal_select_worker').modal();

        }

    });
    $('.TabTitle').click(function (e) {
        console.log($(this).children().attr('href'));
        $('#search_services').val('');
        selected_tab = $(this).children().attr('href')

    });
    $(document).on('input', '#search_services', function () {
        // alert('sad')
        search_query = $(this).val();
        if (selected_tab == '#All') {
            // alert('in all')
            table1.fnFilter(search_query)
        } else if (selected_tab == '#Scheduled') {
            // alert('in Scheduled')
            table2.fnFilter(search_query)
        } else if (selected_tab == '#Assigned') {
            // alert('in Assigned')
            table3.fnFilter(search_query)
        } else if (selected_tab == '#InProgress') {
            // alert('in InProgress')
            table4.fnFilter(search_query)
        } else if (selected_tab == '#Closed') {
            // alert('in Closed')
            table5.fnFilter(search_query)
        } else if (selected_tab == '#Cancelled') {
            // alert('in Cancelled')
            table6.fnFilter(search_query)
        }
        // alert(search_query)
        // table.fnFilter(search_query)

    });
    $('#main_delete_callout_btn').click(function (e) {
        e.preventDefault();
        // console.log(jobs_list[selected_callout].services.id)
        if (selected_callout != '') {
            $('#modal_delete').modal();
        } else {
            $('#modal_select_worker').modal();
        }

    });

    $('#modal_delete_btn').click(function (e) {
        e.preventDefault();
        $('#modal_delete_footer').fadeOut();
        $('#modal_delete_txt').fadeOut();
        $('#main_section_loader_delete').fadeIn();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteService.php?callout_id=' + jobs_list[selected_callout].services.id;
        console.log(link);
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);

            $('#modal_delete_txt').text('The callout has been deleted successfully.');
            $('#modal_delete_txt').fadeIn();
            $('#main_section_loader_delete').fadeOut();
            setTimeout(function () {
                window.location.reload();
            }, 2500);

        });
    });
    $('#export_all_jobs_main_btn').click(function (e) {
        e.preventDefault();
        $('#export_all_jobs_btn').click();

    });
    $('#export_schedule_jobs_main_btn').click(function (e) {
        e.preventDefault();
        $('#export_schedule_jobs_btn').click();

    });
    $('#export_planned_jobs_main_btn').click(function (e) {
        e.preventDefault();
        $('#export_planned_jobs_btn').click();

    });
    $('#export_assigned_jobs_main_btn').click(function (e) {
        e.preventDefault();
        $('#export_assigned_jobs_btn').click();

    });
    $('#export_progress_jobs_main_btn').click(function (e) {
        e.preventDefault();
        $('#export_progress_jobs_btn').click();

    });
    $('#export_closed_jobs_main_btn').click(function (e) {
        e.preventDefault();
        $('#export_closed_jobs_btn').click();

    });
    $('#export_cancelled_jobs_main_btn').click(function (e) {
        e.preventDefault();
        $('#export_cancelled_jobs_btn').click();

    });

    var pre_image_target = '';
    $(document).on('click', '.delete_render_pre_image', function () {
        pre_image_target = $(this).parent().siblings().attr('href').split('/').pop();
        // console.log($(this).parent().siblings().attr('href').split('/').pop())
        $('#PicDel').modal();
    });
    var post_image_target = '';
    $(document).on('click', '.delete_render_post_image', function () {
        post_image_target = $(this).parent().siblings().attr('href').split('/').pop();
        $('#PicDel').modal();
    });
    $('#modal_delete_pic').click(function (e) {
        // e.preventDefault();
        // $('#modal_delete_txt').val('sdasds');
        $('#modal_delete_pic_txt').fadeOut();
        $('#modal_delete_pic_loader').fadeIn();
        $('#modal_delete_image_footer').fadeOut();
        if (pre_image_target != "") {
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deletePrePhoto_a.php?target_file=' + pre_image_target;
            // link2 = 'https://www.queensman.com/phase_2/queens_admin_Apis/deletePrePhoto_b.php?callout_id='+jobs_list[selected_callout].services.id +'&target_file=' + pre_image_target;
            // console.log(link2);
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.server_response == 'The picture has been deleted.') {
                    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deletePrePhoto_b.php?callout_id=' + jobs_list[selected_callout].services.id + '&target_file=' + pre_image_target;
                    $.get(link, function (data, textStatus, jqXHR) {
                        console.log(data);
                        if (data.server_response == "The file location has been deleted.") {
                            $('#modal_delete_pic_txt').text('Succeccfully deleted pre image.');
                            $('#modal_delete_pic_txt').fadeIn();
                            $('#modal_delete_pic_loader').fadeOut();
                            setTimeout(function () {
                                window.location.reload();
                            }, 2500);
                        }
                    });
                }
            });
        } else if (post_image_target != "") {
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deletePostPhoto_a.php?target_file=' + post_image_target;
            // link2 = 'https://www.queensman.com/phase_2/queens_admin_Apis/deletePrePhoto_b.php?callout_id='+jobs_list[selected_callout].services.id +'&target_file=' + pre_image_target;
            // console.log(link2);
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.server_response == 'The picture has been deleted.') {
                    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deletePostPhoto_b.php?callout_id=' + jobs_list[selected_callout].services.id + '&target_file=' + post_image_target;
                    $.get(link, function (data, textStatus, jqXHR) {
                        console.log(data);
                        if (data.server_response == 'The file location has been deleted.') {
                            $('#modal_delete_pic_txt').text('Succeccfully deleted post image.');
                            $('#modal_delete_pic_txt').fadeIn();
                            $('#modal_delete_pic_loader').fadeOut();
                            setTimeout(function () {
                                window.location.reload();
                            }, 2500);
                        }
                    });
                }
            });
        } else if(callout_image_target != ''){
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteCalloutPhoto_a.php?callout_id=' + jobs_list[selected_callout].services.id + '&target_file=' + callout_image_target;
                    $.get(link, function (data, textStatus, jqXHR) {
                        console.log(data);
                        if (data.server_response == 'The picture has been deleted.') {
                            $('#modal_delete_pic_txt').text('Succeccfully deleted callout image.');
                            $('#modal_delete_pic_txt').fadeIn();
                            $('#modal_delete_pic_loader').fadeOut();
                            setTimeout(function () {
                                window.location.reload();
                            }, 2500);
                        }
                    });
        }




    });


    var pre_image_to_upload = ''
    var pre_image_to_upload_name = ''
    $(document).on('change', '#pre_image_uploader', function () {
        setPreImageForUpload(this);
    });

    function setPreImageForUpload(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            // console.log(input.files[0])
            reader.onload = function (e) {
                pre_image_to_upload = input.files[0];

                console.log(pre_image_to_upload.name)
                pre_image_to_upload_name = pre_image_to_upload.name
                $('#show_uploaded_pre_image').attr('src', e.target.result);
                $('#show_uploaded_pre_image').parent().attr('href', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#uplaod_pre_image_btn').click(function (e) {
        e.preventDefault();
        if (pre_image_to_upload != '') {
            $('#modal_loader_upload_pre_image').fadeIn();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadPrePicture_b.php?ID=' + jobs_list[selected_callout].services.id + '&target_file=' + pre_image_to_upload_name;
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data)
                if (data.server_response == 'The file location has been uploaded.') {
                    console.log('in upload pre image')
                    formdata = new FormData();
                    file = pre_image_to_upload;
                    formdata.append("photo", file);
                    $.ajax({
                        url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadPrePicture_a.php',
                        type: "POST",
                        data: formdata,
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        success: function (result) {
                            console.log(result);
                            $('#modal_loader_upload_pre_image').fadeOut();
                            $('#pre_image_upload_error').fadeIn();
                            setTimeout(function () {
                                window.location.reload();
                            }, 2500);


                        },
                        error: function (data) {
                            console.log(data)
                            $('#modal_loader_upload_pre_image').fadeOut();
                            $('#pre_image_upload_error').fadeIn();
                            setTimeout(function () {
                                window.location.reload();
                            }, 2500);


                        },
                    });
                }

            });

        } else {
            $('#modal_upload_image').modal();
        }

    });


    var post_image_to_upload = ''
    var post_image_to_upload_name = ''
    $(document).on('change', '#post_image_uploader', function () {
        setPostImageForUpload(this);
    });

    function setPostImageForUpload(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            // console.log(input.files[0])
            reader.onload = function (e) {
                post_image_to_upload = input.files[0];

                console.log(post_image_to_upload.name)
                post_image_to_upload_name = post_image_to_upload.name
                $('#show_uploaded_post_image').attr('src', e.target.result);
                $('#show_uploaded_post_image').parent().attr('href', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#uplaod_post_image_btn').click(function (e) {
        e.preventDefault();
        if (post_image_to_upload != '') {
            $('#modal_loader_upload_post_image').fadeIn();
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadPostPicture_b.php?ID=' + jobs_list[selected_callout].services.id + '&target_file=' + post_image_to_upload_name;
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data)
                if (data.server_response == 'The file location has been uploaded.') {
                    console.log('in upload post image')
                    formdata = new FormData();
                    file = post_image_to_upload;
                    formdata.append("photo", file);
                    $.ajax({
                        url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadPostPicture_a.php',
                        type: "POST",
                        data: formdata,
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        success: function (result) {
                            console.log(result);
                            $('#modal_loader_upload_post_image').fadeOut();
                            $('#post_image_upload_error').fadeIn();
                            setTimeout(function () {
                                window.location.reload();
                            }, 2500);


                        },
                        error: function (data) {
                            console.log(data)
                            $('#modal_loader_upload_post_image').fadeOut();
                            $('#post_image_upload_error').fadeIn();

                            setTimeout(function () {
                                window.location.reload();
                            }, 2500);


                        },
                    });
                }

            });

        } else {
            $('#modal_upload_image').modal();
        }

    });


    $(document).on('change', '#callout_image_uploader', function () {
        setPostImageForUpload(this);
    });

    function setPostImageForUpload(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            // console.log(input.files[0])
            reader.onload = function (e) {
                // post_image_to_upload = input.files[0];

                // console.log(post_image_to_upload.name)
                // post_image_to_upload_name = post_image_to_upload.name
                // $('#show_uploaded_post_image').attr('src', e.target.result);
                // $('#show_uploaded_post_image').parent().attr('href', e.target.result);

                if (img1 == '') {
                    img1 = input.files[0];
                    console.log('in img1');
                    console.log(img1.name)
                    img1_name = img1.name
                    $('#show_uploaded_callout_image').attr('src', e.target.result);
                    $('#show_uploaded_callout_image').parent().attr('href', e.target.result);
                    // $('#blah').attr('src', e.target.result);

                } else if (img2 == '') {
                    img2 = input.files[0];
                    console.log('in img2')
                    img2_name = img2.name
                    $('#show_uploaded_callout_image').attr('src', e.target.result);
                    $('#show_uploaded_callout_image').parent().attr('href', e.target.result);
                    // $('#blah2').attr('src', e.target.result);

                    // console.log('in img 2')
                    // console.log(e.target)
                } else if (img3 == '') {
                    img3 = input.files[0];
                    console.log('in img3')
                    img3_name = img3.name
                    $('#show_uploaded_callout_image').attr('src', e.target.result);
                    $('#show_uploaded_callout_image').parent().attr('href', e.target.result);
                    // $('#blah3').attr('src', e.target.result);
                    // console.log('in img 3')
                    // console.log(e.target)
                } else if (img4 == '') {
                    img4 = input.files[0];
                    console.log('in img4')

                    img4_name = img4.name
                    $('#show_uploaded_callout_image').attr('src', e.target.result);
                    $('#show_uploaded_callout_image').parent().attr('href', e.target.result);
                    // $('#blah4').attr('src', e.target.result);
                    // console.log('in img 4')
                    // console.log(e.target)
                } else {
                    $('#modal_job_images').modal();
                }
            };



        };

        reader.readAsDataURL(input.files[0]);
    }

    $('#uplaod_callout_image_btn').click(function (e) {
        e.preventDefault();
        var isupdated = false;
        if(img1_name != ''){
            $('#modal_loader_upload_callout_image').fadeIn();
            uploadCalloutPhoto(img1);
            isupdated = true;
        }
        if(img2_name != ''){
            $('#modal_loader_upload_callout_image').fadeIn();
            uploadCalloutPhoto(img2)
            isupdated = true;

        }
        if(img3_name != ''){
            $('#modal_loader_upload_callout_image').fadeIn();
            uploadCalloutPhoto(img3)
            isupdated = true;

        }
        if(img4_name != ''){
            $('#modal_loader_upload_callout_image').fadeIn();
            uploadCalloutPhoto()
            isupdated = true;

        }
         if(!isupdated) {
            $('#modal_upload_image').modal();
        }

    });

function uploadCalloutPhoto(img){
    var pic1 = img1_name;
    var pic2 = img2_name;
    var pic3 = img3_name;
    var pic4 = img4_name;
    if(img1_name == ''){
        pic1 = img1.split('/').pop();
    }
    if(img2_name == ''){
        pic2 = img2
    }
    if(img3_name == ''){
        pic3 = img3
    }
    if(img4_name == ''){
        pic4 = img4
    }
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadCalloutPictures_b.php?callout_id=' + jobs_list[selected_callout].services.id + '&picture1=' + pic1 +  '&picture2=' + pic2 + '&picture3=' + pic3 + '&picture4=' + pic4 ;
    console.log(link);
    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data)
        if (data.server_response == "The selected images' references have been uploaded to database.") {
            console.log('in upload callout image')
            formdata = new FormData();
            file = img;
            formdata.append("photo", file);
            $.ajax({
                url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadCalloutPictures_a.php',
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    $('#modal_loader_upload_callout_image').fadeOut();
                    $('#post_image_upload_error').fadeIn();
                    setTimeout(function () {
                        window.location.reload();
                    }, 2500);


                },
                error: function (data) {
                    console.log(data)
                    $('#modal_loader_upload_callout_image').fadeOut();
                    $('#callout_image_upload_error').fadeIn();

                    setTimeout(function () {
                        window.location.reload();
                    }, 2500);


                },
            });
        }

    });
}

var callout_image_target = '';
$(document).on('click', '.delete_callout_image_btn', function () {
    callout_image_target = $(this).parent().siblings().attr('href').split('/').pop();
    // console.log($(this).parent().siblings().attr('href').split('/').pop())
    $('#PicDel').modal();
});

});