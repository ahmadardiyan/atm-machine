const readline = require('node:readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const { menu } = require('./menu');

const PIN = '123456',
MAX_COUNT = 3;

let counter = 1;
let listTransaction = [
  { action: 'deposit', value: 5000},
  { action: 'withdraw', value: 1000},
  { action: 'transfer', value: 500}
]

const displayQuestion = (question) => {
  return new Promise ( resolve => {
    readline.question( question , value => {
      resolve(value);
    })
  })
}

async function askPin() {
  return await displayQuestion(`Please insert your PIN: `)
};

const displayMenu = async () => {
  menu();
  return await displayQuestion(`Answer: `)
}

const actionMenu = async (option) => {
  console.log(option);

  if (option == 1) {
    console.log('Balance');
    console.log('=======================');
    await balanceMenu();
  } else if (option == 2) {
    console.log('Withdraw');
    console.log('=======================');
  } else if (option == 3) {
    console.log('Deposit');
    console.log('=======================');
    await depositMenu();
  } else if (option == 4) {
    console.log('Transfer');
  } else if (option == 5) {
    console.log('Thank you, and see you~');
    return;
  } else {
    console.log('please select the options menu');
    await main();
  }
}

const getMenu = async () => {
  console.log('=======================');
  const option = await displayMenu();

  await actionMenu(option);
}

const getBalance = async () => {
  let balance = 0
  if (listTransaction.length > 0) {
    for ( item of listTransaction ) {
      if (item.action === 'deposit') {
        balance += item.value;
      } else {
        balance -= item.value;
      }
    }
  }
  return balance;
}

const balanceMenu = async () => {
  const balance = await getBalance();

  console.log(`Your balance is ${balance}`);
  await getMenu()
}

const depositMenu = async () => {
  const value = await displayQuestion('Enter the amount to be deposit: ')  
  const result = await createDeposit(value);

  if (result) {
    console.log('create deposit is successfully');
    // await balanceMenu();
  } else{
    console.log('create deposit is failed');
    await getMenu()
  }
}

const createDeposit = async (value) => {
  value = Number(value)

  if ( isNaN(value) ) {
    return false
  }

  listTransaction.push({
    action: 'deposit',
    value
  })

  return true
}

main = async () => {
  console.log('=======================');
  console.log('Welcome to ATM Machine!');
  console.log('=======================');
  const pin = await askPin();

  if (pin == PIN) {
    await getMenu()
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