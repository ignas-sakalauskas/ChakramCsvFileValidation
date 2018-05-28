var chakram = require('chakram'),
    expect = chakram.expect;

var CSVFileValidator = require('csv-file-validator');

const config = {
    headers: [
        {
            name: 'First Name',
            inputName: 'firstName',
            required: true,
            requiredError: function (headerName, rowNumber, columnNumber) {
                return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`
            }
        },
        {
            name: 'Last Name',
            inputName: 'lastName',
            required: true,
            requiredError: function (headerName, rowNumber, columnNumber) {
                return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`
            }
        },
        {
            name: 'Email',
            inputName: 'email',
            unique: true,
            uniqueError: function (headerName) {
                return `${headerName} is not unique`
            },
            validate: function (email) {
                return isEmailValid(email)
            },
            validateError: function (headerName, rowNumber, columnNumber) {
                return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`
            }
        }
    ]
}

function isEmailValid(email) {
    return email.indexOf('@') !== -1;
}

describe("Chakram CSV validation tests", function () {
    it("Given invalid CSV file should contain 4 validation errors", function () {

        return chakram
            .get("http://www.mocky.io/v2/5b0bdce93300007300b3fe0c")   // Returns contents of "invalid_file.csv"
            .then(function (res) {
                // Debug output
                // console.log("Retrieved CSV:");
                // console.log(res.body);

                // Assert we received non-empty file
                expect(res.body).to.be.not.empty;

                // Validate the CSV
                return CSVFileValidator(res.body, config)
                    .then(csvData => {
                        // Debug out of parsed CSV into JSON object, and validation errors
                        // console.log(csvData); 
                        // Assert JSON data object is not empty 
                        expect(csvData.data).to.be.not.empty;
                        // Assert erros array is empty
                        expect(csvData.inValidMessages).to.have.lengthOf(4);
                    });
            });
    });

    it("Given valid CSV file should have empty errors array", function () {

        return chakram
            .get("http://www.mocky.io/v2/5b0be0ea3300006f00b3fe28") // Returns contents of "valid_file.csv"
            .then(function (res) {
                // Debug output
                // console.log("Retrieved CSV:");
                // console.log(res.body);

                // Assert we received non-empty file
                expect(res.body).to.be.not.empty;

                // Validate the CSV
                return CSVFileValidator(res.body, config)
                    .then(csvData => {
                        // Debug out of parsed CSV into JSON object, and validation errors
                        // console.log(csvData); 
                        // Assert JSON data object is not empty 
                        expect(csvData.data).to.be.not.empty;
                        // Assert erros array is empty
                        expect(csvData.inValidMessages).to.be.empty;
                    });
            });
    });
});
