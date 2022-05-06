import * as model from '../scripts/model';
import { htmlElement } from '../utility/querySelector';
import * as countryCardController from './countryCardController';
import * as countryDetailController from './countryDetailController';
import * as searchboxController from './searchboxController';
import * as filterboxController from './filterboxController';

/**
 * main controller function that calls all the other controllers.
 * disables eveent propagation in theme switcher button .
 */
export async function run() {
  try {
    // render spinner while the data is being fetched
    countryCardController.renderSpinner();

    // fetch data from model
    await model.getCountryData();
    if (!model.modelState.rawCountriesData) {
      throw new Error('No country data available');
    }
    // Sort the countries by  common name before filling the maps
    // maps resepect the order in which entry is inserted
    model.sortCountriesByName();
    // filter data into appropriate Maps
    model.populateCountriesByRegion(model.modelState.rawCountriesData);

    // init countryCard and countryDetail controller
    countryCardController.run(model.modelState.allCountriesMap);
    countryDetailController.run(model.modelState.allCountriesMap);

    // Filterbox controller
    filterboxController.run();

    // Searchbox Controller
    searchboxController.run();

    // Stop event propagation on clicking theme switcher button
    htmlElement.themeContainer?.addEventListener('click', (event) =>
      event.stopPropagation(),
    );
  } catch (error) {
    countryCardController.renderError((error as Error).message, false);
    console.error(error);
  }
}
