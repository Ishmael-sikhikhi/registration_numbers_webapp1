module.exports =function registrations(pool) {
    const regType1 = /^((CA|CJ|CL)\s([0-9]){5})$/
    const regType2 = /^((CA|CL|CJ)\s\d{3}\s\d{3})$/
    const regType3 = /^((CA|CL|CJ)\s\d{3}\-\d{3})$/

    var regNumbers = []
    var regN = ''
    var reg = ''
    var str = ''
    var theReg = ''
    async function setReg(num) {
        
        reg = num.registration
        theReg = reg.charAt(0).toUpperCase() + reg.charAt(1).toUpperCase() + reg.slice(2)
        
        if (theReg) {
            if ((regType1.test(theReg) || regType2.test(theReg) || regType3.test(theReg ))) {
                var id = await getID(theReg)
                var checkReg = await pool.query(`select reg_num from regnum where reg_num = $1`,[theReg]);
                if (checkReg.rowCount === 0) {
                    await pool.query(`insert into regnum (town_id,reg_num) values ($1,$2)`,[id,theReg]);
                }
            }          
        } 
    }; 

    async function forTown(num) {
        var town = num.townName;
        var townID = await getID(town);
        regNumbers = await pool.query(`select reg_num from regnum where town_id = $1`, [townID]);
        return regNumbers.rows 
    };

    async function getID(par){
        str = par.slice(0,2);
        var id = ''
        var townIdentify = await pool.query(`select id from towns where town_str = $1`, [str])
        townIdentify = townIdentify.rows
        id = townIdentify[0].id
        return Number(id)
    };

    async function getRegList() {
        regNumbers = await pool.query(`select reg_num from regnum`);
        return regNumbers.rows;
    };    
 

    async function resetDB(){
        await pool.query(`delete from regnum`);
    }

    return {
        setReg,
        getRegList,
        forTown,
        resetDB,
        getID
   }
}