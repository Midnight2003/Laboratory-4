const display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operation = null;
let history = [];

function updateDisplay() {
    let displayText = '';
    if (previousInput) {
        displayText += previousInput + ' ' + operation + ' ';
    }
    displayText += currentInput || '0';
    display.textContent = displayText;
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    currentInput += number;
    updateDisplay();
}

function chooseOperation(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        compute();
    }
    operation = op;
    previousInput = currentInput;
    currentInput = '';
}

function compute() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                clear();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    history.push(`${previousInput} ${operation} ${currentInput} = ${result}`);
    operation = null;
    previousInput = '';
    updateHistory();
    updateDisplay();
}

function clear() {
    currentInput = '';
    previousInput = '';
    operation = null;
    updateDisplay();
}

function updateHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    history.slice(-10).forEach(item => {  // Show last 10
        const li = document.createElement('li');
        li.textContent = item;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => loadFromHistory(item));
        list.appendChild(li);
    });
}

function loadFromHistory(item) {
    const parts = item.split(' = ');
    const expr = parts[0]; // e.g., "5 + 3"
    const exprParts = expr.split(' ');
    if (exprParts.length === 3) {
        previousInput = exprParts[0];
        operation = exprParts[1];
        currentInput = exprParts[2];
        updateDisplay();
    }
}

// Button event listeners
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => appendNumber(button.id));
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        let op;
        switch (button.id) {
            case 'add':
                op = '+';
                break;
            case 'subtract':
                op = '-';
                break;
            case 'multiply':
                op = '*';
                break;
            case 'divide':
                op = '/';
                break;
            default:
                return;
        }
        chooseOperation(op);
    });
});

document.getElementById('decimal').addEventListener('click', () => appendNumber('.'));
document.getElementById('equals').addEventListener('click', compute);
document.getElementById('clear').addEventListener('click', clear);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+') {
        chooseOperation('+');
    } else if (e.key === '-') {
        chooseOperation('-');
    } else if (e.key === '*') {
        chooseOperation('*');
    } else if (e.key === '/') {
        chooseOperation('/');
    } else if (e.key === 'Enter') {
        compute();
    } else if (e.key === 'Escape') {
        clear();
    }
});