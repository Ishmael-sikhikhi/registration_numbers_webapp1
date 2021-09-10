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
                var str = theReg.slice(0,2);
                var checkReg = await pool.query(`select reg_num from regnum where reg_num = $1`,[theReg]);
                if (checkReg.rowCount === 0) {
                    await pool.query(`insert into regnum (town_id,reg_num) values ($1,$2)`,[str,theReg]);
                }
            }          
        }
    };

    async function getRegList() {
        regNumbers = await pool.query(`select reg_num from regnum`);
        return regNumbers.rows;
    }
    async function filterFunction(town_id) {
       var townReg =  await pool.query(`select town_name from towns where town_id=$1${[town_id]}`);
       return townReg.rows
    }

    async function resetDB(){
        await pool.query(`delete from regnum`);
    }

    return {
        setReg,
        getRegList,
        filterFunction,
        resetDB
   }
}