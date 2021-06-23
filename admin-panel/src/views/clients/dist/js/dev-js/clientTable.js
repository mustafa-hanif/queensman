$(document).ready(function () {
    console.log('Client table.js ready')
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name);
    });
    var client_list = new Array();
    var selected_callout = '';
    var table = '';
    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientsForExport.php';
    $.get(link, function (data) {
        console.log(data.server_response)
        $.each(data.server_response, function (index, item) {
            client_list.push(item);
            renderClient(item.clients.id, item.clients.full_name, item.clients.email, item.clients.password, item.clients.phone, item.clients.account_type, index, item,'render_client_list')
            renderContractTable(index,item)
        });
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientsForExport.php';
        $.get(link, function (data, textStatus, jqXHR) {
            $.each(data.server_response, function (index, item) {
                // client_list.push(item);
                renderClient(item.clients.id, item.clients.full_name, item.clients.email, item.clients.password, item.clients.phone, item.clients.account_type, index, item,'render_client_list_for_export')
            }); 
            table2 = $('#client_table_for_export').dataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export Clients Table',
                        attr:  {
                            title: 'Copy',
                            id: 'export_client_btn'
                        },
                        filename: 'Client table',
                        autoFilter: true,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5,6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                        }
                    }
                ]
            });
            $('#client_table_for_export_filter').fadeOut();
        });
        $.extend($.fn.dataTable.defaults, {
            // searching: false,
            ordering: false,
            // info:false,

        });
        $('#dislay_main_section').fadeIn('fast');
        $('#main_section_loader').fadeOut('fast');
        table = $('#client_table').dataTable();
        
        $('#client-table').dataTable();
        // table.buttons().container()
        // .insertBefore( '#example_filter' );
        $('#client_table_filter').css('display', 'none');

    }).fail((error) => {
        console.log(error);

    });
    $(document).on('click', "tbody tr", function () {
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        selected_callout = $(this).attr("id");
        console.log(selected_callout)
    });
    $(document).on('click', ".show_detail_btn", function () {
        $('#modal_owned_prop_error').fadeIn();
        $('#client_owned_property').empty();
        $('#modal_leased_prop_error').fadeIn();
        $('#client_leased_property').empty();
        selected_callout = $(this).attr("id");
        console.log(client_list[selected_callout]);
        $('#req_time').text('Client Name: ' + client_list[selected_callout].clients.full_name);
        $('#job_type').text('scontract signup date: ' + client_list[selected_callout].clients.contract_start_date);

        $('#client_id').text('Client ID: ' + client_list[selected_callout].clients.id);
        $('#client_name').text('Client Name:' + client_list[selected_callout].clients.full_name);
        $('#client_email').text('Client Email: ' + client_list[selected_callout].clients.email);
        $('#client_phone').text('Client Phone: ' + client_list[selected_callout].clients.phone);
        if (client_list[selected_callout].clients.sec_email != null) {
            $('#client_sec_email').text('Client Sec Email: ' + client_list[selected_callout].clients.sec_email);
        } else {
            $('#client_sec_email').text('Client Sec Email: Not provided');

        }
        if (client_list[selected_callout].clients.sec_phone != null) {
            $('#client_sec_phone').text('Client Sec Phone: ' + client_list[selected_callout].clients.sec_phone);
        } else {
            $('#client_sec_phone').text('Client Sec Phone: Not provided');

        }
        link = "https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientOwnedPropertiesViaClientID.php?ID=" + client_list[selected_callout].clients.id;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            if(data.server_response != -1){
                $('#modal_owned_prop_error').fadeOut();
                $.each(data.server_response, function (indexInArray, valueOfElement) {
                    var htmlStr = '';
                    htmlStr += '<div class="col-sm">'
                    htmlStr += ' <h5 style="margin-left: 2%" class="modal-client">Property ID:'+valueOfElement.owned_properties.property_id+'</h5>'
                    htmlStr += ' <p id="" class="details">'+valueOfElement.owned_properties.address+'</p>'
                    htmlStr += ' <p id="" class="details">Comunity: '+valueOfElement.owned_properties.community+'</p>'
                    htmlStr += ' <p id="" class="details">City: '+valueOfElement.owned_properties.city+'</p>'
                    htmlStr += ' <p id="" class="details">Country: '+valueOfElement.owned_properties.country+'</p>'
                    htmlStr += ' </div>'
                    $('#client_owned_property').append(htmlStr);
                });
            }
           
        });
        link = "https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientLeasedPropertiesViaClientID.php?ID=" + client_list[selected_callout].clients.id;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            if(data.server_response != -1){
                $('#modal_leased_prop_error').fadeOut();
                $.each(data.server_response, function (indexInArray, valueOfElement) {
                    var htmlStr = '';
                    htmlStr += '<div class="col-sm">'
                    htmlStr += ' <h5 style="margin-left: 2%" class="modal-client">Property ID:' + valueOfElement.leased_properties.property_id + '</h5>'
                    htmlStr += ' <p id="" class="details">' + valueOfElement.leased_properties.address + '</p>'
                    htmlStr += ' <p id="" class="details">Comunity: ' + valueOfElement.leased_properties.community + '</p>'
                    htmlStr += ' <p id="" class="details">City: ' + valueOfElement.leased_properties.city + '</p>'
                    htmlStr += ' <p id="" class="details">Country: ' + valueOfElement.leased_properties.country + '</p>'
                    htmlStr += '<p id="" class="details">Leased ID: '+ valueOfElement.leased_properties.lease_id + '</p>'
                    htmlStr += '<p id="" class="details">Leased Start Date: '+ valueOfElement.leased_properties.lease_start + '</p>'
                    htmlStr += '<p id="" class="details">Leased End Date: '+ valueOfElement.leased_properties.lease_end + '</p>'
                    htmlStr += ' </div>'
                    $('#client_leased_property').append(htmlStr);
                });
            }
           
        });
        $('#client_account_type').text('Account Type: ' + client_list[selected_callout].clients.account_type);
        $('#callout_id').text('Occupation: ' + client_list[selected_callout].clients.occupation);
        $('#callout_job_type').text('Organization: ' + client_list[selected_callout].clients.organization);
        $('#callout_req_time').text('Age Range: ' + client_list[selected_callout].clients.age_range);
        $('#callout_urgency').text('Gender: ' + client_list[selected_callout].clients.gender);
        $('#description').text('Family Size: ' + client_list[selected_callout].clients.family_size);

        $('#prop_id').text('Ages of Children: ' + client_list[selected_callout].clients.ages_of_children);
        $('#prop_address').text('Earning: ' + client_list[selected_callout].clients.earning_bracket);
        $('#prop_community').text('Nationality: ' + client_list[selected_callout].clients.nationality);
        $('#prop_city').text('Years Expatriate: ' + client_list[selected_callout].clients.years_expatriate);
        $('#years_native').text('years Native: ' + client_list[selected_callout].clients.years_native);
        $('#referred_by').text('Referred By: ' + client_list[selected_callout].clients.referred_by);
        $('#other_properties').text('Other Properties: ' + client_list[selected_callout].clients.other_properties);
        $('#contract_start_date').text('Start Date: ' + client_list[selected_callout].clients.contract_start_date);
        $('#contract_end_date').text('End Date: ' + client_list[selected_callout].clients.contract_end_date);
        $('#sign_up_time').text('Sign up Date: ' + client_list[selected_callout].clients.sign_up_time);

        $('#myModal').modal('toggle');
    });
    var count = 0;
    function renderContractTable(index,item){
        var htmlStr = '';
        var d = new Date()
        var d1 = new Date(item.clients.contract_end_date)
        var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
        var d2 = new Date(date)
        
        if(d2>=d1){
            htmlStr += '<tr id="' + item.clients.id + '" style="background-color:red;">'
            htmlStr += '<td>' + item.clients.id + '</td>'
            htmlStr += '<td>' + item.clients.full_name + '</td>'
            htmlStr += '<td >' + item.clients.email + '</td>'
            htmlStr += '<td>' + item.clients.phone + '</td>'
            htmlStr += '<td>' + item.clients.contract_start_date + '</td>'
            htmlStr += '<td>' + item.clients.contract_end_date + '</td>'
            htmlStr += '</tr>'
            $('#render-client-list').append(htmlStr);
    
        }
        else{
            console.log(item.clients.id)
            htmlStr += '<tr id="' + item.clients.id + '">'
            htmlStr += '<td>' + item.clients.id + '</td>'
            htmlStr += '<td>' + item.clients.full_name + '</td>'
            htmlStr += '<td >' + item.clients.email + '</td>'
            htmlStr += '<td>' + item.clients.phone + '</td>'
            htmlStr += '<td>' + item.clients.contract_start_date + '</td>'
            htmlStr += '<td>' + item.clients.contract_end_date + '</td>'
            htmlStr += '</tr>'
            $('#render-client-list').append(htmlStr);
    
        }

    }
    function renderClient(id, name, email, password, phone, account_type, index, item,table_id) {

        var active = '';
        if(item.clients.active == 0){
            active = 'Inactive'
        }else {
            active = 'Active'
        }

        var htmlStr = '';

        htmlStr += '<tr id="' + id + '">'
        htmlStr += '<td>' + id + '</td>'
        htmlStr += '<td>' + name + '</td>'
        htmlStr += '<td >' + email + '</td>'
        if(table_id == 'render_client_list'){
            htmlStr += '<td> <span class="hidetext">' + password + ' </span><span class="fa fa-eye-slash field-icon toggle-password"></span></td>'
        }else {
            htmlStr += '<td>' + password + '</td>'
        }
        htmlStr += '<td>' + phone + '</td>'
        htmlStr += '<td>' + account_type + '</td>'
      
        htmlStr += '<td>' + active + '</td>'
        htmlStr += '<td><button id="' + index + '" type="button" class="btn btn-primary btn-sm show_detail_btn" >Show client details</button></td>'

        htmlStr += '<td style="display:none">' + item.clients.sec_email + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.sec_phone + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.occupation + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.organization + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.age_range + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.gender + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.family_size + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.ages_of_children + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.earning_bracket + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.nationality + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.years_expatriate + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.years_native + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.referred_by + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.other_properties + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.contract_start_date + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.contract_end_date + '</td>'
        htmlStr += '<td style="display:none">' + item.clients.sign_up_time + '</td>'
        
        // htmlStr += '<td style="display:none">' + item.clients.active + '</td>'
        htmlStr += '</tr>'
        // $('#'+ table_id).append(htmlStr);

        // Password Show / Hide

        $('#'+ table_id).append(htmlStr);
        // $('#render_client_list_for_export').append(htmlStr);
        

        // https://codepen.io/Sohail05/pen/yOpeBm
    }
    $(document).on('click','.toggle-password' ,function () {
        $(this).toggleClass("fa-eye fa-eye-slash");


        if($(this).hasClass('fa-eye-slash')){
            // $(this).siblings().css('-webkit-text-security', value);
            $(this).siblings().addClass('hidetext');
        }else {
            $(this).siblings().removeClass('hidetext');
        }
   
            // var input = $($(this).attr("toggle"));
            // if (input.attr("type") == "password") {
            //   input.attr("type", "text");
            // } else {
            //   input.attr("type", "password");
            // }
    });


    $(document).on('input', '#search_client', function () {
        // alert('sad')
        search_query = $(this).val();
        // alert(search_query)
        table.fnFilter(search_query)

    });

    $('#modify_client_btn').click(function (e) {
        e.preventDefault();
        if (selected_callout != '') {
            window.location.href = 'ModifyClient.html?id=' + selected_callout;

        } else {
            $('#modal_select_client').modal();
        }

    });

    $('#main_clinet_delete_btn').click(function (e) {
        e.preventDefault();
        if (selected_callout != '') {
            // window.location.href = 'ModifyClient.html?id=' + selected_callout;
            $('#modal_delete_client').modal();
        } else {
            $('#modal_select_client').modal();
        }
    });
    $('#modal_delete_client_btn').click(function (e) {
        e.preventDefault();
        $('#modal_delete_client_footer').fadeOut();
        $('#modal_delete_client_txt').fadeOut();
        $('#main_section_loader_delete_client').fadeIn();
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteClient.php?client_id=' + selected_callout;
        console.log(link);
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);

            $('#modal_delete_client_txt').text('The client has been deleted successfully.');
            $('#modal_delete_client_txt').fadeIn();
            $('#main_section_loader_delete_client').fadeOut();
            setTimeout(function () { window.location.reload(); }, 2500);

        });
    });

    $('#export_client_main_btn').click(function (e) { 
        $('#export_client_btn').click();
        
    });
});