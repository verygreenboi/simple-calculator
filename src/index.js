let expression = '';
let history = [];

const historyElement = document.getElementById('history');
const resultElement = document.getElementById('result');

const operatorDisplayMap = {
    '+': '➕',
    '-': '➖',
    '*': '✖️',
    '/': '➗',
}

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
}

function addExpression(ex) {
    if (operatorDisplayMap[ex]) {
        expression += operatorDisplayMap[ex];
    } else {
        expression += ex;
    }
    tick();
}

function calculate(expression) {
    // Step 1: Replace emoji operators with standard math operators
    let sanitizedExpression = expression.replace(/➕/g, '+') // Replace "➕" with "+"
        .replace(/➖/g, '-') // Replace "➖" with "-"
        .replace(/✖️/g, '*') // Replace "✖️" with "*"
        .replace(/➗/g, '/'); // Replace "➗" with "/"

    // Step 2: Extract numbers (including decimals) and operators from the expression
    let tokens = sanitizedExpression.match(/\d+(\.\d+)?|\+|\-|\*|\//g);

    // If no valid numbers or operators are found, return NaN (Not a Number)
    if (!tokens) return NaN;

    // Step 3: Handle multiplication (*) and division (/) first (higher precedence)
    let values = []; // This will store numbers and operators for the next step
    let currentValue = parseFloat(tokens[0]); // Start with the first number in the expression

    // Loop through tokens and apply * and / before + and -
    for (let i = 1; i < tokens.length; i += 2) { // Move in steps of 2 (operator, then number)
        let operator = tokens[i]; // Get the current operator
        let nextValue = parseFloat(tokens[i + 1]); // Get the next number

        if (operator === '*') {
            // If operator is *, multiply the current value by the next number
            currentValue *= nextValue;
        } else if (operator === '/') {
            // If operator is /, divide the current value by the next number
            currentValue /= nextValue;
        } else {
            // If operator is + or -, store the current value and the operator
            values.push(currentValue, operator);
            currentValue = nextValue; // Update currentValue to the next number
        }
    }
    values.push(currentValue); // Push the last calculated value into the list

    // Step 4: Handle addition (+) and subtraction (-)
    const result = values.reduce((acc, val, index, arr) => {
        if (val === '+') {
            return acc + parseFloat(arr[index + 1]); // Add next number if operator is +
        }
        if (val === '-') {
            return acc - parseFloat(arr[index + 1]); // Subtract next number if operator is -
        }
        return acc; // Return accumulated value
    });

    // Step 5: Print the result in the console for debugging
    console.log(result);

    // Step 6: Display the result on the webpage (if there's a valid element)
    if (typeof resultElement !== "undefined" && resultElement !== null) {
        resultElement.innerHTML = result;
    }

    return result; // Return the final computed result
}

function clearCalculator() {
    expression = '';
    history = [];
    historyElement.innerHTML = '0';
    resultElement.innerHTML = '0';
}

function tick() {
    historyElement.innerHTML = expression;
}