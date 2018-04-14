$(document).ready(function () {

    $("#generar").click(function () {
        clearFields();

        if($("#unidad").val() == '' || $("#unidad").val() == ""){
            alert("El valor de la unidad no puede estar vacío");
            return;
        }
        var unidad = (parseFloat(($.trim($("#unidad").val())).replace(",", "."))).toFixed(2);
        var betLines = $("#betData").val().split("\n");
        var betData = treatBetData(betLines);

        $("#resultado").append(getExcelFromBetLine(betData, unidad));
    });

    $("#borrar").click(function () {
        clearFieldsVal();
    });
});


function treatBetData(betLines) {
    var bet = [];
    var betList = [];
    var resultLine;

    for (var i = 0; i < betLines.length; i++) {
        resultLine = '';
        resultLine = treatBetLine(betLines[i]);
        if (resultLine != "") {
            bet.push(resultLine);
        }
        if (resultLine[2]) {
            betList.push(bet);
            bet = [];
        }
    }
    return betList;
}

function treatBetLine(betLine) {
    var result = '';

    //linea de apuesta y cuota
    if (betLine.indexOf('@') != -1) {
        result = [$.trim(betLine.substr(0, betLine.indexOf('@'))), $.trim(betLine.substr(betLine.indexOf('@') + 1, betLine.length)).replace(",", ".")];
    }

    //linea de ganancias
    if (betLine.indexOf('/') != -1 && betLine.indexOf(':') != -1) {
        var timeData = betLine.split(' ');
        var date = timeData[0];
        var data = timeData[1].split('	');
        var amount = data[1].replace(",", ".");
        var resultBetAmount = data[2].replace(",", ".");
        var resultBet = 'V';
        if (parseFloat(resultBetAmount) < parseFloat(amount)) {
            resultBet = 'L';
        }
        if (parseFloat(resultBetAmount) > parseFloat(amount)) {
            resultBet = 'W';
        }
        result = [date, amount, resultBetAmount, resultBet];
    }

    return result;
}

function getExcelFromBetLine(excelData, unidad) {
    var excelMap = [];
    var excelLine;
    for (var i = 0; i < excelData.length; i++) {
        excelLine = excelData[i];
        excelMap.push(betToExcel(excelLine, unidad));
    }
    
    return orderMap(excelMap);
}

function betToExcel(excelLine, unidad) {
    var object = 0;
    var finalTip = parseFloat(1);
    var line = 'Día ' + (excelLine[excelLine.length - 1][0]).substr(0,2) + ' - ';
    while (excelLine[object].length - 1 < 3) {
        if (object > 0) {
            line = line + ', ';
        }
        line = line + (excelLine[object][0]);
        finalTip = finalTip * parseFloat(excelLine[object][1]);
        object++;
    }

    return line + '\t' + (excelLine[excelLine.length - 1][1]).replace(".", ",") + '\t' + (finalTip.toFixed(3)).replace(".", ",") + '\t' + calculateStake(excelLine[excelLine.length - 1][1], unidad) + '\t' + '\t' + (excelLine[excelLine.length - 1][3]) + '\n';
}

function orderMap(excelMap){
    var orderedMap= [];
    for(var i=excelMap.length;i>0;i--){
        orderedMap.push(excelMap[i-1]);
    }
    return orderedMap;
}

function calculateStake(amount, unidad) {
    return ((amount / unidad).toFixed(2)).replace(".", ",");
}

function clearFields() {
    $("#unidad").html("");
    $("#betData").html("");
    $("#resultado").html("");
}

function clearFieldsVal() {
    $("#betData").val("");
}


