'use strick'
const RegistrationService = require('../services/registration-services');


module.exports = function (registrationService) {

    let Count = 0;
    let regNum = ''
    let regList = []
    var town = ''

    // regax
    const regType1 = /^((CA|CJ|CL)\s([0-9]){5})$/
    const regType2 = /^((CA|CL|CJ)\s\d{3}\s\d{3})$/
    const regType3 = /^((CA|CL|CJ)\s\d{3}\-\d{3})$/

    async function homeRoute(req, res) {
        regList = await registrationService.getRegList()
        
        res.render('index', {
            regNum,
            regList,
            town
        })
    };

    async function addRegNumber(req, res) {
        try {
            regNum = req.body.regNumber

            if (regNum ===''){
                req.flash('error', 'Enter registration number')
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

    async function allRegNumbers(req, res) {
        regList = await registrationService.getRegList()
        res.render('index',{
            regList
        });         
    };
    
    async function reset(req, res) {
        await registrationService.resetDB()
         req.flash('info', 'Database has successfully resetted!')
        return res.render('index')
    };

    async function towns(req, res){
        town = await registrationService.filterFunction('CA')
        console.log(town)
    }

    return {
        addRegNumber,
        homeRoute,
        allRegNumbers,
        reset,
        towns
    }
}