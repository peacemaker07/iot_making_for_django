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
                // .pipe(function(json) {
                //     // console.log("success");
                //     var params = {'json': json};
                //     var hvfChart = new HvfChart(params);
                //     hvfChart.setChart();
                //     $('#js-logger-datas').val(JSON.stringify(json));
                //     return json;
                // })
                // 加工したデータをDataTablesのコールバック関数へ流します。
                .done(fnCallback)
                .fail(function (data) {
                    console.log("fail")
                });
            }
        });
    }

};

var webCommons = {

    dispRange: function(val) {
        return (val < 500 && val > -40);
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

    getStrDate: function(targetDate){

        const y = targetDate.getFullYear();
        let m = targetDate.getMonth() + 1;
        let d = targetDate.getDate();
        m = ('0' + m).slice(-2);
        d = ('0' + d).slice(-2);

        return y + '-' + m + '-' + d;
    },

    clearTableAndGraph: function(dataTable){
        dataTable.destroy();
        $('.js-iot-making-data-list tbody').empty();
        // webCommons.clearGraph();
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
