$(document).ready(()=>{

    var property_id = localStorage.getItem('property_id')
    var info_id = localStorage.getItem('info_id')
    var selected_client = localStorage.getItem('selected_client')
    var selected_property = localStorage.getItem('selected_property')

    var report_id = '';
    var selected_team = '';
    var selected_inspector = '';
    var selected_date = '';
    var summary = '';
    $('#client').val(selected_client)
    $('#property').val(selected_property)

    console.log(info_id)
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryReportsViaPropertyID.php?property_id='+property_id
    $.get(link, function (data) {
        report_id = data.server_response[info_id].reports.id
        localStorage.setItem('key',report_id)
        console.log(data.server_response[info_id],report_id)
        $('#selected_team').val(data.server_response[info_id].reports.ops_team_id)        
        $('#inspector-name').val(data.server_response[info_id].reports.inspection_done_by)
        let date = data.server_response[info_id].reports.checked_on.toString().slice(8,10)+'/'+data.server_response[info_id].reports.checked_on.toString().slice(5,7)+'/'+data.server_response[info_id].reports.checked_on.toString().slice(0,4) 
        $('#inspection-date').val(date)        
        $('#summary').val(data.server_response[info_id].reports.summary)   
        $('#main_section_loader').fadeOut();
        $('.main_section_div').fadeIn();
  
        selected_date = data.server_response[info_id].reports.checked_on
        selected_inspector = data.server_response[info_id].reports.inspection_done_by
        selected_team = data.server_response[info_id].reports.ops_team_id
        summary = data.server_response[info_id].reports.summary
        RenderRoomFetched(report_id)

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
    $(document).on('change','#summary',function(){
        summary = $(this).val();
        console.log(summary)
    })

    
    $('#save-info').submit(function(e){
        e.preventDefault()
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryReportCheckedOn.php?inventory_report_id='+report_id+'&checked_on='+selected_date;
        console.log(link)
        $.get(link, function (data) {
            console.log(data)
        }).fail((error) => {
            console.log(error);
        });    
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryReportInspectionDoneBy.php?inventory_report_id='+report_id+'&inspection_done_by='+selected_inspector;
        console.log(link)
        $.get(link, function (data) {
            console.log(data)
        }).fail((error) => {
            console.log(error);
        });    
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryReportInspectionSummary.php?inventory_report_id='+report_id+'&summary='+summary;
        console.log(link)
        $.get(link, function (data) {
            console.log(data)
        }).fail((error) => {
            console.log(error);
        });    
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryReportOpsTeamID.php?inventory_report_id='+report_id+'&ops_team_id='+selected_team;
        console.log(link)
        $.get(link, function (data) {
            console.log(data)
            $('#heading').html('Success')
            $('#content').html('<center>Information Updated</center>')
            
            $('#myModal4').modal()
        }).fail((error) => {
            console.log(error);
        });    
    
    })

    
    var global_count=0;
    var new_area_count=0;
    var new_article_count=0;
    var article_count = 0;
    var room_id ='';
    
    //  Room Area
        
    function RenderRoomFetched(id){
        renderArticlesFetched(id,global_count)
    }


    var room_count = 0;
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
    var overall_articles_count = 0;


    
    //  Room Area
    $(document).on('change','#room-name',function(){
        room_names.push($(this).val())        
        room_name = $(this).val()
    })    

    $('#add_new_room').submit(function(e){
        e.preventDefault()
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryRoom.php?inventory_report_id='+report_id+'&room='+room_name;
        console.log(link)
        $.get(link, function (data) {
            console.log(data)
            room_id = data.server_response 
            $('#heading').html('Success')
            $('#content1').html('<center>Room Added</center>')
            setTimeout(()=>{
                $('#myModal4').modal()
                setTimeout(()=>{
                    window.location.reload()
                },200)
            },200)
            $('#room-add').attr('disabled',true)
            global_count += 1;
            new_area_count += 1;
            console.log(article_count)

            $('.save-room').fadeIn()
        
        }).fail((error) => {
            console.log(error);
            $('#heading').html('Error')
            $('#content1').html('<center>Error Occured</center>')
            setTimeout(()=>{
                $('#myModal4').modal()
            },200)
        }); 
    })

    
    let images = new Array()
    // add image to  room
    $(document).on('click','.add-image',function(){    
        
        if(images.length>0){
            for(let i=0;i<images.length;i++){
                let file = images[i]
                console.log(file)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadInventoryPicture_b.php?inventory_room_id='+room_id+'&picture_location='+file.name
                console.log(link)
                $.get(link, function (data) {
                    console.log(data)
                    if(data.server_response == "The inventory picture location has been uploaded to database."){
                        var formdata = new FormData();
                        formdata.append("photo", file);
                        $.ajax({
                            url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadInventoryPicture_a.php',
                            type: "POST",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                console.log(result);
                            },
                            error: function (data) { 
                                console.log(data)   
                            },
                        });
                    }    
                }).fail((error) => {
                    console.log(error);
                });        
            }
        }

    })

    $(document).on('click','.add-area-fetched',function(){
        console.log($(this).attr('id'))
        console.log($(this).attr('value'))
        console.log(new_area_count,$(this).attr('id'),$(this).attr('type'),$(this).attr('value'))
        addNewAreaFetched(new_area_count,$(this).attr('id'),$(this).attr('type'),$(this).attr('value'))
    })
    
    $(document).on('click','.add-new-area',function(){
        console.log($(this).attr('id'))
        addNewArea(new_area_count,$(this).attr('id'))
    })

    // Article TYPE
    $(document).on('change','.article-type',function(){
        console.log($(this).attr('id'))
        article_types.push($(this).val())   
        localStorage.setItem('article_type',$(this).val())
    })
    
    $(document).on('click','.edit-article',function(){
        console.log($(this).attr('id'),$(this).attr('type'))
        type = $(this).attr('value')
        article_id = $(this).attr('type')
        $(this).closest('tr').find('textarea').each(function(){
            if($(this).attr("id") == "article-description"){
                article_descrption = $(this).val();
                console.log(article_descrption)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleDescription.php?inventory_article_id='+article_id+'&description='+article_descrption;
                console.log(link)
                $.get(link, function (data){
                    console.log(data)
                }).fail((error) => {
                    console.log(error);
                }); 
            }
            if($(this).attr("id") == "article-inspection"){
                article_inspection = $(this).val();
                console.log(article_inspection)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleInspection.php?inventory_article_id='+article_id+'&inspection='+article_inspection;
                console.log(link)
                $.get(link, function (data){
                    console.log(data)
                }).fail((error) => {
                    console.log(error);
                }); 

            }
            if($(this).attr("id") == "article-work-description"){
                article_work_description = $(this).val();
                console.log(article_work_description)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleWorkDescription.php?inventory_article_id='+article_id+'&work_description='+article_work_description;
                console.log(link)
                $.get(link, function (data){
                    console.log(data)
                }).fail((error) => {
                    console.log(error);
                }); 
        
            }
            if($(this).attr("id") == "article-remarks"){
                article_remarks = $(this).val();
                console.log(article_remarks)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/updateInventoryArticleRemarks.php?inventory_article_id='+article_id+'&remarks='+article_remarks;
                console.log(link)
                $.get(link, function (data){
                    console.log(data)
                }).fail((error) => {
                    console.log(error);
                }); 
        
            }
            $('#heading').html('Success')
            $('#content1').html('<center>Article Saved</center>')
            
            $('#myModal4').modal()
        });
        console.log($(this).attr('value'))
    })
    $(document).on('click','.delete-article',function(){
        console.log($(this).attr('id'),$(this).attr('type'))
        $('#content').html('<center>Are you sure you want to delete this article</center>')
        $('#myModal3').modal()
        
        type = $(this).attr('value')
        article_id = $(this).attr('type')
        $('#ok').click(function(){
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/deleteInventoryArticle.php?article_id='+article_id;
            $.get(link,function(data){
                console.log(data)
                if(data.server_response=="Successfully Deleted Inventory Article."){
                    setTimeout(()=>{
                        window.location.reload()
                    },1000);
                }
            }).fail((error) => {
                console.log(error);
            });     
        })
    })

    // Article Save
    $(document).on('click','.save-article',function(){
        console.log($(this).attr('id'),$(this).attr('type'))
        $(this).closest('tr').find('textarea').each(function(){
            if($(this).attr("id") == "article-description"){
                article_descrption = $(this).val();
                console.log(article_descrption)
            }
            if($(this).attr("id") == "article-inspection"){
                article_inspection = $(this).val();
                console.log(article_inspection)
            }
            if($(this).attr("id") == "article-work-description"){
                article_work_description = $(this).val();
                console.log(article_work_description)
            }
            if($(this).attr("id") == "article-remarks"){
                article_remarks = $(this).val();
                console.log(article_remarks)
            }
        });
        console.log($(this).attr('value'))
        type = $(this).attr('value')
        selected_room_id = $(this).attr('type')
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryArticle.php?inventory_room_id='+selected_room_id+'&type='+type+'&description='+article_descrption+'&inspection='+article_inspection+'&work_description='+article_work_description+'&remarks='+article_remarks;
        console.log(link)
        $.get(link, function (data){
            console.log(data)
            if(data.server_response === "Successfully Submitted Inventory Article Details."){
                $(this).attr('disabled',true);
                $('#heading').html('Success')
                $('#content1').html('<center>Article Saved</center>')
            
            $('#myModal4').modal()
            }
        }).fail((error) => {
            console.log(error);
        }); 
    })
    $(document).on('click','.add-new-article',function(){        
        article_count += 1;
        new_article_count += 1;
        new_area_count += 1;
        // link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryArticle.php?inventory_room_id='+selected_room_id+'&type='+type+'&description='+article_descrption+'&inspection='+article_inspection+'&work_description='+article_work_description+'&remarks='+article_remarks;
        // console.log(link)
        // $.get(link, function (data){
        //     console.log(data)
        // }).fail((error) => {
        //     console.log(error);
        // });
        console.log(article_count,new_article_count,new_area_count,$(this).attr('id'))
        // addNewArticleFetched(new_article_count,$(this).attr('id'),article_count)
    })

    function readURL(input,id) {
        if (input.files && input.files[0]) {            
            console.log(input.files[0])
            var reader = new FileReader();
            reader.onload = function (e) {
                console.log(id,e.target.result)
                // addImages(id,e.target.result)
                var htmlStr = '';
                htmlStr += '<a target="_blank" id=""> <img src='+e.target.result+' id="show_uploaded_pre_image" style="height: 150px"'
                htmlStr += ' alt="your image" /></a>'
                $('#render-images-'+id).append(htmlStr)
            }
            reader.readAsDataURL(input.files[0]);
            images.push(input.files[0])            
        }
    }
    let src='';
    $(document).on('change', '.image-upload', function (e) { 
        readURL(this,$(this).attr('id'))
    });
    function addImages(index,src){
        var htmlStr = '';
        htmlStr += '<a target="_blank" id=""> <img src='+src+' id="show_uploaded_pre_image" style="height: 150px"'
        htmlStr += ' alt="your image" /></a>'
        $('#render-images-'+index).append(htmlStr)
    }
    // add image to  room
    $(document).on('click','.add-image-fetched',function(){    
        
        if(images.length>0){
            for(let i=0;i<images.length;i++){
                let file = images[i]
                images.pop()
                console.log(file)
                id = $(this).attr('id')
                console.log(id)
                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadInventoryPicture_b.php?inventory_room_id='+id+'&picture_location='+file.name
                console.log(link)
                $.get(link, function (data) {
                    console.log(data)
                    if(data.server_response == "The inventory picture location has been uploaded to database."){
                        var formdata = new FormData();
                        formdata.append("photo", file);
                        $.ajax({
                            url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadInventoryPicture_a.php',
                            type: "POST",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                console.log(result);
                                $('#heading').html('Error')
                                $('#content1').html('<center> Error Occured</center>')
                                setTimeout(()=>{
                                    $('#myModal4').modal()
                                },200)
                                $('#room-add').attr('disabled',true)
                                            },
                            error: function (data) { 
                                console.log(data)   
                                $('#heading').html('Success')
                                $('#content1').html('<center>Image Uploaded</center>')
                                setTimeout(()=>{
                                    $('#myModal4').modal()
                                },200)
                                $('#room-add').attr('disabled',true)
                
                            },
                        });
                    }    
                }).fail((error) => {
                    console.log(error);
                });        
            }
        }

    })

    function addNewArticleFetched(index,id,area){
        var htmlStr = '';
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col-xs-12">'
        htmlStr += '<div class="box">'
        htmlStr += '<div class="box-header">'
        htmlStr += '<h3 class="box-title">ARTICLE TYPE</h3>'
        htmlStr += '<input type="text" class="form-control article-type" id="'+area+'" placeholder="Enter article type here" list="types">'
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
        htmlStr += '<th style="color: black"> <center>DELETE</center></th>'
        htmlStr += '</tr></thead>'
        htmlStr+= '<tbody id="render-area-'+area+'"><tr>'
        htmlStr += '</table>'
        htmlStr += '</div></div><div class="row"><center>'
        htmlStr += '<button  id="'+area+'" type="button" class="btn btn-content_bar btn-sm add-new-area mb-3 add-new-area" >Add New Article</button>'
        htmlStr += '</center></div></div></div>'

        render_article = '#render-article-fetched-'+id;
        console.log(render_article)
        $(render_article).append(htmlStr)
    }
    function addNewAreaFetched(index,id,type,room){
        var htmlStr = '';
        console.log(index,room,overall_articles_count)
        htmlStr+= '<tr>'
        htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><button name='+overall_articles_count+' id="'+index+'" value="'+type+'" type='+room+' class="btn btn-content_bar btn-sm save-article"  style="width:100%;">SAVE</button></td>'
        htmlStr+= '<td><button name='+overall_articles_count+' id="'+index+'" value="'+type+'" type='+room+' class="btn btn-content_bar btn-sm delete-article"  style="width:100%;" disabled>Delete</button></td>'
        htmlStr+= '</tr>' 

        var article_id = '#render-area-fetched-'+id
        // console.log(article_id)
        $(article_id).append(htmlStr)
    }
    function addNewRoomFetched(index,area,article_no,obj){
        var htmlStr = '';
        var panel_id= 'collapse'+index
        console.log(panel_id)
        htmlStr += '<button class="accordion" type="button" data-toggle="collapse" data-target="#'+panel_id+'" aria-expanded="false" aria-controls="collapseTwo">'+obj.name+'</button>'
        htmlStr += '<div id="'+panel_id+'" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">'
        htmlStr += '<div class="card-body col-md-12"  style="background-color: white;">'
        htmlStr += '<div class="form-group row" style="margin-top: 2%;">'
        htmlStr += '<div class="col-md-12">'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div id="render-article-fetched-'+index+'"></div>  '
        // htmlStr += '<div class="form-group row">'
        // htmlStr += '<center>'
        // htmlStr += '<button  id="'+index+'" type="button" class="btn btn-content_bar btn-sm add-new-article-fetched" >Add New Type</button>'
        // htmlStr += '</center></div>'
        htmlStr += '<div style="margin-left: 4%;">'
        htmlStr += '<p id="pre_image_error" style="display: none">No pre image(s) found.</p>'
        htmlStr += '<div class="row" id="render_pre_image">'
        htmlStr += '</div>'
        htmlStr += '<div class="container-fluid">'
        htmlStr += '<hr>'
        htmlStr += '<div class="row"><center>'
        htmlStr += '<h3>Upload Room Images</h3>'
        htmlStr += '<div id="render-images-fetched-'+index+'">'
        htmlStr += '</div></center></div>'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col" id="render-images-'+index+'">'
        // htmlStr += '<a target="_blank" id=""> <img id="show_uploaded_pre_image" style="height: 150px"'
        // htmlStr += 'src="http://placehold.it/180" alt="your image" /></a>'
        htmlStr += '</div>'
        htmlStr += '</div>'
        
        htmlStr += '</div>'
        htmlStr += '<center><div class="row" style="margin-top:2%;">'
        htmlStr += '<div class="col-sm-12">'
        htmlStr += '<input id="'+obj.id+'" style="margin-left:-9%;" type="file" class="image-upload"/>'
        htmlStr += '</div></div></center>'
        htmlStr += '<center><div class="row">'
        htmlStr += '<div class="col-sm-12">'
        htmlStr += '<div id="modal_loader_upload_pre_image" style="text-align: center;display: none">'
        htmlStr += '<div style="display: inline-block;" class="loader"></div>'
        htmlStr += '</div>'
        htmlStr += '<p id="pre_image_upload_error" style="display: none">Successfully Uploaded </p>'
        htmlStr += '<button id="'+index+'" type="'+obj.id+'" style="margin-top: 3%;margin-bottom: 5%;" class="btn ImgBts add-image-fetched">AddImage</button>'
        htmlStr += '</div></div></div></center></div></div></div></div>'
        $('#add-room-fetched').append(htmlStr);
        return true
    }
    function renderArticlesFetched(id){
        let types = new Array();
        let ids = new Array();
        let articles = new Array();
        let rooms =new Array();
        article_types = new Array()
        let pictures = new Array()
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryPicturesViaInventoryReportID.php?report_id='+report_id;
        $.get(link,function(data){
            console.log(data)
            $.each(data.server_response,function(index,item){
                pictures.push(item)
            })

            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryArticlesViaInventoryReportID.php?report_id='+id
            console.log(link)
            $.get(link, function (data) {
                console.log(data)
                $.each(data.server_response, function(index,item){
                    types.push(item.rooms_and_articles.type)
                    articles.push(item)
                    rooms.push(item.rooms_and_articles.room)
                    ids.push(item.rooms_and_articles.room_id)
                })
                rooms = rooms.filter(function(item,index){
                    return rooms.indexOf(item) === index
                })
                ids = ids.filter(function(item,index){
                    return ids.indexOf(item) === index
                })
                console.log(rooms,ids)
                types = types.filter(function(item,index){
                    return types.indexOf(item) === index
                })
                for(let i=0;i<rooms.length;i++){
                    global_count += 1;
                    new_area_count += 1;
                    console.log(article_count)
                    let selected_room = rooms[i]
                    console.log('selected_room',selected_room)
                    let backup = articles;
                    let selected_room_articles = backup.filter(val=>{
                        return val.rooms_and_articles.room === selected_room
                    })
                    let selected_room_types=new Array();
                    $.each(selected_room_articles,function(index,item){
                        selected_room_types.push(item.rooms_and_articles.type)
                    })
                    selected_room_types = selected_room_types.filter(function(item,index){
                        return selected_room_types.indexOf(item) === index
                    })
                    let roomObj = {
                        id      :   ids[i],
                        name    :   selected_room, 
                    }    
                    console.log(roomObj)
                    console.log(selected_room,'-> articlelength',selected_room_articles.length,'->typelength',selected_room_types.length)
                    if(addNewRoomFetched(global_count,new_area_count,article_count,roomObj)){
                        for(let i=0;i<selected_room_types.length;i++){
                            console.log(selected_room_types[i])
                            let backup = selected_room_articles;
                            let result = backup.filter(val =>{
                                return val.rooms_and_articles.type === selected_room_types[i]
                            })    
                            console.log('room-articles',result)
                            article_count += 1;
                            articleRenderFetched(result,selected_room_types[i],article_count,global_count,roomObj)
                        }
                        if(pictures.length>0){
                            let backup = pictures
                            console.log(selected_room)
                            const pics =  backup.filter(function(val){
                                return val.pictures.room === selected_room
                            })
                            addImagesFetched(pics,global_count)
                        }
                    }
                }
            }).fail((error) => {
                console.log(error);
            }); 
        }).fail((error) => {
            console.log(error);
        }); 
    
    }
    function articleRenderFetched(item,type,index,id,room){
        var htmlStr = '';

        htmlStr += '<div class="row">'
        htmlStr += '<div class="col-xs-12">'
        htmlStr += '<div class="box">'
        htmlStr += '<div class="box-header">'
        htmlStr += '<h3 class="box-title form-labels" style="font-size: large;">ARTICLE TYPE</h3>'
        htmlStr += '<div class="form-group row">'
        htmlStr += '<div class="col-md-12" >'
        htmlStr += '<input disabled value="'+type+'" type="text" class="form-control article-type" id="'+type+'" placeholder="Enter article type here" list="types">'
        htmlStr += '<datalist id="types">'
        htmlStr += '<option value="ELECTRICAL Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="AC (HVAC) Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)"></option>'
        htmlStr += '<option value="General Services"></option>'
        htmlStr += '</datalist>'
        htmlStr += '</div>'
        // htmlStr += '<div class="col-md-2" >'
        // htmlStr += '<button  type="button" class="btn btn-content_bar btn-sm update-article-type" style="width:100%">Update</button>'
        // htmlStr += '</div>'
        htmlStr += '</div>'
    
        // htmlStr += '<form id="article-type-edit">'
        // htmlStr += '<input value="'+type+'" type="text" class="form-control article-type" id="'+type+'" placeholder="Enter article type here" list="types">'
        // htmlStr += '<button type="submit" class="btn btn-content_bar btn-sm" style="margin-left:3%">edit</button></form>'
        htmlStr += '<div class="box-tools">'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div class="box-body table-responsive no-padding">'
        htmlStr += '<table id='+type+' class="table" style="overflow-x: scroll;">'
        htmlStr += '<thead><tr style="background-color: #EEC95E;">'
        htmlStr += '<th style="color: black;"><center>DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"><center>INSPECTION</center></th>'
        htmlStr += '<th style="color: black"><center> WORK DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"> <center>REMARKS</center></th>'
        htmlStr += '<th style="color: black"> <center>SAVE</center></th>'
        htmlStr += '<th style="color: black"> <center>DELETE</center></th>'
        htmlStr += '</tr></thead>'
        htmlStr+= '<tbody id="render-area-fetched-'+index+'">'
        $.each(item, function(index,item){
            overall_articles_count++;
            htmlStr+= '<tr>'
            htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5">'+item.rooms_and_articles.description+'</textarea></td>'
            htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5">'+item.rooms_and_articles.inspection+'</textarea></td>'
            htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5">'+item.rooms_and_articles.work_description+'</textarea></td>'
            htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5">'+item.rooms_and_articles.remarks+'</textarea></td>'
            htmlStr+= '<td><button name='+overall_articles_count+' value="'+type+'"  id="'+index+'" type="'+item.rooms_and_articles.article_id+'" class="btn btn-content_bar btn-sm edit-article"  style="width:100%;">SAVE</button></td>'
            htmlStr+= '<td><button  name='+overall_articles_count+' value="'+type+'"  id="'+index+'" type="'+item.rooms_and_articles.article_id+'" class="btn btn-content_bar btn-sm delete-article"  style="width:100%;">Delete</button></td>'
            htmlStr+= '</tr>' 
        })
        htmlStr += '</table>'
        htmlStr += '</div></div><div class="row"><center>'
        htmlStr += '<button  id="'+index+'" type="'+type+'" value='+room.id+' class="btn btn-content_bar btn-sm mb-3 add-area-fetched" >Add New Article</button>'
        htmlStr += '</center></div></div></div>'
        render_article = '#render-article-fetched-'+id
        $(render_article).append(htmlStr)
    }
    function addImagesFetched(data,index){
        var htmlStr = '';
        $.each(data,function(index,item){
            console.log(item.pictures.picture_location)
            htmlStr+= '<div class="col-lg-3">'
            htmlStr+= '<div class="card" style="width: 18rem;">'
            htmlStr+= '<img class="card-img-top" src="'+item.pictures.picture_location+'" style="height: 110px" alt="Card image cap">'
            // htmlStr+= '<div class="card-body"><center>'
            // htmlStr+= '<button  type="button" class="btn btn-content_bar btn-sm delete-image" style="width:100%;margin-left:5px">Delete</button>'
            // htmlStr+= '</center></div>'
            htmlStr+= '</div></div>'
            // htmlStr+= '<div class="col-lg-3">'
            // htmlStr+= '<div class="card"><img src="'+item.pictures.picture_location+'" alt="" style="height: 150px">'
            // htmlStr+= '<div class="card-body"><button  type="button" class="btn btn-content_bar btn-sm delete-image" style="width:100%">Update</button>'
            // htmlStr+= '</div>'
        })
        $('#render-images-fetched-'+index).append(htmlStr)
    }

    





    // New add room
    $('#add-new-room').submit(function(e){
        e.preventDefault()
        
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryRoom.php?inventory_report_id='+report_id+'&room='+room_name;
        console.log(link)
        $.get(link, function (data) {
            console.log(data)
            room_id = data.server_response 
            $('#heading').html('Success')
            $('#content').html('<center>Room Added</center>')
            setTimeout(()=>{
                $('#myModal3').modal()
            },200)
            $('#room-add').attr('disabled',true)
            global_count += 1;
            new_area_count += 1;
            console.log(article_count)
            addNewRoom(global_count,new_area_count,article_count,room_id)
            $('.save-room').fadeIn()
            renderArticles(report_id,global_count)

        }).fail((error) => {
            console.log(error);
            $('#heading').html('Error')
            $('#content').html('<center>Error Occured</center>')
            setTimeout(()=>{
                $('#myModal3').modal()
            },200)
        }); 
    })
    function addNewRoom(index,area,article_no,room_id){
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
        htmlStr += '<div id="render-article-'+index+'"></div>  '
        htmlStr += '<div class="form-group row">'
        htmlStr += '<center>'
        htmlStr += '<button  id="'+index+'" type="" class="btn btn-content_bar btn-sm add-new-article" >Add New Type</button>'
        htmlStr += '</center></div>'
        htmlStr += '<div style="margin-left: 4%;">'
        htmlStr += '<hr>'
        htmlStr += '<h3>Add Room Images</h3>'
        htmlStr += '<p id="pre_image_error" style="display: none">No pre image(s) found.</p>'
        htmlStr += '<div class="row" id="render_pre_image">'
        htmlStr += '</div>'
        htmlStr += '<hr>'
        htmlStr += '<h3>Upload Image</h3>'
        htmlStr += '<div class="container-fluid">'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col" id="render-images-'+index+'">'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<div class="row" style="margin-top:2%;">'
        htmlStr += '<div class="col-sm-6">'
        htmlStr += '<input id="'+index+'" style="margin-left:-9%;" type="file" class="image-upload"/>'
        htmlStr += '</div></div>'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col-sm-3">'
        htmlStr += '<div id="modal_loader_upload_pre_image" style="text-align: center;display: none">'
        htmlStr += '<div style="display: inline-block;" class="loader"></div>'
        htmlStr += '</div>'
        htmlStr += '<p id="pre_image_upload_error" style="display: none">Successfully Uploaded </p>'
        htmlStr += '<button id="'+room_id+'" type="button" style="margin-top: 3%;margin-bottom: 5%;" class="btn ImgBts add-image">AddImage</button>'
        htmlStr += '</div></div></div></div></div></div></div>'
        $('#add-room').append(htmlStr);
    }
    function renderArticles(id){
        let types = new Array();
        let articles = new Array();
        article_types = new Array()
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchInventoryArticlesViaInventoryReportID.php?report_id='+id
        console.log(link)
        $.get(link, function (data) {
            console.log(data)
            $.each(data.server_response, function(index,item){
                types.push(item.rooms_and_articles.type)
                articles.push(item)
            })
            types = types.filter(function(item,index){
                return types.indexOf(item) === index
            })
            // console.log(types)
            for(let i=0;i<types.length;i++){
                let backup = articles;
                let result = backup.filter(val =>{
                    return val.rooms_and_articles.type === types[i]
                })                 
                article_types.push(types[i])
                // console.log(result)
                article_count += 1;
        
                articleRender(result,types[i],article_count,global_count)
            }
        }).fail((error) => {
            console.log(error);
        }); 
    
    }
    function articleRender(item,type,index,id){
        var htmlStr = '';
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col-xs-12">'
        htmlStr += '<div class="box">'
        htmlStr += '<div class="box-header">'
        htmlStr += '<h3 class="box-title form-labels" style="font-size: large;">ARTICLE TYPE</h3>'
        htmlStr += '<input disabled value="'+type+'" type="text" class="form-control article-type" id="'+type+'" placeholder="Enter article type here" list="types">'
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
        htmlStr += '<table id='+type+' class="table" style="overflow-x: scroll;">'
        htmlStr += '<thead><tr style="background-color: #EEC95E;">'
        htmlStr += '<th style="color: black;"><center>DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"><center>INSPECTION</center></th>'
        htmlStr += '<th style="color: black"><center> WORK DESCRIPTION</center></th>'
        htmlStr += '<th style="color: black"> <center>REMARKS</center></th>'
        htmlStr += '<th style="color: black"> <center>SAVE</center></th>'
        htmlStr += '</tr></thead>'
        htmlStr+= '<tbody id="render-area-'+index+'">'
        $.each(item, function(index,item){
            htmlStr+= '<tr><td><textarea name="" id="article-description" cols="30" rows="5">'+item.rooms_and_articles.description+'</textarea></td>'
            htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
            htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
            htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
            htmlStr+= '<td><button value="'+type+'"  id="'+index+'" type="'+item.rooms_and_articles.article_id+'" class="btn btn-content_bar btn-sm edit-article"  style="width:100%;">SAVE</button></td>'
            htmlStr+= '</tr>' 
        })
        htmlStr += '</table>'
        htmlStr += '</div></div><div class="row"><center>'
        htmlStr += '<button  id="'+index+'" type="'+type+'" class="btn btn-content_bar btn-sm add-new-area mb-3 add-new-area" >Add New Article</button>'
        htmlStr += '</center></div></div></div>'
        render_article = '#render-article-'+id
        $(render_article).append(htmlStr)
    }


})