function onLoad() {
    createRecordsTable()
}

function addCell(row, text) {
    let cell = row.insertCell();
    cell.style.border = "1px solid black";
    cell.style.textAlign = "center";
    cell.appendChild(document.createTextNode(text));
}

function createRecordsTable(){
    let records = JSON.parse(window.localStorage["game.records"]);
    let table = document.getElementById("records-table");
    let rows = []

    for (let player in records) {
        rows.push({username: player, score: records[player]})
    }

    rows.sort((a, b) => {
        return b.score - a.score;
    });

    for (let i = 0; i < rows.length; ++i) {
        let row = table.insertRow();
        addCell(row, rows[i].username);
        addCell(row, rows[i].score);
    }
}

function redirectToGame() {
    window.location.href = "/game";
}