/* JQuery Event Function */
$(function(){
    $('#makeButton').click(function(evet){
        $('#top-view').hide(0);
        $('#make-setting').fadeIn(750);
        isSetUpOk = false;
    });

    $('#make-setting .addButton').click(function (e) { 
        coladd();
    });

    $('#make-setting .finButton').click(function (e) { 
        if(col_index > 0 && col_sum==100){
            $('#make').slideUp(750);
            $('#use').fadeIn(750);
            isSetUpOk = true;
            fadeInEvaluateTable();
        }else{
            window.alert("評価項目が正しく設定されていません");
        }
    });


    $('#addButton').click(function(evet){
        if(col_index > 0 && isSetUpOk){
            $('#addButton').slideUp(250);
            $('#add-setting').fadeIn(750);
            $('#make-setting').slideUp(750);
        }else{
            window.alert("評価関数の作成または変更の適用が行われていません");
        }
        
    });

    $('#add-setting .finButton').click(function (e) {
        addResult();
    });
});

/* Table setting function */
var col_sum = 0;
var col_num = 0;
var col_index = 0;
var col_flag = [];
var isSetUpOk = false;
function coladd() {
    col_num++;
    col_index++;
    col_flag.push(true);

    var table = document.getElementById("make-setting-table");
    // 行を行末に追加
    var row = table.insertRow(-1);

    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);
    var cell3 = row.insertCell(-1);
    
    cell1.innerHTML = "<p align='center'><input type='text' id='make-setting-table-n" +  col_num + "' class='make-setting-table-n' value='評価項目" + col_num + "' style='width: 95%;'></p>";
    cell2.innerHTML = "<p align='center'><input type='number' id='make-setting-table-p" +  col_num + "' class='make-setting-table-p' value='0' style='width: 50%;'>％</p>"
    cell3.innerHTML = "<input align='center' type='button' value='削除' id='" + col_num + "' onclick='coldel(this)'>";

    tabelOnChange();
}

function coldel(obj) {
    col_index--;
    tr = obj.parentNode.parentNode;
    tr.parentNode.deleteRow(tr.sectionRowIndex);
    col_flag[parseInt(obj.id)-1] = false;

    tabelOnChange();
    paramOnChange();
}

function tabelOnChange(){
    $('.make-setting-table-p').change(function (e) { 
        paramOnChange();
    });
}

function paramOnChange(){
    col_sum = 0;
    for(var i = 0;i < col_flag.length; i++){
        if(col_flag[i] == true){
            col_sum += parseInt($('#make-setting-table-p' + (i+1)).val());
        }
    }

    if(col_sum <= 100){
        $('#make-setting .message').html("優先割合の割り当て可能数 ⇒ 残り" + (100-col_sum) + "%")
    }else{
        $('#make-setting .message').html("優先割合の割り当て可能数を越えています ⇒ " + (col_sum) + "%")
    }
}

/* -------- */
function fadeInEvaluateTable(){
    var default_table = ""
        + "<table id='use-setting-table' width='100%'>"
        + "   <tr>"
        + "        <th width='75%'>評価項目</th>"
        + "        <th>得点(10点)</td>"
        + "    </tr>"
        + "</table>";

    $('#add-setting .setting-table').html(default_table);

    for(var i = 0;i < col_flag.length; i++){
        if(col_flag[i] == true){
            var table = document.getElementById("use-setting-table");
            // 行を行末に追加
            var row = table.insertRow(-1);

            var cell1 = row.insertCell(-1);
            var cell2 = row.insertCell(-1);

            cell1.innerHTML = "<p align='center'>" + $('#make-setting-table-n' + (i+1)).val() + "</p>";
            cell2.innerHTML = "<p align='center'><input type='number' id='use-setting-table-p" +  (i+1) + "' class='use-setting-table-p' value='0' style='width: 50%;'>点</p>"
        }
    }

    $('.use-setting-table-p').change(function (e) { 
        checkPointInput(parseInt($(this).val()));
    });
}

/* --------- */
var result = []; 

function checkPointInput(point){
    if(isNaN(point)){
        window.alert("数値を入力してください")
        return false;
    }else{
        if(point < 1 || point > 10){
            window.alert("10点満点で評価してください (1 ~ 10)")
            return false;
        }else{
            return true;
        }
    }
} 

function addResult(){
    var sum = 0;
    for(var i = 0;i < col_flag.length; i++){
        if(col_flag[i] == true){
            var point = parseInt($('#use-setting-table-p' + (i+1)).val());
            if(!checkPointInput(point)){
                return false;
            }

            var weight = parseInt($('#make-setting-table-p' + (i+1)).val());
            sum += point * (weight * 0.01)
        }
    }

    var title = $('#add-item-name').val();
    addResultTable(title, sum);
    
    $('#add-setting').slideUp(750);
    $('#addButton').fadeIn(1000);


    console.log("title:" + title + " 得点：" + sum);
    result.push({title: title, point: sum});

}

function addResultTable(title, score){
    var table = document.getElementById("result");
    // 行を行末に追加
    var row = table.insertRow(-1);

    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);

    cell1.innerHTML = "<p align='center'>" + title + "</p>";
    cell2.innerHTML = "<p align='center'>" + score.toFixed(3) + "</p>";
}