const assert = require('assert');
const greetingsFactory = require('../services/registration-services');
const pg = require("pg");
const Pool = pg.Pool;


// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/greet_tests';

const pool = new Pool({
    connectionString
});  


beforeEach(async function () {
    // clean the tables before each test run
    await pool.query("delete from users;");

});

describe('Registration number exercise', ()=>{      
    
    it("It should be able to convert small letter to capital letter when registration is been entered as 'ca 878 555'", ()=>{
       let registration = registrations()
       registration.setReg("ca 878 555")
      
       assert.deepEqual(['CA 878 555'],registration.getRegList() )
   })
   it("It should be able to convert small letter to capital letter when registration is been entered as 'cA 878 555'", ()=>{
       let registration = registrations()
       registration.setReg("ca 878 555")
      
       assert.deepEqual(['CA 878 555'],registration.getRegList() )
   })
   it("It should be able to convert small letter to capital letter when registration is been entered as 'Cl 878 555'", ()=>{
       let registration = registrations()
       registration.setReg("Cl 878 555")
      
       assert.deepEqual(['CL 878 555'],registration.getRegList() )
   })
   it("It should be able to convert small letter to capital letter when registration is been entered as 'Cl 878 555'", ()=>{
       let registration = registrations()
       registration.setReg("Cl 878 555")
      
       assert.deepEqual(['CL 878 555'],registration.getRegList() )
   })
   describe('Validating by regex',()=>{
       it('Should return error message if wrong registration number is entered', ()=>{
           let registration = registrations()
            assert.equal("Wrong registration number",registration.setReg('ca12345'))
        })
        it('Should return error message if entered registration number entered does not belong from Cape Town/ Paarl or Stellenbosch', ()=>{
            let registration = registrations()
             assert.equal("Wrong registration number",registration.setReg('cy 12345'))
         })
         it("Bellville registratiion number entered and No Bellville on Application", ()=>{
            let registration = registrations()
            assert.equal( "Wrong registration number", registration.setReg("CY 152775"))
        })
        it("It should add to the list registration when it is correct", ()=>{
            let registration = registrations()
            registration.setReg("CA 123 456")
            assert.deepEqual(['CA 123 456'],registration.getRegList() )
        })
        it("It should not add to the list registration when it is correct and already exist on the list", ()=>{
            let registration = registrations()
            registration.setReg("CA 123 456")
            registration.setReg("CA 123 456")
            assert.deepEqual(['CA 123 456'],registration.getRegList() )
        })
        it("It should add to the list registration when it is correct and have not been added before", ()=>{
            let registration = registrations()
            registration.setReg("CA 123 456")
            registration.setReg("CL 123 456")
            assert.deepEqual(['CA 123 456','CL 123 456'],registration.getRegList() )
        })
   }) 
   describe("Filter by town", ()=>{
       it('it should display Cape Town registration if selected town is Cape Town', ()=>{
           let registration = registrations()
       registration.setReg("ca 878 555")
       registration.setReg("ca 878 565")
       registration.setReg("cy 878 555")
       registration.setReg("cl 878 576")
       registration.setReg("cl 878 555")
       registration.setReg("cj 878 555")
      
       assert.deepEqual(['CA 878 555','CA 878 565'],registration.filterFunction('CA') )
       })

       it('it should display Stellenbosch registration if selected town is Stellenbosch', ()=>{
           let registration = registrations()
       registration.setReg("cl 878 555")
       registration.setReg("cl 878 565")
       registration.setReg("cy 878 555")
       registration.setReg("ca 878 576")
       registration.setReg("cj 878 555")
       registration.setReg("cj 878 555")
      
       assert.deepEqual(['CL 878 555', 'CL 878 565'], registration.filterFunction('CL'))
       })
       it('it should display Paarl registration if selected town is Paarl', ()=>{
           let registration = registrations()
       registration.setReg("cl 878 555")
       registration.setReg("cl 878 565")
       registration.setReg("cy 878 555")
       registration.setReg("ca 878 576")
       registration.setReg("cj 878 555")
       registration.setReg("cj 878 555")
      
       assert.deepEqual([ 'CJ 878 555' ], registration.filterFunction('CJ'))
       })
   })
})