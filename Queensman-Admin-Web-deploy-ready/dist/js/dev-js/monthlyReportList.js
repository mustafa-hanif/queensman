
$(document).ready(function () {
  
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

    var client_detail = null;
    var selected_client = '';
    var selected_property = '';
    $(document).on('change','#select_client',function(){
        $('#select_property').val('')
        $('#properties').html('')
        selected_client = $(this).val();
        client_detail = client_list.filter(val=>{
            return val.clients.id === $(this).val()
        })
        console.log(client_detail)
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
                });    

                var htmlStr = '';
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
        if(selected_property!=''&& selected_client!=''){
            $('#view-report').attr('disabled',false);
            $('#add-inventory').attr('disabled',false);
        }
    })

    let month,year;
    $('#view-report').submit(function(e){
        
        let list = new Array()
        let client = new Array()
        let callout_ids = new Array()
        let temp = new Array()
        e.preventDefault()
        selected_date = $('#select_date').val()
        console.log(selected_date)
        var date = new Date(selected_date)
        month = date.getMonth()+1
        year = date.getFullYear()
        console.log(selected_client,selected_property,selected_date,month,year)
        // link = 'https://www.queensman.com/phase_2/queens_admin_Apis/generateMonthlyServicesReportData.php?property_id=1&month=10&year=2019'
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/generateMonthlyServicesReportData.php?property_id='+selected_property+'&month='+month+'&year='+year
        $.get(link, function(data){
            console.log(data)
            $('#content').empty()
            if(data.server_response.length>0){
                $.each(data.server_response, function(index,item){
                    let packet = { id : item.monthly_services.client_id, name : item.monthly_services.client_name, email: item.monthly_services.client_email, address : item.monthly_services.address, city: item.monthly_services.city, country: item.monthly_services.country, property_id: item.monthly_services.property_id, community: item.monthly_services.community}
                    client.push(packet)
                    list.push(item.monthly_services)    
                    callout_ids.push(item.monthly_services.callout_id)
                })
                client = client.filter((client, index, self) =>
                    index === self.findIndex((t) => (
                        t.name === client.name
                    ))
                )
                client_prop_list = client_prop_list.filter(val=>{
                    return val.property_id === selected_property
                })
                clientDetails(client_detail[0],client_prop_list[0])
                // propertyDetails(client_prop_list[0])
                callout_ids = callout_ids.filter(function(item,index){
                    return callout_ids.indexOf(item) === index
                })
                callout_ids.sort((a,b)=>a-b)            
                $.each(callout_ids, function(index,item){
                    let backup = list.sort((a,b)=>a.callout_id-b.callout_id)
                    let res = backup.filter(val=>{
                        return val.callout_id === item
                    }) 
                    let request_time = new Array()
                    let resolved_time = new Array()
                    let description = new Array()
                
                    let category = new Array()
                    let job_type = new Array()
                    let feedback = new Array()
                    let history = new Array()
                    let urgency_level = new Array()
                    
                    $.each(res,function(index,item){
                        request_time.push(item.request_time)
                        resolved_time.push(item.resolved_time)
                        description.push(item.description)
                        category.push(item.category)
                        job_type.push(item.job_type)
                        feedback.push(item.feedback)
                        urgency_level.push(item.urgency_level)
                        let packet = { 
                            status_update: item.status_update,
                            update_time: item.update_time,
                            updated_by: item.updated_by,
                        }
                        history.push(packet)
                    })
                   
                    category = category.filter(function(item,index){
                        return category.indexOf(item) === index
                    })
                    job_type = job_type.filter(function(item,index){
                        return job_type.indexOf(item) === index
                    })
                    urgency_level = urgency_level.filter(function(item,index){
                        return urgency_level.indexOf(item) === index
                    })
                    request_time = request_time.filter(function(item,index){
                        return request_time.indexOf(item) === index
                    })
                    resolved_time = resolved_time.filter(function(item,index){
                        return resolved_time.indexOf(item) === index
                    })
                    description = description.filter(function(item,index){
                        return description.indexOf(item) === index
                    })
    
                    feedback = feedback.filter(function(item,index){
                        return feedback.indexOf(item) === index
                    })
                    temp.push({
                        id: res[0].callout_id,request_time: request_time, resolved_time: resolved_time, description:description,
                        category: category,job_type: job_type,feedback: feedback,urgency_level: urgency_level, job_history: history
                    })
                })
                console.log('=>',temp)
                
                $.each(temp, function(index,item){
                    console.log(item)
                    renderContent(index,item,'#content')
                })

                $.each(temp, function(index,item){
                    console.log(item)
                    renderData(index,item,'#render_owned_properties')
                })
                $('button').attr('disabled',false)
                // $.extend($.fn.dataTable.defaults, {
                //     searching: false,
                //     ordering: false,
                //     // info:false,   
                // });
                // table1 = $('#owned_Table').dataTable({
                //     dom: 'Bfrtip',
                //     buttons:  [
                //         'excel'
                //     ]
                // });
            
            }
            else{
                $('#content').html('<center><p>No Content</p></center>')
            }
            $('.content').show()
        })
        
    })
    function clientDetails(item,data){
        let htmlStr = '';
        var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        htmlStr += '<center><h3 class="details3" >MONTHLY SERVICES REPORT</h3></center>'
        htmlStr += '<div class="col-lg-6" style="margin-top:2%;" ><p class="details3"style="float:right;">Month : '+months[month-1]+'</p></div>'
        htmlStr += '<div class="col-lg-6" style="margin-top:2%;"><p class="details3" style="float:left;">Year : '+year+'</p></div>'
        // htmlStr += '<p>Client Id: '+item.id+'</p>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Client Name : '+item.clients.full_name+'</p></div>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Client Phone : '+item.clients.phone+'</p></div>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Client Email : '+item.clients.email+'</p></div>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Property ID : '+data.property_id+'</p></div>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Property Address : '+data.address+'</p></div>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Property Location : '+ data.city+', '+data.country+'</p></div>'
        $('#content').append(htmlStr)
    }
    function propertyDetails(item){
        let htmlStr = '';
        htmlStr += '<div class="col-lg-4"><p class="details3">Property ID : '+item.property_id+'</p></div>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Property Address : '+item.address+'</p></div>'
        htmlStr += '<div class="col-lg-4"><p class="details3">Property Location : '+ item.city+', '+item.country+'</p></div>'
        $('#content').append(htmlStr)
    }
    function renderData(index,item,tableID){
        let htmlStr = ''
        
        htmlStr += '<tr>'
        htmlStr += '<td>'+item.id+'</td>'

        htmlStr += '<td><ul>'
        $.each(item.category,function(index,item){
            htmlStr += '<li>'+item+'</li>'
        })        
        htmlStr += '</ul></td>'
        
        htmlStr += '<td><ul>'
        $.each(item.job_type,function(index,item){
            htmlStr += '<li>'+item+'</li>'
        })        
        htmlStr += '</ul></td>'

        htmlStr += '<td><ul>'
        $.each(item.urgency_level,function(index,item){
            htmlStr += '<li>'+item+'</li>'
        })        
        htmlStr += '</ul></td>'
        
        htmlStr += '<td><ul>'
        $.each(item.request_time,function(index,item){
            htmlStr += '<li>'+item+'</li>'
        })        
        htmlStr += '</ul></td>'
                
        htmlStr += '<td><ul>'
        $.each(item.resolved_time,function(index,item){
            htmlStr += '<li>'+item+'</li>'
        })        
        htmlStr += '</ul></td>'
                
                
        htmlStr += '<td><ul>'
        $.each(item.feedback,function(index,item){
            htmlStr += '<li>'+item+'</li>'
        })        
        htmlStr += '</ul></td>'

        htmlStr += '<td><ul>'
        $.each(item.description,function(index,item){
            htmlStr += '<li>'+item+'</li>'
        })        
        htmlStr += '</ul></td>'

        
        // htmlStr += '<th>Job History</th>'

        htmlStr += '<td><ol>'
        $.each(item.job_history,function(index,item){
            htmlStr += '<li>'+item.status_update+'</li>'
        })        
        htmlStr += '</ol></td>'
        htmlStr += '<td><ol>'
        $.each(item.job_history,function(index,item){
            htmlStr += '<li>'+item.update_time+'</li>'
        })        
        htmlStr += '</ol></td>'
        htmlStr += '<td><ol>'
        $.each(item.job_history,function(index,item){
            htmlStr += '<li>'+item.updated_by+'</li>'
        })        
        htmlStr += '</ol></td>'
        htmlStr += '</tr>'
        // htmlStr += '<td>'+item.status_update+'</td>'
        // htmlStr += '<td>'+item.update_time+'</td>'
        // htmlStr += '<td>'+item.updated_by+'</td>'
    
        $(tableID).append(htmlStr);
    }

    function renderContent(index,item,tableID){
        let htmlStr = ''

        htmlStr += '<div class="form-group">'
        htmlStr += '<div class="col-md-12">'
        htmlStr += '<center><h4 class="details3" >SERVICE DETAILS</h4></center>'
        htmlStr += '<center><h4 class="details3">Service Id : '+item.id+'</h4></center>'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div class="form-group">'
        $.each(item.category,function(index,item){
            htmlStr += '<div class="col-md-4">'
            htmlStr += '<p class="details3">Category : '+item+'</p>'
            htmlStr += '</div>'    
        })
        $.each(item.job_type,function(index,item){
            htmlStr += '<div class="col-md-4">'
            htmlStr += '<p class="details3">Job Type : '+item+'</p>'
            htmlStr += '</div>'    
        })
        
        $.each(item.urgency_level,function(index,item){
            htmlStr += '<div class="col-md-4">'
            htmlStr += '<p class="details3">Urgency Level : '+item+'</p>'
            htmlStr += '</div>'    
        })

        htmlStr += '<div class="col-md-4">'
        htmlStr += '<p class="details3">Request Time : <ul>'
        if(item.request_time.length>0){
            $.each(item.request_time,function(index,item){
                if(item==="")
                    htmlStr += '<li>N/A</li>'
                else
                    htmlStr += '<li>'+item+'</li>'
            })    
        }
        else{
            htmlStr += '<li>N/A</li>'
        }
        htmlStr += '</ul></p></div>'    
        
        htmlStr += '<div class="col-md-4">'
        htmlStr += '<p class="details3">Resolved Time : <ul>'
        if(item.resolved_time.length>0){
            $.each(item.resolved_time,function(index,item){
                if(item==="")
                    htmlStr += '<li>N/A</li>'
                else
                    htmlStr += '<li>'+item+'</li>'
            })
        }
        else{
            htmlStr += '<li>N/A</li>'
        }
        htmlStr += '</ul></p></div>'    
        

        htmlStr += '<div class="col-md-4">'
        htmlStr += '<p class="details3">Client Feedback : <ul>'
        if(item.feedback.length>0){
    
            $.each(item.feedback,function(index,item){
                if(item==="")
                    htmlStr += '<li>N/A</li>'
                else
                    htmlStr += '<li>'+item+'</li>'
            })
        }
        else{
            htmlStr += '<li>N/A</li>'
        }
        htmlStr += '</ul></p></div>'    

        htmlStr += '<div class="col-md-4">'
        htmlStr += '<p class="details3">Description : <ul>'
        if(item.description.length>0){
            $.each(item.description,function(index,item){
                if(item==="")
                    htmlStr += '<li>N/A</li>'
                else
                    htmlStr += '<li>'+item+'</li>'
            })
        }
        else{
            htmlStr += '<li>N/A</li>'
        }

        htmlStr += '</ul></p></div>'    
        

        htmlStr += '<div class="col-md-8">'
        htmlStr += '<p class="details3">Job History : </p>'
        htmlStr += '<table class="table table-bordered">'
        htmlStr += '<thead>'
        htmlStr += '<tr>'
        htmlStr += '<th  style="color: black">#</th>'
        htmlStr += '<th  style="color: black">STATUS UPDATE</th>'
        htmlStr += '<th  style="color: black">TIME OF UPDATE</th>'
        htmlStr += '<th style="color: black">UPDATED BY</th>'
        htmlStr += '</tr>'
        htmlStr += '</thead><tbody>'
        $.each(item.job_history,function(index,item){
            console.log(item.status_update)
            htmlStr += '<tr>'
            htmlStr += '<td>'+(index+1)+'</td>'
            htmlStr += '<td>'+item.status_update+'</td>'
            htmlStr += '<td>'+item.update_time+'</td>'
            htmlStr += '<td>'+item.updated_by+'</td>'
            htmlStr += '</tr>'
        })
        htmlStr += '</tbody></div>'    
        $(tableID).append(htmlStr);    
    }


    function downloadInnerHtml(filename, elId) {
        var elHtml = document.getElementById(elId).innerHTML;
        var link = document.createElement('a');
        link.setAttribute('download', filename);   
        link.setAttribute('href', 'data:' + 'text/doc' + ';charset=utf-8,' + encodeURIComponent(elHtml));
        link.click(); 
        window.open(link)
    }
    $('#cmd').click(function () {
        kendo.drawing
            .drawDOM("#content", 
            { 
                paperSize: "A4",
                margin: { top: "1cm", bottom: "1cm" ,},
                scale: 0.8,
                height: 500
            })
                .then(function(group){
                kendo.drawing.pdf.saveAs(group, 'Monthly_Report_'+selected_property+'.pdf')
            });
    });

    $('#excel').click(function () {
            var downloadurl;
            var dataFileType = 'application/vnd.ms-excel';
            var tableSelect = document.getElementById('owned_Table');
            var tableHTMLData = tableSelect.outerHTML.replace(/ /g, '%20');
            
            // Specify file name
            filename = 'Monthly_Report_'+selected_property+'.xlsx';
            
            // Create download link element
            downloadurl = document.createElement("a");
            
            document.body.appendChild(downloadurl);
            
            if(navigator.msSaveOrOpenBlob){
                var blob = new Blob(['\ufeff', tableHTMLData], {
                    type: dataFileType
                });
                navigator.msSaveOrOpenBlob( blob, filename);
            }else{
                // Create a link to the file
                downloadurl.href = 'data:' + dataFileType + ', ' + tableHTMLData;
            
                // Setting the file name
                downloadurl.download = filename;
                
                //triggering the function
                downloadurl.click();
            }
        
        
    });
});


