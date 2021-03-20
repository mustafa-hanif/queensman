$(document).ready(()=>{

    $(document).on('click','#add-inventory',function(){
        window.location.href ="InventoryReport.html" 
    })

    $('#no-content').show();
    var client_list = new Array();
    var client_prop_list = new Array();
    var client_reports = new Array();
    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClients.php';
    $.get(link, function (data) {
        console.log(data)
        $.each(data.server_response, function (index, item) {
            client_list.push(item);
            var htmlStr = '';
            htmlStr += '<option value='+item.clients.id+'>'+item.clients.full_name+'</option>'
            $('#clients').append(htmlStr)
        });
        $('#main_section_loader').fadeOut();
        $('.main_section_div').fadeIn();
    }).fail((error) => {
        console.log(error);
    });


    var selected_client = '';
    var selected_property = '';
    $(document).on('change','#select_client',function(){
        $('#select_property').val('')
        $('#properties').html('')
        selected_client = $(this).val();
        console.log(selected_client)
        localStorage.setItem('selected_client',selected_client)
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientLeasedPropertiesViaClientID.php?ID='+selected_client
        $.get(link, function (data) {
            console.log(data)
            if(data.server_response !== -1){
                $.each(data.server_response, function (index, item) {
                    client_prop_list.push(item.leased_properties);
                    var htmlStr = '';
                    htmlStr += '<option value='+item.leased_properties.property_id+'>'+item.leased_properties.address+'</option>'
                    $('#properties').append(htmlStr)
                });
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientOwnedPropertiesViaClientID.php?ID='+selected_client
                $.get(link, function (data) {
                    console.log(data)
                    $.each(data.server_response, function (index, item) {
                        client_prop_list.push(item.owned_properties);
                        var htmlStr = '';
                        htmlStr += '<option value='+item.owned_properties.property_id+'>'+item.owned_properties.address+'</option>'
                        $('#properties').append(htmlStr)
                    });
                }).fail((error) => {
                    console.log(error);
                });    
            }
            else{

                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientOwnedPropertiesViaClientID.php?ID='+selected_client
                $.get(link, function (data) {
                    console.log(data)
                    if(data.server_response!== -1){
                        $.each(data.server_response, function (index, item) {
                            client_prop_list.push(item.owned_properties);
                            var htmlStr = '';
                            htmlStr += '<option value='+item.owned_properties.property_id+'>'+item.owned_properties.address+'</option>'
                            $('#properties').append(htmlStr)
                        });
                    }
                    else{
                        $('#select_property').val('No Properties')
            
                    }
                }).fail((error) => {
                    console.log(error);
                });                    var htmlStr = '';

            }
        }).fail((error) => {
            console.log(error);
        });
        if(selected_property!=''&& selected_client!=''){
            $('#view-report').attr('disabled',false);
            $('#add-inventory').attr('disabled',false);
        }
    })
    $(document).on('change','#select_property',function(){
        selected_property = $(this).val();
        console.log(selected_property)
        localStorage.setItem('selected_property',selected_property)
        if(selected_property!=''&& selected_client!=''){
            $('#view-report').attr('disabled',false);
            $('#add-inventory').attr('disabled',false);
            fetchInventoryReportsViaPropertyID(selected_property) 
        }
    })

    $(document).on('click','.status-toggle',function(){
        id = $(this).attr('id');
        val = $(this).attr('value');
        console.log(id)
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryReportInspectionApproved.php?inventory_report_id='+id+'&approved='+val
        $.get(link, function (data) {
            console.log(data)
            if(data.server_response=="Successfully updated approved for this inventory_report."){
                setTimeout(()=>{
                    window.location.reload()
                },200)
            }
        })
        .fail((error) => {
            console.log(error);
        });
    })

    function fetchInventoryReportsViaPropertyID(selected_property){
        $('#main_section_loader1').fadeOut()
        $('#render_table').fadeIn()
        
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryReportsViaPropertyID.php?property_id='+selected_property
        $.get(link, function (data) {
            console.log(data)
            // if(data.server_response.length>0){
                // $('#no-content').hide();
                $('#owned_Table').DataTable().clear();
                $('#owned_Table').DataTable().destroy();
                $.each(data.server_response, function(index,item){
                    client_reports.push(item)
                    renderTable(item,index)
                })
                // $('#main_section_loader1').fadeIn()
                // $('#render_table').fadeOut()
        
                $.extend($.fn.dataTable.defaults, {
                    searching: false,
                    ordering: false,
                    // info:false,   
                });
                table1 = $('#owned_Table').dataTable({});                        
            // }
            // else{
            //     console.log('else')
            //     $('#no-content').show();
            // }
        }).fail((error) => {
            console.log(error);
        });
    }

    function renderTable(item,index){
        var htmlStr = '';
        var ar = [item.reports.checked_on,item.reports.ops_team_id]
        htmlStr += '<tr>'
        htmlStr += '<td>'+item.reports.id+'</td>'
        htmlStr += '<td>'+item.reports.checked_on+'</td>'
        htmlStr += '<td>'+item.reports.ops_team_id+'</td>'
        if(item.reports.approved=='0'){
            htmlStr += '<td>Unapprove</td>'
        }
        else{
            htmlStr += '<td>Approved</td>'
        }
        htmlStr += '<td>'+item.reports.inspection_done_by+'</td>'
        htmlStr += '<td><button id='+item.reports.property_id+' value="'+index+'" type="'+item.reports.ops_team_id+'" class="btn btn-primary btn-sm edit-report">Edit</button></td>'
        htmlStr += '<td><button id='+item.reports.id+' value="'+item.reports.checked_on+'" type="'+item.reports.ops_team_id+'" class="btn btn-primary btn-sm view-report">View</button></td>'
        if(item.reports.approved=='0'){
            htmlStr += '<td><button id="'+item.reports.id+'" value="1" type="button" class="btn btn-primary btn-sm status-toggle">Approve</button></td>'
        }
        else{
            htmlStr += '<td><button id="'+item.reports.id+'" value="0" type="button" class="btn btn-primary btn-sm status-toggle">Unapproved</button></td>'
        }
        htmlStr += '<td><button type="button" class="btn btn-primary btn-sm">EMAIL TO CLIENT</button></td>'
        htmlStr += '</tr>'
        $('#render_table').append(htmlStr)
    }

    $(document).on('click','.view-report',function(){
        console.log($(this).attr('value'))
        selected_id = $(this).attr('id')
        console.log(selected_id)
        console.log(client_prop_list)
        let result = client_prop_list.filter(function(val){
            return val.property_id===selected_property || val.property_id===selected_property
        }) 
        console.log(result)
        localStorage.setItem('report_id',selected_id)
        localStorage.setItem('date',$(this).attr('value'))
        localStorage.setItem('address',result[0].address || result[0].address)
        localStorage.setItem('team',$(this).attr('type'))
        localStorage.setItem('property_id',selected_property)
        window.location.href = 'ViewReport.html';
    })
    $(document).on('click','.edit-report',function(){
        console.log($(this).attr('id'));
        let id = $(this).attr('id')
        localStorage.setItem('property_id',$(this).attr('id'))
        localStorage.setItem('info_id',$(this).attr('value'))
        window.location.href = 'EditReport.html';
    })
})
