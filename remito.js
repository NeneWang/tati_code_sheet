const SHEET_ID = "1iIH5JafHEYD3NusdedZcgGVby21wViVBAk_OyApeFX0";
const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;

const SHEET_NAME = "Remitos";
const PRICE_SHEET_NAME = "Precios";

let query = encodeURIComponent("SELECT *");
const URL = BASE + `sheet=${SHEET_NAME}&headers=1&tq=${query}`;

console.log("URL", URL);

const PRODUCTOS = {
    b1: {
        nombre: "Blanco 1",
        precio: 15200,
    },
    b2: {
        nombre: "Blanco 2",
        precio: 14400,
    },
    campo: {
        nombre: "Campo",
        precio: 13800,
    },
    c1: {
        nombre: "Color 1",
        precio: 14800,
    },
    c2: {
        nombre: "Color 2",
        precio: 24000,
    },
};



document.addEventListener("DOMContentLoaded", function () {
    Object.defineProperty(String.prototype, "capitalize", {
        value: function () {
            return this.split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        },
        enumerable: false,
    });



    // Esta función analiza los parámetros de la URL
    function getQueryParam(param) {
        var queryString = window.location.search.substring(1);
        var params = queryString.split("&");
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split("=");
            if (pair[0] == param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }
    const CLIENTE = getQueryParam("cliente");
    const DATE = getQueryParam("date");
    console.log("Date", DATE);

    // Llenar los datos en el HTML
    document.getElementById("cliente").innerText =
        CLIENTE.capitalize() || "No especificado";
    // Repite este paso para cada elemento que necesites llenar
    const today_date = new Date();
    let formatted_date = today_date.toLocaleDateString("es-ES"); // 'es-ES' para formato español, puedes ajustarlo según tu localidad


    document.getElementById("fecha").innerText = formatted_date;

    // Si hay una fecha en la URL, usar esa
    if (DATE) {
        // Date is on format of 2023-12-13
        const date_parts = DATE.split("-");
        const date = new Date(date_parts[0], date_parts[1] - 1, date_parts[2]);
        document.getElementById("fecha").innerText = date.toLocaleDateString("es-ES");
    }

    // Update the prices
    const prices_cols = [];
    const prices_data = {};
    fetch(BASE + `sheet=${PRICE_SHEET_NAME}&headers=1&tq=${query}`)
        .then((res) => res.text())
        .then((text) => {
            const jsData = JSON.parse(text.substr(47).slice(0, -2));
            jsData.table.cols.forEach((heading) => {
                if (heading.label) {
                    const propName = heading.label.toLowerCase();
                    // console.log(propName`)
                    prices_cols.push(propName);
                }
            });

            jsData["table"]["rows"].forEach((main) => {
                const row = {};
                main.c.forEach((cell, i) => {
                    //row[colz[i]] = cell ? cell.v : null;
                    //console.log('prices cols', prices_cols[i])
                    row[prices_cols[i]] = cell ? cell.v : null;


                });
                prices_data[main.c[0].v] = row;
            });

            // Update Productos 
            Object.keys(PRODUCTOS).forEach((key) => {
                const upper_key = key.toUpperCase();
                console.log('upper_key', upper_key, prices_data[upper_key], PRODUCTOS[upper_key])
                if (prices_data[upper_key] && prices_data[upper_key]["precio"] && prices_data[upper_key]["precio"] != '') {
                    PRODUCTOS[key]["precio"] = prices_data[upper_key]["precio"];
                }
            });
            console.log("Updated PRODUCTS")
            console.table(PRODUCTOS);

        });

    const data = [];
    const colz = [];
    let USER_DATA = {};
    fetch(URL)
        .then((res) => res.text())
        .then((text) => {
            const jsData = JSON.parse(text.substr(47).slice(0, -2));

            jsData.table.cols.forEach((heading) => {
                if (heading.label) {
                    const propName = heading.label.toLowerCase();
                    // console.log(propName`)
                    colz.push(propName);
                }
            });
            jsData["table"]["rows"].forEach((main) => {
                const row = {};
                main.c.forEach((cell, i) => {
                    row[colz[i]] = cell ? cell.v : null;
                });
                data.push(row);
            });
            //console.table(data);

            data.forEach((userdata) => {
                // console.log(userdata["cliente"]);
                if (userdata["cliente"] == undefined || userdata["cliente"] == null) {

                } else if (userdata["cliente"].toUpperCase() == CLIENTE.toUpperCase()) {
                    USER_DATA = userdata;
                }
            });

            // USER DATA?

            document.getElementById("direccion_cliente").innerText =
                USER_DATA["direccion"]?.capitalize() || "";
            const mappedProductData = {};
            Object.keys(PRODUCTOS).forEach((key) => {
                if (USER_DATA[key] && USER_DATA[key] > 0) {
                    mappedProductData[key] = {
                        cantidad: USER_DATA[key],
                        nombre: PRODUCTOS[key]["nombre"],
                        precio: PRODUCTOS[key]["precio"],
                        total: USER_DATA[key] * PRODUCTOS[key]["precio"],
                    };
                }
            });

            console.log("mappedProductData", mappedProductData);
            var tabla = document.getElementById("productos-tabla");
            let total = 0;
            for (var key in mappedProductData) {
                if (mappedProductData.hasOwnProperty(key)) {
                    var producto = mappedProductData[key];
                    var fila = tabla.insertRow();

                    var celdaCantidad = fila.insertCell(0);
                    var celdaNombre = fila.insertCell(1);
                    var celdaPrecio = fila.insertCell(2);
                    var celdaTotal = fila.insertCell(3);

                    celdaCantidad.innerText = producto.cantidad;
                    celdaNombre.innerText = producto.nombre;

                    // Check if there is a price override
                    if (USER_DATA["$" + key] && USER_DATA["$" + key] != '') {
                        producto.precio = USER_DATA["$" + key];
                    }

                    celdaPrecio.innerText = producto.precio.toLocaleString();
                    celdaTotal.innerText = (
                        producto.cantidad * producto.precio
                    ).toLocaleString();
                    total += producto.cantidad * producto.precio;
                }
            }

            if (USER_DATA["debe"] && USER_DATA["debe"] > 0) {
                var fila = tabla.insertRow();

                var celdaCantidad = fila.insertCell(0);
                var celdaNombre = fila.insertCell(1);
                var celdaPrecio = fila.insertCell(2);
                var celdaTotal = fila.insertCell(3);

                //celdaCantidad.innerText = '-';
                celdaNombre.innerText = "Debe";
                celdaPrecio.innerText = USER_DATA["debe"].toLocaleString();
                celdaTotal.innerText = USER_DATA["debe"].toLocaleString();
                total += USER_DATA["debe"];
            }

            document.getElementById("total_general").innerText =
                total.toLocaleString();
        });
});
