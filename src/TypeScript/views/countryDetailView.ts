import { APIData } from '../dataTypes/interfaces';
import { htmlElement, countryDetailSelector } from '../utility/querySelector';
import { CountryView } from './countryView';
import * as util from '../utility/util';

/**
 *
 */
class CountryDetailView extends CountryView {
  protected parentElement = htmlElement.countryDetailModal;
  private countriesMap: undefined | Map<string, APIData>;
  private viewState = {
    showDetailedViewInstance: this.showDetailedView.bind(this),
    switchDetailedViewInstance: this.switchDetailedView.bind(this),
    hideDetailedViewInstance: this.hideDetailedView.bind(this),
  };

  /**
   * Hides error modal
   */
  private hideErrorBox() {
    util.removeBodyBlur();
    this.hideErrorModal();
  }

  /**
   * handles closing of deatailed country modal on click that originates within country detail modal
   * @param event
   * @returns
   */
  private hideDetailedView(event: MouseEvent) {
    event.stopPropagation();
    const targetEvent = event.target as HTMLElement;
    const country = targetEvent?.closest('.country-detail');
    const countryClose = targetEvent?.closest('.country-detail__cross');

    if (country && !countryClose) return;
    else {
      this.hideErrorBox();
      htmlElement.countryDetailModal?.classList.add('hidden');

      htmlElement.body?.removeEventListener(
          'click',
          this.viewState.hideDetailedViewInstance,
      );
    }
  }

  /**
   * toggles visibility of blur as well as country deatil modal
   */
  private toggleDetailedView() {
    util.toggleBodyBlur();
    htmlElement.countryDetailModal?.classList.toggle('hidden');
  }

  /**
   * helper function to check if a valid country data is available to generate
   * data for country detail modal
   * @param targetCountry
   * @returns
   */
  private renderDetailView(targetCountry: HTMLElement) {
    if (!targetCountry.dataset.cca3) {
      throw new Error('No valid country code to view detailed information');
    }
    if (!this.countriesMap) throw new Error('No allCountriesMap found');

    const countryDetail = this.countriesMap.get(targetCountry.dataset.cca3);
    if (!countryDetail) {
      throw new Error(
          `Cannot find any country with country code ${targetCountry.dataset.cca3}`,
      );
    }

    this.generateMarkup(countryDetail);
  }

  /**
   * handles click event on country card, renders country detail view as well as
   * a event listener on body for handling hiding contry deatil modal if a click is
   * registered on a node other than country detail modal.
   * @param event
   * @returns
   */
  private showDetailedView(event: MouseEvent) {
    try {
      // CLear all effects before showing modal
      const targetEvent = event.target as HTMLElement;
      const countryCont = targetEvent?.closest('.country') as HTMLElement;

      if (!countryCont) return;
      // Stop event propagation here because the the click was most likely intended for country card
      // if stopped earlier searchbox and dropdown box won't close properly as event won't bubble in
      // that case
      else event.stopPropagation();

      this.renderDetailView(countryCont);

      this.toggleDetailedView();
      htmlElement.body?.addEventListener(
          'click',
          this.viewState.hideDetailedViewInstance,
      );

      // console.log(modelConfig.allCountriesMap.get(country.dataset.cca3));
    } catch (error) {
      util.toggleBodyBlur();
      this.renderError((error as Error).message);
      htmlElement.body?.addEventListener(
          'click',
          this.viewState.hideDetailedViewInstance,
      );
    }
  }

  /**
   * handles click event on bordering countirs tags in country detail modal
   * @param event
   * @returns
   */
  private switchDetailedView(event: MouseEvent) {
    event.stopPropagation();

    const targetEvent = event.target as HTMLElement;
    const country = targetEvent?.closest(
        '.country-detail__border-country',
    ) as HTMLElement;

    if (!country) return;

    this.renderDetailView(country);
  }

