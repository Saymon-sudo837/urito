const socket = io();  

socket.on("status", (status) => {
    atualizar(status);
});

function atualizar(pedidos) {
    const finalizado = document.getElementById('finalizado');
    const andamento = document.getElementById('andamento');
    const aguardo = document.getElementById('aguardo');
    finalizado.innerText = '';
    andamento.innerText = '';
    aguardo.innerText = '';
    pedidos.forEach(pedido => {
        if(pedido.retirado == true){
            return;
        }
        if(pedido.andamento == 0){
            aguardo.innerHTML += `<h3 class="text-5xl text-white font-bold">${pedido.id}</h3>`;
        }else if(pedido.andamento == 1){
            andamento.innerHTML += `<h3 class="text-5xl text-white font-bold">${pedido.id}</h3>`;
        }else{
            finalizado.innerHTML += `<h3 class="text-5xl text-white font-bold">${pedido.id}</h3>`;
        }
    })
}
