import axios from 'axios';
import env from '../../env';

// MemberReport.js
export async function memberInfoFetch(url, id) {
  // write a check here for undefined id for testing purposes or for invalid id?
  try {
    const memberInfo = await axios.get(`${url}?memberId=${id}`).then((res) => res.data);
    return memberInfo;
  } catch (error) {
    return error;
  }
}

// D3Container.js
export async function measureDataFetch(measure) {
  try {
    const memberUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}members?measurementType=${measure}`);
    const defaultVal = await axios.get(memberUrl).then((values) => values.data);
    return defaultVal;
  } catch (error) {
    return error;
  }
}

// Search bar
export async function memberInfoSearch(query) {
  try {
    const searchUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}members/search?memberId=${query}`);
    const memberInfo = await axios.get(searchUrl).then((values) => values.data);
    return memberInfo;
  } catch (error) {
    return error;
  }
}

// App.js
export async function validateAccessToken(accessToken) {
  try {
    const auth = await axios.get(`${env.REACT_APP_TOKENINFO}?access_token=${accessToken}`);
    if (auth.status === 200) {
      return true;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
  return false;
}

// Filter Search
export async function filterSearch(searchMeasure, measurementYear, searchArray, isComposite) {
  try {
    const searchObject = {
      submeasure: isComposite ? false : searchMeasure,
      measurementYear,
      filters: searchArray,
      isComposite,
    };
    const filterSearchURL = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}/filter`);
    const filterResults = await axios.post(filterSearchURL, searchObject).then((res) => res.data);
    if (filterResults.status === 'Success') {
      const { members, dailyMeasureResults } = filterResults;
      return {
        status: filterResults.status,
        members,
        dailyMeasureResults,
      };
    }
    return {
      status: 'Failed',
      members: [],
      dailyMeasureResults: [],
    };
  } catch (error) {
    return {
      status: 'Failed',
      members: [],
      dailyMeasureResults: [],
    };
  }
}
export async function infoDataFetch() {
  try {
    const infoUrl = new URL(`${env.REACT_APP_HEDIS_MEASURE_API_URL}measures/info`);
    const infoPromise = await axios.get(infoUrl).then((res) => res.data);
    return infoPromise;
  } catch (error) {
    return error;
  }
}
