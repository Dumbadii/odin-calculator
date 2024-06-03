"use strict";
const DIGITS = "0123456789";
const OPERATORS = "s+-*/q";
const divInfo = document.querySelector(".operationInfo");
const divBoard = document.querySelector(".board");
divBoard.addEventListener("click", modifyOperation);
const btnCalculate = document.querySelector(".calculate");
btnCalculate.addEventListener("click", calculate);
let operationString = "";

function validateKey(key) {
  if (key === "q") return !DIGITS.includes(operationString.at(-1));
  return DIGITS.includes(operationString.at(-1));
}

function updateInfo(result) {
  let text = operationString;
  if (result) text += ` = ${result}`;
  divInfo.textContent = text;
}

function modifyOperation(event) {
  const key = event.target.dataset?.key;
  if (!key || (OPERATORS.includes(key) && !validateKey(key))) return;
  if (key === "C") {
    operationString = "";
  } else if (key === "c") {
    operationString = operationString.slice(0, -1);
  } else {
    operationString += key;
  }
  updateInfo();
}

function generateTokens(operationString) {
  let arrTokens = operationString.split("");
  return arrTokens.reduce(
    (acc, cur) =>
      acc.length && DIGITS.includes(cur) && !OPERATORS.includes(acc.at(-1))
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

function calculate() {
  if (!operationString || OPERATORS.includes(operationString.at(-1))) return;
  let arrTokens = generateTokens(operationString);
  arrTokens = unaryOperate(arrTokens, sqrt);
  arrTokens = binaryOperate(arrTokens, pow);
  arrTokens = binaryOperate(arrTokens, mulDiv);
  arrTokens = binaryOperate(arrTokens, addMinus);
  let result = arrTokens[0];
  updateInfo(Math.round(result * 100) / 100);
}
