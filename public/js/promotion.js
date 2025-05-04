function porcent(input){
    if(input.value > 100){
        return input.value = 100;
    } else if(input.value < 0){
        return input.value = 0;
    }
   document.getElementById('precoPrevisto').value = "R$ " + (preco - ((input.value / 100) * preco)).toFixed(2);
}