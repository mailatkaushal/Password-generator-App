const passwordDisplay = document.querySelector('[dataPasswordDisplay]');
const lengthDisplay = document.querySelector('[dataLengthNumber]');
const inputSlider = document.querySelector('[dataLengthSlider]');
const copyBtn = document.querySelector('[dataCopy]');
const copyPassword = document.querySelector('[dataCopyPassword]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[dataIndicator]');
const generateBtn = document.querySelector('.generate-btn');
const allCheckbox = document.querySelectorAll('input[type=checkbox]');
const symbols = "!@#$%^&*()-_=+[{]};:'\",<.>/?`~\\|";

let password = '';
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator('#ccc');

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumber() {
  return getRandomInteger(0, 9);
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateSymbol() {
  const randomIndex = getRandomInteger(0, symbols.length);
  return symbols[randomIndex];
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyPassword.innerText = "Copied!";
  }
  catch(e) {
    copyPassword.innerText = "Failed";
  }

  // to make copy wala span visible
  copyPassword.classList.add("active");

  setTimeout( () => {
    copyPassword.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener('input', (event) => {
  passwordLength = event.target.value;
  handleSlider();
});

copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value)
    copyContent();
});

function handleCheckboxChange() {
  checkCount = 0;
  allCheckbox.forEach(checkbox => {
    if(checkbox.checked) {
      checkCount++;
    }
  });
  if(passwordLength < checkCount ) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckbox.forEach(checkbox => {
  checkbox.addEventListener('change', handleCheckboxChange);
});

function shufflePassword(array) { 
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener('click', () => {
  if(checkCount == 0) 
    return;

  if(passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = '';

  // if(uppercaseCheck.checked) {
  //   password += generateUpperCase();
  // }
  // if(lowercaseCheck.checked) {
  //   password += generateLowerCase();
  // }
  // if(numbersCheck.checked) {
  //   password += generateNumber();
  // }
  // if(symbolsCheck.checked) {
  //   password += generateSymbol();
  // }

  let funcArr = [];

  if(uppercaseCheck.checked) 
    funcArr.push(generateUpperCase);

  if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

  if(numbersCheck.checked)
    funcArr.push(generateNumber);

  if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for(let i = 0; i < passwordLength - funcArr.length; i++) {
    let randomIndex = getRandomInteger(0, funcArr.length);
    password += funcArr[randomIndex]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});