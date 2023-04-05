let x = 2;
function inverso(numero) {
    return numero === 0 ? 0 : Math.pow(numero, -1);
  }

console.log(inverso(x));
console.log(inverso(inverso(x)));