if (typeof jQuery === "undefined") {
    throw new Error("jQuery plugins need to be before this file");
}

$.DataTBL = {};
$.DataTBL.options = {};

$.DataTBL.iotMakingDatalist = {

    activate: function (contentUrl) {

        return $('.js-iot-making-data-list').DataTable({
            responsive: true,
            bStateSave: true,
            iStateDuration: 60 * 60 * 24,
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            columnDefs: [
                { "targets": 0, data: "send_time"},
                {
                    "targets": 1,
                    data: "temp",
                    "render": function (data, type, full, meta) {
                        return (webCommons.dispRange(data)) ? data : "-";
                    }
                },
                {
                    "targets": 2,
                    data: "humi",
                    "render": function (data, type, full, meta) {
                        return (webCommons.dispRange(data)) ? data : "-";
                    }
                },
                {
                    "targets": 3,
                    data: "lux",
                    "render": function (data, type, full, meta) {
                        return (webCommons.dispRange(data)) ? data : "-";
                    }
                },
                {
                    "targets": 4,
                    data: "loudness",
                    "render": function (data, type, full, meta) {
                        return (webCommons.dispRange(data)) ? data : "-";
                    }
                },
                {
                    "targets": 5,
                    data: "air_quality",
                    "render": function (data, type, full, meta) {
                        return (webCommons.dispRange(data)) ? data : "-";
                    }
                },
                { className: "center", "targets": [ 0, 1, 2, 3, 4, 5, ] }
            ],
            order: [[0, "desc" ]],
            // 遅延レンダリングを設定します。
            // trueにするとAjax通信を非同期で行います。
            // bDeferRender: true,
            // Ajaxの接続先を設定します。
            //sAjaxSource: contentUrl,
            sAjaxSource: "data",
            // Ajax通信方式を設定します。
            // sServerMethod: "GET",
            // 取得JSONのルート文字列を設定します。
            // 省略した場合のデフォルト値は「aaData」です。
            sAjaxDataProp: "",
            // サーバのデータ取得を行います。
            // sSource sAjaxSourceで設定した接続先です。
            // aoData fnServerParamsで設定したパラメータです。
            // fnCallback DataTablesのデータ取得後の描画等を行うコールバック関数です。
            // oSettings DataTablesの設定です。
            fnServerData: function(sSource, aoData, fnCallback, oSettings) {
                // ajaxリクエストからの戻ってくるjqXHRはoSettingsへ格納します。
                oSettings.jqXHR = $.ajax({
                    url: contentUrl,
                    type: "GET",
                    // TODO 同期通信とする
                    async: false
                })
                // サーバから取得したデータを加工します。
                .pipe(function(json) {
                    // console.log("success");
                    const params = {'json': json};
                    const ioTMakingChart = new IoTMakingChart(params);
                    ioTMakingChart.setChart();

                    return json;
                })
                // 加工したデータをDataTablesのコールバック関数へ流します。
                .done(fnCallback)
                .fail(function (data) {
                    console.log("fail")
                });
            }
        });
    }

};

