const CLIENTES = ["DELI", "WB DEL", "SUSHI"];

function get_remito_link(cliente) {
    return `remito.html?cliente=${cliente}`
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the body element
    var body = document.body;
    console.log("Select")

    // Iterate over all clients
    for (var i = 0; i < CLIENTES.length; i++) {

        var iframe = document.createElement('iframe');
        const link = get_remito_link(CLIENTES[i])
        iframe.src = link;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        // Remove borders
        iframe.style.border = 'none';
        body.appendChild(iframe);


    }
});