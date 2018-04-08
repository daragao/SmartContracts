const web3Abi = require('web3-eth-abi');
const Doart3Token = artifacts.require('Doart3Token')

contract('Doart3Token', (accounts) => {
  const owner = accounts[0]
  const senderAddr = accounts[1]
  const recipientAddr = accounts[2]

  it('fund defund', async () => {
    const token = await Doart3Token.deployed()
    const tokenOwner = await token.GetOwner()
    const totalSupply = 1000

    const receiptFundSender = await token.fund(senderAddr, totalSupply,{ from: owner })

    const senderBalance = await token.balanceOf(senderAddr);
    const recipientBalance = await token.balanceOf(recipientAddr);

    assert.equal(senderBalance.toString(), totalSupply, 'sender initial balance failed')
    assert.equal(recipientBalance.toString(), 0, 'recipient initial balance failed')

    const receiptDefundSender = await token.defund(totalSupply,{ from: senderAddr })

    const senderFinalBalance = await token.balanceOf(senderAddr);
    const recipientFinalBalance = await token.balanceOf(recipientAddr);

    assert.equal(senderFinalBalance.toString(), 0, 'sender final balance failed')
    assert.equal(recipientFinalBalance.toString(), 0, 'recipient final balance failed')
  })

  it('tranasfer with reference', async () => {
    const token = await Doart3Token.deployed()
    const tokenOwner = await token.GetOwner()
    const totalSupply = 1000
    const txValue = 100
    const refData = '0x01'

    const receiptFundSender = await token.fund(senderAddr, totalSupply,{ from: owner })

    const senderBalance = await token.balanceOf(senderAddr);
    const recipientBalance = await token.balanceOf(recipientAddr);

    assert.equal(senderBalance.toString(), totalSupply, 'sender initial balance failed')
    assert.equal(recipientBalance.toString(), 0, 'recipient initial balance failed')

    const overloadedTransferAbi = {
      "constant": false,
      "inputs": [
        { "name": "to", "type": "address" },
        { "name": "value", "type": "uint256" },
        { "name": "data", "type": "bytes" }
      ],
      "name": "transfer",
      "outputs": [ { "name": "", "type": "bool" } ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }

    const transferMethodTransactionData = web3Abi
      .encodeFunctionCall(overloadedTransferAbi, [ recipientAddr, txValue, refData ])
    const transferReceipt = await web3.eth
      .sendTransaction({from: senderAddr, to: token.address, data: transferMethodTransactionData});

    const senderFinalBalance = await token.balanceOf(senderAddr);
    const recipientFinalBalance = await token.balanceOf(recipientAddr);

    assert.equal(senderFinalBalance.toString(), totalSupply - txValue, 'sender final balance failed')
    assert.equal(recipientFinalBalance.toString(), txValue, 'recipient final balance failed')
  })
});
