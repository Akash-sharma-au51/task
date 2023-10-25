// Task 3: This code snippet calculates the sum of the squares of even numbers, but it contains a
// logical error that needs to be resolved.
// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const squaredNumbers = numbers.map((num) => num * 2);
// const sumOfSquaredEvenNumbers = squaredNumbers.reduce((acc, num) => { if (acc % 2 ===
// 0) { return acc + num; } return num; }, 0);
// console.log("Sum of squared even numbers :", sumOfSquaredEvenNumbers);
// Input - [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] expected O/p- 220
// Input - [11, 12, 13, 14, 15, 16]; expected O/p- 596

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const squareevennumbers =  numbers.filter((x)=>x%2===0).map((x)=>x**2)
const sumsquarenumbers = squareevennumbers.reduce((a,x)=>a+x,0)
console.log(sumsquarenumbers)