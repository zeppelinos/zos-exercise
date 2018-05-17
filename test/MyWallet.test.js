const BigNumber = web3.BigNumber
const MyWallet = artifacts.require('MyWallet')

contract('MyWallet', ([_, owner, anotherone]) => {
  const ETH_10 = new BigNumber('10e18')

  beforeEach(async function () {
    this.wallet = await MyWallet.new({ from: owner })
  })

  describe('init', function () {
    it('should allow to set the owner of the contract', async function () {
      await this.wallet.initWallet(owner, { from: owner })

      const walletOwner = await this.wallet.owner()
      assert.equal(walletOwner, owner)
    })

    it('should not allow to set the owner of the contract once set', async function () {
      // TODO: This test is failing, it should pass once you have fixed the contract
      await this.wallet.initWallet(owner, { from: owner })

      try {
        await this.wallet.initWallet(anotherone, { from: anotherone })
        assert.fail('Expected revert not received')
      } catch (error) {
        assert(error.message.search('revert') >= 0, 'Expected revert not received')
        const walletOwner = await this.wallet.owner()
        assert.equal(walletOwner, owner)
      }
    })
  })

  describe('deposit', function () {
    it('should allow to receive money', async function () {
      await this.wallet.sendTransaction({ from: owner, value: ETH_10 })

      const balance = await web3.eth.getBalance(this.wallet.address)
      assert(balance.eq(ETH_10))
    })
  })

  describe('withdraw', function () {
    beforeEach('init wallet', async function () {
      await this.wallet.initWallet(owner, { from: owner })
    })

    it('should allow the owner to withdraw money', async function () {
      await this.wallet.sendTransaction({ from: owner, value: ETH_10 })

      await this.wallet.withdraw(ETH_10, { from: owner })

      const balance = await web3.eth.getBalance(this.wallet.address)
      assert(balance.eq(0))
    })

    it('should not allow others to withdraw money', async function () {
      await this.wallet.sendTransaction({ from: owner, value: ETH_10 })

      try {
        await this.wallet.withdraw(ETH_10, { from: anotherone })
      } catch (error) {
        assert(error.message.search('revert') >= 0)
        const balance = await web3.eth.getBalance(this.wallet.address)
        assert(balance.eq(ETH_10))
      }
    })
  })
})
