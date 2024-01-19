const { resolve } = require('node:path');
const readline = require('node:readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askPin() {
  return new Promise ( resolve => {
    readline.question( `Please insert your PIN: `, pin => {
      resolve(pin);
    })
  })
};

const PIN = '123456',
MAX_COUNT = 3;

let counter = 1, 
balance = 0;

main = async () => {
  const pin = await askPin();

  if (pin == PIN) {
    console.log('success');
  } else {
    if (counter < MAX_COUNT ) {
      console.log('failed, please try again!');
      
      counter++;
      console.log(counter);
      await main();
    } else {
      console.log('failed, you have tried 3 times!');
    }
  }

  readline.close();
}

main();