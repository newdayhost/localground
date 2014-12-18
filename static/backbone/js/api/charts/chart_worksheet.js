//1. put your credentials here:
var username = "vanwars";
var password = "123";
//2. define functions here:
function initialize() {
    //setup AJAX:
    setUpAjax();
    getVariableData(showDraggableVariables);
    
    $('#reset').click(function(){
        getVariableData(showDraggableVariables);
        return false;
    });
}

function setUpAjax() {
    $.ajaxSetup({
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization",
                "Basic " + btoa(username + ":" + password));
        }
    });
}

function getData(callback) {
    $.ajax({
        url: $('#url').val(),
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $("#results").html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            callback(result);
        }
    });
}

function getVariableData(callback) {
    $.ajax({
        url: $('#url').val(),
        type: 'OPTIONS',
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $("#results").html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            callback(result);
        }
    });
}


function showCode(result) {
    var txt = JSON.stringify(result, null, 2);
    $("#results").html('<pre class="prettyprint">' + txt + '</pre>');
    prettyPrint();
}

function showScatter(result) {
    var list = result.results;
    
    //loop through data:
    var data = [];
    $.each(list, function(){
        data.push([this.spider_count, this.soil_compactness]);
    });
    console.log(data);
    $('#results').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        legend: false,
        title: {
            text: 'Spider Count v. Soil Compactness'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Spider Count'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Soil Compactness'
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 15,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>Observation</b><br>',
                    pointFormat: '{point.x} spiders & {point.y} cm deep'
                }
            }
        },
        series: [{
            color: 'rgba(223, 83, 83, .5)',
            data: data
        }]
    });
}

var user_selection = "spider_count";

function showHistogram(result){
    var list = result.results;
    //console.log(list);
    var categories = [];
    var series1 = [];

    $.each(list, function(){
        //console.log("this is this: ", this);
        categories.push(this.team_members);
        series1.push(this[user_selection]);
    });
    console.log("series1: ", series1);
     $('#results').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: user_selection
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: user_selection
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table class="table table-condensed">',
            pointFormat: '<tr><td>{series.name}: </td>' +
                '<td style="border-right: solid 5px {series.color};">{point.y}</td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [
            {
                name: user_selection,
                data: series1
            }
        ]
    });
}

function showDraggableVariables(result) {
    var symbolLookup = function (symbol) {
        switch (symbol) {
            case 'integer':
            case 'decimal':
                return '<i>#</i>';
            case 'string':
                return '<i>Abc</i>';
            default:
                return '?';
        }
    };
    var $theSource = $('#the_source');
    var $theTarget = $('#the_target');
    $theSource.empty();
    $("#results").empty();
    var list = result.actions.POST;
    //exclude system variables
    var excludeList = ["id", "overlay_type", "url", "geometry", "manually_reviewed" , "project_id", "num"];
    
    for (key in list){
        if (excludeList.indexOf(key) == -1) {
            var $el = $('<div></div>')
                .attr("draggable", true)
                .attr("id", key)
                .html(symbolLookup(list[key].type) + " " + key);
            $el.bind('dragstart', function(e){
                $(this).css({
                    'background-color': '#e631ee;'    
                });
                event.dataTransfer.setData('Text', $(this).attr("id"));
                $(this).addClass("highlighted");
            });

            $theSource.append($el);
        }   
    }
    $theSource.bind('dragover', function(e){
        event.preventDefault();
    });
    $theTarget.bind('dragover', function(e){
        event.preventDefault();
    });
    $theSource.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).removeClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        alert("remove variable from chart");
    });
    $theTarget.bind('drop', function(e){
        var field_id = event.dataTransfer.getData('Text');
        var $elem = $('#' + field_id).addClass("chosen").removeClass("highlighted");
        $(this).append($elem);
        //alert("add variable to chart (if it makes sense)");
        //alert($elem.attr("id"));
        user_selection = $elem.attr("id");
        getData(showHistogram);
    });
    //$("#results").append($theSource);
    //$("#results").append($theTarget);
}

//3. call functions here
initialize();



