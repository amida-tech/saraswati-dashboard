const domainsOfCare = {
  name: 'Domains of Care',
  tip: 'We only support Effectiveness of Care and Electronic Clinical Data System measures at the moment.',
  options: [
    'Electronic Clinical Data System',
    'Effectiveness of Care',
    // 'Experience of Care',
    // 'Access/Availability of Care',
    // 'Utilization & Risk Adjusted Utilization',
    // 'Healthcare Descriptive Info',
  ],
  values: ['ECDS', 'EOC'], // 'XOC', 'AOC', 'URAU', 'HDI'],
}

const starRating = {
  name: 'Star Rating',
  tip: 'Each star rating also includes the next half star. So 2 Stars would also cover 2.5 stars.',
  options: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
  values: [1, 2, 3, 4, 5],
}

const ncqaBonus = {
  name: 'NCQA Accreditation Bonus',
  tip: 'Coming soon.',
  options: ['Accredited/Provisional', 'Interim', 'In-Process', 'Scheduled', 'None'],
  values: ['accredited', 'interim', 'inprocess', 'scheduled', 'none'],
}

const measureTypes = {
  name: 'Measure Types',
  tip: 'Coming soon.',
  options: ['Process', 'Outcome', 'Member Experience (CPA,CPC)'],
  values: ['process', 'outcome', 'experience'],
}

const subMeasures = {
  name: 'Sub-Measures',
  tip: 'Coming soon.',
  options: ['Show ONLY scores with sub or child measures'],
}

// TODO: When adding functionality, change this to an object returned by a function that assembles
// the options and values arrays from the ingested data from HERA.
// HERA needs to pass forward the set of providers forward as a unique set.

const payors = (payor) => ({
  name: 'Payors (Payers)',
  tip: 'The providers of the services recieved in the context of member data.',
  options: payor?.map((payer) => payer.payor),
  values: payor?.map((payer) => payer.payor),
})

// TODO: When adding functionality, change this to an object returned by a function that assembles
// the options and values arrays from the ingested data from HERA.
// HERA needs to pass forward the set of policies forward as a unique set.

const healthcareProviders = (healthcareProvider) => ({
  name: 'Healthcare Providers',
  tip: 'The coverage plan types covering the relevant member data.',
  options: healthcareProvider?.map((provider) => provider.provider),
  values: healthcareProvider?.map((provider) => provider.provider),
})
// TODO: When adding functionality, change this to an object returned by a function that assembles
// the options and values arrays from the ingested data from HERA.
// HERA needs to pass forward the set of providers forward as a unique set.

const healthcareCoverages = (healthcareCoverage) => ({
  name: 'Healthcare Coverages',
  tip: 'The providers of the services recieved in the context of member data.',
  options: healthcareCoverage?.map((coverage) => coverage.coverage),
  values: healthcareCoverage?.map((coverage) => coverage.coverage),
})

// TODO: When adding functionality, change this to an object returned by a function that assembles
// the options and values arrays from the ingested data from HERA.
// HERA needs to pass forward the set of policies forward as a unique set.

const healthcarePractitioners = (practitioner) => ({
  name: 'Healthcare Practitioners',
  tip: 'The coverage plan types covering the relevant member data.',
  options: practitioner?.map((prac) => prac.practitioner),
  values: practitioner?.map((prac) => prac.practitioner),
})

const percentMarks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
]

const sumCalculator = (filter, additionalFilterOptions) => {
  let sum = 0;

  if (filter.domainsOfCare.length < domainsOfCare.options.length) {
    sum += filter.domainsOfCare.length;
  }
  if (filter.stars.length < starRating.options.length) {
    sum += filter.stars.length;
  }
  if (filter.payors.length < payors(additionalFilterOptions.payors).options.length) {
    sum += filter.payors.length
  }
  if (filter.healthcareProviders.length < healthcareProviders(
    additionalFilterOptions.healthcareProviders,
  ).options.length) {
    sum += filter.healthcareProviders.length
  }
  if (filter.healthcareCoverages.length < healthcareCoverages(
    additionalFilterOptions.healthcareCoverages,
  ).options.length) {
    sum += filter.healthcareCoverages.length
  }
  if (filter.healthcarePractitioners.length < healthcarePractitioners(
    additionalFilterOptions.healthcarePractitioners,
  ).options.length) {
    sum += filter.healthcarePractitioners.length
  }
  if (filter.percentRange[0] > 0) {
    sum += 1;
  }
  if (filter.percentRange[1] < 100) {
    sum += 1;
  }

  return sum;
}

const filterDrawerItemData = {
  domainsOfCare,
  starRating,
  ncqaBonus,
  measureTypes,
  subMeasures,
  payors,
  healthcareProviders,
  healthcareCoverages,
  healthcarePractitioners,
  percentMarks,
  sumCalculator,
};

export default filterDrawerItemData;
