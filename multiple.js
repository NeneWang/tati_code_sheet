let clientes = [];

function get_remito_link(cliente, { date } = {}) {
    let url = `remito.html?cliente=${cliente}`
    if (date) {
        url += `&date=${date}`
    }
    return url;
}

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


document.addEventListener('DOMContentLoaded', function () {
    // Get the body element
    var body = document.body;


    // Get the current URL
    var url = new URL(window.location.href);

    const DATE = getQueryParam("date");

    // Get the 'clientes' query parameter values
    clientes = url.searchParams.getAll('clientes[]');



    // Iterate over all clients
    for (var i = 0; i < clientes.length; i++) {

        var iframe = document.createElement('iframe');
        const link = get_remito_link(clientes[i], { date: DATE })
        iframe.src = link;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        // Remove borders
        iframe.style.border = 'none';
        body.appendChild(iframe);


    }
});