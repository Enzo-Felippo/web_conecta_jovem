console.log("Hello World");

// Desafio da aula: Calcular o valor de uma viagem


let gastoTotal;
let precoCombustivel;

let kmPorLitro = 8;
let distanciaEmKm = 27;
let tipoCombustivel = 'etanol'

const precoGasolina = 5.70;
const precoEtanol = 5.40;
const consumoTotal = distanciaEmKm / kmPorLitro;


if (tipoCombustivel === 'gasolina'){
    precoCombustivel = precoGasolina
    gastoTotal = consumoTotal * precoGasolina;
}else if (tipoCombustivel === 'etanol'){
    precoCombustivel = precoEtanol
    gastoTotal = consumoTotal * precoEtanol;
}else{
    console.log('tipo não reconhecido')
}


console.log(`Rodando ${distanciaEmKm} KM e o preço do ${tipoCombustivel} estando ${precoCombustivel.toFixed(2)}, gastará: `);
console.log(`R$: ${gastoTotal.toFixed(2)}`);

//  Desafio da aula: Calcular a média das notas e a clasificação do aluno

const nota1 = 10;
const nota2 = 10;
const nota3 = 2;
const notaMedia = (nota1 + nota2 + nota3) / 3

console.log(`Nota média: ${notaMedia.toFixed(1)}`)

if (notaMedia < 5){
    console.log('Aluno(a) reprovado(a) por nota insuficiente')
}else if(notaMedia <= 7) {
    console.log('Aluno(a) de recuperação por ter nota insuficiente')
}else{
    console.log('Aluno(a) passou com boa nota')
}