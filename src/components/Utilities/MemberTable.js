const { getMeasureCompliance } = require('./GeneralUtil');

const memberIdTip = 'The member\'s member ID.';
const pageSize = 10;

// These will change based on the measurement.
const headerData = (selectedMeasures, storeInfo) => {
  let standardFlexBasis = 'medium';
  if (selectedMeasures.length > 4) {
    standardFlexBasis = selectedMeasures.length >= 6 ? 'smaller' : 'small';
  }

  const headerInfo = [
    {
      key: 'label',
      link: true,
      header: 'MemberID',
      tooltip: memberIdTip,
      flexBasis: 'larger',
    },
  ];
  selectedMeasures.forEach((measureName) => {
    const labelFound = storeInfo[measureName].displayLabel;
    headerInfo.push({
      key: measureName,
      link: false,
      header: labelFound,
      tooltip: storeInfo[measureName].title,
      flexBasis: standardFlexBasis,
    });
  });
  return headerInfo;
};

const allValuesEqual = (valueArray) => {
  const compareValue = valueArray[0].value;
  for (let k = 1; k < valueArray.length; k += 1) {
    if (compareValue !== valueArray[k].value) {
      return false;
    }
  }
  return true;
};

const formatData = (memberResults, activeMeasure, storeInfo, tableFilter) => {
  const formattedData = [];
  let workingData = [];

  const subMeasures = Object.keys(storeInfo).filter((item) => item.includes(activeMeasure));

  if (activeMeasure !== 'composite' && activeMeasure !== '') {
    // loop through member results for active measure
    memberResults.forEach((res) => {
      if (res.measurementType === activeMeasure) {
        workingData.push(res);
      }
    });
    // workingData = memberResults
    //   .filter((result) => activeMeasure.measure.includes(result.measurementType))
  } else {
    workingData = memberResults;
  }
  if (workingData && activeMeasure) {
    workingData.forEach((memberResult) => {
      const memberResultArray = [];
      const complianceResult = getMeasureCompliance(memberResult);
      if (complianceResult.length === 1) {
        memberResultArray.push({
          memberID: memberResult.memberId,
          measure: subMeasures[0],
          label: storeInfo[subMeasures[0]].displayLabel,
          value: complianceResult[0],
        });
      } else {
        complianceResult.forEach((result, index) => {
          memberResultArray.push({
            memberID: memberResult.memberId,
            measure: subMeasures[index + 1],
            label: storeInfo[subMeasures[index + 1]]?.displayLabel,
            value: result,
          });
        });
      }

      const formattedResult = {
        value: memberResult.memberId,
        label: memberResult.memberId,
        type: 'member',
      };

      if (memberResultArray.length === 1) {
        formattedResult[subMeasures[0]] = memberResultArray[0].value.toString();
      } else {
        formattedResult[subMeasures[0]] = allValuesEqual(memberResultArray).toString();
        for (let k = 1; k < subMeasures.length; k += 1) {
          const memberFoundResult = memberResultArray[k - 1];
          if (memberFoundResult) {
            formattedResult[subMeasures[k]] = memberFoundResult.value.toString();
          }
        }
      }

      formattedData.push(formattedResult);
    });
  }

  return filterByNonCompliance(formattedData, tableFilter);
};

const nomCompRange = {
  one: 1,
  two: 2,
  many: 3,
};

const filterByNonCompliance = (formattedData, tableFilter) => {
  if (tableFilter.length === 0) {
    return formattedData;
  }
  const filteredData = [];

  const counting = (data, filterVal) => {
    data.forEach((measure) => {
      const resultList = Object.values(measure).filter((submeasure) => submeasure === 'false');
      if (resultList.length === nomCompRange[filterVal] && nomCompRange[filterVal] <= 2) {
        filteredData.push(measure);
      }
      if (resultList.length >= nomCompRange[filterVal] && nomCompRange[filterVal] > 2) {
        filteredData.push(measure);
      }
    });
  };

  if (tableFilter.length === 1) {
    const filterVal = tableFilter[0];
    const ns = structuredClone(formattedData);
    if (Object.keys(nomCompRange).includes(filterVal)) {
      counting(ns, filterVal);
    }
  }

  if (tableFilter.length > 1) {
    const ns = structuredClone(formattedData);
    tableFilter.forEach((filterVal) => {
      counting(ns, filterVal);
    });
  }

  return filteredData;
};

module.exports = {
  headerData, pageSize, formatData,
};
