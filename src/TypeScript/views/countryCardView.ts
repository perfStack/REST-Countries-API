import { APIData } from '../dataTypes/interfaces';
import { htmlElement } from '../utility/querySelector';
import { CountryView } from './countryView';

/**
 *
 */
class CountryCardView extends CountryView {
  protected parentElement = htmlElement.mainCont;

  /**
   * function that formats larger number into million and billion
   * also puts comma at appropriate places.
   * @param population
   * @returns
   */
  protected getPopulation(population: number) {
    const million = 1000000;
    const billion = 1000 * million;

    let finalMarkup = '';

    if (population < 100000) {
      finalMarkup = this.prettifyNumbers(population);
      finalMarkup += '</span>';
    } else if (population > billion) {
      finalMarkup = `${(population / billion).toFixed(2)}`;
      finalMarkup +=
        '</span><span class="country__content__postfix"> B </span>';
    } else {
      finalMarkup = `${(population / million).toFixed(2)}`;
      finalMarkup +=
        '</span><span class="country__content__postfix"> M </span>';
    }

    return finalMarkup;
  }

  /**
   * function that formats the result for capital.
   * 'No capital' if no data present or is 0
   * capitals[0] if len > 0
   * "capitals[0], ..." if len > 1
   * @param capitalArr
   * @returns
   */
  private capitalFormatter(capitalArr: APIData['capital']) {
    if (!capitalArr) return 'No capital';

    const noOfCapitals = capitalArr.length;
    let finalMarkup = '';

    if (noOfCapitals === 0) finalMarkup = 'No capital';
    else if (noOfCapitals === 1) finalMarkup = capitalArr[0];
    else finalMarkup = `${capitalArr[0]}, ...`;

    return finalMarkup;
  }

  /**
   * generates the html markup for country card
   * @param data
   */
  private generateHtmlMarkup(data: APIData) {
    const htmlTemplate = ` <article class="country" data-cca3=${data.cca3}>
  <div class="country__cont">
    <div class="country__img-cont">
      <img
        src="${data.flags.svg}"
        alt="${data.name.common} flag"
        class="country__img"
      />
    </div>
    <div class="country__content-cont">
      <h1 class="country__title">${data.name.common}</h1>

      <p class="country__content">
        <span class="material-icons country__icon">people</span>
        <span class="country__content__title">Population: </span>
        <span class="country__content__result">
        ${this.getPopulation(data.population)}
      </p>
      <p class="country__content">
        <span class="material-icons country__icon">travel_explore</span>
        <span class="country__content__title">Region: </span>
        <span class="country__content__result country__content__result--region">${
  data.region
}</span>
      </p>
      <p class="country__content">
        <span class="material-icons country__icon">festival</span>
        <span class="country__content__title">Capital: </span>
        <span class="country__content__result">${this.capitalFormatter(
      data.capital,
  )}</span>
      </p>
    </div>
  </div>
</article>`;

    return htmlTemplate;
  }

  /**
   * renders country card based on weather a map, array or a value of a single country is passed
   * @param dataMap
   */
  render(dataMap: Map<string, APIData> | APIData[] | APIData) {
    try {
      if (!this.parentElement) {
        throw new Error('No valid parent element in countryCard');
      }
      this.clearParentElement();

      let htmlTemplate;
      if (dataMap instanceof Map) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, value] of dataMap) {
          htmlTemplate = this.generateHtmlMarkup(value);
          this.parentElement.insertAdjacentHTML('beforeend', htmlTemplate);
        }
      } else if (dataMap instanceof Array) {
        for (const countryData of dataMap) {
          htmlTemplate = this.generateHtmlMarkup(countryData);
          this.parentElement.insertAdjacentHTML('beforeend', htmlTemplate);
        }
      } else {
        htmlTemplate = this.generateHtmlMarkup(dataMap);
        this.parentElement.insertAdjacentHTML('beforeend', htmlTemplate);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new CountryCardView();
