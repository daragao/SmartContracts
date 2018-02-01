const doart3 = artifacts.require('Doart3Token')

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
    const txACK = await instance.transfer(receiverAddr, amount/*, 'first test transfer'*/, { from: ownerAddr })
    assert(txACK, 'something was wrong with the transfer!')
    const receiverBalance = await instance.balanceOf.call(receiverAddr, { from: ownerAddr })
    assert(receiverBalance, amount, 'receiver has the wrong amount')
    const ownerPostBalance = await instance.balanceOf.call(ownerAddr, { from: ownerAddr })
    assert(ownerPostBalance, ownerBalance-amount, 'receiver has the wrong amount')

  })
})
