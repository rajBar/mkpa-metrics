const _ = require("lodash");

const metricTemplate = {
    location: "",
    metrics: {
        SEN: [],
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
    }
};

const allMetrics = [];

let metrics;

let currentMetricLocationIndex;


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
    const ethnicities = [...metrics.ethnicities];
    const index = _.findIndex(ethnicities, e => e.ethnicity === ethnicity);

    if (index === -1) {
        ethnicities.push({ethnicity, count: 1})
    } else {
        const count = ethnicities[index].count;
        ethnicities[index].count = count + 1;
    }

    metrics.ethnicities = [...ethnicities];
}

const incrementPostcode = postcode => {
    const postcodes = metrics.postcodes;
    const index = _.findIndex(postcodes, e => e.postcode === postcode);

    if (index === -1) {
        postcodes.push({postcode, count: 1})
    } else {
        const count = postcodes[index].count;
        postcodes[index].count = count + 1;
    }

    metrics.postcodes = postcodes;
}

const incrementSEN = condition => {
    const conditions = metrics.SEN;
    const index = _.findIndex(conditions, e => e.condition === condition);

    if (index === -1) {
        conditions.push({condition, count: 1})
    } else {
        const count = conditions[index].count;
        conditions[index].count = count + 1;
    }

    metrics.SEN = conditions;
}

const getMetricsForLocation = async location => {
    const index = _.findIndex(allMetrics, e => e.location === location);

    if (index === - 1) {
        const newLMetricLocation = {...metricTemplate};
        newLMetricLocation.location = location;
        currentMetricLocationIndex = allMetrics.length;
        allMetrics.push(newLMetricLocation);
        metrics = {...allMetrics[currentMetricLocationIndex].metrics};
        metrics.totalAttended = 1;
    } else {
        currentMetricLocationIndex = index;
        metrics = {...allMetrics[currentMetricLocationIndex].metrics};
        metrics.totalAttended = metrics.totalAttended + 1;
    }

    return 0;
}

const generateMetrics = async dataRow => {
    const blah = await getMetricsForLocation(dataRow.type);

    const gender = dataRow.maleorfemale;
    gender.toString().toLowerCase() === "male" ? await incrementGender("m") : await incrementGender("f");

    const date = new Date();
    const birthYear = dataRow.yearofbirth.replace(/\s+/g, '') === "" ? 3000 : dataRow.BirthYear;
    const age = date.getFullYear() - birthYear;
    await incrementAgeGroup(age);

    const ethnicity = dataRow.pleasechooseappropiateethnicityofyourchild.replace(/\s+/g, '') === "" ? "empty" : dataRow.pleasechooseappropiateethnicityofyourchild.replace(/\s+/g, '');
    await incrementEthnicities(ethnicity);

    const postcode = dataRow.postcode.replace(/\s+/g, '') === "" ? "empty": dataRow.postcode.replace(/\s+/g, '').slice(0, -3).toLowerCase();
    await incrementPostcode(postcode);

    if ((dataRow.doesyourchildhaveanyspecialeducationalneeds.toLowerCase().replace(/\s/g, "") === "yes") && dataRow.ifyespleasesignifybelow) await incrementSEN(dataRow.ifyespleasesignifybelow);

    allMetrics[currentMetricLocationIndex].metrics = {...metrics};
}

export const metricCalulator = async (allData) => {

    for (const row of allData) {
        if (row.label.replace(/\s+/g, '').toLowerCase() === "checkedin") {
            await generateMetrics(row);
        }
    }

    console.log(JSON.stringify(allMetrics));

    console.log('===========================');
    console.log('===========================');
    console.log('===========================');
    console.log('===========================');

    console.log(allMetrics);

    return allMetrics
}