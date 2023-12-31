
const SHEET_ID = "1iIH5JafHEYD3NusdedZcgGVby21wViVBAk_OyApeFX0";
const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;

const SHEET_NAME = "Remitos";

let query = encodeURIComponent("SELECT *");
const URL = BASE + `sheet=${SHEET_NAME}&headers=1&tq=${query}`;

const output = document.querySelector('.output')
var selected_date;

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
        // console.log(jsData['table']['rows'])
        // console.table(jsData['table']['cols'])
        jsData['table']['rows'].forEach((main) => {
            const row = {}
            main.c.forEach((cell, i) => {
                row[colz[i]] = cell ? cell.v : null
            })
            data.push(row)
        })

        // console.log('_____data _____')
        // console.table(data)
        maker(data);
    })

    // Get the button
    var button = document.querySelector('#print_multiple');
    selected_date = document.getElementById('start').value;



    // Add event listener to the button
    button.addEventListener('click', function () {
        // Get all checkboxes
        var checkboxes = document.querySelectorAll('input[type=checkbox]');
        const selected = [];
        // Iterate over all checkboxes
        for (var i = 0; i < checkboxes.length; i++) {
            // If the checkbox is checked
            if (checkboxes[i].checked) {
                // Log the value of the checkbox
                selected.push(checkboxes[i].value);
            }
        }

        const param = "clientes[]";
        let url = "multiple.html?" + param + "=" + selected.join("&" + param + "=");
        // console.log(url)
        // Open the new window with the url

        // Get the selected date from the date picker
        selected_date = document.getElementById('start').value;

        // If a date is selected, append it to the URL
        if (selected_date) {
            url += "&date=" + selected_date;
        }



        // Open a new tab with the specified URL
        window.open(url, '_blank');
    });


    // Select Completed button
    var btn_select_completed = document.querySelector('#clean_select');

    // Add event listener to the button
    btn_select_completed.addEventListener('click', function () {

        // Get all checkboxes
        var checkboxes = document.querySelectorAll('input[type=checkbox]');

        // Iterate over all checkboxes
        for (var i = 0; i < checkboxes.length; i++) {
            // Clean Selection
            checkboxes[i].checked = false;

        }

    });


});

/**
 * Prints the details of the products and any special prices
* @param {dict} detalles:
{
    "cliente": "PARA KONA",
    "huevo": "campo ",
    "contacto": null,
    "direccion": "CASTAÑEDA 1899",
    "horario": "8.00am",
    "b1": 1,
    "b2": 2,
    "b3": null,
    "c1": null,
    "c2": null,
    "termosel": null,
    "debe": null,
    "gan.uni": null,
    "ingresa rep": null,
    "$b1": 25000,
    "$b2": 24000,
    "campo ": 27000,
    "$c1": null,
    "$c2": null,
    "undefined": null
}

    @returns {string} detalles:
    " b1 - 1: 25000; b2 - 2: 24000 "
 */
function detallesPrinter(detalles) {

    const HUEVOS = ["b1", "b2", "c1", "c2", "campo"]
    const PRECIOS_ESPECIALES = HUEVOS.map((el) => "$" + el);

    const HUEVOS_COMPRADOS = {}

    console.log('+++++++++++++++++++++++');
    console.log(HUEVOS);
    console.log(detalles)

    for (const key in HUEVOS) {
        const element = HUEVOS[key];
        console.log(element, key);
        if (detalles[element]) {
            HUEVOS_COMPRADOS[element] = detalles[element]
        }
    }

    let detallesPrint = "";
    for (const key in HUEVOS_COMPRADOS) {
        const special_price_key = "$" + key;
        const element = HUEVOS_COMPRADOS[key];
        const precio_especial = detalles[special_price_key]

        detallesPrint += `${key} - ${element}`
        if (precio_especial) {
            detallesPrint += `: \$${precio_especial}`
        }
        detallesPrint += "; ";
    }

    return detallesPrint;


}

function get_remito_link(cliente, { date = "" } = {}) {
    let url = `remito.html?cliente=${cliente}`
    if (date) {
        url += `&date=${date}`
    }
    return url
}

function maker(json) {
    var tabla = document.getElementById("clientes-tabla");
    json.forEach((el) => {
        console.log(el)

        var fila = tabla.insertRow();

        var celdaCliente = fila.insertCell(0);
        var total = fila.insertCell(1);
        var celdaLink = fila.insertCell(1);
        var detalles = fila.insertCell(2);
        var checkbox = fila.insertCell(3);

        celdaCliente.innerHTML = el["cliente"];

        selected_date = document.getElementById('start').value;
        console.log("SELECTED_DATE", selected_date)
        // celdaRemito.innerHTML = el.remito;
        const link = get_remito_link(el.cliente, { date: selected_date })
        celdaLink.innerHTML = `<a target="_blank" href="${link}">Ver</a>`

        // Create basic details
        const detallesPrint = detallesPrinter(el)
        detalles.innerHTML = detallesPrint;


        // Create a checkbox
        var checkboxElement = document.createElement('input');
        checkboxElement.type = "checkbox";
        checkboxElement.name = "select";
        checkboxElement.value = `${el.cliente}`;

        // auto select if details exists
        if (detallesPrint && el["cliente"]) {
            checkboxElement.checked = true;
        }




        // Add CSS to make the checkbox larger
        checkboxElement.style.width = "100%";
        checkboxElement.style.height = "100%";

        // Append the checkbox to the third cell
        checkbox.appendChild(checkboxElement);
    })
}



