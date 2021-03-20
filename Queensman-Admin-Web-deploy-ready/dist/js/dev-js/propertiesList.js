

$(document).ready(function () {
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name);
    });
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchOwnedPropertiesForExport.php';
    
    var prop_list = new Array();
    var prop_list = new Array();
    var owned_list = new Array();
    var leased_list = new Array();
    var table1;
    var table2;
    var lease_prop = new Array();
    var selected_property = '';
    var selected_client = '';
    var property_type = '';
    var selected_tab = '#Owned';
    var file_name = '';
    var rep_type = '';
    var cid= '';
    var select_prop_element;
    $.get(link, function (data) {
        console.log(data);
        var main_index = 0
        
        $.each(data.server_response, function (index, item) {
            renderOwned('render_owned_properties', 'Owned', item, index)
            // renderWorkerList('render_owned_properties', item.properties.property_id, item.properties.full_name, item.properties.address, 'Owned', item.properties.city, item.properties.country, item.properties.type, item.properties.comments,item,index);
            main_index++;
            prop_list.push(item);
            owned_list.push(item);
        });
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchLeasedPropertiesForExport.php';
        $.get(link, function (data) {
            console.log(data);
            $.each(data.server_response, function (index, item) {
                lease_prop[item.properties.id] = item;
                
                console.log('len: ' + Object.keys(item.properties).length)
                renderOwned('render_leased_properties', 'Leased' ,item, index)
                // renderWorkerList('render_leased_properties', item.properties.id, item.properties.full_name, item.properties.address, 'Leased', item.properties.city, item.properties.country, item.properties.type, item.properties.comments,item,main_index);
                main_index++;
                prop_list.push(item);
                leased_list.push(item);
            });
            $.extend($.fn.dataTable.defaults, {
                // searching: false,
                ordering: false,
                // info:false,

            });
            table1 = $('#owned_Table').dataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export Owned Properties Table',
                        filename: 'Owned properties table',
                        autoFilter: true,
                        exportOptions: {
                            columns: [ 0, 1,2,3,4,5,6,7,8,9,10]
                        }
                    }
                  ]
            });
            table2 = $('#leased_table').dataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export Leased Properties Table',
                        filename: 'Leased properties table',
                        autoFilter: true,
                        exportOptions: {
                            columns: [ 0, 1,2,3,4,5,6,7,8,9,10,11,12 ]
                        }
                    }
                  ]
            });
            $('#leased_table_filter').css('display', 'none');
            $('#owned_Table_filter').css('display', 'none');
            $('#dislay_main_section').fadeIn('fast');
            $('#main_section_loader').fadeOut('fast');
            // console.log(lease_prop[108])
            // fade out loader here
        })

    });
    $(document).on('input', '#search_property', function () {
        search_query = $(this).val();
        table1.fnFilter(search_query)


        if (selected_tab == '##Owned') {
            // alert('in all')
            table1.fnFilter(search_query)
        } else if (selected_tab == '#Leased') {
            // alert('in Scheduled')
            table2.fnFilter(search_query)
        }
    });
    $('.TabTitle').click(function (e) {
        console.log($(this).children().attr('href'));
        $('#search_services').val('');
        selected_tab = $(this).children().attr('href')

    });

    function renderWorkerList(table_id, id, name, address, type, city, country, propType, comments,item,index) {
        var active = '';
        var htmlStr = '';
        htmlStr += '<tr class ="'+index+'" id=' + id + '>'
        htmlStr += '<td>' + id + '</td>'
        htmlStr += '<td style="display:none">' + item.properties.client_id + '</td>'
        htmlStr += '<td>' + item.properties.full_name + '</td>'
        htmlStr += '<td style="display:none">' + item.properties.phone + '</td>'
        htmlStr += '<td style="display:none">' + item.properties.email + '</td>'

        htmlStr += '<td>' + address + '</td>'
        htmlStr += '<td>' + propType + '</td>'
        htmlStr += '<td>' + type + '</td>'
        if(Object.keys(item.properties).length == 12){
            htmlStr += '<td style="display:none">' + item.properties.lease_start + '</td>'
            htmlStr += '<td style="display:none">' + item.properties.lease_end + '</td>'
        }
        htmlStr += '<td>' + item.properties.community + '</td>'
        htmlStr += '<td>' + city + '</td>'
        htmlStr += '<td>' + country + '</td>'
        htmlStr += '<td>' + comments + '</td>'
        if (item.properties.active == 1){
            active = 'Active';
        }else {
            active = 'Inactive';
        }
        htmlStr += '<td>' + active + '</td>'
        htmlStr += '<td>'
        htmlStr += '<div id='+index+' class="jobdetails">'
        htmlStr += '<button type="button" id="' + id + '" class="btn btn-pri btn-sm show_prop_detail_btn" data-toggle="modal"'
        htmlStr += 'data-target="#myModal"> Show Property '
        htmlStr += 'Details</button>'
        htmlStr += '</div>'
        htmlStr += '</td>'
        htmlStr += '</tr>'

        $('#' + table_id).append(htmlStr);
    }
    function renderReports(valueOfElement, report_type,tag_id) {
        var month= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
        var htmlStr = '';
        // htmlStr += '<div class="col-md-6">'
        // htmlStr += '<div>'
        // htmlStr += '<li>'
        // htmlStr += '<h5><strong>'+report_type+': </strong>'+valueOfElement.reports.report_month+ ', '+valueOfElement.reports.report_year+'</h5>'
        // htmlStr += '<a href="'+valueOfElement.reports.report_location+'" target= "_blank"type="button" class="btn btn-primary btn-sm">View</a>'
        // htmlStr += '<button type="button" class="btn btn-primary btn-sm">Delete</button>'
        // htmlStr += '</li>'
        // htmlStr += '</div>'
        // htmlStr += '</div>'
        htmlStr += '<div class="col-md-12">'
        htmlStr += '<div class="Buttons-Inline">'
        htmlStr += '<button type="button" class="btn btn-sm" id="Bt-Popup">Month: <span'
        if(tag_id == 'render_monthly_report'){
            htmlStr += 'style="font-weight:bold;">'+ month[valueOfElement.reports.report_month - 1]+'</span></button>'
        }else {
            htmlStr += 'style="font-weight:bold;">'+valueOfElement.reports.report_month+'</span></button>'
        }
        htmlStr += '<button type="button" class="btn btn-sm" id="Bt-Popup">Year: <span'
        htmlStr += 'style="font-weight:bold;">'+valueOfElement.reports.report_year+'</span></button>'
        htmlStr += '<a href="'+valueOfElement.reports.report_location+'" type="button" class="btn btn-sm" id="Bt-Popup"  target= "_blank"'
        htmlStr += 'style="background-color: #DAA207;color:#fff;">View Report</a>'
        htmlStr += '<button value="'+valueOfElement.reports.report_location+'" id="'+selected_prop_id+'-'+tag_id+'" type="button" class="btn btn-sm delete_report" id="Bt-Popup-Cross">x</button>'
        htmlStr += '</div>'
        htmlStr += '</div>'
        $('#' + tag_id).append(htmlStr);
    }
    function renderReportsMaterialWarranty(valueOfElement, report_type,tag_id) {
        var month= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
        var htmlStr = '';
        // htmlStr += '<div class="col-md-6">'
        // htmlStr += '<div>'
        // htmlStr += '<li>'
        // htmlStr += '<h5><strong>'+report_type+': </strong>'+valueOfElement.reports.report_month+ ', '+valueOfElement.reports.report_year+'</h5>'
        // htmlStr += '<a href="'+valueOfElement.reports.report_location+'" target= "_blank"type="button" class="btn btn-primary btn-sm">View</a>'
        // htmlStr += '<button type="button" class="btn btn-primary btn-sm">Delete</button>'
        // htmlStr += '</li>'
        // htmlStr += '</div>'
        // htmlStr += '</div>'
        htmlStr += '<div class="col-md-12">'
        htmlStr += '<div class="Buttons-Inline">'
        htmlStr += '<button type="button" class="btn btn-sm" id="Bt-Popup">Date: <span'
        htmlStr += 'style="font-weight:bold;">'+valueOfElement.reports.report_upload_date+'</span></button>'
        htmlStr += '<a href="'+valueOfElement.reports.report_location+'" type="button" class="btn btn-sm" id="Bt-Popup"  target= "_blank"'
        htmlStr += 'style="background-color: #DAA207;color:#fff;">View Report</a>'
        htmlStr += '<button value="'+valueOfElement.reports.report_location+'" id="'+selected_prop_id+'-'+tag_id+'" type="button" class="btn btn-sm delete_report" id="Bt-Popup-Cross">x</button>'
        htmlStr += '</div>'
        htmlStr += '</div>'
        $('#' + tag_id).append(htmlStr);
    }
   
    $(document).on('click','.delete_report', function () {
        // console.log($(this).attr('value').split('/').pop());
        file_name = $(this).attr('value').split('/').pop();
        rep_type = $(this).attr('id').split('_')[1];
        $('#modal_man_rep').modal('show');
        $('#modal_man_rep_txt').text('Are you sure you want to delete this report?');
        $('#modal_man_rep_footer').fadeIn();
        $('#modal_man_rep_txt').fadeIn();
        $('#main_section_loader_modal_man_rep').fadeOut();
        
    });
    $('#modal_del_rep_btn').click(function (e) { 
        e.preventDefault();
        $('#modal_man_rep_footer').fadeOut();
        $('#modal_man_rep_txt').fadeOut();
        $('#main_section_loader_modal_man_rep').fadeIn();
        if(rep_type == 'managment'){
            // alert('del mng')
            console.log(file_name);
            console.log(rep_type)
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteManagementReport_a.php?target_file=' +file_name;
            $.get(link,function (data, textStatus, jqXHR) {
                 console.log(data)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteManagementReport_b.php?target_file=' +file_name + '&property_id=' + selected_prop_id;
                $.get(link,function (data, textStatus, jqXHR) {
                    console.log(data)  
                    $('#modal_man_rep_txt').text('Successfully deleted report');
                    $('#modal_man_rep_txt').fadeIn();
                    $('#main_section_loader_modal_man_rep').fadeOut();
                    setTimeout(function () {  window.location.reload(); }, 2000);

                }); 
            });
            
        }else if( rep_type == 'monthly'){
            // alert('del mon')
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteMonthlyServicesReport_a.php?target_file=' +file_name;
            $.get(link,function (data, textStatus, jqXHR) {
                 console.log(data)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteMonthlyServicesReport_b.php?target_file=' +file_name + '&property_id=' + selected_prop_id;
                $.get(link,function (data, textStatus, jqXHR) {
                    console.log(data)  
                    $('#modal_man_rep_txt').text('Successfully deleted report');
                    $('#modal_man_rep_txt').fadeIn();
                    $('#main_section_loader_modal_man_rep').fadeOut();
                    setTimeout(function () {  window.location.reload(); }, 2000);

                }); 
            });
        }
        else if( rep_type == 'material'){
            
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteMaterialWarrantyReport_a.php?target_file=' +file_name;
            $.get(link,function (data, textStatus, jqXHR) {
                 console.log(data)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteMaterialWarrantyReport_b.php?target_file=' +file_name + '&property_id=' + selected_prop_id;
                $.get(link,function (data, textStatus, jqXHR) {
                    console.log(data)  
                    $('#modal_man_rep_txt').text('Successfully deleted report');
                    $('#modal_man_rep_txt').fadeIn();
                    $('#main_section_loader_modal_man_rep').fadeOut();
                    setTimeout(function () {  window.location.reload(); }, 2000);

                }); 
            });
        }  
        else {
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteMarketReport_a.php?target_file=' +file_name;
            $.get(link,function (data, textStatus, jqXHR) {
                 console.log(data)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteMarketReport_b.php?target_file=' +file_name + '&property_id=' + selected_prop_id;
                $.get(link,function (data, textStatus, jqXHR) {
                    console.log(data)  
                    $('#modal_man_rep_txt').text('Successfully deleted report');
                    $('#modal_man_rep_txt').fadeIn();
                    $('#main_section_loader_modal_man_rep').fadeOut();
                    setTimeout(function () {  window.location.reload(); }, 2000);

                }); 
            }); 
        }
    });
    $(document).on('click', '.show_prop_detail_btn', function () {
        selected_prop_id = $(this).attr('id');
        $('#tennat_detials_div').fadeOut();
        $('#no_tenant_error').fadeIn();
        $('#no_manegment_error').fadeIn();
        $('#no_monthly_error').fadeIn();
        $('#no_market_error').fadeIn();
        console.log($(this).parent().attr('id'));
        console.log(prop_list);
        $('#client_id').text('Client ID: ' + prop_list[$(this).parent().attr('id')].properties.client_id);
        $('#client_name').text('Client Name:' + prop_list[$(this).parent().attr('id')].properties.full_name);
        $('#client_phone').text('Client Phone:' + prop_list[$(this).parent().attr('id')].properties.phone);
        $('#client_email').text('Client Email: ' + prop_list[$(this).parent().attr('id')].properties.email);
        
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchOwnerDetailsViaPropertyID.php?property_id=' + selected_prop_id;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            $('#owner_detials_div').empty();
            $.each(data.server_response, function (indexInArray, valueOfElement) {

                var htmlStr = '';
                htmlStr += '<p id="tenant_id" class="details">ID: ' + valueOfElement.owner.id + '</p>'
                htmlStr += '<p id="tenant_name" class="details">Name: ' + valueOfElement.owner.full_name + '</p>'
                htmlStr += '<p id="tenant_phone" class="details">Phone: ' + valueOfElement.owner.phone + '</p>'
                htmlStr += '<p id="tenant_email" class="details">Email: ' + valueOfElement.owner.email + '</p>'
                stat = valueOfElement.owner.active;
              
                htmlStr += '<p id="tenant_active" class="details">Is Active: ' + ((valueOfElement.owner.active == 1) ? "Active" : "Inactive") + '</p> <hr>';
                $('#owner_detials_div').append(htmlStr);

            });
            $('#owner_detials_div').fadeIn();
            // $('#owner_id').text( "ID: " + data.server_response[0].owner.id);    
            // $('#owner_name').text("Name: " + data.server_response[0].owner.full_name);    
            // $('#owner_email').text("Email: " + data.server_response[0].owner.email);    
            // $('#owner_phone').text("Phone: " + data.server_response[0].owner.phone);    
            // $('#owner_active').text("Is Active: " +  ((data.server_response[0].owner.active == 1) ? "Active" : "Inactive") );    
        });
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchTenantDetailsViaPropertyID.php?property_id=' + selected_prop_id;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            if(data.server_response != ""){
                // alert('in if')
                
                $('#no_tenant_error').fadeOut();
                $('#tennat_detials_div').empty();
                $.each(data.server_response, function (indexInArray, valueOfElement) {
                    // $('#tenant_id').text("ID: " + data.server_response[0].tenant.id);    
                    // $('#tenant_name').text("Name: " + data.server_response[0].tenant.full_name);    
                    // $('#tenant_email').text("Email: " + data.server_response[0].tenant.email);    
                    // $('#tenant_phone').text("Phone: " + data.server_response[0].tenant.phone);
                    // $('#tenant_active').text("Phone: " + data.server_response[0].tenant.active);
                    // $('#tennat_detials_div').fadeIn();
                    var htmlStr = '';
                    htmlStr += '<p id="tenant_id" class="details">ID: ' + valueOfElement.tenant.id + '</p>'
                    htmlStr += '<p id="tenant_name" class="details">Name: ' + valueOfElement.tenant.full_name + '</p>'
                    htmlStr += '<p id="tenant_phone" class="details">Phone: ' + valueOfElement.tenant.phone + '</p>'
                    htmlStr += '<p id="tenant_email" class="details">Email: ' + valueOfElement.tenant.email + '</p>'
                    htmlStr += '<p id="tenant_email" class="details">Lease Start Time: ' + valueOfElement.tenant.lease_start + '</p>'
                    htmlStr += '<p id="tenant_email" class="details">Lease End Time: ' + valueOfElement.tenant.lease_end + '</p>'
                    stat = valueOfElement.tenant.active;
                  
                    htmlStr += '<p id="tenant_active" class="details">Is Active: ' + ((valueOfElement.tenant.active == 1) ? "Active" : "Inactive") + '</p> <hr>';
                    $('#tennat_detials_div').append(htmlStr);

                });
                
                $('#tennat_detials_div').fadeIn();

            }else {
                $('#no_tenant_error').fadeIn();

            }
        
                
        });



        $('#render_managment_report').empty();
        $('#render_monthly_report').empty();
        $('#render_market_report').empty();
        $('#render_material_report').empty();
        
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchManagementReportsViaPropertyID.php?property_id=' + selected_prop_id;
        console.log(link)
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            if (data.server_response != "") {
                // $('#report_error').fadeOut();

                $.each(data.server_response, function (indexInArray, valueOfElement) {
                    $('#no_manegment_error').fadeOut();
                    renderReports(valueOfElement, 'Management Report','render_managment_report')
                })
            } else {
                $('#report_error').fadeIn();
            }

        });
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchMonthlyServicesReportsViaPropertyID.php?property_id=' + selected_prop_id
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            if (data.server_response != "") {
                // $('#report_error').fadeOut();

                $.each(data.server_response, function (indexInArray, valueOfElement) {
                    $('#no_monthly_error').fadeOut();
                    renderReports(valueOfElement, 'Monthly Report','render_monthly_report')
                })
            } else {
                $('#report_error').fadeIn();
            }
        });
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchMarketReportsViaPropertyID.php?property_id=' + selected_prop_id
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            if (data.server_response != "") {
                // $('#report_error').fadeOut();

                $.each(data.server_response, function (indexInArray, valueOfElement) {
                    $('#no_market_error').fadeOut();
                    renderReports(valueOfElement, 'Market Report','render_market_report')
                })
            } else {
                $('#report_error').fadeIn();
            }
        });

        console.log(selected_prop_id)
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchMaterialWarrantyReportsViaPropertyID.php?property_id=' + selected_prop_id
        console.log(link)
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.server_response != "") {
                // $('#report_error').fadeOut();
                $.each(data.server_response, function (indexInArray, valueOfElement) {
                    $('#no_material_error').fadeOut();
                    renderReportsMaterialWarranty(valueOfElement, 'Material Warranty Report','render_material_report')
                })
            } else {
                $('#report_error').fadeIn();
            }
        });
    });



    $(document).on('click', "tbody tr", function () {
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        selected_property = $(this).attr("id");
        select_prop_element = $(this).attr('class');
        console.log(selected_property)
        property_type = $('li.active.TabTitle').children().text().toLowerCase();
        // console.log($(this).attr('class').split(' ')[0])
        cid = $(this).attr('class').split(' ')[0];
        console.log(cid);
        console.log(property_type)
        if(property_type == 'Owned'){
            cid = owned_list[cid].properties.client_id;
            // alert(cid);
        } else {
            cid = prop_list[cid].properties.client_id
        }
        // console.log(prop_list[cid].)
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
    $('#assign_property_btn').click(function (e) {
        if (selected_property != '') {
            if (selected_client != '') {
                property_type = $('li.active.TabTitle').children().text().toLowerCase();
                console.log(property_type)
                if (property_type == 'leased') {

                    lease_start_date = lease_prop[parseInt(selected_property)].properties.lease_start.split(' ')[0];
                    lease_end_date = lease_prop[parseInt(selected_property)].properties.lease_end.split(' ')[0];
                    console.log('lease start: ')
                    console.log(lease_start_date)
                    console.log('lease end : ')
                    console.log(lease_end_date)

                    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignLeasedProperty.php?property_id=' + selected_property + '&client_id=' + selected_client + '&lease_start_date=' + lease_start_date + '&lease_end_date=' + lease_end_date + '&uploaded_by=' + admin_id;
                    console.log(link);
                    $.get(link, function (data, textStatus, jqXHR) {
                        console.log(data);
                        if (data.server_response == 'Successfully Assigned Leased Property To Client.') {
                            setTimeout(function () { alert('sucess'); window.location.relod(); }, 2000);
                        }

                    });
                } else {
                    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignOwnedProperty.php?property_id=' + selected_property + '&client_id=' + selected_client + '&uploaded_by=' + admin_id;
                    console.log(link);
                    $.get(link, function (data, textStatus, jqXHR) {
                        console.log(data);
                        if (data.server_response == 'Successfully Assigned Owned Property To Client.') {
                            setTimeout(function () { alert('sucess'); window.location.relod(); }, 2000);
                        }

                    });
                }
                console.log()
            } else {
                alert('select client')
            }
        } else {
            alert('select property')
        }

    });

    $('#modify_prop_btn').click(function (e) {
        e.preventDefault();
        if (selected_property != "") {
            window.location.href = 'ModifyProperty.html?id=' + selected_property + '&type=' + property_type + '&cid=' + cid; 
        } else {
            // alert('please select property first');
            $('#modal_select_prop').modal();
            // $('#modal_select_client').modal('toggle');
        }

    });
    $('#delete_prop_btn').click(function (e) {
        e.preventDefault();
        if (selected_property != '') {
            // window.location.href = 'ModifyClient.html?id=' + selected_callout;
            property_type = $('li.active.TabTitle').children().text().toLowerCase();
            // alert(property_type)
            // console.log(select_prop_element.split(' ')[0]);
            // console.log(prop_list);
            // console.log(prop_list[select_prop_element.split(' ')[0]].properties.client_id)
            $('#modal_del_prop').modal();
        } else {
            $('#modal_select_prop').modal();
        }
    });
    $('#modal_delete_prop_btn').click(function (e) {
        e.preventDefault();
        $('#modal_footer_modal_del_prop').fadeOut();
        $('#modal_txt_modal_del_prop').fadeOut();
        $('#main_section_loader_modal_del_prop').fadeIn();
        var link = ''
        if(property_type == 'owned'){
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteOwnedProperty.php?property_id=' + selected_property +'&client_id=' + prop_list[select_prop_element.split(' ')[0]].properties.client_id;
        }else {
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteLeasedProperty.php?property_id=' + selected_property +'&client_id=' + prop_list[select_prop_element.split(' ')[0]].properties.client_id;
        }
        // link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteProperty.php?property_id=' + selected_property;
        console.log(link)
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);

            $('#modal_txt_modal_del_prop').text('The property has been deleted successfully.');
            $('#modal_txt_modal_del_prop').fadeIn();
            $('#main_section_loader_modal_del_prop').fadeOut();
            setTimeout(function () { window.location.reload(); }, 2500);

        });
    });




    function renderOwned(table_id,type, item, index) {
        var active = '';
        var htmlStr = '';
        htmlStr += '<tr class ="'+index+'" id=' + item.properties.property_id + '>'
        htmlStr += '<td>' + item.properties.property_id  + '</td>'
        htmlStr += '<td style="display:none">' + item.properties.client_id + '</td>'
        htmlStr += '<td>' + item.properties.full_name + '</td>'
        htmlStr += '<td style="display:none">' + item.properties.phone + '</td>'
        htmlStr += '<td style="display:none">' + item.properties.email + '</td>'

        htmlStr += '<td>' + item.properties.address  + '</td>'
        htmlStr += '<td>' + item.properties.type  + '</td>'
        htmlStr += '<td>'+type+'</td>'
        // if(Object.keys(item.properties).length == 12){
        //     htmlStr += '<td style="display:none">' + item.properties.lease_start + '</td>'
        //     htmlStr += '<td style="display:none">' + item.properties.lease_end + '</td>'
        // }
        htmlStr += '<td>' + item.properties.community + '</td>'
        htmlStr += '<td>' + item.properties.city  + '</td>'
        htmlStr += '<td>' + item.properties.country  + '</td>'
        htmlStr += '<td>' + item.properties.comments  + '</td>'
        if (item.properties.active == 1){
            active = 'Active';
        }else {
            active = 'Inactive';
        }
        htmlStr += '<td>' + active + '</td>'
        htmlStr += '<td>'
        htmlStr += '<div id='+index+' class="jobdetails">'
        htmlStr += '<button type="button" id="' + item.properties.property_id  + '" class="btn btn-pri btn-sm show_prop_detail_btn" data-toggle="modal"'
        htmlStr += 'data-target="#myModal"> Show Property '
        htmlStr += 'Details</button>'
        htmlStr += '</div>'
        htmlStr += '</td>'
        htmlStr += '</tr>'

        $('#' + table_id).append(htmlStr);
    }
    // ('render_owned_properties', item.properties.property_id, item.properties.full_name, item.properties.address, 'Owned', item.properties.city, item.properties.country, item.properties.type, item.properties.comments,item,index);

});
// active: "1"
// address: "Town House H72, District 12"
// city: "Dubai"
// client_id: "1"
// comments: null
// community: "JVC"
// country: "United Arab Emirates"
// email: "bkhawaja@etisalat.ae"
// full_name: "Bashir Khawaja"
// phone: "00971506319669"
// property_id: "1"
// type: null
active: "1"
address: "Town House H72, District 12"
city: "Dubai"
client_id: "2"
comments: null
community: "JVC"
country: "United Arab Emirates"
email: "danebowers@me.com"
full_name: "Dane Bowers"
lease_end: "2020-04-04 00:00:00"
lease_start: "2019-04-05 00:00:00"
phone: "00971555782787"
property_id: "1"
type: null