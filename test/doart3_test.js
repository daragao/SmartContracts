const crypto = require('crypto')
const HTLC = artifacts.require('HashedTimelock')

const htlcArrayToObj = c => {
  return {
    sender: c[0],
    receiver: c[1],
    amount: c[2],
    hashlock: c[3],
    timelock: c[4],
    withdrawn: c[5],
    refunded: c[6],
    preimage: c[7],
  }
};

const sha256 = x => crypto.createHash('sha256').update(x).digest()

contract ('HTLC contract', (accounts) => {
  const senderAddr = accounts[0]
  const recipientAddr = accounts[1]

  it('create contract', async () => {
    const instance = await HTLC.deployed()

    const senderBalance = web3.eth.getBalance(senderAddr);
    const recipientBalance = web3.eth.getBalance(recipientAddr);

    const secret = "hello".padEnd(32,'\0').substring(0,32);// padd with 0 and cut string
    const hash = '0x' + sha256(secret).toString('hex');
    // console.log('JS hash:',secret,hash)

    const timelock = (1)
    const txObj = { value: web3.toWei('1','ether'), from: senderAddr }
    const txReceipt = await instance.newContract(recipientAddr, hash, Date.now() + timelock, txObj)
    // console.log(txReceipt.logs[0].args.contractId)
    const contractId = txReceipt.logs[0].args.contractId;
    // console.log(contractId)

    const contractArr = await instance.getContract.call(contractId)
    const contract = htlcArrayToObj(contractArr)
    // console.log('contract:',JSON.stringify(contract,2,2))

    //await new Promise(resolve => setTimeout(resolve, timelock*2)) // SLEEP

    //const txReceiptTest = await instance.test(secret, { from: recipientAddr })

    const txReceiptWithdraw = await instance.withdraw(contractId, secret, { from: recipientAddr })

    const senderBalanceEnd = web3.eth.getBalance(senderAddr);
    const recipientBalanceEnd = web3.eth.getBalance(recipientAddr);

    const diffSender = web3.fromWei(senderBalanceEnd - senderBalance,'ether');
    const diffRecipient = web3.fromWei(recipientBalanceEnd - recipientBalance,'ether');

    assert.isBelow(diffSender,-1,'diff sender')
    assert.isAbove(diffSender,-2,'diff sender')
    assert.isBelow(diffRecipient,1,'diff recipient')
    assert.isAbove(diffRecipient,0,'diff recipient')
    const contractArrEnd = await instance.getContract.call(contractId)
    const contractEnd = htlcArrayToObj(contractArrEnd)
    // console.log('contract:',JSON.stringify(contractEnd,2,2))
  })
});
/*
const doart3 = artifacts.require('Doart3Token')
const doart3Crowdsale = artifacts.require('Doart3Crowdsale')

contract ('doart3 token', (accounts) => {
  const ownerAddr = accounts[0]

  it('check literals', async () => {
    const instance = await doart3.deployed()
    const name = await instance.name()
    assert.equal(name, 'doart3 token', 'name was not expected!')
    const totalSupply = await instance.totalSupply()
    assert.equal(totalSupply, 10000000, 'totalSupply was not expected!')
    const decimals = await instance.decimals()
    assert.equal(decimals, 8, 'decimals was not expected!')
    const symbol = await instance.symbol()
    assert.equal(symbol, 'DRT', 'symbol was not expected!')
  })

  it('transfer value', async () => {
    const instance = await doart3.deployed()
    const totalSupply = await instance.totalSupply.call({ from: ownerAddr })

    const ownerBalance = await instance.balanceOf.call(ownerAddr, { from: ownerAddr })
    assert.equal(totalSupply.toString(), ownerBalance.toString(), 'totalSupply should equal owner balance!')

    const amount = 1000
    const receiverAddr = accounts[1]
    // owner -> receiver
    // TODO: polymorphism/overloading not working in truffle need to use web3Abi.encodeFunctionCall()
    const txACK = await instance.transfer(receiverAddr, amount, { from: ownerAddr })
    assert(txACK, 'something was wrong with the transfer!')
    const receiverBalance = await instance.balanceOf.call(receiverAddr, { from: ownerAddr })
    assert(receiverBalance, amount, 'receiver has the wrong amount')
    const ownerPostBalance = await instance.balanceOf.call(ownerAddr, { from: ownerAddr })
    assert(ownerPostBalance, ownerBalance-amount, 'receiver has the wrong amount')

  })

  it.only('crowdsale', async () => {
    console.log(doart3Crowdsale.new)
  })
})
*/
