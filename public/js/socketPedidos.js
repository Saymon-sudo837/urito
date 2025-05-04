const socket = io();  
var lastPedido = null;

socket.on("pedidos", (pedidos) => {
    const pedidosString = JSON.stringify(pedidos);
    if (lastPedido !== pedidosString) {
        lastPedido = pedidosString;  
        atualizar(pedidos);          
    }
});

function atualizar(pedidos) {
    const divpedidos = document.getElementById("pedidos");
    divpedidos.innerHTML = ""; 

    pedidos.forEach(pedido => {
        const div = document.createElement("div");
        div.classList.add("w-full", "p-6", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow-sm", "dark:bg-gray-800", "dark:border-gray-700");
        if(pedido.pedido.retirado == true){
            return;
        }
        if (pedido.pedido.andamento == 0) {
            div.innerHTML = `
                <p>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${pedido.pedido.nome}</h5>
                </p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${produto(pedido.produtos)}</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${pedido.pedido.observacao == '' ? '' : 'Observação: ' + pedido.pedido.observacao }</p>
                <div class="w-full pr-5 flex justify-end">
                    <button type="button" class="hover:cursor-not-allowed text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Aguardo</button>
                    <button type="button" id="/andamento/${pedido.pedido.id}" class="acao text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Preparar</button>
                </div>
            `;
        } else if (pedido.pedido.andamento == 1) {
            div.innerHTML = `
                <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${pedido.pedido.nome}</h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${produto(pedido.produtos)}</p>
                <div class="w-full pr-5 flex justify-end gap-3">
                    <button type="button" class="hover:cursor-not-allowed text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Andamento</button>
                    <button type="button" id="/finalizar/${pedido.pedido.id}" class="acao text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Finalizar</button>
                </div>
            `;
        } else{
            return;
        }
        
        divpedidos.appendChild(div);
    });

    function produto(items) {
        let stringItems = "";
        let vez = 0;
        const tamanho = items.length;

        items.forEach(item => {
            if (vez !== tamanho - 1) {
                stringItems += `${item.quantidade} x | ${item.nome}, `;
            } else {
                stringItems += `${item.quantidade} x | ${item.nome}.`;
            }
            vez++;
        });

        return stringItems;
    }
}

document.getElementById("pedidos").addEventListener('click', function(event) {
    if (event.target && event.target.matches('button.acao')) {
        post(event.target.id);
      }
})
function post(url){
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
}