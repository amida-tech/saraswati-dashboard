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
// eslint-disable-next-line max-len
export async function filterSearch(searchMeasure, searchArrayOrFilters, isComposite, measurementYear) {
  try {
    // normalize filters argument
    let filters = {};
    if (Array.isArray(searchArrayOrFilters)) {
      // must have a string key for array filters
      if (typeof searchMeasure === 'string' && searchMeasure) {
        filters[searchMeasure] = searchArrayOrFilters;
      } else {
        // no valid key provided ⇒ empty filters
        filters = {};
      }
    } else if (
      searchArrayOrFilters
      && typeof searchArrayOrFilters === 'object'
    ) {
      filters = searchArrayOrFilters;
    }

    // decide submeasure: only non-composite calls pass a string
    const submeasure = !isComposite && typeof searchMeasure === 'string' && searchMeasure
      ? searchMeasure
      : false;

    const body = {
      submeasure,
      filters,
      isComposite: Boolean(isComposite),
      measurementYear,
    };

    const url = new URL(
      `${env.REACT_APP_HEDIS_MEASURE_API_URL}/filter`,
    );
    const resp = await axios.post(url, body);
    const result = resp.data;

    if (result.status === 'Success') {
      return {
        status: 'Success',
        members: result.members,
        dailyMeasureResults: result.dailyMeasureResults,
      };
    }

    return {
      status: 'Failed',
      members: [],
      dailyMeasureResults: [],
    };
  } catch (err) {
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
