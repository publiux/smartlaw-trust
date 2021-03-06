
const Owned = artifacts.require('Owned');
const utils = require('./Utils');

contract('Owned', (accounts) => {

    describe('Owned()', () => {
        it('verifies the owner after construction', async () => {
            let contract = await Owned.new(accounts[0]);
            let owner = await contract.owner.call();
            assert.equal(owner, accounts[0]);
        });
    });

    describe('transferOwnership() and acceptOwnership()', () => {
        it('verifies the new owner after ownership transfer', async () => {
            let contract = await Owned.new(accounts[0]);
            await contract.transferOwnership(accounts[1]);
            await contract.acceptOwnership({ from: accounts[1] });
            let owner = await contract.owner.call();
            assert.equal(owner, accounts[1]);
        });

        it('verifies that ownership transfer fires an OwnerUpdate event', async () => {
            let contract = await Owned.new(accounts[0]);
            await contract.transferOwnership(accounts[1]);
            let res = await contract.acceptOwnership({ from: accounts[1] });
            assert(res.logs.length > 0 && res.logs[0].event == 'OwnerUpdate');
        });

        it('verifies that newOwner is cleared after ownership transfer', async () => {
            let contract = await Owned.new(accounts[0]);
            await contract.transferOwnership(accounts[1]);
            await contract.acceptOwnership({ from: accounts[1] });
            let newOwner = await contract.newOwner.call();
            assert.equal(newOwner, utils.zeroAddress);
        });

        it('verifies that no ownership transfer takes places before the new owner accepted it', async () => {
            let contract = await Owned.new(accounts[0]);
            await contract.transferOwnership(accounts[1]);
            let owner = await contract.owner.call();
            assert.equal(owner, accounts[0]);
        });

        it('verifies that only the owner can initiate ownership transfer', async () => {
            let contract = await Owned.new(accounts[0]);

            try {
                await contract.transferOwnership(accounts[1], { from: accounts[2] });
                assert(false, "didn't throw");
            }
            catch (error) {
                return utils.ensureException(error);
            }
        });

        it('verifies that the owner can cancel ownership transfer before the new owner accepted it', async () => {
            let contract = await Owned.new(accounts[0]);
            await contract.transferOwnership(accounts[1]);
            await contract.transferOwnership('0x0');
            let newOwner = await contract.newOwner.call();
            assert.equal(newOwner, utils.zeroAddress);
        });
    });
});
