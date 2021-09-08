'use strick'
const RegistrationService = require('../services/registration-services');


module.exports = function (registrationService) {

    let Count = 0;
    let regNum = ''
    let regList = []

    // regax
    const regType1 = /^((CA|CJ|CL)\s([0-9]){5})$/
    const regType2 = /^((CA|CL|CJ)\s\d{3}\s\d{3})$/
    const regType3 = /^((CA|CL|CJ)\s\d{3}\-\d{3})$/

    async function start(req, res) {
        regList = await registrationService.getRegList()
        
        console.log(regList)
        res.render('index', {
            regNum,
            regList
        })

    };

    async function add(req, res) {
        try {
            regNum = req.body.regNumber

            if (!regNum){
                req.flash('error', 'Enter name and select a registration number')
            }

            else if (regNum) {
                reg = await registrationService.setReg({
                    registration: regNum
                })               
            }

        }
        catch (err) {
            console.error('Error occured on greet!', err)
            throw err
        }
        return res.redirect('/');
    };

    async function all(req, res) {
        regList = await registrationService.getRegList()
        res.redirect('index',{
            regList
        });
        console.log(regList);
         
    };
    async function times(req, res) {
        // const selectedName = req.params.name;
        // counter = await registrationService.howManyTimesEachName(selectedName)

        // console.log(registrationService.howManyTimesEachName(selectedName))
        // res.render('greeted-times', {
        //     selectedName,
        //     counter
        // })
    };
    async function resetDB(req, res) {
        await registrationService.deletes()
         req.flash('info', 'Database has successfully resetted!')
         message = ''
        return res.redirect('/');
    };


    return {
        add,
        start,
        all,
        times,
        resetDB
    }

}