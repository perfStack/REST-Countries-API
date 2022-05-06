import { APIData } from '../dataTypes/interfaces';
import { View } from './view';

/**
 *
 */
export class CountryView extends View {
  // todo getCapital()
  // todo Bouvet Island
  // todo DR congo
  //   countryData: APIData;
  /**
   *
   * @param countryData
   */
  //   constructor(countryData: APIData) {
  //     this.countryData = countryData;
  //   }

  /**
   *
   * @param countryData
   */
  //   renderHtml(countryData: APIData) {
  //     this.countryData = countryData;
  //   }

  /**
   * generates string seperated by comma using values from string[]
   * @param dataArr
   * @param noDataMsg
   * @returns
   */
  protected genListSeperatedVals(
      dataArr: string[] | undefined | null,
      noDataMsg: string,
  ) {
    if (!dataArr) return noDataMsg;

    let finalMarkup = '';
    for (const data of dataArr) {
      finalMarkup += `${data}, `;
    }

    return finalMarkup.slice(0, finalMarkup.length - 2);
  }

  /**
   * generates string seperated by comma using values from string[]
   * for currencies
   * @param currenciesObj
   * @param noDataMsg
   * @returns
   */
  protected getCurrencies(
      currenciesObj: APIData['currencies'],
      noDataMsg = 'No currency',
  ) {
    if (!currenciesObj || Object.entries(currenciesObj).length < 1) {
      return noDataMsg;
    }

    let finalMarkup = '';
    for (const curr in currenciesObj) {
      if (Object.prototype.hasOwnProperty.call(currenciesObj, curr)) {
        finalMarkup += `${currenciesObj[curr].name}, `;
      }
    }

    return finalMarkup.slice(0, finalMarkup.length - 2);
  }

  /**
   * generates string seperated by comma using values from string[]
   * for languages
   * @param languageObj
   * @param noDataMsg
   * @returns
   */
  protected getLanguages(
      languageObj: APIData['languages'],
      noDataMsg = 'No language',
  ) {
    if (!languageObj || Object.entries(languageObj).length < 1) {
      return noDataMsg;
    }

    let finalMarkup = '';
    for (const lang in languageObj) {
      if (Object.prototype.hasOwnProperty.call(languageObj, lang)) {
        finalMarkup += `${languageObj[lang]}, `;
      }
    }

    return finalMarkup.slice(0, finalMarkup.length - 2);
  }

  /**
   * returns native name of the country
   * @param nativeNameObj
   */
  protected getNativeName(
      nativeNameObj: APIData['name']['nativeName'],
      noDataMsg = 'No native name',
  ) {
    if (!nativeNameObj || Object.entries(nativeNameObj).length < 1) {
      return noDataMsg;
    }

    let finalMarkup = '';
    for (const language in nativeNameObj) {
      if (Object.prototype.hasOwnProperty.call(nativeNameObj, language)) {
        finalMarkup += nativeNameObj[language].official;
        break;
      }
    }

    return finalMarkup;
  }

  /**
   * returns formatted population as string
   * @param population
   */
  protected getPopulation(population: number) {
    let finalMarkup = '';

    if (population < 100000) {
      finalMarkup = population.toString();
    } else {
      finalMarkup = `${(population / 1000000).toFixed(2)}`;
    }

    return finalMarkup;
  }

  /**
   * function that inserts commas at appropriate position for numbers upto billion
   * and returns string of fromatted number
   * @param numToBeautify
   */
  protected prettifyNumbers(numToBeautify: number) {
    const thousand = 1000;
    const million = 1000 * thousand;
    const billion = 1000 * million;

    let finalString = numToBeautify.toString();
    let commaPos = 3;
    if (numToBeautify >= thousand) {
      finalString =
        finalString.slice(0, -commaPos) + ',' + finalString.slice(-commaPos);
    }
    if (numToBeautify >= million) {
      commaPos += 4;
      finalString =
        finalString.slice(0, -commaPos) + ',' + finalString.slice(-commaPos);
    }
    if (numToBeautify >= billion) {
      commaPos += 4;
      finalString =
        finalString.slice(0, -commaPos) + ',' + finalString.slice(-commaPos);
    }

    return finalString;
  }
}
