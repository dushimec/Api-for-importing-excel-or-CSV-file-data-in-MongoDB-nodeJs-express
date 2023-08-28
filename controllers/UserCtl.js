var UserM = require('../model/UserM');
var csv = require('csvtojson');
const CsvParser =require('json2csv').Parser;

const importUser = async (req, res) => {
    try {
        var userData = [];

        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                for (var x = 0; x < response.length; x++) { // Fix: Use response.length
                    userData.push({
                        name: response[x].Name,
                        email: response[x].Email,
                        mobile: response[x].Mobile,
                    });
                }

                await UserM.insertMany(userData);
            });

        res.send({ status: 200, success: true, msg: 'CSV Imported!!' });
    } catch (error) {
        res.send({ status: 400, success: false, msg: error.message });
    }
}

const exportUser = async(req, res)=>{
    try {
        let users = [];
        var userData = await UserM.find({})
        userData.forEach((user) => {
            const {id,name,email,mobile} = user
            users.push({id,name,email,mobile})
        });

        const csvFields = ['Id','Name','Email','Mobile'];
        const csvParser = new CsvParser({csvFields});
        const csvData = csvParser.parse(users);

        res.setHeader("Content-type","text/csv");
        res.setHeader("Content-Disposition","attachment: filename=usersData.csv");

        res.status(200).send(csvData)

    } catch (error) {
        res.send({ status: 400, success: false, msg: error.message });
        
    }
}

module.exports = { importUser, exportUser };
