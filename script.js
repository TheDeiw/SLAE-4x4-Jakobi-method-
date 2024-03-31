function handleFocus(input) {
     if (parseFloat(input.value) === 0) {
        input.value = ''; // Якщо значення - 0, очищаємо поле
    }
}

function handleInput(input) {
    /*if (input.value.trim() === '') {
        input.value = '0'; // Якщо поле порожнє після введення, заповнюємо його 0
    }*/
}
let Results = [];
var failtxt1 = document.querySelector('.failText1');
var failtxt2 = document.querySelector('.failText2');
var failtxt3 = document.querySelector('.failText3');
/* -------------------- BUTTONS -------------------- */
document.querySelector('.submit-button').addEventListener('click', MainFunction);

document.querySelector('.fillzero-button').addEventListener('click', function() {
    var inputs = document.querySelectorAll('input[type="number"]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = 0;
    }
});

document.querySelector('.default-button').addEventListener('click', function() {
    var data = [
        [0.63, -0.14, 0.06, -0.12, -1.21],
        [0.12, 0.52, 0, -0.18, -0.72],
        [0.08, -0.12, 1.23, 0.32, 0.58],
        [0.25, 0.22, 0.14, 0.12, -1.56],
        [0.01]
    ];
    var inputs = document.querySelectorAll('input[type="number"]');
    var k = 0;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            if (k < inputs.length) {
                inputs[k].value = data[i][j];
                k++;
            }
        }
    }
});

/* -------------------- MAIN FUNCTION -------------------- */
function MainFunction(){
    //let Eps = 0.001;
    СlearContent();
    failtxt1.style.display = 'none';
    failtxt2.style.display = 'none';
    failtxt3.style.display = 'none';

    // Taking information
    var matrix = [];
    var equations = document.querySelectorAll('.equation');
    for (var i = 0; i < equations.length; i++) {
        var inputs = equations[i].querySelectorAll('input[type="number"]');
        var row = [];
        for (var j = 0; j < inputs.length; j++) {
            row.push(parseFloat(inputs[j].value));
        }
        matrix.push(row);
    }

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (isNaN(matrix[i][j])) {
                matrix[i][j] = 0;
            }
        }
    }

    console.log(matrix);

    let Eps = parseFloat(document.querySelector('#eps').value);
    console.log(Eps);

    if(Determinant(matrix)==0){
        failtxt1.style.display = 'block';
    } else if (Eps <= 0){
        failtxt2.style.display = 'block';
    } else if (matrix[0][0] == 0 || matrix[1][1] == 0 || matrix[2][2] == 0 || matrix[3][3] == 0){
        failtxt3.style.display = 'block';
    }
    else{
        const AlfaMatrix = CreateAlfa(matrix)
        const BetaMatrix = CreateBeta(matrix)
    
        if(IfConvergence(matrix)){
            DisplayText("Alfa/Beta Matrixes", "alfa-beta", '25px' , 'h1')
            DisplayText("Alfa Matrix", "alfa-beta", '' , 'p')
            DispalyMatrix2D(AlfaMatrix, "alfa-beta")
            DisplayText("Beta Matrix", "alfa-beta", '' , 'p')
            DispalyMatrix1D(BetaMatrix, "alfa-beta")
        
            Jakobi(matrix, Eps, AlfaMatrix, BetaMatrix);
            Zeydel(matrix, Eps, AlfaMatrix, BetaMatrix);
        }
    } 
}

/* -------------------- ADDITIONAL FOR OUTPUT AND CHECKING -------------------- */
function Determinant(m) {
    let det = 0;
    for (let i = 0; i < 4; i++) {
        let subMatrix = [];
        for (let j = 1; j < 4; j++) {
            let row = [...m[j]];
            row.splice(i, 1);
            subMatrix.push(row);
        }
        det += m[0][i] * (i % 2 === 0 ? 1 : -1) * Determinant3x3(subMatrix);
    }
    return det;
}

function Determinant3x3(m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]) -
           m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
           m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}