const IoTMakingChart = function(params){
    this.json = params.json;
    if(!params.interval) {
        this.interval = 2;
    } else {
        this.interval = params.interval;
    }
};
IoTMakingChart.prototype = {

    setChart: function(){
        const self = this;
        const labels = [];
        const dataTemp = [];
        const dataHumi = [];
        const dataLux = [];
        const dataLoudness = [];
        const dataAirQuality = [];

        for(let max = self.json.length, idx = 0; idx < max; idx++){
            // if((idx % self.interval) === 0) {
                labels.push(self.json[idx]['send_time'].substr(11, 5));

                self.pushData(dataTemp, self.json[idx]['temp']);
                self.pushData(dataHumi, self.json[idx]['humi']);
                self.pushData(dataLux, self.json[idx]['lux']);
                self.pushData(dataLoudness, self.json[idx]['loudness']);
                self.pushData(dataAirQuality, self.json[idx]['air_quality']);
            // }
        }

        // グラフと日付変更
        const $graphTitleDate = $('.card-title.js-range-date');
        let startDateList = '';
        let endDateList = '';
        let strRangeDate = '';
        try{
            startDateList = self.json[0]['send_time'].split('T');
            endDateList = self.json[self.json.length-1]['send_time'].split('T');
            strRangeDate = startDateList[0] + ' ' + startDateList[1].substr(0, 5) + ' 〜 ' + endDateList[0] + ' ' + endDateList[1].substr(0, 5);
        } catch (e) {
            console.log(e)
        }
        $graphTitleDate.each(function(idx, element){
            $(element).text(strRangeDate);
        });

        const ctxDht = document.getElementById("id-chart1").getContext('2d');
        ctxDht.canvas.height = 25;
        const chartDht = new Chart(ctxDht, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '温度',
                        data: dataTemp,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '湿度',
                        data: dataHumi,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(2, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '空気の品質',
                        data: dataAirQuality,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(255, 200, 132, 1)',
                        borderWidth: 1
                    },
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

        const ctxLux = document.getElementById("id-chart2").getContext('2d');
        ctxLux.canvas.height = 25;
        const chartLux = new Chart(ctxLux, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '明るさ',
                        data: dataLux,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(200, 50, 200, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '音の大きさ',
                        data: dataLoudness,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 132, 70, 1)',
                        borderWidth: 1
                    },
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    },

    pushData: function(dataList, val){
        if(webCommons.dispRange(val)){
            dataList.push(val);
        } else {
            dataList.push(null);
        }
    }
};

const webCommons = {

    dispRange: function(val) {
        return (val < 800 && val > -40);
    },

    createDeviceDropdownMenu: function(url, targetDeviceId){
        const self = this;
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            success: function(json) {
                self.setDeviceDropdownMenuAndItem(targetDeviceId, json)
            },
            error: function() {
                console.log('ajax error');
            }
        });
    },

    setDeviceDropdownMenuAndItem: function(targetDeviceId, deviceList){
        const self = this;

        $('.js-device_id-dropdown-menu').empty();
        deviceList.forEach(function(val, idx){
            const keys = Object.keys(val);
            if(keys.indexOf('device_id') === -1){
                return;
            }
            const device_id = val['device_id'];
            $('.js-device_id-dropdown-menu').append('<a class="dropdown-item js-device_id-dropdown-item" data-device_id="' + device_id + '">' + val['name'] + '</a>');
            if(device_id === targetDeviceId){
                $('.js-device_id-dropdown').text(val['name']);
            }
        });
    },

    isValidDate: function(targetDay) {
        if(!targetDay){
            alert("日付を入力してください");
            return false;
        }
        return true;
    },

    setChartCanvas: function(){
        $('#js-chart1').append('<canvas id="id-chart1" width="100%"></canvas>');
        $('#js-chart2').append('<canvas id="id-chart2" width="100%"></canvas>');
    },

    clearGraph: function(){
        $('#id-chart1').remove();
        $('#id-chart2').remove();
    },

    clearTableAndGraph: function(dataTable){
        dataTable.destroy();
        $('.js-iot-making-data-list tbody').empty();
        webCommons.clearGraph();
    },

    getStrDate: function(targetDate){

        const y = targetDate.getFullYear();
        let m = targetDate.getMonth() + 1;
        let d = targetDate.getDate();
        m = ('0' + m).slice(-2);
        d = ('0' + d).slice(-2);

        return y + '-' + m + '-' + d;
    },

    getUrlVars: function getUrlVars(){
        let vars = {}, max = 0, hash = "", array = "";
        const url = window.location.search;

        if(!url){
            return null;
        }

        //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
        hash  = url.slice(1).split('&');
        max = hash.length;
        for (let i = 0; i < max; i++) {
            array = hash[i].split('=');    // keyと値に分割。
            vars[array[0]] = array[1];
        }

        return vars;
    },

    getQueryString: function(vars, isAdd){
        let query_str = isAdd ? '?' : '';
        for(let key in vars){
            query_str = query_str + key + '=' + vars[key];
        }
        return query_str
    }

};
