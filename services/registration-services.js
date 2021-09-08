module.exports =function registrations(pool) {
    const regType1 = /^((CA|CJ|CL)\s([0-9]){5})$/
    const regType2 = /^((CA|CL|CJ)\s\d{3}\s\d{3})$/
    const regType3 = /^((CA|CL|CJ)\s\d{3}\-\d{3})$/

    var regNumbers = []
    var regN = ''
    var reg = ''
    async function setReg(num) {
        reg = num.registration
        var theReg = reg.charAt(0).toUpperCase() + reg.charAt(1).toUpperCase() + reg.slice(2)
        if (theReg) {
            if ((theReg.match(regType1) || theReg.match(regType2) || theReg.match(regType3))) {
                regN = theReg
                var checkReg = await pool.query(`select reg_num from regnum where reg_num = $1`,[theReg]);
                if (checkReg.rowCount === 0) {
                    await pool.query(`insert into regnum (reg_num) values ($1)`,[theReg]);
                }
            }
          
        }

    };

    async function getRegList() {
        regNumbers = await pool.query(`select reg_num from regnum`);
        return regNumbers.rows;
    }
    function filterFunction(town) {
        var arrayList = []
        for (var i = 0; i < regNumbers.length; i++) {
            if (regNumbers[i].startsWith(town)) {
                arrayList.push(regNumbers[i])
            }
        }
        return arrayList;
    }

    return {
        setReg,
        getRegList,
        filterFunction,
   }
}