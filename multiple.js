let clientes = [];

function get_remito_link(cliente) {
    return `remito.html?cliente=${cliente}`
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the body element
    var body = document.body;

    // Get the current URL
    var url = new URL(window.location.href);

    // Get the 'clientes' query parameter values
    clientes = url.searchParams.getAll('clientes[]');



    // Iterate over all clients
    for (var i = 0; i < clientes.length; i++) {

        var iframe = document.createElement('iframe');
        const link = get_remito_link(clientes[i])
        iframe.src = link;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        // Remove borders
        iframe.style.border = 'none';
        body.appendChild(iframe);


    }
});