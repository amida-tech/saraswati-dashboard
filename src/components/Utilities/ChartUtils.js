export function filterByStars(displayData, filters, currentResults) {
  return (displayData.filter((result) => filters.stars.includes(
    Math.floor( // Floor for the .5 stars.
      currentResults.find(
        (current) => current.measure === result.measure,
      ).starRating,
    ),
  )));
}
export function filterByPercentage(displayData, filters, currentResults) {
  return (displayData.filter((result) => {
    const { value } = currentResults.find(
      (current) => current.measure === result.measure,
    );
    return (
      value >= filters.percentRange[0] && value <= filters.percentRange[1]
    );
  }));
}
export function filterByDOC(displayData, filters, storeInfo) {
  return displayData.filter(
    (result) => filters.domainsOfCare.includes(storeInfo[result.measure].domainOfCare),
  );
}
export function filterByTimeline(timelineDisplayData, timeline) {
  if (timeline.choice !== 'all') {
    let dayLimit = 0;
    if (timeline.choice === 'YTD') {
      dayLimit = new Date(new Date().getFullYear(), 0, 1).getTime();
    } else {
      dayLimit = new Date().getTime() - (parseInt(timeline.choice, 10) * 24 * 60 * 60 * 1000);
    }
    return timelineDisplayData.filter((result) => new Date(result.date) > dayLimit);
  }
  return timelineDisplayData;
}
export function expandSubMeasureResults(selectedMeasure, results) {
  const expandedResults = [];
  results.filter(
    (result) => result.measure === selectedMeasure.measure,
  ).forEach((byLine) => {
    expandedResults.push(byLine);
    if (selectedMeasure.subScores && selectedMeasure.subScores.length > 1) {
      byLine.subScores.forEach((subScore) => expandedResults.push(subScore));
    }
  });
  return expandedResults;
}
export function getSubMeasureCurrentResults(activeMeasure, currentResults) {
  let subMeasureCurrentResults = [];
  const subMeasurePrime = currentResults.find(
    (item) => item.measure === activeMeasure.measure,
  );
  if (subMeasurePrime.subScores && subMeasurePrime.subScores.length > 1) {
    subMeasureCurrentResults = [subMeasurePrime, ...subMeasurePrime.subScores];
  } else {
    subMeasureCurrentResults = [subMeasurePrime];
  }
  subMeasureCurrentResults.forEach((res) => { res.id = res.measure; });
  return subMeasureCurrentResults;
}
export function getSubMeasureCurrentResultsPerMeasure(givenMeasure, currentResults) {
  let subMeasureCurrentResults = [];
  const subMeasurePrime = currentResults.find(
    (item) => item.measure === givenMeasure,
  );
  if (subMeasurePrime.subScores && subMeasurePrime.subScores.length > 1) {
    subMeasureCurrentResults = [subMeasurePrime, ...subMeasurePrime.subScores];
  } else {
    subMeasureCurrentResults = [subMeasurePrime];
  }
  return subMeasureCurrentResults;
}
export const createLabel = (measure, info) => {
  if (info[measure]) {
    return `${info[measure].displayLabel} - ${info[measure].title}`;
  }
  if (measure === 'composite') {
    return 'Composite';
  }
  if (measure.length > 3 && measure.charAt(3) === 'e') {
    return `${measure.slice(0, 3).toUpperCase()}-E`;
  }
  return measure.toUpperCase();
};
export const createSubMeasureLabel = (subMeasure, info) => {
  let displayLabel = '';
  if (subMeasure.length > 3 && subMeasure.charAt(3) === 'e') {
    displayLabel = `${subMeasure.slice(0, 3).toUpperCase()}-E`;
  } else {
    displayLabel = subMeasure.toUpperCase();
  }

  if (info[subMeasure]) {
    return `${displayLabel} - ${info[subMeasure].title}`;
  }

  return displayLabel;
};
export const calcMemberResults = (dailyMeasureResults, measureInfo) => {
  const workingList = {};
  dailyMeasureResults.forEach((item) => {
    if (workingList[item.measure] === undefined
      || item.date > workingList[item.measure].date) {
      workingList[item.measure] = item;
    }
  });
  Object.keys(workingList).forEach((key) => {
    workingList[key].label = createLabel(workingList[key].measure, measureInfo);
    workingList[key].shortLabel = measureInfo[workingList[key].measure]?.displayLabel;
    workingList[key].title = measureInfo[workingList[key].measure]?.title;
    if (workingList[key].subScores) {
      workingList[key].subScores.forEach((subscore) => {
        const newSubscore = subscore;
        newSubscore.label = createSubMeasureLabel(newSubscore.measure, measureInfo);
      });
    }
  });
  const currentResults = Object.values(workingList)
    .sort((a, b) => {
      if (a.measure === 'composite') return -1;
      if (b.measure === 'composite') return 1;
      return a.measure > b.measure ? 1 : -1;
    });

  return {
    results: dailyMeasureResults,
    currentResults,
  };
};
export const DisplayDataFormatter = (
  currentResults,
  selectedMeasures,
  displayData,
  colorMap,
  theme,
  measureAvgValue,
) => {
  const newChartDisplay = [];
  if (displayData.length > 0) {
    const sortedData = displayData
      .filter((data) => data.measure === selectedMeasures[0])
      .sort((a, b) => a.date <= b.date);

    newChartDisplay.push({
      color: '#222222',
      name: 'MY2024 Composite Average',
      data: Array(sortedData.length).fill(measureAvgValue),
      date: sortedData.map((entry) => entry.date),
    });
  }
  currentResults.forEach((cr) => {
    const Measure = cr.measure;

    if (selectedMeasures.includes(Measure)) {
      const selectMeasureFilter = displayData.filter((entry) => Measure === entry.measure);
      if (selectMeasureFilter.length > 0) {
        newChartDisplay.push({
          color: colorMap
            .find((color) => color.value === Measure)?.color || theme.palette?.primary.main,
          name: Measure,
          data: selectMeasureFilter.map((item) => Number(item.value.toFixed(2))),
          date: selectMeasureFilter.map((entry) => entry.date),
        });
      }
    }
  });
  if (newChartDisplay.length > 0) {
    return newChartDisplay;
  }
  return [{ name: undefined, date: [], data: [] }];
};
export const lineChartOptions = (
  {
    colorMap,
    currentTimeline,
    chartData,
    theme,
  },
) => {
  const xaxisTitle = () => {
    const { choice } = currentTimeline;
    if (choice === 'all') {
      return 'All Available';
    }
    if (choice === '30') {
      return 'Last 30 Days';
    }
    if (choice === '60') {
      return 'Last 60 Days';
    }
    if (choice === '90') {
      return 'Last 90 Days';
    }
    if (choice === 'YTD') {
      return 'Year to Date';
    }
    return 'All Available';
  };

  const chartOptions = {
    height: 100,
    type: 'line',
    redrawOnParentResize: true,
    zoom: {
      enabled: true,
    },
    animations: {
      enabled: true,
      easing: 'easein',
      speed: 1,
      animateGradually: {
        enabled: false,
        delay: 50,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 600,
      },
    },
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: false,
        customIcons: [
          // {
          //   icon: '<img src="https://cdn4.iconfinder.com/data/icons/complete-common-version-1-5/1024/date_range2-512.png"/>',
          //   index: -7,
          //   title: 'tooltip of the icon',
          //   class: 'chart-container__custom-icon',
          //   click(chart, options, e) {
          //     console.log('clicked custom-icon', {chart, options, e})
          //   },
          // },
          // {
          //   icon: 'F',
          //   index: -8,
          //   title: 'tooltip of the icon',
          //   class: 'custom-icon',
          //   click(chart, options, e) {
          //     console.log('clicked custom-icon', {chart, options, e})
          //   },
          // },
        ],
      },
      export: {
        csv: {
          filename: undefined,
          columnDelimiter: ',',
          headerCategory: 'category',
          headerValue: 'value',
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString();
          },
        },
        svg: {
          filename: undefined,
        },
        png: {
          filename: undefined,
        },
      },
      autoSelected: 'zoom',
    },
  };
  const legend = {
    show: false,
    showForSingleSeries: false,
    showForNullSeries: true,
    showForZeroSeries: true,
    position: 'bottom',
    horizontalAlign: 'center',
    floating: false,
    fontSize: '15px',
    fontFamily: 'Helvetica, Arial',
    fontWeight: 400,
    formatter(value) {
      return `${value.toUpperCase()}`;
    },
    inverseOrder: false,
    width: undefined,
    height: undefined,
    tooltipHoverFormatter: undefined,
    customLegendItems: [],
    offsetX: 0,
    offsetY: 0,
    labels: {
      colors: colorMap.map((color) => {
        if (color.color) {
          return color.color;
        }
        return theme.palette.text.primary;
      }),
      useSeriesColors: false,
    },
    markers: {
      width: 12,
      height: 12,
      strokeWidth: 0,
      strokeColor: '#fff',
      fillColors: colorMap.map((color) => {
        if (color.color) {
          return color.color;
        }
        return theme.palette.text.primary;
      }),
      radius: 12,
      onClick: undefined,
      offsetX: 0,
      offsetY: 0,
    },
    itemMargin: {
      horizontal: 5,
      vertical: 0,
    },
    onItemClick: {
      toggleDataSeries: true,
    },
    onItemHover: {
      highlightDataSeries: true,
    },
  };
  const dataLabels = {
    enabled: false,
  };
  const stroke = {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    width: 4.5,
    dashArray: [16, 0],
  };

  const xaxis = {
    show: true,
    showAlways: true,
    type: 'category',
    categories: chartData[0].date.length > 0 ? chartData[0].date : [],
    tickAmount: 20,
    tickPlacement: 'on',
    min: undefined,
    max: undefined,
    range: undefined,
    floating: false,
    decimalsInFloat: undefined,
    overwriteCategories: undefined,
    position: 'bottom',
    labels: {
      show: true,
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: true,
      showDuplicates: false,
      trim: false,
      minHeight: undefined,
      maxHeight: 120,
      style: {
        colors: theme.palette?.bluegray.L1,
        fontSize: '18px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400,
        // cssClass: 'apexcharts-xaxis-label',
      },
      offsetX: 0,
      offsetY: 10,
      format: undefined,
      formatter(value) {
        if (chartData[0].date.length > 0) {
          if (value !== undefined) {
            if (typeof value === 'string') {
              return value.split('T')[0];
            }
            return value;
            // eslint-disable-next-line no-else-return
          } else {
            return Date.now();
          }
          // eslint-disable-next-line no-else-return
        } else {
          return [];
        }
      },
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm',
      },
    },
    axisBorder: {
      show: false,
      color: theme.palette?.bluegray.L1,
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      borderType: 'solid',
      color: theme.palette?.bluegray.L1,
      offsetX: 0,
      offsetY: 0,
    },
    title: {
      text: xaxisTitle(),
      offsetX: 0,
      offsetY: 205,
      style: {
        color: theme.palette?.bluegray.L1,
        fontSize: '20px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 600,
        cssClass: 'apexcharts-xaxis-title',
      },
    },
    tooltip: {
      enabled: false,
    },
  };
  const yaxis = {
    show: true,
    showAlways: true,
    max: chartData[0].data.length > 0 ? 100 : undefined,
    tickAmount: 5,
    labels: {
      show: true,
      align: 'right',
      minWidth: 0,
      maxWidth: 100,
      style: {
        colors: theme.palette?.bluegray.L1,
        fontSize: '20px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 600,
        cssClass: 'apexcharts-yaxis-label',
      },
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
      formatter(value) {
        return `${value.toFixed(0)}%`;
      },
    },
    axisBorder: {
      show: false,
      color: theme.palette?.bluegray.L1,
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      borderType: 'solid',
      color: theme.palette?.bluegray.L1,
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
    title: {
      text: 'Percent',
      rotate: -90,
      offsetX: 0,
      offsetY: 0,
      style: {
        color: theme.palette?.bluegray.L1,
        fontSize: '20px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 600,
        cssClass: 'apexcharts-yaxis-title',
      },
    },

  };
  const tooltip = {
    enabled: true,
    enabledOnSeries: true,
    shared: false,
    followCursor: true,
    intersect: false,
    inverseOrder: false,
    custom({
      series, seriesIndex, dataPointIndex, w,
    }) {
      const foundDate = w.globals.categoryLabels[dataPointIndex + 1];
      const foundColor = w.globals.initialSeries[seriesIndex]?.color;
      return `<div class="chart-container__tooltip" style="background-color:${foundColor}; text-shadow: 1px 1px ${theme.palette?.bluegray.main}; color:${theme.palette?.background.main};">`
        + `<span> Measure: ${w.config.series[seriesIndex].name.toUpperCase()}</span>`
        + '<br/>'
        + `<span> Value: ${series[seriesIndex][dataPointIndex].toFixed(2)}%</span>`
        + '<br/>'
        + `<span> Date: ${new Date(foundDate).toDateString()}</span>`
        + '</div>';
    },
    fillSeriesColor: true,
    style: {
      fontSize: '18px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 400,
    },
    onDatasetHover: {
      highlightDataSeries: false,
    },
    marker: {
      show: true,
    },
    items: {
      // display: flex,
    },
    fixed: {
      enabled: false,
      position: 'topRight',
      offsetX: 0,
      offsetY: 0,
    },
  };
  const markers = {
    colors: [theme.palette?.bluegray.D1],
  };
  const noData = {
    text: 'No measures selected, please use the checkboxes next to the measures below to view results.',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '25px',
      fontFamily: undefined,
    },
  };
  return {
    chart: chartOptions,
    dataLabels,
    stroke,
    xaxis,
    yaxis,
    legend,
    markers,
    tooltip,
    noData,
  };
};

export const TimelineOptions = [
  { value: 'all', label: 'All Available' },
  { value: '30', label: 'Last 30 Days' },
  { value: '60', label: 'Last 60 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: 'YTD', label: 'Year to Date' },
];
