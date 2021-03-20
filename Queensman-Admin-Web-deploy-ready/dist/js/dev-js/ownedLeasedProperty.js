

$(document).ready(function () {

    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchOwnedProperties.php';
    var table1;
    var table2;
    var lease_prop = new Array();
    var owned_prop = new Array();
    var selected_property = '';
    var selected_client ='';
    var property_type;
    var client_prop_type = 'owned';
    var client_lease_start_date = '';
    var client_lease_end_date = '';
    $.get(link, function (data) {
        console.log(data);
        $.each(data.server_response, function (index, item) {
            owned_prop[item.properties.property_id] = item;
            renderWorkerList('render_owned_properties', item.properties.property_id, item.properties.full_name, item.properties.address, 'Owned', item.properties.city, item.properties.country);
        });
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchLeasedProperties.php';
        $.get(link, function (data) {
            console.log(data);
            $.each(data.server_response, function (index, item) {
                lease_prop[item.properties.id] = item;
                renderWorkerList('render_leased_properties', item.properties.id, item.properties.full_name, item.properties.address, 'Leased', item.properties.city, item.properties.country);
            });
            $.extend($.fn.dataTable.defaults, {
                searching: false,
                ordering: false,
                // info:false,

            });
            table1 = $('#owned_Table').dataTable();
            table2 = $('#leased_table').dataTable();
            $('#dislay_main_section').fadeIn('fast');
            $('#main_section_loader').fadeOut('fast');
            console.log(lease_prop[108])
            // fade out loader here
        })

    });
    $(document).on('input', '#search_property', function () {
        search_query = $(this).val();
        table1.fnFilter(search_query)
        $('#property_table_filter').css('display', 'none');
    });


    function renderWorkerList(table_id, id, name, address, type, city, country) {

        var htmlStr = '';
        htmlStr += '<tr id='+id+'>'
        htmlStr += '<td>' + id + '</td>'
        htmlStr += '<td>' + name + '</td>'
        htmlStr += '<td>' + address + '</td>'
        htmlStr += '<td>' + type + '</td>'
        htmlStr += '<td>' + city + '</td>'
        htmlStr += '<td>' + country + '</td>'
        htmlStr += '</tr>'
       
        $('#' + table_id).append(htmlStr);
    }
    $(document).on('click', "tbody tr", function () {
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        selected_property = $(this).attr("id");
        console.log(selected_property)
        // console.log(jobs_list[selected_callout])
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
    $('#assign_property_btn').click(function (e) { 
        if (selected_property != ''){
            if(selected_client != ''){
                if(client_prop_type == 'leased'){
                    client_lease_start_date = $('#inputLEASESTART').val();
                    client_lease_end_date = $('#inputLEASEEND').val();
                    if(client_lease_end_date != "" && client_lease_start_date != ''){
                        property_type = $('li.active.TabTitle').children().text().toLowerCase();
                        if(property_type == 'owned'){
                            // alert('ds')
                            console.log(lease_prop[parseInt(selected_property)])
                            try {
                                if(lease_prop[parseInt(selected_property)].properties.id != null){
                                    // alert('property already leased')
                                    $('#modal_leased_already_assigned').modal();
                                } 
                            } catch (error) {
                                // alert('yay')
                                $('#modal_assign_prop').modal();
                            }
                            // if(lease_prop[parseInt(selected_property)].properties.id != null){
                            //     alert('property already leased')
                            // }
                        }else {
                            $('#modal_leased_already_assigned').modal();
                        }
                        console.log(property_type)
                        // $('#modal_assign_prop').modal();
                    }else {
                        $('#modal_assign_lease_date').modal();
                    }

                }else {
                    property_type = $('li.active.TabTitle').children().text().toLowerCase();
                    try {
                        if(owned_prop[parseInt(selected_property)].properties.property_id != null){
                            // alert('property already leased')
                            $('#modal_owned_already_assigned').modal();
                        } 
                    } catch (error) {
                        // alert('yay')
                        $('#modal_assign_prop').modal();
                    }
                    // if(property_type == 'owned'){
                    //     console.log(owned_prop)
                    //     console.log(owned_prop[parseInt(selected_property)])
                    //     try {
                    //         if(owned_prop[parseInt(selected_property)].properties.property_id != null){
                    //             // alert('property already leased')
                    //             $('#modal_owned_already_assigned').modal();
                    //         } 
                    //     } catch (error) {
                    //         // alert('yay')
                    //         $('#modal_assign_prop').modal();
                    //     }
                    // }else {
                    //     try {
                    //         if(owned_prop[parseInt(selected_property)].properties.property_id != null){
                    //             // alert('property already leased')
                    //             $('#modal_owned_already_assigned').modal();
                    //         } 
                    //     } catch (error) {
                    //         // alert('yay')
                    //         $('#modal_assign_prop').modal();
                    //     } 
                    // }
                    // console.log(property_type)
                    // $('#modal_assign_prop').modal();
                }
                
                
            }else {
                // alert('select client');
                $('#modal_select_client').modal();
            }
        }else {
            // alert('select property')
            $('#modal_select_property').modal();
        }
        
    });
    $('#assign_ownerr_again').click(function (e) { 
        e.preventDefault();
        $('#modal_owned_already_assigned').modal('hide');
        $('#modal_assign_prop').modal();
        // $('#modal_save_btn').text();
        
    });

    $('#modal_save_btn').click(function (e) {
        $('#modal_header_modal_assign_prop').fadeOut();
        $('#modal_footer_modal_assign_prop').fadeOut();
        $('#modal_txt_modal_assign_prop').fadeOut();
        $('#main_section_loader_modal_assign_prop').fadeIn();
        e.preventDefault();
        if (property_type == 'leased') {

            lease_start_date =lease_prop[parseInt(selected_property)].properties.lease_start.split(' ')[0];
            lease_end_date = lease_prop[parseInt(selected_property)].properties.lease_end.split(' ')[0];
            console.log('lease start: ')
            console.log(lease_start_date )
            console.log('lease end : ')
            console.log( lease_end_date)

            // link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignLeasedProperty.php?property_id=' + selected_property + '&client_id=' + selected_client + '&lease_start_date=' + lease_start_date + '&lease_end_date=' + lease_end_date + '&uploaded_by=' + admin_id;
            // console.log(link);
            // $.get(link, function (data, textStatus, jqXHR) {
            //     console.log(data);
            //     if(data.server_response == 'Successfully Assigned Leased Property To Client.'){
                    if(client_prop_type == 'leased'){
                        // alert('in leased leased ')
                        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/AssignLeasedPropertyToClient.php?property_id=' + selected_property + '&client_id=' + selected_client + '&lease_start=' + client_lease_start_date + '&lease_end=' + client_lease_end_date  + '&uploaded_by=' + admin_id;
                        $.get(link,function (data, textStatus, jqXHR) {
                            console.log(data.server_response);
                            setTimeout(function () {
                                $('#modal_txt_modal_assign_prop').text('Successfully Assigned Owned Property To Client.');
                                $('#modal_txt_modal_assign_prop').fadeIn();
                                $('#main_section_loader_modal_assign_prop').fadeOut();
                                window.location.reload();
                            }, 3000);  
                        });
                    }else {
                        // alert('in leased owned')
                        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/AssignOwnedPropertyToClient.php?property_id=' + selected_property + '&client_id=' + selected_client + '&uploaded_by=' + admin_id; 
                        $.get(link,function (data, textStatus, jqXHR) {
                            console.log(data.server_response);
                            setTimeout(function () {
                                $('#modal_txt_modal_assign_prop').text('Successfully Assigned Owned Property To Client.');
                                $('#modal_txt_modal_assign_prop').fadeIn();
                                $('#main_section_loader_modal_assign_prop').fadeOut();
                                window.location.reload();
                            }, 3000); 
                        });

                    }
                    // setTimeout(function () {
                    //     $('#modal_txt_modal_assign_prop').text('Successfully Assigned Leased Property To Client.');
                    //     $('#modal_txt_modal_assign_prop').fadeIn();
                    //     $('#main_section_loader_modal_assign_prop').fadeOut(); 
                    //     window.location.reload();
                    // }, 2500);
            //     }

            // });
        } else {
            // link = 'https://www.queensman.com/phase_2/queens_admin_Apis/assignOwnedProperty.php?property_id=' + selected_property + '&client_id=' + selected_client + '&uploaded_by=' + admin_id;
            // console.log(link);
            // $.get(link, function (data, textStatus, jqXHR) {
            //     console.log(data);
            //     if(data.server_response == 'Successfully Assigned Owned Property To Client.'){
                    if(client_prop_type == 'leased'){
                        // alert('in owned leased')
                        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/AssignLeasedPropertyToClient.php?property_id=' + selected_property + '&client_id=' + selected_client + '&lease_start=' + client_lease_start_date + '&lease_end=' + client_lease_end_date  + '&uploaded_by=' + admin_id;
                        $.get(link,function (data, textStatus, jqXHR) {
                            console.log(data.server_response);
                            setTimeout(function () {
                                $('#modal_txt_modal_assign_prop').text('Successfully Assigned Owned Property To Client.');
                                $('#modal_txt_modal_assign_prop').fadeIn();
                                $('#main_section_loader_modal_assign_prop').fadeOut();
                                window.location.reload();
                            }, 3000);  
                        });
                    }else {
                        // alert('in owned owned')
                        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/AssignOwnedPropertyToClient.php?property_id=' + selected_property + '&client_id=' + selected_client  + '&uploaded_by=' + admin_id;
                        $.get(link,function (data, textStatus, jqXHR) {
                            console.log(data.server_response);
                            setTimeout(function () {
                                $('#modal_txt_modal_assign_prop').text('Successfully Assigned Owned Property To Client.');
                                $('#modal_txt_modal_assign_prop').fadeIn();
                                $('#main_section_loader_modal_assign_prop').fadeOut();
                                window.location.reload();
                            }, 3000);  
                        });

                    }
                    // setTimeout(function () {
                    //     $('#modal_txt_modal_assign_prop').text('Successfully Assigned Owned Property To Client.');
                    //     $('#modal_txt_modal_assign_prop').fadeIn();
                    //     $('#main_section_loader_modal_assign_prop').fadeOut();
                    //     window.location.reload();
                    // }, 3000);
            //     }

            // });
        }
    });

    $('input[type=radio][name=prop_type]').change(function() {
        if (this.value == 'leased') {
            // alert("leased selected");
            client_prop_type = 'leased';
            $('#lease_details_div').fadeIn();
        }
        else  {
            // alert("owned selected");
            client_prop_type = 'owned';
            $('#lease_details_div').fadeOut();

        }
        // console.log($('li.active.TabTitle').children().text().toLowerCase())
    });

});