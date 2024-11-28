// DOM Elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const themeBtn = document.getElementById('theme-btn');

// Variables to manage calculation state
let currentInput = '0'; // Stores current number
let previousInput = null; // Stores the first number
let operator = null; // Stores the operator
let memory = 0; // Memory variable for M+ and M-

// Update the display with ongoing input or result
function updateDisplay() {
  // Show the expression as the user enters numbers and operators
  display.textContent = `${previousInput || ''} ${operator || ''} ${currentInput}`;
}

// Clear everything and reset state
function clearAll() {
  currentInput = '0';
  operator = null;
  previousInput = null;
  updateDisplay();
}

// Handle button click events
function handleButtonClick(value) {
  if (!isNaN(value) || value === '.') {
    handleNumber(value); // Handle number and decimal
  } else if (['+', '-', '*', '/', '%'].includes(value)) {
    handleOperator(value); // Handle operator
  } else if (value === '=') {
    calculateResult(); // Calculate the result
  } else if (value === 'C') {
    clearAll(); // Clear the calculator
  } else if (value === '⌫') {
    handleBackspace(); // Handle backspace
  } else if (['sin', 'cos', 'tan', '√'].includes(value)) {
    handleScientific(value); // Handle scientific functions
  } else if (value.startsWith('M')) {
    handleMemory(value); // Handle memory functions
  }
}

// Handle number inputs (digits or decimals)
function handleNumber(value) {
  // If the current input is '0' or 'Error', replace it with the new digit or decimal
  if (currentInput === '0' || currentInput === 'Error') {
    currentInput = value === '.' ? '0.' : value;
  } else {
    // Append the value unless it's a decimal and one already exists
    if (value === '.' && currentInput.includes('.')) return;
    currentInput += value;
  }
  updateDisplay();
}

// Handle operator input (+, -, *, /, %)
function handleOperator(value) {
  // If there is a previous input and an operator, calculate the result first
  if (operator && previousInput !== null) {
    calculateResult();
  }

  // Store the first number and set the operator
  previousInput = currentInput;
  operator = value;
  currentInput = '0'; // Reset current input for the second number

  updateDisplay();
}

// Perform the actual calculation
function calculateResult() {
  if (operator === null || previousInput === null || currentInput === '0') return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  // Perform the operation based on the selected operator
  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      result = curr === 0 ? 'Error' : prev / curr;
      break;
    case '%':
      result = prev % curr;
      break;
    default:
      return;
  }

  // Update the current input with the result and reset the state
  currentInput = result.toString();
  operator = null;
  previousInput = null;

  // Show the result on the display
  display.textContent = currentInput;
}

// Handle backspace (remove the last character)
function handleBackspace() {
  if (currentInput.length === 1 || currentInput === 'Error') {
    currentInput = '0'; // Reset to '0' if only one character remains
  } else {
    currentInput = currentInput.slice(0, -1); // Remove the last character
  }
  updateDisplay();
}

// Handle scientific functions (sin, cos, tan, √)
function handleScientific(func) {
  const value = parseFloat(currentInput);
  let result;

  switch (func) {
    case 'sin':
      result = Math.sin(value * (Math.PI / 180)); // Convert degrees to radians
      break;
    case 'cos':
      result = Math.cos(value * (Math.PI / 180)); // Convert degrees to radians
      break;
    case 'tan':
      result = Math.tan(value * (Math.PI / 180)); // Convert degrees to radians
      break;
    case '√':
      result = Math.sqrt(value); // Square root
      break;
    default:
      return;
  }

  currentInput = result.toString();
  updateDisplay();
}

// Handle memory functions (M+, M-, MR, MC)
function handleMemory(action) {
  const value = parseFloat(currentInput);

  switch (action) {
    case 'M+':
      memory += value; // Add to memory
      break;
    case 'M-':
      memory -= value; // Subtract from memory
      break;
    case 'MR':
      currentInput = memory.toString(); // Recall memory
      break;
    case 'MC':
      memory = 0; // Clear memory
      break;
  }

  updateDisplay();
}

// Theme toggle (dark mode)
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Attach event listeners to calculator buttons
buttons.forEach((button) => {
  button.addEventListener('click', () => handleButtonClick(button.textContent));
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!isNaN(key) || key === '.') {
    handleNumber(key);
  } else if (['+', '-', '*', '/', '%'].includes(key)) {
    handleOperator(key);
  } else if (key === '=' || key === 'Enter') {
    calculateResult();
  } else if (key === 'Backspace') {
    handleBackspace();
  } else if (key === 'c' || key === 'C') {
    clearAll();
  }
});

// Initialize the calculator display
updateDisplay();
