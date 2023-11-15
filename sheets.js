
const SHEET_ID = "1iIH5JafHEYD3NusdedZcgGVby21wViVBAk_OyApeFX0";
const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;

const SHEET_NAME = "Remitos";

let query = encodeURIComponent("SELECT *");
const URL = BASE + `sheet=${SHEET_NAME}&headers=1&tq=${query}`;

const output = document.querySelector('.output')

document.addEventListener('DOMContentLoaded', function () {
    const data = []
    const colz = []
    
    fetch(URL).then(res => res.text()).then(text => {
        // console.log(text)
        const jsData = JSON.parse(text.substr(47).slice(0, -2))
        // console.table(jsData['table']['rows'])
        jsData.table.cols.forEach((heading) => {
            if (heading.label) {
                const propName = heading.label.toLowerCase();
                // console.log(propName`)
                colz.push(propName)
            }
        })
        console.log(jsData['table']['rows'])
        console.table(jsData['table']['cols'])
        jsData['table']['rows'].forEach((main) => {
            const row = {}
            main.c.forEach((cell, i) => {
                row[colz[i]] = cell ? cell.v : null
            })
            data.push(row)
        })

        console.log('_____data _____')
        console.table(data)
        maker(data);
    })
});

function maker(json) {
    console.log('calling maker')
    
    let first = true
    var tabla = document.getElementById("clientes-tabla");
    json.forEach((el) => {
        console.log('el', el)

        var fila = tabla.insertRow();

        var celdaCliente = fila.insertCell(0);
        var total = fila.insertCell(1);
        var celdaLink = fila.insertCell(1);

        celdaCliente.innerHTML = el["cliente"];
        

        // celdaRemito.innerHTML = el.remito;
        const link = `remito.html?cliente=${el.cliente}`
        celdaLink.innerHTML = `<a target="_blank" href="${link}">Ver</a>`
    })
}

