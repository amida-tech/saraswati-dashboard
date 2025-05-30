/* eslint-disable default-param-last */
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

const formatData = (
  memberResults = [],
  activeMeasure = '',
  storeInfo = {},
  tableFilter,
) => {
  const formattedData = [];
  let workingData = [];

  const safeStore = storeInfo || {};
  const subMeasures = Object.keys(safeStore).filter((item) => item.includes(activeMeasure));

  console.log('format data props: ', [memberResults, activeMeasure, storeInfo])
  if (activeMeasure && activeMeasure !== 'composite') {
    workingData = memberResults.filter(
      (res) => res.measurementType === activeMeasure,
    );
  } else {
    workingData = memberResults;
  }

  workingData.forEach((memberResult) => {
    const memberResultArray = [];
    const complianceResult = getMeasureCompliance(memberResult);

    if (complianceResult.length === 1) {
      const key0 = subMeasures[0] || '';
      memberResultArray.push({
        memberID: memberResult.memberId,
        measure: key0,
        label: safeStore[key0]?.displayLabel,
        value: complianceResult[0],
      });
    } else {
      complianceResult.forEach((value, idx) => {
        const key = subMeasures[idx + 1] || '';
        memberResultArray.push({
          memberID: memberResult.memberId,
          measure: key,
          label: safeStore[key]?.displayLabel,
          value,
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
      for (let i = 1; i < subMeasures.length; i += 1) {
        const mr = memberResultArray[i - 1];
        if (mr) formattedResult[subMeasures[i]] = mr.value.toString();
      }
    }

    formattedData.push(formattedResult);
  });

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
