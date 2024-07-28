function randomNumberBetween(upperLimit, lowerLimit) {
    const randomValue = Math.random();
    const range = upperLimit - lowerLimit + 1;
    const scaledValue = randomValue * range;
    const randomNumber = Math.floor(scaledValue) + lowerLimit;
    return randomNumber;
  }
  
  export default randomNumberBetween;