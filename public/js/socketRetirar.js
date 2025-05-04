const socket = io();  
let lastPedido;
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
        if(pedido.pedido.retirado != true && pedido.pedido.andamento == 2){

        const div = document.createElement("div");
        div.classList.add("w-full", "p-6", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow-sm", "dark:bg-gray-800", "dark:border-gray-700");
        
            div.innerHTML = `
                <p>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${pedido.pedido.nome} | ${pedido.pedido.id}</h5>
                </p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${produto(pedido.produtos)}</p>
                <div class="w-full pr-5 flex justify-end">
                    <button type="button" id="/retirar/${pedido.pedido.id}" class="acao text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Informar Retirada</button>
                </div>
            `;
        
        divpedidos.appendChild(div);
    }
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
    console.log('teste')
    if (event.target && event.target.matches('button.acao')) {
    console.log('teste2')

        post(event.target.id);
      }
})
function post(url){
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
}