getData();
async function getData() {
    const result = await fetch("/api/cmb-status",
        {
            headers: {
                'Accept': 'application/json'
            }
        })
    const unfilteredData = await result.json();
    data = unfilteredData;
    if (result.ok) {
        /*query = document.getElementById("filter").value;
        data = unfilteredData.filter(search, query);
        if (!data) {
            data = unfilteredData;
        }
        console.log(data);*/
        $("#Boot tbody").remove();
        $("#Boot").append(`<tbody>`);
        data.forEach(i => {
            var statusLabel;
            if (i.status === "Started" || i.status === "Finished") {
                statusLabel = '<i class="bi bi-check-circle-fill good-status"></i>';
            }
            else if (i.status === "Error") {
                statusLabel = '<i class="bi bi-exclamation-circle-fill bad-status"></i>';
            }
            else {
                statusLabel = '<i class="bi bi-exclamation-circle-fill unknown-status"></i>';
            }
            if (i.message) {
                $("#Boot tbody").append(`<tr><td>${i.macAddress}</td><td>${i.status}&nbsp;${statusLabel}</td><td>${i.time}</td><td>${i.message}</td></tr>`);
            }
            else {
                $("#Boot tbody").append(`<tr><td>${i.macAddress}</td><td>${i.status}&nbsp;${statusLabel}</td><td>${i.time}</td><td> </td></tr>`);
            }
        })
        $("#Boot").append(`</tbody>`);
    }
    setTimeout(getData, 1000);
}