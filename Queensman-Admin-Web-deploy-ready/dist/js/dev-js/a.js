$(document).ready(()=>{

    var selected_client = localStorage.getItem('selected_client')
    var selected_property = localStorage.getItem('selected_property')
    var selected_team = '';
    var selected_inspector = '';
    var selected_date = '';
    var summary = '';
    var room_count = 1;
    var article_descrption = '';
    var article_inspection = '';
    var article_work_description = '';
    var article_remarks = '';
    var article_type = '';

    var room_name = '';
    var room_names = new Array();
    var article_types = new Array();
    var article_descrptions = new Array();
    var articles = new Array();
    var article_type_id = 0;

    $('#client').val(selected_client)
    $('#property').val(selected_property)

    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchWorkers.php'
    $.get(link, function (data) {
        $.each(data.server_response, function (index, item) {
            var htmlStr = '';
            htmlStr += '<option value='+item.workers.id+'></option>'
            $('#ops-team').append(htmlStr)
        });
        $('#main_section_loader').fadeOut();
        $('.main_section_div').fadeIn();
    }).fail((error) => {
        console.log(error);
    });

    //  General Info
    $(document).on('change','#inspector-name',function(){
        selected_inspector = $(this).val();
    })
    $(document).on('change','#inspection-date',function(){
        selected_date = $(this).val();
    })
    $(document).on('change','#selected_team',function(){
        selected_team = $(this).val();
    })
    $(document).on('click','#summary',function(){
        summary = $(this).val();
        console.log(summary)
    })
    var report_id = '';
    $(document).on('click','#save-info',function(){   
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryReport.php?property_id='+selected_property+'&ops_team_id='+selected_team+'&inspection_done_by='+selected_inspector+'&summary='+summary+'&checked_on='+selected_date;
        $.get(link, function (data) {
            console.log(data)
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryReportsViaPropertyID.php?property_id='+selected_property   
            $.get(link, function (data) {
                console.log(data)
                reporty_id = 1
            }).fail((error) => {
                console.log(error);
            }); 
        }).fail((error) => {
            console.log(error);
        });    
    })

    var global_count=0;
    var new_area_count=1;
    var new_article_count=1;
    var article_count = 0;
    var room_id ='';
    
    //  Room Area
    $(document).on('change','#room-name',function(){
        room_names.push($(this).val())        
        room_name = $(this).val()
    })    
    $('#add-new-room').submit(function(e){
        e.preventDefault()
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryArticle.php?inventory_room_id='+report_id+'&room='+room_name;
        $.get(link, function (data) {
            console.log(data)
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryArticlesViaInventoryReportID.php?report_id='+report_id;
            $.get(link, function (data) {
                console.log(data)
                report_id = 1;
            }).fail((error) => {
                console.log(error);
            }); 
            }).fail((error) => {
            console.log(error);
        }); 
        global_count += 1;
        article_count +=1;
        addNewRoom(global_count,article_count)
    })

    // Article Area
    $(document).on('change','.article-type',function(){
        console.log($(this).attr('id'))
        article_types.push($(this).val())   
        article_type =  $(this).val()   
        console.log(article_type) 
        $('.save-article').attr('value',article_type)
        $('.add-new-area').attr('disabled',false)
    })
    $(document).on('change','#article-description',function(){
        article_descrption = $(this).val()        
    })
    $(document).on('change','#article-inspection',function(){
        article_inspection = $(this).val()        
    })
    $(document).on('change','#article-work-description',function(){
        article_work_description = $(this).val()        
    })
    $(document).on('change','#article-remarks',function(){
        article_remarks = $(this).val()        
    })


    $(document).on('click','.add-new-area',function(){
        console.log($(this).attr('id'))
        addNewArea(new_area_count,$(this).attr('id'))
    })

    $(document).on('click','.save-article',function(){

        console.log($(this).attr('value'))
        // link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryArticle.php?inventory_room_id='+room_id+'&type='+article_type+'&description='+article_descrption+'&inspection='+article_inspection+'&work_description='+article_work_description+'&remarks='+article_remarks;
        // $.get(link, function (data) {
        //     console.log(data)
        // }).fail((error) => {
        //     console.log(error);
        // }); 
        // $('.save-article')
    })
    $(document).on('click','#add-new-article',function(){
        
        console.log($(this))
        // article_count += 1;
        // new_article_count += 1;
        // addNewArticle(new_article_count)
    })
    
    function addNewArticle(index,id){

        var htmlStr = '';
        htmlStr += '<div class="row" style="marign-top:2%">'
        htmlStr += '<div class="col-xs-12">'
        htmlStr += '<div class="box">'
        htmlStr += '<div class="box-header">'
        htmlStr += '<h3 class="box-title">ARTICLE TYPE</h3>'
        htmlStr += '<input type="text" class="form-control article-type" id="'+index+'" placeholder="Enter article type here" list="types">'
        htmlStr += '<datalist id="types">'
        htmlStr += '<option value="ELECTRICAL Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="AC (HVAC) Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="General Services"></option>'
        htmlStr += '</datalist>'
        htmlStr += '<div class="box-tools">'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div class="box-body table-responsive no-padding">'
        htmlStr += '<table class="table" style="overflow-x: scroll;">'
        htmlStr += '<thead><tr style="background-color: #EEC95E;">'
        htmlStr += '<th style="color: black;"><center>DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"><center>INSPECTION</center></th>'
        htmlStr += '<th style="color: black"><center> WORK DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"> <center>REMARKS</center></th>'
        htmlStr += '<th style="color: black"> <center>SAVE</center></th>'
        htmlStr += '</tr></thead>'
        htmlStr+= '<tbody id="'+index+'" class="render-area"><tr>'
        htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><button  id="'+index+'" type="button" class="btn btn-content_bar btn-sm save-article"  style="width:100%;">SAVE</button></td>'
        htmlStr+= '</tr>'  
        htmlStr += '</table>'
        htmlStr += '</div></div><div class="row"><center>'
        htmlStr += '<button  id="'+index+'" type="button" class="btn btn-content_bar btn-sm add-new-area mb-3 add-new-area" disabled>Add New Area</button>'
        htmlStr += '</center></div></div></div>'

        // $('#render-article').append(htmlStr)
    }

    function addNewArea(index,id){
        console.log(id)
        var htmlStr = '';
        htmlStr+= '<tr>'
        htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><button  id="'+index+'" type="button" class="btn btn-content_bar btn-sm save-article"  style="width:100%;">SAVE</button></td>'
        htmlStr+= '</tr>' 

        var article_id = '#'+id
        console.log(article_id)
        $(article_id).append(htmlStr)
    }
    function addNewRoom(index){
        var htmlStr = '';
        var panel_id= 'collapse'+index
        console.log(panel_id)
        htmlStr += '<button class="accordion" type="button" data-toggle="collapse" data-target="#'+panel_id+'" aria-expanded="false" aria-controls="collapseTwo">'+room_name+'</button>'
        htmlStr += '<div id="'+panel_id+'" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">'
        htmlStr += '<div class="card-body col-md-12"  style="background-color: white;">'
        htmlStr += '<div class="form-group row" style="margin-top: 2%;">'
        htmlStr += '<div class="col-md-12">'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div class="row" style="marign-top:2%">'
        htmlStr += '<div class="col-xs-12">'
        htmlStr += '<div class="box">'
        htmlStr += '<div class="box-header">'
        htmlStr += '<h3 class="box-title">ARTICLE TYPE</h3>'
        htmlStr += '<input type="text" class="form-control article-type" id="'+index+'" placeholder="Enter article type here" list="types">'
        htmlStr += '<datalist id="types">'
        htmlStr += '<option value="ELECTRICAL Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="AC (HVAC) Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="General Services"></option>'
        htmlStr += '</datalist>'
        htmlStr += '<div class="box-tools">'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div class="box-body table-responsive no-padding">'
        htmlStr += '<table class="table" style="overflow-x: scroll;">'
        htmlStr += '<thead><tr style="background-color: #EEC95E;">'
        htmlStr += '<th style="color: black;"><center>DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"><center>INSPECTION</center></th>'
        htmlStr += '<th style="color: black"><center> WORK DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"> <center>REMARKS</center></th>'
        htmlStr += '<th style="color: black"> <center>SAVE</center></th>'
        htmlStr += '</tr></thead>'
        htmlStr+= '<tbody id="render-area'+index+'"><tr>'
        htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><button value="'+article_type+'"  id="'+index+'" type="button" class="btn btn-content_bar btn-sm save-article"  style="width:100%;">SAVE</button></td>'
        htmlStr+= '</tr>'  
        htmlStr += '</table>'
        htmlStr += '</div></div><div class="row"><center>'
        htmlStr += '<button  id="'+index+'" type="button" class="btn btn-content_bar btn-sm add-new-area mb-3 add-new-area" disabled>Add New Area</button>'
        htmlStr += '</center></div></div></div>'
        htmlStr += '<div class="form-group row">'
        htmlStr += '<center>    '
        htmlStr += '<button  id="'+index+'" type="button" class="btn btn-content_bar btn-sm add-new-article" disabled>Add New Article</button>'
        htmlStr += '</center></div>'
        htmlStr += '<div style="margin-left: 4%;">'
        htmlStr += '<h3>Add Room Images</h3>'
        htmlStr += '<p id="pre_image_error" style="display: none">No pre image(s) found.</p>'
        htmlStr += '<div class="row" id="render_pre_image">'
        htmlStr += '</div>'
        htmlStr += '<hr>'
        htmlStr += '<h3>Upload Image</h3>'
        htmlStr += '<div class="container-fluid">'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col">'
        htmlStr += '<a target="_blank"> <img id="show_uploaded_pre_image" style="height: 150px"'
        htmlStr += 'src="http://placehold.it/180" alt="your image" /></a>'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div class="row" style="margin-top:2%;">'
        htmlStr += '<div class="col-sm-6">'
        htmlStr += '<input id="pre_image_uploader" style="margin-left:-9%;" type="file" />'
        htmlStr += '</div></div>'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col-sm-3">'
        htmlStr += '<div id="modal_loader_upload_pre_image" style="text-align: center;display: none">'
        htmlStr += '<div style="display: inline-block;" class="loader"></div>'
        htmlStr += '</div>'
        htmlStr += '<p id="pre_image_upload_error" style="display: none">Successfully Uploaded </p>'
        htmlStr += '<button id="uplaod_pre_image_btn" type="button" style="margin-top: 3%;margin-bottom: 5%;" class="btn ImgBts">AddImage</button>'
        htmlStr += '</div></div></div></div></div></div></div>'
        $('#add-room').append(htmlStr);
    }
})