  /**
   * genertates html markup of available borders if available and passes [false, ''] if empty.
   * @param bordersArr
   * @param allCountriesMap
   * @returns
   */
  private genAvailableBorders(
      bordersArr: APIData['borders'],
      allCountriesMap: Map<string, APIData>,
  ): [boolean, string] {
    if (!bordersArr) return [false, ''];

    let finalMarkup = ``;
    for (const border of bordersArr) {
      const countryFullName = allCountriesMap.get(border)?.name.common;

      finalMarkup += `<li class="country-detail__border-country" data-cca3=${border}>${
        countryFullName ?? border
      }</li>`;
    }

    return [true, finalMarkup];
  }

  /**
   * function that generates the appropriate values for the relevant fileds in country card modal
   * @param countryData
   * @returns
   */
  private generateMarkup(countryData: APIData) {
    try {
      if (!this.countriesMap) {
        throw new Error('No valid countryMap data');
      }

      const headingCountry = countryDetailSelector.heading;
      const flagImg = countryDetailSelector.flagImg;
      const nativeName = countryDetailSelector.nativeName;
      const population = countryDetailSelector.population;
      const region = countryDetailSelector.region;
      const subRegion = countryDetailSelector.subRegion;
      const capital = countryDetailSelector.capital;
      const topLevelDomain = countryDetailSelector.topLevelDomain;
      const currencies = countryDetailSelector.currencies;
      const languages = countryDetailSelector.languages;
      const borderCountriesList = countryDetailSelector.borderCountriesList;
      const noBorderCountriesText = countryDetailSelector.noBorderCountriesText;

      // guard clause. better error handling maybe in future
      if (
        !(
          headingCountry &&
          flagImg &&
          nativeName &&
          population &&
          region &&
          subRegion &&
          capital &&
          topLevelDomain &&
          currencies &&
          languages &&
          borderCountriesList &&
          noBorderCountriesText
        )
      ) {
        throw new Error(
            'Error generating correct markup for detailed country view modal',
        );
      }

      headingCountry.innerText = countryData.name.common;

      // flags
      flagImg.setAttribute('src', countryData.flags.svg);
      flagImg.setAttribute('alt', `${countryData.name.common} flag`);

      nativeName.innerText = this.getNativeName(countryData.name.nativeName);
      population.innerText = this.prettifyNumbers(countryData.population);
      region.innerText = countryData.region;
      subRegion.innerText = countryData.subregion ?? 'No subregion';
      capital.innerText = this.genListSeperatedVals(
          countryData.capital,
          'No capital',
      );
      topLevelDomain.innerText = this.genListSeperatedVals(
          countryData.tld,
          'No TLD',
      );
      currencies.innerText = this.getCurrencies(countryData.currencies);
      languages.innerText = this.getLanguages(countryData.languages);

      // bordering countires
      const borderingCountries = this.genAvailableBorders(
          countryData.borders,
          this.countriesMap,
      );
      // Check if any bordering countries are present
      // if so unhide countiesList<ul> and hide noCountry<p>
      // add the neighbours as <li> to the <ul> innerHtml
      if (borderingCountries[0]) {
        borderCountriesList.classList.remove('hidden');
        noBorderCountriesText.classList.add('hidden');

        borderCountriesList.innerHTML = borderingCountries[1];
      } else {
        // if no bordering country hide countiesList<ul> and unhide noCountry<p>
        borderCountriesList.classList.add('hidden');
        noBorderCountriesText.classList.remove('hidden');
      }
    } catch (error) {
      this.renderError((error as Error).message);
    }
  }

  /**
   * init function that sets the intital region as "all regions" as well as add event listeners for:
   * click event on main container to show detailed modal
   * click event on border countries in detailed countries modal
   * @param allCountriesMap
   */
  render(allCountriesMap: Map<string, APIData>) {
    try {
      this.countriesMap = allCountriesMap;

      // Add event listeners
      htmlElement.mainCont?.addEventListener(
          'click',
          this.viewState.showDetailedViewInstance,
      );
      countryDetailSelector.borderCountriesList?.addEventListener(
          'click',
          this.viewState.switchDetailedViewInstance,
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new CountryDetailView();
