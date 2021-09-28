const assert = require('assert');
const RegistrationService = require('../services/registration-services');
const pg = require("pg");
const Pool = pg.Pool;


// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/regnum_tests';

const pool = new Pool({
    connectionString
});

let registration = RegistrationService(pool)

beforeEach(async function () {
    // clean the tables before each test run
    await registration.resetDB();

});

describe('Registration number exercise', async () => {

    it("It should be able to convert small letter to capital letter when registration is been entered as 'ca 878 555'", async () => {
        beforeEach(async function () {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "ca 878 555" })

        assert.deepEqual([{ "reg_num": 'CA 878 555' }], await registration.getRegList())
    })
    it("It should be able to convert small letter to capital letter when registration is been entered as 'cA 878 555'", async () => {
        beforeEach(async function () {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "ca 878 555" })

        assert.deepEqual([{ "reg_num": 'CA 878 555' }], await registration.getRegList())
    })
    it("It should be able to convert small letter to capital letter when registration is been entered as 'Cl 878 555'", async () => {
        beforeEach(async function () {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "Cl 878 555" })

        assert.deepEqual([{ "reg_num": 'CL 878 555' }], await registration.getRegList())
    })
    it("It should be able to convert small letter to capital letter when registration is been entered as 'Cl 878 555'", async () => {
        beforeEach(async function () {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "Cl 878 555" })

        assert.deepEqual([{ "reg_num": 'CL 878 555' }], await registration.getRegList())
    })
    describe('Validating by regex', () => {
        it('Should return error message if wrong registration number is entered', async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

        assert.equal(undefined, await registration.setReg({ registration: 'ca12345' }))
        });
        it('Should return error message if entered registration number entered does not belong from Cape Town/ Paarl or Stellenbosch', async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

        assert.equal(undefined, await registration.setReg({ registration: 'cy 12345' }))
        })
        it("Bellville registratiion number entered and No Bellville on Application", async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

        assert.equal(undefined, await registration.setReg({ registration: "CY 152775" }))
        })
        it("It should add to the list registration when it is correct", async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "CA 123 456" })
            assert.deepEqual([{ "reg_num": 'CA 123 456' }], await registration.getRegList())
        })
        it("It should not add to the list registration when it is correct and already exist on the list", async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "CA 123 456" })
            await registration.setReg({ registration: "CA 123 456" })
            assert.deepEqual([{ "reg_num": 'CA 123 456' }], await registration.getRegList())
        })
        it("It should add to the list registration when it is correct and have not been added before", async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "CA 123 456" })
            await registration.setReg({ registration: "CL 123 456" }) 
            assert.deepEqual([{ "reg_num": 'CA 123 456' }, { "reg_num": 'CL 123 456' }], await registration.getRegList())
        })
    })
    describe("Filter by town", async () => {
            it('it should display Cape Town registration if selected town is Cape Town', async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "ca 878 555" })
            await registration.setReg({ registration: "ca 878 565" })
            await registration.setReg({ registration: "cy 878 555" })
            await registration.setReg({ registration: "cl 878 576" })
            await registration.setReg({ registration: "cl 878 555" })
            await registration.setReg({ registration: "cj 878 555" })

            assert.deepEqual([{ "reg_num": 'CA 878 555' }, { "reg_num": 'CA 878 565' }], await registration.forTown({ townName: 'CA' }))
        })

        it('it should display Stellenbosch registration if selected town is Stellenbosch', async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "cl 878 555" })
            await registration.setReg({ registration: "cl 878 565" })
            await registration.setReg({ registration: "cy 878 555" })
            await registration.setReg({ registration: "ca 878 576" })
            await registration.setReg({ registration: "cj 878 555" })
            await registration.setReg({ registration: "cj 878 555" })

            assert.deepEqual([{ "reg_num": 'CL 878 555'},{"reg_num": 'CL 878 565' }], await registration.forTown({ townName: 'CL' }))
        })
        it('it should display Paarl registration if selected town is Paarl', async () => {
            beforeEach(async function () {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "cl 878 555" })
            await registration.setReg({ registration: "cl 878 565" })
            await registration.setReg({ registration: "cy 878 555" })
            await registration.setReg({ registration: "ca 878 576" })
            await registration.setReg({ registration: "cj 878 555" })
            await registration.setReg({ registration: "cj 878 555" })

            assert.deepEqual([{ "reg_num": 'CJ 878 555' }], await registration.forTown({ townName: 'CJ' }))
        })
    })

    describe('Test filter function', ()=>{
        it('It should return id = 1 if Paarl registration number is inserted', async ()=>{
            assert.deepEqual(1, await registration.getID("CL 123-456"))
        })
        it('It should return id = 2 if Stellenbosch registration number is inserted', async ()=>{
            assert.deepEqual(2, await registration.getID("CJ 123-456"))
        })
        it('It should return id = 3 if Cape Town registration number is inserted', async ()=>{
            assert.deepEqual(3, await registration.getID("CA 123-456"))
        })             
    })
})