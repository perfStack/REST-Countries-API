import { APIData } from '../dataTypes/interfaces';
import * as util from '../utility/util';
import * as globalConfig from '../utility/config';

export const modelState: {
  allCountriesMap: Map<string, APIData>;
  africaMap: Map<string, APIData>;
  americasMap: Map<string, APIData>;
  asiaMap: Map<string, APIData>;
  europeMap: Map<string, APIData>;
  oceaniaMap: Map<string, APIData>;
  miscRegionMap: Map<string, APIData>;
  countriesNameMap: Map<string, APIData>;
  rawCountriesData: undefined | APIData[];
} = {
  allCountriesMap: new Map(),
  africaMap: new Map(),
  americasMap: new Map(),
  asiaMap: new Map(),
  europeMap: new Map(),
  oceaniaMap: new Map(),
  miscRegionMap: new Map(),
  countriesNameMap: new Map(),
  rawCountriesData: undefined,
};

const localStorageKeys = {
  countriesLocalStorageKey: 'countriesLocalData',
  preSortedData: 'isDataPreSorted',
};

/**
 * function that sorts raw data obtained from API into different map
 * 1) allCountriesMap - contains country cca3 code as key
 * 2) countriesNameMap - contains country common name as key
 * 3) rest are maps seperated based on the region with country cca3 code a s key
 * @param countryData - array of raw coountry data
 */
export function populateCountriesByRegion(countryData: APIData[]) {
  for (const country of countryData) {
    modelState.allCountriesMap.set(country.cca3, country);
    modelState.countriesNameMap.set(country.name.common.toLowerCase(), country);

    switch (country.region) {
      case 'Africa':
        modelState.africaMap.set(country.cca3, country);
        break;
      case 'Americas':
        modelState.americasMap.set(country.cca3, country);
        break;
      case 'Asia':
        modelState.asiaMap.set(country.cca3, country);
        break;
      case 'Europe':
        modelState.europeMap.set(country.cca3, country);
        break;
      case 'Oceania':
        modelState.oceaniaMap.set(country.cca3, country);
        break;
      default:
        modelState.miscRegionMap.set(country.cca3, country);
    }
  }

  // console.log(modelConfig.africaMap);
  // console.log(modelConfig.americasMap);
  // console.log(modelConfig.asiaMap);
  // console.log(modelConfig.europeMap);
  // console.log(modelConfig.oceaniaMap);
  // console.log(modelConfig.noRegionMap);

  // console.log(modelConfig.americasMap.get('BOL'));
}

/**
 * function that sorts the raw data obtained from API alphabetically in ascending order,
 * uses country common name as sorting parameter.
 * Stores the sorted value in local storage as well as sets a isDataPresorted flag for
 * subsequent uses.
 */
export async function sortCountriesByName() {
  try {
    // If data is presorted there is nothing more to do, so return
    const isDataPresorted = util.getDataFromLocalStorage(
        localStorageKeys.preSortedData,
    );
    if (isDataPresorted === 'true') return;

    const rawCountriesData = modelState.rawCountriesData;
    if (!rawCountriesData) {
      console.error('No raw countries data found');
      return;
    }

    rawCountriesData.sort((country1: APIData, country2: APIData) => {
      if (country1.name.common > country2.name.common) return 1;
      else if (country1.name.common < country2.name.common) return -1;
      else return 0;
    });

    // put the sorted data into localstorage
    setRawDataIntoLocalStorage();
    util.setDataToLocalStorage(localStorageKeys.preSortedData, 'true');
  } catch (error) {
    throw error;
  }
}

/**
 * helper function to store raw data obtained from API, into localStorage
 */
function setRawDataIntoLocalStorage() {
  if (!modelState.rawCountriesData) {
    throw new Error('No country data available from API');
  }

  util.setDataToLocalStorage(
      localStorageKeys.countriesLocalStorageKey,
      modelState.rawCountriesData,
  );
}

/**
 * function to fetch data from API
 */
async function fetchApiData() {
  // todo settimeout
  try {
    const connectApi = await fetch(globalConfig.RESTAPI_URL);
    if (connectApi.status !== 200) {
      throw new Error(`'Coudn\'t connect to REST API '`);
    }

    const countryData = await connectApi.json();

    modelState.rawCountriesData = countryData;
  } catch (error) {
    throw error;
  }
}

/**
 * function that checks if the raw data from API is available in localStorage
 * if not calls fetchApiData().It then assigns the data to modelState.rawCountriesData
 */
export async function getCountryData() {
  try {
    const localCountryData = util.getDataFromLocalStorage(
        localStorageKeys.countriesLocalStorageKey,
        true,
    ) as APIData[];
    if (!localCountryData) {
      await fetchApiData();

      setRawDataIntoLocalStorage();
    } else modelState.rawCountriesData = localCountryData;
  } catch (error) {
    throw error;
  }
}
