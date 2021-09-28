'use strick'
const { Pool } = require('pg');
const RegistrationService = require('../services/registration-services');

module.exports = function (registrationService) {

    let regNum = ''
    let regList = []
    let reg = []
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
            regNum = regNum.charAt(0).toUpperCase() + regNum.charAt(1).toUpperCase() + regNum.slice(2)
            regList = await registrationService.getRegList();
            if (regList.includes(regNum) === true) {
                req.flash('error', "Registration number already exists!");
                console.log(1100);
            }
        
            
            if (regList.includes(regNum) === false) {
                if (regType1.test(regNum) || regType2.test(regNum) || regType3.test(regNum)) {

                    regList = await registrationService.setReg({
                        registration: regNum
                    })

                    console.log(1200)

                }

                else if (!regType1.test(regNum) || !regType2.test(regNum) || !regType3.test(regNum)) {
                    req.flash('error', "Please registration number start with CA/ CL or CJ as example showed on the screen")
                }
            }
        }
        catch (err) {
            console.error('Error occured on reg!', err)
            throw err
        }
        return res.redirect('/')
    };

    async function allRegNumbers(req, res) {
        regList = await registrationService.getRegList()
        res.render('index', {
            regList
        });
    };

    async function townRegNumbers(req, res) {
        town = req.body.townReg;
        console.log(town)
        console.log(regList)
        if (town) {
            regList = await registrationService.forTown({
                townName: town
            })

            res.render('index', {
                regList
            })
        }
        else {
            req.flash('error', 'Please select a town')
        }
    };

    async function reset(req, res) {
        await registrationService.resetDB()
        req.flash('info', 'Database has successfully resetted!');
        regList = ''
        res.redirect('/');
    };

    return {
        addRegNumber,
        homeRoute,
        allRegNumbers,
        reset,
        townRegNumbers,
    }
}