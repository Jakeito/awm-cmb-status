getData();
async function getData() {
    const result = await fetch("/api/cmb/status",
        {
            headers: {
                'Accept': 'application/json'
            }
        })
    const data = await result.json();
    console.log(data);
    if (result.ok) {
        //Clear table and remake
        $("#Boot tbody").remove();
        $("#Boot").append(`<tbody>`);
        data.forEach(i => {
            //Easier data access with dictionary
            let stepDict = {
                bootloader: undefined,
                sdFormat: undefined,
                sdPopulate: undefined,
                os: undefined,
                validate: undefined,
                time: ""
            };
            let appendString = "";
            appendString += `<tr><td class="mac-address" id="mac-address">${i["mac-address"]}</td>`;

            //Initialize dictionary
            i['steps'].forEach(j => {
                if (j['name'] === 'bootloader') {
                    stepDict.bootloader = j['status'];
                    if (j['message']) {
                        stepDict.message = j['message'];
                    }
                    if (stepDict.time < j['time']) {
                        stepDict.time = j['time'];
                    }
                }
                else if (j['name'] === 'sd-format') {
                    stepDict.sdFormat = j['status'];
                    if (j['message']) {
                        stepDict.message = j['message'];
                    }
                    if (stepDict.time < j['time']) {
                        stepDict.time = j['time'];
                    }
                }
                else if (j['name'] === 'sd-populate') {
                    stepDict.sdPopulate = j['status'];
                    if (j['message']) {
                        stepDict.message = j['message'];
                    }
                    if (stepDict.time < j['time']) {
                        stepDict.time = j['time'];
                    }
                }
                else if (j['name'] === 'os') {
                    stepDict.os = j['status'];
                    if (j['message']) {
                        stepDict.message = j['message'];
                    }
                    if (stepDict.time < j['time']) {
                        stepDict.time = j['time'];
                    }
                }
                else if (j['name'] === 'validate') {
                    stepDict.validate = j['status'];
                    if (j['message']) {
                        stepDict.message = j['message'];
                    }
                    if (stepDict.time < j['time']) {
                        stepDict.time = j['time'];
                    }
                }
            })
            appendString = fillTable(stepDict, appendString);
            if (stepDict.message) {
                appendString += `<td>${stepDict.time}</td><td>${stepDict.message}</td></tr>`;
            }
            else {
                appendString += `<td>${stepDict.time}</td><td></td></tr>`;
            }
            $("#Boot tbody").append(appendString);
        })
        $("#Boot").append(`</tbody>`);
        setTimeout(getData, 1000);
    }
}

$(document).ready(function () {
    $("#clear").click(clear)
})

function clear() {
    $("#Boot tbody").remove();
    const response = fetch("http://127.0.0.1:5000/api/cmb/clear", {
        method: 'POST'
    });
}

function fillTable(j, appendString) {
    if (j.bootloader) {
        statusResult = statusIcon(j.bootloader)
        appendString += `<td>${statusResult[0]}&nbsp;${statusResult[1]}</td>`;
    }
    else {
        appendString += `<td></td>`;
    }
    if (j.sdFormat) {
        statusResult = statusIcon(j.sdFormat)
        appendString += `<td>${statusResult[0]}&nbsp;${statusResult[1]}</td>`;
    }
    else {
        appendString += `<td></td>`;
    }
    if (j.sdPopulate) {
        statusResult = statusIcon(j.sdPopulate)
        appendString += `<td>${statusResult[0]}&nbsp;${statusResult[1]}</td>`;
    }
    else {
        appendString += `<td></td>`;
    }
    if (j.os) {
        statusResult = statusIcon(j.os)
        appendString += `<td>${statusResult[0]}&nbsp;${statusResult[1]}</td>`;
    }
    else {
        appendString += `<td></td>`;
    }
    if (j.validate) {
        statusResult = statusIcon(j.validate)
        appendString += `<td>${statusResult[0]}&nbsp;${statusResult[1]}</td>`;
    }
    else {
        appendString += `<td></td>`;
    }
    return appendString;
}

function statusIcon(inputStatus) {
    var statusLabel;
    var outputStatus;
    if (inputStatus === "success") {
        statusLabel = '<i class="bi bi-check-circle-fill good-status"></i>';
        outputStatus = "Passed"
    }
    else if (inputStatus === "error") {
        statusLabel = '<i class="bi bi-exclamation-circle-fill bad-status"></i>';
        outputStatus = "Failed"
    }
    else {
        statusLabel = '<i class="bi bi-exclamation-circle-fill unknown-status"></i>';
        outputStatus = "Running"
    }
    return [statusLabel, outputStatus];
}

//FILTER WIP
/*$(document).ready(function () {
    $("#filter").keyup(search)
})

function search() {
    var input = $(this).val();
    const response = fetch("http://127.0.0.1:5000/api/cmb/filter?input=" + input, {
        method: 'GET'
    });
}*/
