# ETHBA exercise using ZeppelinOS

## Setup
The first thing you should do is to install `zos`.
```
npm install -g zos
```

Then, follow the subsequent commands to setup the exercise project:
```
git clone git@github.com:zeppelinos/ethba-exercise.git
cd ethba-exercise
npm install
```

## Exercise
The idea of this exercise is to fix a bug on a contract using ZeppelinOS upgradeability.
In the `contracts` directory you will find a contract called `MyWallet` with a bug.
The idea would be to deploy an instance of the `MyWallet` contract as if we wouldn't have known it had a bug, and then upgrade it using ZeppelinOS!

*We recommend doing this exercise in a local network, you can start a new one running `npx truffle develop`*

Then open a new console and follow the next steps: 

### 1. Buggy contract
The first step would be to create an instance of our buggy contract as if we wouldn't have known it had a bug. 
To do that we will use the following commands of `zos`:

```
zos add MyWallet
zos push --network local
zos create MyWallet --network local
```

As you can see, a new `zos.local.json` including all the data of the contracts of your project.
You can check your buggy contract running the following commands over the truffle console:

```
walletAddress = require('./zos.local.json').proxies['MyWallet'][0].address
wallet = MyWallet.at(walletAddress)

someone = web3.eth.accounts[0]
wallet.initWallet(someone)
wallet.owner().then(r => owner = r)
owner === someone // true

anotherone = web3.eth.accounts[1]
wallet.initWallet(anotherone)
wallet.owner().then(r => owner = r)
owner === anotherone // true
``` 

As you can see, our instance has a bug, let's fix it...

### 2. Fix the bug
Once you have created the first instance of `MyWallet` it's time to realize it had a bug and fix its code.
If you don't recognize the vulnerability, you can run the tests with `npm test`. 
You will see that one of them is failing. Let's now fix it!
Make sure all your tests pass by running `npm test`.

### 3. Upgrade your contract with the bugfix
To upgrade your `MyWallet` instance run the following commands:

```
zos bump 0.1.1
zos add MyWallet
zos push --network local
zos upgrade MyWallet --network local
```

Now let's try the same commands over the truffle console to check our contract instance has been upgraded correctly.

```
walletAddress = require('./zos.local.json').proxies['MyWallet'][0].address
wallet = MyWallet.at(walletAddress)

someone = web3.eth.accounts[0]
wallet.initWallet(someone)
wallet.owner().then(r => owner = r)
owner === someone // true

anotherone = web3.eth.accounts[1]
wallet.initWallet(anotherone) // revert!
``` 

As you can see, the bug has been fixed!
