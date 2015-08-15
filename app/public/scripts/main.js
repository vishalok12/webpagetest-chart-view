(function() {
    "use strict";

    var data = {};

    $( () => {
        $('#url-list').on('change', loadDataAndRenderChart);
        $('#graph-fields').multipleSelect({
            width: 200,
            placeholder: 'Select Metrics',
            onClose: function() {
                showSelectedMetricsInChart('#container');
                showSelectedMetricsInChart('#repeat-view-container');
            },
        });

        $("#graph-fields").multipleSelect("setSelects", ['docTime', 'render', 'firstPaint']);
    });

    function showSelectedMetricsInChart(chartContainerSelector) {
        let selectedMetrics = getSelectedMetrics();
        let chart = $(chartContainerSelector).highcharts();

        chart.series.map( c => {
            if (selectedMetrics.indexOf(c.name.toLowerCase()) > -1) {
                c.show();
            } else {
                c.hide();
            }
        });
    }

    function loadDataAndRenderChart(e) {
        var url = $(e.target).val();

        getData(url, renderChart);
    }

    function getPath(url) {
        return url.replace(/(http|https):\/\//, '');
    }

    function getData(url, callback) {
        if (data[url]) {
            return callback(data[url]);
        }

        $.get('/data/' + getPath(url) + '/data.json', (response) => {
            data[url] = response;
            callback(response);
        });
    }

    function renderChart(data) {
        // destroy current charts if exists
        if ($('#container').highcharts()) {
            $('#container').highcharts().destroy();
        }
        if ($('#repeat-view-container').highcharts()) {
            $('#repeat-view-container').highcharts().destroy();
        }

        // render new charts
        renderChartView(data, 'firstView', '#container', {title: 'First View Performance'});
        renderChartView(data, 'repeatView', '#repeat-view-container', {title: 'Repeat View Performance'});
    }

    function renderChartView(data, viewType, chartContainerSelector, options) {
        let xAxisCategories = data.map( value => value.runTime );
        let seriesData = getMetricsData(data, viewType);

        $(chartContainerSelector).highcharts({
            title: {
                text: options.title || 'Chart View'
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter() {
                        return Highcharts.dateFormat('%b %d, %Y', this.value);
                    }
                },
                categories: xAxisCategories,
                title: {
                    text: 'Releases'
                }
            },
            yAxis: {
                title: {
                    text: 'Time (ms)'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: 'ms',
                xDateFormat: '%b %d, %Y'
            },
            series: seriesData
        });
    }

    function getMetricsData(data, viewType) {
        let metrics = [];
        $('#graph-fields').find('option').each(function() {
            metrics.push($(this).val().trim());
        });

        let selectedMetrics = getSelectedMetrics();

        return metrics.map( metric => {
            return {
                name: metric.trim(),
                data: data.map( value => value.average[viewType][metric] ),
                visible: selectedMetrics.indexOf(metric.toLowerCase()) > -1 ? true : false
            };
        });
    }

    function getSelectedMetrics() {
        return $('#graph-fields').multipleSelect("getSelects", 'text')
            .map( metric => metric.trim().toLowerCase() );

    }

})();
