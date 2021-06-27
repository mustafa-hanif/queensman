
$(document).ready(function () {
    var admin_id = localStorage.getItem('admin_1d');

    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAdminProfile.php?admin_id=' + admin_id;

    $.get(link,function (data, textStatus, jqXHR) {
        console.log(data.server_response)
        $('.admin_name_top').text(data.server_response.full_name); 
    });
    date = new Date();
    var current_month = date.getMonth() + 1;
    var final_month_array = new Array();
    var data_chart1 = new Array();
    var data_chart2 = new Array();
    var data_chart3 = new Array();
    var data_chart4 = new Array();
    var data_array_c1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var data_array_c2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var data_array_c3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var data_array_c4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // uea_total_month array
    var job_Stat = [0,0,0,0,0,0,0]
    

    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchServicesCount.php';

    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data.server_response);
        $.each(data.server_response, function (index, item) {
            job_Stat[0] +=  parseInt(item.services['COUNT(callout.id)']);

            if (item.services.status == 'Requested') {
                $('#scheduled_count').text(item.services['COUNT(callout.id)']);
                job_Stat[1] +=  item.services['COUNT(callout.id)'];

            } else if (item.services.status == 'Planned') {
                $('#planned_count').text(item.services['COUNT(callout.id)']);
                job_Stat[2] +=  item.services['COUNT(callout.id)'];

            }if (item.services.status == 'Job Assigned') {
                $('#assigned_count').text(item.services['COUNT(callout.id)']);
                job_Stat[3] +=  item.services['COUNT(callout.id)'];

            } if (item.services.status == 'In Progress') {
                $('#inprogress_count').text(item.services['COUNT(callout.id)']);
                job_Stat[4] +=  item.services['COUNT(callout.id)'];

            } else if (item.services.status == 'Closed') {
                $('#closed_count').text(item.services['COUNT(callout.id)']);
                job_Stat[5] +=  item.services['COUNT(callout.id)'];

            }  if (item.services.status == 'Cancelled') {
                $('#cancelled_count').text(item.services['COUNT(callout.id)']);
                job_Stat[6] +=  item.services['COUNT(callout.id)'];
            }
        });
        console.log(job_Stat)
        let myChart5 = document.getElementById('myChart5').getContext('2d');
// Global Options
Chart.defaults.global.defaultFontFamily = 'Poppins';
Chart.defaults.global.defaultFontSize = 10;
Chart.defaults.global.defaultFontColor = '#777';

let massPopChart5 = new Chart(myChart5, 
{
    type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data:
    {
        labels:['All','Requested','Planned','Job Assigned','In Progress','Closed','Cancelled'],
        datasets:
        [
            {
                data: job_Stat,
                // [
                //     47,
                //     27,
                //     32,
                //     28,
                //     22,
                //     40
                // ],
                backgroundColor:'#052244',
                borderWidth:1,
                borderColor:'#052244',
                hoverBorderWidth:3,
                hoverBorderColor:'#052244'
            },
        ]
    },
    options:
    {
        responsive: true,
        title:
        {
            display:true,
            text:'',
            fontSize:25
        },
        legend:
        {
            display:false,
            position:'top',
            labels:
            {
                fontColor:'#000'
            }
        },
        layout:
        {
            padding:
            {
                left:50,
                right:0,
                bottom:0,
                top:10
            }
        },
        tooltips:
        {
            enabled:true
        }
    }
});
        $('#main_section_loader').fadeOut();
        $('.callout_count_div').fadeIn();
    });


    link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientCountInUAE.php';

    $.get(link, function (data, textStatus, jqXHR) {
        console.log(data);
        
        $.each(data.server_response, function (index, item) {
            console.log(item.client_count.month)
            if (parseInt(item.client_count.month) == 1) {
                data_array_c1[1 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 2) {
                data_array_c1[2 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 3) {
                data_array_c1[3 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 4) {
                data_array_c1[4 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 5) {
                data_array_c1[5 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 6) {
                data_array_c1[6 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 7) {
                data_array_c1[7 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 8) {
                data_array_c1[8 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 9) {
                // alert('haha')
                data_array_c1[9 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 10) {
                data_array_c1[10 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 11) {
                data_array_c1[11 - 1] += parseInt(item.client_count.num_of_clients);
            } else if (parseInt(item.client_count.month) == 12) {
                data_array_c1[12 - 1] += parseInt(item.client_count.num_of_clients);
            }

        });
        console.log(data_array_c1)

        // data_chart1 = data_array_c1;
        // final_month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchClientCountInUK.php';

        $.get(link, function (data, textStatus, jqXHR) {
            console.log(data.server_response);
            // var data_array_c2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $.each(data.server_response, function (index, item) {
                console.log(item.client_count.month)
                if (parseInt(item.client_count.month) == 1) {
                    data_array_c2[1 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 2) {
                    data_array_c2[2 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 3) {
                    data_array_c2[3 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 4) {
                    data_array_c2[4 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 5) {
                    data_array_c2[5 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 6) {
                    data_array_c2[6 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 7) {
                    data_array_c2[7 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 8) {
                    data_array_c2[8 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 9) {
                    data_array_c2[9 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 10) {
                    data_array_c2[10 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 11) {
                    data_array_c2[11 - 1] += parseInt(item.client_count.num_of_clients);
                } else if (parseInt(item.client_count.month) == 12) {
                    data_array_c2[12 - 1] += parseInt(item.client_count.num_of_clients);
                }

            });
            // data_chart2 = data_array_c2;
            // final_month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];



            link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAvgJobRatingInUAE.php';

            $.get(link, function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.server_response != "") {
                    // var data_array_c3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    $.each(data.server_response, function (index, item) {
                        // console.log(item.avg_rating.month)
                        if (parseInt(item.avg_rating.month) == 1) {
                            data_array_c3[1 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 2) {
                            data_array_c3[2 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 3) {
                            data_array_c3[3 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 4) {
                            data_array_c3[4 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 5) {
                            data_array_c3[5 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 6) {
                            data_array_c3[6 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 7) {
                            data_array_c3[7 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 8) {
                            data_array_c3[8 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 9) {
                            data_array_c3[9 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 10) {
                            data_array_c3[10 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 11) {
                            data_array_c3[11 - 1] += parseInt(item.avg_rating.avg_rating);
                        } else if (parseInt(item.avg_rating.month) == 12) {
                            data_array_c3[12 - 1] += parseInt(item.avg_ratings.avg_rating);
                        }

                    });
                    // data_chart3 = data_array_c3;
                    console.log(data_array_c3)
                    // final_month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

                }

                link = 'https://www.queensman.com/phase_2/queens_admin_Apis/fetchAvgJobRatingInUK.php';

                $.get(link, function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.server_response != "") {
                        // var data_array_c4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        $.each(data.server_response, function (index, item) {
                            // console.log(item.avg_rating.month)
                            if (parseInt(item.avg_rating.month) == 1) {
                                data_array_c4[1 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 2) {
                                data_array_c4[2 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 3) {
                                data_array_c4[3 - 1] += parseInt(item.client_count.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 4) {
                                data_array_c4[4 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 5) {
                                data_array_c4[5 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 6) {
                                data_array_c4[6 - 1] += parseInt(item.client_count.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 7) {
                                data_array_c4[7 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 8) {
                                data_array_c4[8 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 9) {
                                data_array_c4[9 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 10) {
                                data_array_c4[10 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 11) {
                                data_array_c4[11 - 1] += parseInt(item.avg_rating.avg_rating);
                            } else if (parseInt(item.avg_rating.month) == 12) {
                                data_array_c4[12 - 1] += parseInt(item.avg_rating.avg_rating);
                            }

                        });
                        // data_chart4 = data_array_c4;
                        final_month_array = new Array();
                        // month_array = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                        alert('asdasd')
                        console.log(current)
                        for (i=current_month ;i<month_array.length;i++){
                            final_month_array.push(month_array[i]);
                            data_chart1.push(data_array_c1[i])
                            data_chart2.push(data_array_c2[i])
                            data_chart3.push(data_array_c3[i])
                            data_chart4.push(data_array_c4[i])
                        }
                        for (i=0 ;i<current_month;i++){
                            final_month_array.push(month_array[i]);
                            data_chart1.push(data_array_c1[i])
                            data_chart2.push(data_array_c2[i])
                            data_chart3.push(data_array_c3[i])
                            data_chart4.push(data_array_c4[i])

                        }

                        
                    }
                    final_month_array = new Array();
                        // month_array = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                        // alert('asdasd')
                        // console.log(current)
                        for (i=current_month ;i<month_array.length;i++){
                            final_month_array.push(month_array[i]);
                            data_chart1.push(data_array_c1[i])
                            data_chart2.push(data_array_c2[i])
                            data_chart3.push(data_array_c3[i])
                            data_chart4.push(data_array_c4[i])
                        }
                        for (i=0 ;i<current_month;i++){
                            final_month_array.push(month_array[i]);
                            data_chart1.push(data_array_c1[i])
                            data_chart2.push(data_array_c2[i])
                            data_chart3.push(data_array_c3[i])
                            data_chart4.push(data_array_c4[i])

                        }
                    renderTotalUAEClientsGraph(data_chart1, final_month_array)
                    renderTotalUKClientsGraph(data_chart2, final_month_array);
                    renderAvgUAERating(data_chart3, final_month_array)
                    renderAvgUKRating(data_chart4, final_month_array)
                    $('#graph_section_loader').fadeOut();
                    $('#graph_section_div').fadeIn();
                });
            });

        });





    });
});

/* Chart 1 */
function renderTotalUAEClientsGraph(data_array, month_array) {
    let myChart = document.getElementById('myChart').getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Poppins';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let massPopChart = new Chart(myChart,
        {
            type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:
            {
                labels: month_array,
                datasets:
                    [
                        {
                            label: 'Number of UAE Clients',
                            data: data_array,/*
                    backgroundColor:
                    [
                        '#2196F3',
                        '#AED6F1',
                        '#2196F3',
                        '#AED6F1',
                        '#2196F3',
                        '#AED6F1'
                    ],*/
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#052244',
                            hoverBorderWidth: 3,
                            hoverBorderColor: '#000',
                        },
                    ]
            },
            options:
            {
                responsive: true,
                title:
                {
                    display: true,
                    text: '',
                    fontSize: 25
                },
                legend:
                {
                    display: true,
                    position: 'top',
                    labels:
                    {
                        fontColor: '#000'
                    }
                },
                layout:
                {
                    padding:
                    {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0
                    }
                },
                tooltips:
                {
                    enabled: true
                }
            }
        });

}

/* Chart 2 */

function renderTotalUKClientsGraph(data_array, month_array) {
    let myChart2 = document.getElementById('myChart2').getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Poppins';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let massPopChart2 = new Chart(myChart2,
        {
            type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:
            {
                labels: month_array,
                datasets:
                    [
                        {
                            label: 'Number of UK Clients',
                            data: data_array,/*
                backgroundColor:
                [
                    '#2196F3',
                    '#AED6F1',
                    '#2196F3',
                    '#AED6F1',
                    '#2196F3',
                    '#AED6F1'
                ],*/
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#052244',
                            hoverBorderWidth: 3,
                            hoverBorderColor: '#000'
                        },
                    ]
            },
            options:
            {
                responsive: true,
                title:
                {
                    display: true,
                    text: '',
                    fontSize: 25
                },
                legend:
                {
                    display: true,
                    position: 'top',
                    labels:
                    {
                        fontColor: '#000'
                    }
                },
                layout:
                {
                    padding:
                    {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0
                    }
                },
                tooltips:
                {
                    enabled: true
                }
            }
        });
}

/* Chart 3 */
function renderAvgUAERating(data_array, month_array) {
    let myChart3 = document.getElementById('myChart3').getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Poppins';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let massPopChart3 = new Chart(myChart3,
        {
            type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:
            {
                labels: month_array,
                datasets:
                    [
                        {
                            label: 'Average Rating of UAE Clients',
                            data: data_array,/*
                    backgroundColor:
                    [
                        '#2196F3',
                        '#AED6F1',
                        '#2196F3',
                        '#AED6F1',
                        '#2196F3',
                        '#AED6F1'
                    ],*/
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#052244',
                            hoverBorderWidth: 3,
                            hoverBorderColor: '#000'
                        },
                    ]
            },
            options:
            {
                responsive: true,
                title:
                {
                    display: true,
                    text: '',
                    fontSize: 25
                },
                legend:
                {
                    display: true,
                    position: 'top',
                    labels:
                    {
                        fontColor: '#000'
                    }
                },
                layout:
                {
                    padding:
                    {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0
                    }
                },
                tooltips:
                {
                    enabled: true
                }
            }
        });
}

/* Chart 4 */
function renderAvgUKRating(data_array, month_array) {
    let myChart4 = document.getElementById('myChart4').getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Poppins';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let massPopChart4 = new Chart(myChart4,
        {
            type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:
            {
                labels: month_array,
                datasets:
                    [
                        {
                            label: 'Average Rating of UK Clients',
                            data: data_array,/*
                backgroundColor:
                [
                    '#2196F3',
                    '#AED6F1',
                    '#2196F3',
                    '#AED6F1',
                    '#2196F3',
                    '#AED6F1'
                ],*/
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#052244',
                            hoverBorderWidth: 3,
                            hoverBorderColor: '#000'
                        },
                    ]
            },
            options:
            {
                responsive: true,
                title:
                {
                    display: true,
                    text: '',
                    fontSize: 25
                },
                legend:
                {
                    display: true,
                    position: 'top',
                    labels:
                    {
                        fontColor: '#000'
                    }
                },
                layout:
                {
                    padding:
                    {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0
                    }
                },
                tooltips:
                {
                    enabled: true
                }
            }
        });
}

/* Chart 5 */



