
$(document).ready(function () {
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name);
    });
    var link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchContacts.php';
    var table = '';
    $.get(link, function (data) {
        console.log(data.server_response)
        $('#contact_body_render').empty()
        $.each(data.server_response, function (index, item) {
            renderContacts(index,item);

        });
        $.extend($.fn.dataTable.defaults, {
            // searching: false,
            ordering: false,
            // info:false,
    
        });
        table = $('#contact_tab').dataTable();
        $('#contact_tab_length').fadeOut();
        $('#contact_tab_filter').fadeOut();
        $('#main_section_loader').fadeOut();
        $('#dislay_main_section').fadeIn();
    }).fail((error) => {
        console.log(error);

    });
    $(document).on('input', '#search_contacts', function () {
        // alert('sad')
        search_query = $(this).val();
        // alert(search_query)
        table.fnFilter(search_query)

    });
    function renderContacts(index,item) {
        var htmlStr = '';
        htmlStr += '<tr>'
        htmlStr += '<td>'+item.contacts.id+'</td>'
        htmlStr += '<td>'+item.contacts.full_name+'</td>'
        htmlStr += '<td>'+item.contacts.email+'</td>'
        htmlStr += '<td>'+item.contacts.phone+'</td>'
        htmlStr += '</tr>'
        $('#contact_body_render').append(htmlStr);
    }
    
  
    
});