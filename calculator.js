"use strict";
const DIGITS = "0123456789";
const REGDIGIT = new RegExp(`[${DIGITS}]`, "g");
const OPERATORS = "s+-*/q";
const divInfo = document.querySelector(".display");
const divBoard = document.querySelector(".board");
divBoard.addEventListener("click", clickButton);
const body = document.querySelector("body");
body.addEventListener("keypress", keyPress);
const btnCalculate = document.querySelector(".calculate");
btnCalculate.addEventListener("click", calculate);
let operationString = "";

function validateKey(key) {
  if (key === "q") return !DIGITS.includes(operationString.at(-1));
  if (key === ".") return operationString.replace(REGDIGIT, "").at(-1) != ".";
  if (OPERATORS.includes(key)) return DIGITS.includes(operationString.at(-1));
  if (DIGITS.includes(key) || "Cc".includes(key)) return true;
  return false;
}

function updateDisplay(result) {
  let text = operationString;
  if (result) text += ` = ${result}`;
  divInfo.textContent = text.replace("s", "**").replace("q", "√");
}

function clickButton(event) {
  const key = event.target.dataset?.key;
  inputOperatorOperand(key);
}
function keyPress(event) {
  if (event.key == "Enter") calculate();
  else inputOperatorOperand(event.key);
}

function inputOperatorOperand(key) {
  if (!validateKey(key)) return;
  if (key === "C") {
    operationString = "";
  } else if (key === "c") {
    operationString = operationString.slice(0, -1);
  } else {
    operationString += key;
  }
  updateDisplay();
}

function generateTokens(operationString) {
  let arrTokens = operationString.split("");
  return arrTokens.reduce(
    (acc, cur) =>
      acc.length &&
      ("." + DIGITS).includes(cur) &&
      !OPERATORS.includes(acc.at(-1))
        ? acc.slice(0, -1).concat(acc.pop() + cur)
        : acc.concat(cur),
    [],
  );
}

function binaryOperate(arrayTokens, operation) {
  return arrayTokens.reduce(
    (acc, cur) =>
      !OPERATORS.includes(cur) && acc.at(-1) in operation
        ? acc
            .slice(0, -2)
            .concat(
              operation[acc.at(-1)](parseFloat(acc.at(-2)), parseFloat(cur)),
            )
        : acc.concat(cur),
    [],
  );
}

function unaryOperate(arrayTokens, operation) {
  return arrayTokens.reduce(
    (acc, cur) =>
      !OPERATORS.includes(cur) && acc.at(-1) in operation
        ? acc.slice(0, -1).concat(operation[acc.at(-1)](parseFloat(cur)))
        : acc.concat(cur),
    [],
  );
}

const mulDiv = { "*": (a, b) => a * b, "/": (a, b) => a / b };
const addMinus = { "+": (a, b) => a + b, "-": (a, b) => a - b };
const pow = { s: Math.pow };
const sqrt = { q: Math.sqrt };

function checkDivideByZero(arrTokens) {
  let re = arrTokens.findIndex(
    (item, index, array) => item === "/" && parseFloat(array[index + 1]) === 0,
  );
  return re === -1;
}
function calculate() {
  if (!operationString || OPERATORS.includes(operationString.at(-1))) return;
  let arrTokens = generateTokens(operationString);
  if (!checkDivideByZero(arrTokens)) {
    updateDisplay("Divided by 0");
    return;
  }
  arrTokens = unaryOperate(arrTokens, sqrt);
  arrTokens = binaryOperate(arrTokens, pow);
  arrTokens = binaryOperate(arrTokens, mulDiv);
  arrTokens = binaryOperate(arrTokens, addMinus);
  let result = arrTokens[0];
  updateDisplay(Math.round(result * 100) / 100);
}
