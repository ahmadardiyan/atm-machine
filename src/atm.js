const readline = require('node:readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const { menu } = require('./menu');

const PIN = '123456',
MAX_COUNT = 3;

let counter = 1;
let listTransaction = []

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
    await withdrawMenu();
  } else if (option == 3) {
    console.log('Deposit');
    console.log('=======================');
    await depositMenu();
  } else if (option == 4) {
    console.log('Transfer');
    console.log('=======================');
    await transferMenu()
  } else if (option == 5) {
    console.log('Mutation');
    console.log('=======================');
    await mutationMenu()
  } else if (option == 6) {
    console.log('Thank you, and see you~');
    return main();
  } else {
    console.log('please select the options menu');
  }

  await getMenu();
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
}

const depositMenu = async () => {
  const action = 'deposit';
  const value = await displayQuestion('Enter the amount to be deposit: ')  

  const result = await createTransaction({action, value});

  if (result) {
    console.log('create deposit is successfully');
  } else{
    console.log('create deposit is failed');
  }
}

const checkNumberType = async ( value ) => {
  if (isNaN(Number(value))) {
    console.log('failed, your amount data is not a number!');
    await getMenu()
  }
}

const createTransaction = async ({ action, value }) => {
  value = Number(value)
  await checkNumberType(value);
  
  const result = listTransaction.push({
    action,
    value
  })

  return result ? true : false;
}

const withdrawMenu = async () => {
  const action = 'withdraw';
  const value = await displayQuestion('Enter the amount to be withdraw: ')  

  const balance = await getBalance();
  if (balance < value ) {
    console.log('your balance less than the amount');
    await getMenu();
  }

  const result = await createTransaction({ action, value });

  if (result) {
    console.log('create withdraw is successfully');
  } else{
    console.log('create withdraw is failed');
  }
}

const transferMenu = async () => {
  const action = 'transfer';
  const value = await displayQuestion('Enter the amount to be transfer: ')  

  const balance = await getBalance();
  if (balance < value ) {
    console.log('your balance less than the amount');
    await getMenu();
  }

  const result = await createTransaction({ action, value });

  if (result) {
    console.log('create transfer is successfully');
  } else{
    console.log('create transfer is failed');
  }
}

const mutationMenu = async () => {
  if (listTransaction.length <= 0) console.log('you do not have transaction'); 

  for ( const [index, item] of listTransaction.reverse().entries()) {
    console.log(`${index + 1} | ${item.action} | ${item.value} `);
  }
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
      console.log(`failed, you have tried ${MAX_COUNT} times!`);
    }
  }

  readline.close();
}

main();