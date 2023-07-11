const ini = require('ini');
const fs = require('fs');
const { extname } = require('path');

if (!process.argv[2]) {
    console.log('No file selected! Please select a file by dragging it onto the application or passing it as the first argument in the terminal');
    process.exit(0);
}

const file = process.argv[2];
if (extname(file) !== '.ini') {
    console.log('File must be an .ini file!');
    process.exit(0);
}

const config = ini.parse(fs.readFileSync(file, 'utf-8'));

console.log(`Reading file: ${file}`);

let csvFields = 'index';
let rawCsvValues = [];

// Getting all the fields from the ini file into a raw array
for (let key in config) {
    const formattedKey = key.replaceAll(' ', '_');
    for (let subKey in config[key]) {
        const formattedSubKey = subKey.replaceAll(' ', '_');
        csvFields += `, ${formattedKey}.${formattedSubKey}`;
        rawCsvValues.push(config[key][subKey]);
    }
}

let csvValues = [];
let longestArray = 0;
console.log(`Parsing a maximum of ${longestArray} values...`);

// Splitting all the raw values by comma and adding them to a 2d array
for (const rawValue of rawCsvValues) {
    const values = rawValue.split(',');
    if (values.length > longestArray) {
        longestArray = values.length;
    }
    csvValues.push(values);
}

let csv = csvFields + '\n';

// Parsing the 2d array into a csv string
for (let i = 0; i < longestArray; i++) {
    let row = `${i}`;
    for (const values of csvValues) {
        if (i > values.length - 1) {
            row += ',';
        } else {
            row += `,${values[i]}`;
        }
    }
    row += '\n';
    csv += row;
}

const outputFileName = `${file.replace('.ini', '')}_${Date.now()}.csv`;
fs.writeFileSync(outputFileName, csv);

console.log(`Done! (${outputFileName})`);