{/* <div class="col-md-4">
<p class="details3">JOB TYPE : Plumbering</p>
</div>
<div class="col-md-4">
<p class="details3">URGENCY LEVEL: Normal</p>
</div>
</div>
<div class="form-group row">
<div class="col-md-4">
<p class="details3">JOB REQUEST TIME : 12:30 AM</p>
</div>
<div class="col-md-4">
<p class="details3">JOB RESOLVED TIME: 5:00 PM</p>
</div>
</div>
<div class="form-group row" >
<div class="col-md-4">
<p class="details3">CLIENT FEEDBACK</p>
<div>
<p class="details3" >Lorem ipsum dolor sit amet,</p>
</div>
</div>
<div class="col-md-4">
<p class="details3">DESCRIPTION</p>
<div>
<p class="details3">Lorem ipsum dolor sit amet,.</p>
</div>
</div>
<div class="col-md-4" style="margin-top: -5%;">
<p class="details3">JOB HISTORY</p>
<table class="table table-bordered table-hover">
<thead>

<tr>
<th style="color: black">#</th>
<th style="color: black">STATUS UPDATE</th>
<th style="color: black">TIME OF UPDATE</th>
<th style="color: black">UPDATED BY</th>
</tr>

</thead>
<tbody>
<tr>
<td>1</td>
<td>Done</td>
<td>02:00 AM</td>
<td>Ahmed</td>
</tr>
<tr>
<td>1</td>
<td>Done</td>
<td>02:00 AM</td>
<td>Ahmed</td>
</tr>
<tr>
<td>1</td>
<td>Done</td>
<td>02:00 AM</td>
<td>Ahmed</td>
</tr>
</tbody>
</table>
</div>
</div> */}
