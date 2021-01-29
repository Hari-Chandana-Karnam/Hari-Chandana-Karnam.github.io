function generate_table() {
    var table = document.getElementById("table_input");
    var row = table.insertRow(-1);
        var cell1 = row.insertCell(-1);
        var element1 = document.createElement("td");
        element1.innerHTML = document.getElementById(2).value;
        element1.style.textAlign = "center";
        element1.style.width = "150";
        element1.style.borderColor = "black";
        element1.style.background = "white";
        cell1.appendChild(element1);
        document.getElementById(2).value = '';
}