function DispalyMatrix2D(matrix, className, size){
        // Знайти div з вказаним класом
        var div = document.querySelector('.' + className);

        // Створити таблицю
        var table = document.createElement('div');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.display = 'block';
        table.style.margin = 'auto';
        table.style.marginBottom = '10px';
        
        // Додати рядки та комірки до таблиці
        for (var i = 0; i < matrix.length; i++) {
            var row = document.createElement('div');
            row.style.display = 'flex';
            //row.style.margin = 'auto';
            for (var j = 0; j < matrix[i].length; j++) {
                var cell = document.createElement('div');
                row.style.justifyContent = 'center';
                cell.innerHTML = `${(matrix[i][j].toFixed(3))}`;
                cell.style.padding = '5px';
                cell.style.textAlign = 'center';
                cell.style.fontSize = size;
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        // Додати таблицю до div
        div.appendChild(table);
}

function DispalyMatrix1D(matrix, className, size){
    // Знайти div з вказаним класом
    var div = document.querySelector('.' + className);

    // Створити таблицю
    var table = document.createElement('div');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.display = 'block';
    table.style.margin = 'auto';
    table.style.marginBottom = '10px';
    
    // Додати рядки та комірки до таблиці
    for (var i = 0; i < matrix.length; i++) {
        var cell = document.createElement('div');
        table.style.justifyContent = 'center';
        cell.innerHTML = `${(matrix[i].toFixed(3))}`;
        cell.style.padding = '5px';
        cell.style.textAlign = 'center';
        cell.style.fontSize = size;
        table.appendChild(cell);
    }
    // Додати таблицю до div
    div.appendChild(table);
}

function DisplayEqulation(matrix, className) {
    // Знайти div з вказаним класом
    var div = document.querySelector('.' + className);

    // Створити таблицю
    var table = document.createElement('div');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.display = 'block';
    table.style.margin = 'auto';
    table.style.marginBottom = '10px';
    
    // Додати рядки та комірки до таблиці
    for (var i = 0; i < matrix.length; i++) {
        var row = document.createElement('div');
        row.style.display = 'flex';
        //row.style.margin = 'auto';
        for (var j = 0; j < matrix[i].length; j++) {
            var cell = document.createElement('div');
            row.style.justifyContent = 'center';
            cell.innerHTML = `(${(matrix[i][j].toFixed(3))})*x<sub>${j+1}</sub> + `;
            if (j == 3){
                cell.innerHTML = `(${(matrix[i][j].toFixed(3))})*x<sub>${j+1}</sub> = `;
            }
            if (j == 4){
                cell.innerHTML = `${(matrix[i][j].toFixed(3))}`;
            }
            cell.style.padding = '5px';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    

}

function DisplayText(text, className, size, type){
    var div = document.querySelector('.' + className);
    textField = document.createElement(type);
    textField.innerHTML = text;
    textField.style.fontSize = size;
    div.appendChild(textField);
}

function DispalyResults(resArray, className, size){
    var div = document.querySelector('.' + className);
    for (var i=0; i<resArray.length; i++){
        var row = document.createElement('div');
        row.innerHTML = `x<sub>${i+1}</sub> = ${(resArray[i].toFixed(3))} `;
        row.style.fontSize = size;
        div.appendChild(row);
    }
}

function СlearContent() {
    const tempContainer = document.querySelector('.tempContainer');
    if (tempContainer) {
        const objects = tempContainer.querySelectorAll('*');
        objects.forEach((obj) => {
            if (!obj.classList.length) {
                obj.remove();
            }
        });
    }
}в

/* -------------------- CHECK CONVERGENCE -------------------- */
function IfConvergence(alfa){
    DisplayText(`Convergence checking`, "convergence", '25px', 'h1');
    let sum1 = 0, sum2 = 0, sum3 = 0;

    for(let i=0; i<alfa.length; i++){
        let tempSum = 0;
        for(let j=0; j<alfa.length; j++){
            tempSum += alfa[i][j]
            console.log(sum1);
        }
        if (tempSum > sum1){
            sum1 = tempSum;
        }
    }

    for(let i=0; i<alfa.length; i++){
        let tempSum = 0;
        for(let j=0; j<alfa.length; j++){
            tempSum += alfa[j][i];
            console.log(sum1);
        }
        if (tempSum > sum2){
            sum2 = tempSum;
        }
    }

    for(let i=0; i<alfa.length; i++){
        sum3 += alfa[i][i];
    }

    DisplayText(`Row checking: Max = ${sum1.toFixed(3)}`, "convergence", '15px', 'p');
    DisplayText(`Column checking: Max = ${sum2.toFixed(3)}`, "convergence", '15px', 'p');
    DisplayText(`Sqr checking: Diag = ${sum3.toFixed(3)}`, "convergence", '15px', 'p');

    if (sum1 < 1 || sum2 < 1 || sum3>sum2 || sum3>sum1){
        DisplayText(`Is convergence`, "convergence", '20px', 'h1');
        return true;
    } else {
        DisplayText(`Is not convergence!!!`, "convergence", '20px', 'h1');
        return false;
    }
}
/* -------------------- JAKOBI -------------------- */
function CreateAlfa(array){
    let alfa = [];
    for (let i=0; i < array.length; i++){
        alfa.push([]);
        for (let j=0; j<array[i].length - 1; j++){
            if (i==j){
                alfa[i][j] = 0;
            } else {
                alfa[i][j] = -array[i][j]/array[i][i];
            } 
        }
    }
    return (alfa);
}

function CreateBeta(array){
    let beta = [];
    for (let i=0; i<array.length; i++){
        beta[i] = array[i][array[i].length-1]/array[i][i];
    }
    return(beta);
}

function Jakobi(array, eps, alfaMatrix, betaMatrix){

    let count = 0;
    // Перша ітерація
    for (let i=0; i<betaMatrix.length; i++){
        Results = [...betaMatrix];
        count++;
    }
    
    let tempRes = [], MaxDiff=100;
    // Наступні ітерації
    while (MaxDiff > eps){
        tempRes = [...Results];
        for (let i = 0; i<Results.length; i++){
            let sum = 0
            for (let j = 0; j<Results.length; j++){
                sum += tempRes[j]*alfaMatrix[i][j];
            }
            Results[i] = betaMatrix[i] + sum;
        }
        MaxDiff = 0;
        // Пошук максимальної різниці
        for (let i=0; i<Results.length; i++){
            if(MaxDiff < Math.abs(tempRes[i] - Results[i])){
                MaxDiff = Math.abs(tempRes[i] - Results[i])
            }
        }
        count++;
    }
    DisplayText("Jakobi method", "jak", '30px', 'h1');
    DisplayText("Results:", "jak", '18px', 'p');
    DispalyResults(Results, "jak", '15px');
    DisplayText(`Count = ${count}`, "jak", '18px', 'p');
}

function Zeydel(array, eps, alfaMatrix, betaMatrix){

    let count = 0;
    // Перша ітерація
    for (let i=0; i<betaMatrix.length; i++){
        Results = [...betaMatrix];
        count++;
    }
    
    let tempRes = [], MaxDiff=100;
    // Наступні ітерації
    while (MaxDiff > eps){
        tempRes = [...Results];

        for (let i = 0; i<Results.length; i++){
            let sum = 0;
            for (let j = 0; j<i; j++){
                sum += Results[j]*alfaMatrix[i][j];
            }
            for (let j = i+1; j<Results.length; j++){
                sum += tempRes[j]*alfaMatrix[i][j];
            }
            Results[i] = betaMatrix[i] + sum;
        }

        MaxDiff = 0;
        // Пошук максимальної різниці
        for (let i=0; i<Results.length; i++){
            if(MaxDiff < Math.abs(tempRes[i] - Results[i])){
                MaxDiff = Math.abs(tempRes[i] - Results[i])
            }
        }
        count++;
    }
    DisplayText("Seidel method", "zel", '30px', 'h1');
    DisplayText("Results:", "zel", '18px', 'p');
    DispalyResults(Results, "zel", '15px');
    DisplayText(`Count = ${count}`, "zel", '18px', 'p');
}




/* -------------------- TERMINAL FUNCTIONS -------------------- */
function CreatingMatrix(check){
    if (check == 1){
        for (let i=0; i<3; i++){
            matrix.push([]);
            for (let j=0; j<4; j++){
                matrix[i][j] = +prompt(`Введіть [${i}][${j}]: `);
            }
        }
    } 
    else{
        matrix = 
	    [[ 0.46, 1.72, 2.53, 2.44], 
	    [1.53, -2.32, -1.83, 2.83], 
	    [0.75, 0.86, 3.72, 1.06] ];
    }
    return matrix;
}
function PrintingMatrix(array, Ni, Nj){
    let rowString;
    for (let i=0; i<Ni; i++){
        rowString = "";
        for(let j=0; j<Nj; j++){
            if(j == 3){
                rowString += "   =";
            }
            rowString += `${(array[i][j]).toFixed(3).padStart(10," ").padEnd(5," ")} `;
        }
        console.log(rowString);
    }
}
