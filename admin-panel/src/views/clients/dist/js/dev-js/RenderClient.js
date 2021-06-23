selected_client = ''
// w1 = '';

$(document).ready(function () {
  
    console.log('RenderClient.js ready')
    var client_list = new Array();
    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClients.php';
    $.get(link, function (data) {
        $.each(data.server_response, function (index, item) {
            client_list.push(item);
            renderClient(index, item.clients.full_name, item.clients.id)
        });
        $('#main_section_loader').fadeOut();
        $('#main_section_div').fadeIn();
    }).fail((error) => {
        console.log(error);

    });
    function getParameter(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }
    function renderClient(index, name, id) {
        
        var htmlStr = '';
        htmlStr += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        htmlStr += '<div class="image-parent">'
        htmlStr += '<img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">'
        htmlStr += '</div>'
        htmlStr += '<p class="client-name"> ' + name + '</p>'
        htmlStr += '<div id=' + (index + 1) + ' class="checkbox checkbox-warning checkbox-circle">'
    
        if(getParameter('cid') == id ){
            console.log('in if: ' + id)
            htmlStr += '<input id="chkWarning" class="client_checkbox selected_client" type="checkbox" checked value=' + id + ' />'
        }else {
            htmlStr += '<input id="chkWarning" class="client_checkbox" type="checkbox" unchecked value=' + id + ' />'
            
        }
        htmlStr += '<label for='+ id +'>'
        htmlStr += '  </label>'
        htmlStr += '</div>'
        htmlStr += '</li>'
        $('#client_list').append(htmlStr);
    }
    $('.SearchButtonCLient').click(function (e) { 
        // e.preventDefault();
        // alert('sda')
        query = $('#search_client_by_name').val().toString().toLowerCase();
        isfound = false;
        $('#client_list').empty();
        for (var i = 0; i < client_list.length; i++) {
            if (client_list[i].clients.full_name.toString().toLowerCase().includes(query)) {
                // alert('found');
                renderClient(i, client_list[i].clients.full_name, client_list[i].clients.id);
                isfound = true;
            }
        }
        if (!isfound) {
            $('#client_list').html('<p>not found</p>');
        }
    });
    $('#search_client_by_name').keyup(function (e) {
        if (e.keyCode == 13) {
            query = $(this).val().toString().toLowerCase();
            isfound = false;
            $('#client_list').empty();
            for (var i = 0; i < client_list.length; i++) {
                if (client_list[i].clients.full_name.toString().toLowerCase().includes(query)) {
                    // alert('found');
                    renderClient(i, client_list[i].clients.full_name, client_list[i].clients.id);
                    isfound = true;
                }
            }
            if (!isfound) {
                $('#client_list').html('<p>not found</p>');
            }
        }
    });
    
});