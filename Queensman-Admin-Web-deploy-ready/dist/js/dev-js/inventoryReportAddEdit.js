$(document).ready(()=>{

    var selected_client = localStorage.getItem('selected_client')
    var selected_property = localStorage.getItem('selected_property')
    var selected_team = '';
    var selected_inspector = '';
    var selected_date = '';
    var summary = '';
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




    var global_count=0;
    var new_area_count=0;
    var new_article_count=0;
    var article_count = 0;
    var room_id ='';
    let report_id = '';
    // //  Room Area
    // $(document).on('change','#room-name',function(){
    //     room_names.push($(this).val())        
    //     room_name = $(this).val()
    // })    

    // $('#add_new_room').submit(function(e){
    //     e.preventDefault()
    //     report_id = localStorage.getItem('key');        
    //     link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryRoom.php?inventory_report_id='+report_id+'&room='+room_name;
    //     console.log(link)
    //     $.get(link, function (data) {
    //         console.log(data)
    //         room_id = data.server_response 
    //         $('#heading').html('Success')
    //         $('#content').html('<center>Room Added</center>')
    //         setTimeout(()=>{
    //             $('#myModal4').modal()
    //         },200)
    //         $('#room-add').attr('disabled',true)
    //         global_count += 1;
    //         new_area_count += 1;
    //         console.log(article_count)
    //         addNewRoom(global_count,new_area_count,article_count,room_id)
    //         $('.save-room').fadeIn()
    //         renderArticles(report_id,global_count)

    //     }).fail((error) => {
    //         console.log(error);
    //         $('#heading').html('Error')
    //         $('#content').html('<center>Error Occured</center>')
    //         setTimeout(()=>{
    //             $('#myModal4').modal()
    //         },200)
    //     }); 
    // })

    
    let images = new Array()
    // add image to  room
    $(document).on('click','.add-image',function(){    
        
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
                                $('#content').html('<center> Error Occured</center>')
                                setTimeout(()=>{
                                    $('#myModal3').modal()
                                },200)
                                $('#room-add').attr('disabled',true)
                                            },
                            error: function (data) { 
                                console.log(data)   
                                $('#heading').html('Success')
                                $('#content').html('<center>Image Uploaded</center>')
                                setTimeout(()=>{
                                    $('#myModal3').modal()
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


    $(document).on('click','.add-new-area',function(){
        console.log($(this).attr('id'))
        addNewArea(new_area_count,$(this).attr('id'),$(this).attr('type'))
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
            $('#content').html('<center>Article Saved</center>')
            
            $('#myModal3').modal()
        });
        // console.log($(this).attr('value'))
    })


    // Article Save
    $(document).on('click','.save-article',function(){
        console.log($(this).attr('id'),$(this).attr('value'))
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
        // console.log($(this).attr('value'))
        type = $(this).attr('value')
        if(type=='button'){
            type = localStorage.getItem('article_type')
            console.log(type)
        }
        else{
            type = $(this).attr('value')
        }
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/insertInventoryArticle.php?inventory_room_id='+room_id+'&type='+type+'&description='+article_descrption+'&inspection='+article_inspection+'&work_description='+article_work_description+'&remarks='+article_remarks;
        console.log(link)
        $.get(link, function (data){
            console.log(data)
            if(data.server_response === "Successfully Submitted Inventory Article Details."){
                $(this).attr('disabled',true);
                // $('#heading').html('Success')
                // $('#content').html('<center>Article Saved</center>')
                // setTimeout(()=>{
                //     $('#myModal3').modal()
                // },200)
                // $('#room-add').attr('disabled',true)
                $('#heading').html('Success')
                $('#content').html('<center>Article Saved</center>')
    
                $('#myModal3').modal()
            }
        }).fail((error) => {
            console.log(error);
            $('#heading').html('Error')
            $('#content').html('<center>Error Occured</center>')
            setTimeout(()=>{
                $('#myModal3').modal()
            },200)
            $('#room-add').attr('disabled',true)
        }); 
    })
    $(document).on('click','.add-new-article',function(){        
        article_count += 1;
        new_article_count += 1;
        new_area_count += 1;
        console.log($(this).attr('id'))
        addNewArticle(new_article_count,$(this).attr('id'),article_count)
    })
    $(document).on('click','#save-room',function(){
        $('#room-add').attr('disabled',false);
        $('#heading').html('Success')
        $('#content').html('<center>Room Saved</center>')

        $('#myModal3').modal()
        
    })
    function readURL(input,id) {
        if (input.files && input.files[0]) {            
            console.log(input.files[0])
            var reader = new FileReader();
            reader.onload = function (e) {
                addImages(id,e.target.result)
            }
            reader.readAsDataURL(input.files[0]);
            images.push(input.files[0])            
        }
    }
    let src='';
    $(document).on('change', '.image-upload', function (e) { 
        readURL(this,$(this).attr('id'))
    });

    function addNewArticle(index,id,area){
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
        htmlStr += '</tr></thead>'
        htmlStr+= '<tbody id="render-area-'+area+'"><tr>'
        // htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><button value="'+article_type+'"  id="'+index+'" type="button" class="btn btn-content_bar btn-sm save-article"  style="width:100%;">SAVE</button></td>'
        // htmlStr+= '</tr>'  
        htmlStr += '</table>'
        htmlStr += '</div></div><div class="row"><center>'
        htmlStr += '<button  id="'+area+'" type="button" class="btn btn-content_bar btn-sm add-new-area mb-3 " >Add New Article</button>'
        htmlStr += '</center></div></div></div>'

        render_article = '#render-article-'+id;
        console.log(render_article)
        $(render_article).append(htmlStr)
    }

    function addNewArea(index,id,type){
        var htmlStr = '';
        console.log(type)
        htmlStr+= '<tr>'
        htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
        htmlStr+= '<td><button  id="'+index+'" value="'+type+'" class="btn btn-content_bar btn-sm save-article"  style="width:100%;">SAVE</button></td>'
        htmlStr+= '</tr>' 

        var article_id = '#render-area-'+id
        // console.log(article_id)
        $(article_id).append(htmlStr)
    }

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
        // htmlStr += '<div class="row">'
        // htmlStr += '<div class="col-xs-12">'
        // htmlStr += '<div class="box">'
        // htmlStr += '<div class="box-header">'
        // htmlStr += '<h3 class="box-title">ARTICLE TYPE</h3>'
        // htmlStr += '<input type="text" class="form-control article-type" id="'+index+'" placeholder="Enter article type here" list="types">'
        // htmlStr += '<datalist id="types">'
        // htmlStr += '<option value="ELECTRICAL Services (repair and replace warranty cover)"></option>'
        // htmlStr += '<option value="CARPENTRY, PAINT & TILING Services (repair and replace warranty cover)"></option>'
        // htmlStr += '<option value="AC (HVAC) Services (repair and replace warranty cover)"></option>'
        // htmlStr += '<option value="WATER SYSTEM & PLUMIBING Services (repair and replace warranty cover)"></option>'
        // htmlStr += '<option value="General Services"></option>'
        // htmlStr += '</datalist>'
        // htmlStr += '<div class="box-tools">'
        // htmlStr += '</div>'
        // htmlStr += '</div>'
        // htmlStr += '<div class="box-body table-responsive no-padding">'
        // htmlStr += '<table class="table" style="overflow-x: scroll;">'
        // htmlStr += '<thead><tr style="background-color: #EEC95E;">'
        // htmlStr += '<th style="color: black;"><center>DESCRIPTION</center></th>'
        // htmlStr += '<th style="color: black"><center>INSPECTION</center></th>'
        // htmlStr += '<th style="color: black"><center> WORK DESCRIPTION</center></th>'
        // htmlStr += '<th style="color: black"> <center>REMARKS</center></th>'
        // htmlStr += '<th style="color: black"> <center>SAVE</center></th>'
        // htmlStr += '</tr></thead>'
        // htmlStr+= '<tbody id="render-area'+area+'"><tr>'
        // htmlStr+= '<td><textarea name="" id="article-description" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><textarea name="" id="article-inspection" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><textarea name="" id="article-work-description" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><textarea name="" id="article-remarks" cols="30" rows="5"></textarea></td>'
        // htmlStr+= '<td><button   id="'+index+'" type="button" class="btn btn-content_bar btn-sm save-article"  style="width:100%;">SAVE</button></td>'
        // htmlStr+= '</tr></tbody>'  
        // htmlStr += '</table>'
        // htmlStr += '</div></div><div class="row"><center>'
        // htmlStr += '<button  id="'+area+'" type="button" class="btn btn-content_bar btn-sm add-new-area mb-3 add-new-area" >Add New Article</button>'
        // htmlStr += '</center></div></div></div>'
        // htmlStr += '<div id="render-article"></div>  '
        htmlStr += '<div id="render-article-'+index+'"></div>  '
        htmlStr += '<div class="form-group row">'
        htmlStr += '<center>'
        htmlStr += '<button  id="'+index+'" type="" class="btn btn-content_bar btn-md add-new-article" >Add New Type</button>'
        htmlStr += '</center></div>'
        htmlStr += '<div style="margin-left: 4%;">'
        htmlStr += '<p id="pre_image_error" style="display: none">No pre image(s) found.</p>'
        htmlStr += '<div class="row" id="render_pre_image">'
        htmlStr += '</div>'
        htmlStr += '<hr>'
        htmlStr += '<center><h3>Upload Room Images</h3></center>'
        htmlStr += '<div class="container-fluid">'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col" id="render-images-'+index+'">'
        // htmlStr += '<a target="_blank" id=""> <img id="show_uploaded_pre_image" style="height: 150px"'
        // htmlStr += 'src="http://placehold.it/180" alt="your image" /></a>'
        htmlStr += '</div>'
        htmlStr += '</div>'
        htmlStr += '<center><div class="row" style="margin-top:2%;">'
        htmlStr += '<div class="col-sm-12">'
        htmlStr += '<input id="'+index+'" type="file" class="image-upload"/>'
        htmlStr += '</div></div><center>'
        htmlStr += '<div class="row">'
        htmlStr += '<div class="col-sm-12"><center>'
        htmlStr += '<div id="modal_loader_upload_pre_image" style="text-align: center;display: none">'
        htmlStr += '<div style="display: inline-block;" class="loader"></div>'
        htmlStr += '</div>'
        htmlStr += '<p id="pre_image_upload_error" style="display: none">Successfully Uploaded </p>'
        htmlStr += '<button id="'+room_id+'" type="button" style="margin-top: 3%;margin-bottom: 5%;" class="btn ImgBts add-image">AddImage</button>'
        htmlStr += '</center></div></div></div></div></div></div></div>'
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

    function addImages(index,src){
        var htmlStr = '';
        htmlStr += '<a target="_blank" id=""> <img src='+src+' id="show_uploaded_pre_image" style="height: 150px"'
        htmlStr += ' alt="your image" /></a>'
        $('#render-images-'+index).append(htmlStr)
    }

})