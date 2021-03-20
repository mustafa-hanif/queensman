$(document).ready(function () {
    $('#demo').carousel({
        interval: false
    });
    var admin_id = localStorage.getItem('admin_1d');
    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;
    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    var selected_client = '';
    var owned_property = new Array();
    var leased_property = new Array();
    var selected_property = '';
    var report_type = '';
    var report_pdf_file = '';
    var fileURL = '';
    var reporting_date = '';
    var base64PDF = '';
    $(document).on('click', '.client_checkbox', function () {
        $('#prop_indicator').fadeOut();
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
        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientOwnedPropertiesViaClientID.php?ID=' + selected_client;
        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.server_response != -1) {
                $.each(data.server_response, function (index, item) {
                    owned_property.push(item);
                });
            }
            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientLeasedPropertiesViaClientID.php?ID=' + selected_client;
            $.get(link, function (data, textStatus, jqXHR) {
                console.log(data)
                if (data.server_response != -1) {
                    $.each(data.server_response, function (index, item) {
                        leased_property.push(item);
                    });
                }
                renderProperties();
                console.log(leased_property);
                console.log(owned_property)
            });
        });

    });

    function renderProperties() {
        $('#property_slider').empty();
        // $('#property_slider').html();
        isowned = false;
        for (var i = 0; i < owned_property.length; i++) {
            var htmlstr = '';
            isowned = true;
            if (i == 0) {
                htmlstr += '<div class="item active">'
            } else {
                htmlstr += '<div class="item">'
            }
            // htmlstr += '<div class="modal-body">'
            // htmlstr += '<h5 class="modal-client">CLIENT DETAILS1</h5>'
            // htmlstr += '<p class="details">Callout ID: 2791</p>'
            // htmlstr += '<p class="details">Client Name: Saad Ali</p>'
            // htmlstr += '<p class="details">Phone: +428717293</p>'
            // htmlstr += '<p class="details">Client Email: spence@gmail.com</p>'
            // htmlstr += '<p class="details">CNIC: 32201-12342343-8</p>'
            // htmlstr += '<p class="details">Date Joined: 17/10/90</p>'
            // htmlstr += '<p class="details">Address: G13 Street 4</p>     '
            // htmlstr += '<h5 class="modal-client">CALLOUT DETAILS</h5>'
            // htmlstr += '<p class="details">DOB: 17/10/90</p>'
            // htmlstr += '<p class="details">Job Type: Woodworks</p>'
            // htmlstr += '<p class="details">Location: United Arab Emirates</p>'
            // htmlstr += '<p class="details">Rating: 4.5</p>'
            // htmlstr += '<p class="details">Total Callout: 20</p>'

            htmlstr += '<h5 class="modal-client">PROPERTY DETAILS</h5>'
            htmlstr += '<p class="details">Property ID:' + owned_property[i].owned_properties.property_id + '</p>'
            htmlstr += '<p class="details">Country: ' + owned_property[i].owned_properties.country + '</p>'
            htmlstr += '<p class="details">Property Address: ' + owned_property[i].owned_properties.address + '</p>'
            htmlstr += '<p class="details">Comunity: ' + owned_property[i].owned_properties.community + '</p>'
            htmlstr += '<p class="details">City: ' + owned_property[i].owned_properties.city + '</p>'
            htmlstr += '<div class="jobdetails" >'
            htmlstr += '<button id="' + owned_property[i].owned_properties.property_id + '-owned" type="button" class="btn btn-pri btn-sm select_prop_btn">Select This Property</button>'
            htmlstr += '</div>'
            htmlstr += '</div>'
            htmlstr += "</div>"
            $('#property_slider').append(htmlstr);
        }
        for (var i = 0; i < leased_property.length; i++) {
            var htmlstr = '';
            console.log(isowned)
            if (i == 0 && isowned == false) {
                htmlstr += '<div class="item active">'
            } else {
                htmlstr += '<div class="item">'
            }
            htmlstr += '<div class="modal-body">'
            // htmlstr += '<h5 class="modal-client">CLIENT DETAILS1</h5>'
            // htmlstr += '<p class="details">Callout ID: 2791</p>'
            // htmlstr += '<p class="details">Client Name: Saad Ali</p>'
            // htmlstr += '<p class="details">Phone: +428717293</p>'
            // htmlstr += '<p class="details">Client Email: spence@gmail.com</p>'
            // htmlstr += '<p class="details">CNIC: 32201-12342343-8</p>'
            // htmlstr += '<p class="details">Date Joined: 17/10/90</p>'
            // htmlstr += '<p class="details">Address: G13 Street 4</p>     '
            // htmlstr += '<h5 class="modal-client">CALLOUT DETAILS</h5>'
            // htmlstr += '<p class="details">DOB: 17/10/90</p>'
            // htmlstr += '<p class="details">Job Type: Woodworks</p>'
            // htmlstr += '<p class="details">Location: United Arab Emirates</p>'
            // htmlstr += '<p class="details">Rating: 4.5</p>'
            // htmlstr += '<p class="details">Total Callout: 20</p>'

            htmlstr += '<h5 class="modal-client">PROPERTY DETAILS</h5>'
            htmlstr += '<p class="details">Property ID:' + leased_property[i].leased_properties.property_id + '</p>'
            htmlstr += '<p class="details">Country: ' + leased_property[i].leased_properties.country + '</p>'
            htmlstr += '<p class="details">Property Address: ' + leased_property[i].leased_properties.address + '</p>'
            htmlstr += '<p class="details">Comunity: ' + leased_property[i].leased_properties.community + '</p>'
            htmlstr += '<p class="details">City: ' + leased_property[i].leased_properties.city + '</p>'
            htmlstr += '<p class="details">Lease ID: ' + leased_property[i].leased_properties.lease_id + '</p>'
            htmlstr += '<p class="details">Lease Start Date: ' + leased_property[i].leased_properties.lease_start + '</p>'
            htmlstr += '<p class="details">Lease End Date: ' + leased_property[i].leased_properties.lease_end + '</p>'
            htmlstr += '<div class="jobdetails" >'
            htmlstr += '<button id="' + leased_property[i].leased_properties.property_id + '-leased" type="button" class="btn btn-pri btn-sm select_prop_btn">Select This Property</button>'
            htmlstr += '</div>'
            htmlstr += '</div>'
            htmlstr += "</div>"
            $('#property_slider').append(htmlstr);
        }
    }
    $(document).on('click', '.select_prop_btn', function () {
        selected_property = $(this).attr('id');
        console.log(selected_property.split('-'));
    });

    $('.report_type_btn').click(function (e) {
        report_type = $(this).children().text()
    });

    $(document).on('change', '#report_pdf', function () { UploadPDFHandler(this); });
    function UploadPDFHandler(input) {
        console.log('in handler')
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            // console.log(input.files[0])
            reader.onload = function (e) {
                console.log(input.files[0])
                report_pdf_file = input.files[0];
                base64PDF = e.target.result

                // console.log(e.target.result)
                // window.open(URL.createObjectURL(input.files[0]));
                // var objbuilder = '';
                // objbuilder += ('<object width="100%" height="100%"      data="data:application/pdf;base64,');
                // objbuilder += (e.target.result);
                // objbuilder += ('" type="application/pdf" class="internal">');
                // objbuilder += ('<embed src="data:application/pdf;base64,');
                // objbuilder += (e.target.result);
                // objbuilder += ('" type="application/pdf" />');
                // objbuilder += ('</object>');
                // var win = window.open("","_blank","titlebar=yes");
                // $(win.document.body).html(objbuilder);
                // win.document.title = "My Title";
                // win.document.write('<html><body>');
                // win.document.write(objbuilder);
                // win.document.write('</body></html>');
                // layer = jQuery(win.document);
                fileURL = URL.createObjectURL(input.files[0]);
                console.log(fileURL);

                // reader.readAsDataURL(input.files[0]);

                // if (img1 == '') {
                //     img1 = input.files[0];
                //     $('#blah').attr('src', e.target.result);

                // } else if (img2 == '') {
                //     img2 = input.files[0];
                //     $('#blah2').attr('src', e.target.result);

                //     // console.log('in img 2')
                //     // console.log(e.target)
                // } else if (img3 == '') {
                //     img3 = input.files[0];
                //     $('#blah3').attr('src', e.target.result);
                //     // console.log('in img 3')
                //     // console.log(e.target)
                // } else if (img4 == '') {
                //     img4 = input.files[0];
                //     $('#blah4').attr('src', e.target.result);
                //     // console.log('in img 4')
                //     // console.log(e.target)
                // } else {
                //     $('#test-upload-img').text('select upto 4 images');
                // }
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
    $(document).on('click', '#prew_pdf', function (e) {

        console.log(fileURL)
        // window.open(fileURL)
        $('#pdf_tag').attr('href', fileURL);
        $('#pdf_tag').click();
        window.open($('#pdf_tag').attr('href'))
    });
    $('#save_change_btn_report').click(function (e) {
        e.preventDefault();
        $('#modal_header').fadeOut();
        $('#modal_footer').fadeOut();
        $('#modal_txt').fadeOut();
        $('#main_section_loader_report').fadeIn();
        // alert(report_type)
        if(report_type == 'Management Report'){

            var link_report = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadManagementReport_b.php?client_id=' + selected_client + '&property_id=' + selected_property.split('-')[0] + '&report_date=' + reporting_date + '&report_location=reports/' + report_pdf_file.name
            console.log(link_report)
            $.get(link_report, function (data, textStatus, jqXHR) {
                console.log(data)
                if (data.server_responce == 'Successfully Submitted Report Location in Database.') {
                    formdata = new FormData();
                    file = report_pdf_file;
                    formdata.append("photo", file);
                    // // console.log(formdata);
                    $.ajax({
                        url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadManagementReport_a.php',
                        type: "POST",
                        data: formdata,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            console.log(result)
                            setTimeout(function () { window.location.reload(); }, 2500);

                        },
                        error: function (data) {
                            console.log(data)
                            setTimeout(function () { window.location.reload(); }, 2500);

                        },
                    });
                } else {
                    // alert('failed to update report DB')
                }

            });
        } else if(report_type == 'Monthly Report'){

            var link_report = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadMonthlyServicesReport_b.php?client_id=' + selected_client + '&property_id=' + selected_property.split('-')[0] + '&report_date=' + reporting_date + '&report_location=reports/' + report_pdf_file.name
            console.log(link_report)
            $.get(link_report, function (data, textStatus, jqXHR) {
                console.log(data)
                if (data.server_responce == 'Successfully Submitted Report Location in Database.') {
                    formdata = new FormData();
                    file = report_pdf_file;
                    formdata.append("photo", file);
                    // // console.log(formdata);
                    $.ajax({
                        url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadMonthlyServicesReport_a.php',
                        type: "POST",
                        data: formdata,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            console.log(result)
                            setTimeout(function () { window.location.reload(); }, 2500);

                        },
                        error: function (data) {
                            console.log(data)
                            setTimeout(function () { window.location.reload(); }, 2500);

                        },
                    });
                } else {
                    // alert('failed to update report DB')
                }

            });
        }  else if(report_type == 'Market Report'){

            var link_report = 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadMarketReport_b.php?client_id=' + selected_client + '&property_id=' + selected_property.split('-')[0] + '&report_date=' + reporting_date + "&report_location=reports/" + report_pdf_file.name
            console.log(link_report)
            $.get(link_report, function (data, textStatus, jqXHR) {
                console.log(data)
                if (data.server_responce == 'Successfully Submitted Report Location in Database.') {
                    formdata = new FormData();
                    file = report_pdf_file;
                    formdata.append("photo", file);
                    // // console.log(formdata);
                    $.ajax({
                        url: 'https://www.queensman.com/phase_2/queens_admin_Apis/uploadMarketReport_a.php',
                        type: "POST",
                        data: formdata,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            console.log(result)
                            setTimeout(function () { window.location.reload(); }, 2500);

                        },
                        error: function (data) {
                            console.log(data)
                            setTimeout(function () { window.location.reload(); }, 2500);

                        },
                    });
                } else {
                    // alert('failed to update report DB')
                }

            });
        }else {
            // alert('none')
        }
        // alert('successfully submitted pdf: ');
        $('#modal_txt').text('Succeccfully Submitted ' + report_type);
        $('#modal_txt').fadeIn();
        $('#main_section_loader_report').fadeOut();
    });
    $('#upload_report_btn').click(function (e) {
        e.preventDefault();
        // alert('submit report');
        reporting_date = $('#reporting_date').val();
        console.log(selected_client + ' | ' + selected_property + ' | ' + report_type + ' | ' + report_pdf_file + ' | ' + reporting_date);
        if (selected_client != '') {
            if (selected_property != '') {
                if (report_type != '') {
                    if (report_pdf_file != '') {
                        if (reporting_date != '') {
                            $('#modal_submit_report').modal();
                            
                        } else {
                            // alert('select reporting date');
                            $('#modal_select_reporting_date').modal();

                        }
                    } else {
                        // alert('upload pdf');
                        $('#modal_select_upload_pdf').modal();

                    }
                } else {
                    // alert('select report type');
                    $('#modal_select_report_type').modal();

                }
            } else {
                // alert('select property');
                $('#modal_select_property').modal();

            }
        } else {
            // alert('select client');
            $('#modal_select_client').modal();
        }
    });
});