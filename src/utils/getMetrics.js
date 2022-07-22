import csv from 'fast-csv';
import _ from 'lodash';

const headers = ["StartTime","n/a","ChildsFirstName","ChildsLastName","Phone","Email","Type","Calendar","AppointmentPrice","Paid","AmountPaidOnline","CertificateCode","Notes","DateScheduled","Label","ScheduledBy","Postcode","Gender","BirthYear","Ethnicity","SpecialEducationNeedsOrDisability","SpecialEducationCondition","AppointmentId"];

const metrics = {
    date: "",
    location: "",
    // {SEN?: ??},
    totalAttended: 0,
    totalBoys: 0,
    totalGirls: 0,
    ageGroups: {
        totalZeroToFive: 0,
        totalSixToEight: 0,
        totalNineToEleven: 0,
        totalTwelveToFourteen: 0,
        totalOverFourteen: 0,
        empty: 0
    },
    ethnicities: [],
    postcodes: []
};


const getDataFromCsv = (csvFile) => {
    return new Promise((resolve, reject) => {
        const csvData = [];
        csv.parseString(csvFile, {headers: headers, renameHeaders: true, ignoreEmpty: true})
        // csv.parseFile('./charityFiles/finalcsv.csv', {headers: headers, renameHeaders: true, ignoreEmpty: true})
            .on("data", (data) => {
                csvData.push(data);
            })
            .on("end", () => {
                resolve(csvData);
            });
    });
}

const incrementGender = gender => {
    const totalBoys = metrics.totalBoys;
    const totalGirls = metrics.totalGirls;
    if (gender === "m") {
        metrics.totalBoys = totalBoys + 1;
    } else {
        metrics.totalGirls = totalGirls + 1;
    }
}

const incrementAgeGroup = age => {
    const totalZeroToFive = metrics.ageGroups.totalZeroToFive;
    const totalSixToEight = metrics.ageGroups.totalSixToEight;
    const totalNineToEleven = metrics.ageGroups.totalNineToEleven;
    const totalTwelveToFourteen = metrics.ageGroups.totalTwelveToFourteen;
    const totalOverFourteen = metrics.ageGroups.totalOverFourteen;
    const empty = metrics.ageGroups.empty;

    console.log(age);
    console.log(typeof age);

    switch(true) {
        case (age < -1):
            metrics.ageGroups.empty = empty + 1;
            break;
        case (age < 6):
            metrics.ageGroups.totalZeroToFive = totalZeroToFive + 1;
            break;
        case (age < 9):
            metrics.ageGroups.totalSixToEight = totalSixToEight + 1;
            break;
        case (age < 12):
            metrics.ageGroups.totalNineToEleven = totalNineToEleven + 1;
            break;
        case (age < 15):
            metrics.ageGroups.totalTwelveToFourteen = totalTwelveToFourteen + 1;
            break;
        case (age > 14):
            metrics.ageGroups.totalOverFourteen = totalOverFourteen + 1;
            break;
        default:
            break;
    }
}

const incrementEthnicities = ethnicity => {
    const ethnicities = metrics.ethnicities;
    const index = _.findIndex(ethnicities, e => e.ethnicity = ethnicity);

    if (index === -1) {
        ethnicities.push({ethnicity, count: 1})
    } else {
        const count = ethnicities[index].count;
        ethnicities[index].count = count + 1;
    }

    metrics.ethnicities = ethnicities;
}

const incrementPostcode = postcode => {
    const postcodes = metrics.postcodes;
    const index = _.findIndex(postcodes, e => e.postcode = postcode);

    if (index === -1) {
        postcodes.push({postcode, count: 1})
    } else {
        const count = postcodes[index].count;
        postcodes[index].count = count + 1;
    }

    metrics.postcodes = postcodes;
}

const generateMetrics = async dataRow => {
    const gender = dataRow.Gender;
    gender.toString().toLowerCase() === "male" ? incrementGender("m") : incrementGender("f");

    const date = new Date();
    console.log('================');
    console.log(dataRow.BirthYear);
    console.log(typeof dataRow.BirthYear);
    console.log('----')
    const birthYear = dataRow.BirthYear.replace(/\s+/g, '') === "" ? 3000 : dataRow.BirthYear;
    console.log(birthYear);
    console.log(typeof birthYear);
    console.log('----')
    const age = date.getFullYear() - birthYear;
    console.log(age);
    incrementAgeGroup(age);
    console.log('================');

    const ethnicity = dataRow.Ethnicity.replace(/\s+/g, '') === "" ? "empty" : dataRow.Ethnicity.replace(/\s+/g, '');
    incrementEthnicities(ethnicity);

    const postcode = dataRow.Postcode.replace(/\s+/g, '') === "" ? "empty": dataRow.Postcode.replace(/\s+/g, '');
    incrementPostcode(postcode);
}

export const metricCalulator = async (csvFile) => {
    const allData = await getDataFromCsv(csvFile);
    metrics.date = allData[0].StartTime;
    metrics.location = allData[0].Type;
    metrics.totalAttended = allData.length;

    for (const row of allData) {
        await generateMetrics(row);
    }

    console.log(JSON.stringify(metrics));

    console.log('===========================');
    console.log('===========================');
    console.log('===========================');
    console.log('===========================');

    console.log(metrics);
}