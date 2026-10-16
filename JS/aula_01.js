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

// Desafio da aula: Calcular o IMC e mostrar sua condição
/*
    IMC = peso / (altura * altura)

    - Abaixo do peso: < 18.5
    - Peso normal: >= 18.5 e < 25
    - Acima do peso: >= 25 e < 30
    - Obeso: >= 30 e < 40
    - Obesidade grave: >= 40

    console.log(`O IMC de ${imc.toFixed(1)} é `)
*/

const altura = 1.75;
const peso = 62.5;
const imc = peso / Math.pow(altura,2); // (altura * altura)

if (imc < 18.5){
    console.log(`O IMC de ${imc.toFixed(1)} é considerado abaixo do peso`)
} else if (imc < 25){
    console.log(`O IMC de ${imc.toFixed(1)} é considerado peso normal`)
} else if (imc < 30){
    console.log(`O IMC de ${imc.toFixed(1)} é considerado acima do peso`)
} else if (imc < 40){
    console.log(`O IMC de ${imc.toFixed(1)} é considerado obesidade`)
} else {
    console.log(`O IMC de ${imc.toFixed(1)} é considerado obesidade grave`)
}



// Desafio da aula: Elabore um algoritmo que calcule o que deve ser pago por um produto, considerando o preço normal de etiqueta e a escolha da condição de pagamento.
/*
Utilize os códigos da tabela a seguir para ler qual a condição de pagamento escolhida e efetuar o cálculo
adequado.

Código Condição de pagamento:
A vista Débito, recebe 10% de desconto;
- À vista no Dinheiro ou PIX, recebe 15% de desconto;
Em duas vezes, preco normal de etiqueta sem juros;
Acima de duas vezes, preço normal de etiqueta mais juros de 10%;
*/

const tipoDePagamento = 'débito'; // 'à vista', 'pix', 'crédito', 'débito'
const valorEtiqueta = 100;
let parcelamento;
let descontoOuJuros;
let valorTotal;

if (tipoDePagamento === 'crédito'){
    parcelamento = 1;
    if (parcelamento < 3){
        descontoOuJuros = 1;
    }else{
        descontoOuJuros = 1.10;
    }
}else if (tipoDePagamento === 'pix' || tipoDePagamento === 'à vista'){
    descontoOuJuros = 0.85;
}else if (tipoDePagamento === 'débito'){
    descontoOuJuros = 0.90;
}

valorTotal = valorEtiqueta * descontoOuJuros

console.log(`Valor padrão: ${valorEtiqueta.toFixed(2)}`)
console.log(`Valor para ${tipoDePagamento}: ${valorTotal.toFixed(2)}`)