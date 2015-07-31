(function() {
    "use strict";

    $( () => {
        $('#url-list').on('change', loadDataAndRenderChart);
    });

    function loadDataAndRenderChart(e) {
        var url = $(e.target).val();

        getData(url, renderChart);
    }

    function getPath(url) {
        return url.replace(/(http|https):\/\//, '');
    }

    function getData(url, callback) {
        $.get('/data/' + getPath(url) + '/data.json', (data) => {
            callback(data);
        });
    }

    function renderChart(data) {
        renderChartView(data, 'firstView', '#container', {title: 'First View Performance'});
        renderChartView(data, 'repeatView', '#repeat-view-container', {title: 'Repeat View Performance'});
    }

    function renderChartView(data, viewType, chartContainerSelector, options) {
        var xAxisCategories = data.map( value => value.runTime );
        var loadData = data.map( value => value.average[viewType].loadTime );
        var domLoadData = data.map(value => value.average[viewType].docTime );
        var fullyLoadData = data.map( value => value.average[viewType].fullyLoaded );
        var visuallyCompleteData = data.map( value => value.average[viewType].visualComplete );

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
            series: [{
                name: 'Load',
                data: loadData
            },
            {
                name: 'DOM Load',
                data: domLoadData
            },
            {
                name: 'Fully Loaded',
                data: fullyLoadData
            },
            {
                name: 'Visually Complete',
                data: visuallyCompleteData
            }]
        });
    }

})();
