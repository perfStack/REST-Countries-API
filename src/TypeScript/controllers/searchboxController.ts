import * as model from '../scripts/model';
import countryCardView from '../views/countryCardView';
import searchBoxView from '../views/searchBoxView';
import filterView from '../views/filterView';
import { filterboxState } from './filterboxController';
import { getRegionMap } from './utilController';
import { APIData } from '../dataTypes/interfaces';
import * as config from '../utility/config';

const searchboxState: {
  searchCausedViewChange: boolean;
  partialmatchedResultsArr: APIData[];
} = {
  searchCausedViewChange: false,
  partialmatchedResultsArr: [],
};

/**
 * function clears searchbox, closes :-
 * -> close btn or "X" icon
 * -> submit btn
 * -> hides searchbox suggestion list
 * then checks if a previous searc caused the view to change
 * if so hides back btn, clears the view and displays all the countries in that region.
 */
export function resetSearchResults() {
  searchBoxView.hideCloseIcon();
  searchBoxView.hideSubmitBtn();
  searchBoxView.hideSearchSuggestions();
  searchBoxView.searchboxValue = '';

  if (searchboxState.searchCausedViewChange) {
    searchBoxView.hideBackBtn();

    searchboxState.searchCausedViewChange = false;
    const currentRegionMap = getRegionMap(filterView.getCurrentRegionDataset());
    countryCardView.render(currentRegionMap);
  }
}

/**
 * checks if the searchbox is empty and wheter a previous search resulted in view changing
 * if so calls resetSearchResults().
 */
function resetSearchResultsOnEmpty() {
  if (
    searchBoxView.searchboxValue === '' &&
    searchboxState.searchCausedViewChange
  ) {
    resetSearchResults();
  }
}

/**
 * function that updates the puts the value clicked into the searchbox,
 * clears all the countries and renders only the country that was selected,
 * updates searchboxState.searchCausedViewChange to true, indicating the default view was changed.
 * @param event - click event
 */
function searchSuggestionOnClick(event: MouseEvent) {
  // todo Show region specific countires only
  const eventTarget = event.target as HTMLElement;
  const searchboxListItem = eventTarget.closest(
      '.searchbox__list-item',
  ) as HTMLElement;
  if (!searchboxListItem) return;

  const targetCountryCode = searchboxListItem.dataset?.cca3;
  if (!targetCountryCode) {
    throw new Error(
        'Can\'t find appropriate cca3 code from searchbox suggestion',
    );
  }
  const targetCountry = model.modelState.allCountriesMap.get(targetCountryCode);
  if (!targetCountry) throw new Error('No valid country found with the code');

  searchBoxView.searchboxValue = targetCountry.name.common;
  countryCardView.render(targetCountry);
  searchBoxView.showBackBtn();
  searchboxState.searchCausedViewChange = true;
}

/**
 * function that handles submit event on the searchbox.
 * searches if the query is a substring in any country present in the current region
 * if so renders all the countries that match or else displays appropriate error.
 * @param event
 */
function searchSubmit(event: SubmitEvent) {
  event.preventDefault();

  try {
    // Clear any previous matched countries
    searchboxState.partialmatchedResultsArr.length = 0;

    const targetCountryCommonName = searchBoxView.searchboxValue;
    if (!targetCountryCommonName || targetCountryCommonName === '') return;

    const currRegion = filterboxState.currRegion;
    const currentRegionMap = getRegionMap(currRegion);
    const targetCountry = model.modelState.countriesNameMap.get(
        targetCountryCommonName,
    );

    // Match all countries that contain the given input
    // So India and British Indian Ocean Territory both are selected when input is India
    for (const [, value] of currentRegionMap) {
      if (
        value.name.common.toLowerCase().indexOf(targetCountryCommonName) >= 0
      ) {
        searchboxState.partialmatchedResultsArr.push(value);
      }
    }

    // Check if no valid country or partially matched countries can be found
    if (!targetCountry && searchboxState.partialmatchedResultsArr.length < 1) {
      // render error modal;
      // suggest to maybe change regions if the current region is not "all region"
      let errorMsg = `No valid country found
       with the name <strong>${targetCountryCommonName}</strong>. `;

      if (currRegion !== config.REGION_KEYS.allRegion) {
        errorMsg += 'Maybe try changing region';
      }
      searchBoxView.renderError(errorMsg);

      // Hide Error modal when clicked once
      searchBoxView.hideErrorWhenClickedOutsideOnce();

      return;
    }

    // Check if the a single valid country can be found but does not belong in this region
    // conditions to check for:-
    // 1) targetCountry's region is different from the current region
    // 2) the current region is not "all regions"
    // 3) No partially matched country can be found in the current region
    if (
      targetCountry?.region.toLowerCase() !== currRegion &&
      currRegion !== config.REGION_KEYS.allRegion &&
      searchboxState.partialmatchedResultsArr.length < 1
    ) {
      // Add body blur and render error modal;
      searchBoxView.renderError(
          `No valid country found, named <em><strong>${targetCountryCommonName}</strong></em> 
         in the region <strong>${currRegion}</strong>.
         Maybe try selecting 
         <strong>${
  targetCountry?.region.toLowerCase() ?? 'All regions'
}</strong> as the region.`,
      );

      // Hide Error modal when clicked once
      searchBoxView.hideErrorWhenClickedOutsideOnce();

      return;
    }

    //  send array of partially matched countries
    countryCardView.render(searchboxState.partialmatchedResultsArr);
    searchBoxView.showBackBtn();
    searchboxState.searchCausedViewChange = true;
  } catch (error) {
    console.error(error);
  }
}

/**
 * calls searchBoxView.generateSearchSuggestions() which can be used by other controllers
 * without accessing searchBoxView.
 */
export function generateSearchSuggestions(
    currentRegionMap: Map<string, APIData>,
) {
  searchBoxView.generateSearchSuggestions(currentRegionMap);
}

/**
 * function thta gives functionality to the searchbox as well as the suggestions
 * for the searchbox.
 */
export function run() {
  // Generate suggestions for initial render (ie, for all the  regions)
  // -> generate intit searchSuggestion list consisting of all countries,
  //  as "all regions" is the default.
  // -> passes the handler function for handling click events on the suggestion list
  searchBoxView.generateSearchSuggestions(model.modelState.allCountriesMap);
  searchBoxView.searchboxSuggestionHandler(searchSuggestionOnClick);

  // Causes the intital functionality
  // passes handler function to  :-
  // -> if searchbox value becomes empty on keydown call resetSearchResultsOnEmpty()
  // -> close btn or "X" icon
  // -> back btn
  searchBoxView.render();
  searchBoxView.submitHandler(searchSubmit);
  searchBoxView.resetSearchHandler(resetSearchResultsOnEmpty);
  searchBoxView.hideCloseIconHandler(resetSearchResults);
  searchBoxView.backBtnClickHandler(resetSearchResults);
}

// /**
//  * function behaves silghtly different from current searchSuggestion func
//  * @param event
//  */
// function searchSuggestion(event: MouseEvent) {
//   // todo Show region specific countires only
//   const eventTarget = event.target as HTMLElement;
//   const searchboxListItem = eventTarget.closest(
//       '.searchbox__list-item',
//   ) as HTMLElement;
//   if (!searchboxListItem) return;

//   const targetCountryCode = searchboxListItem.dataset?.cca3;
//   if (!targetCountryCode) {
//     throw new Error(
//         'Can\'t find appropriate cca3 code from searchbox suggestion',
//     );
//   }
//   const targetCountry = model.modelState.allCountriesMap.get(targetCountryCode);
//   if (!targetCountry) throw new Error('No valid country found with the code');

//   searchBoxView.searchboxValue = targetCountry.name.common;
//   countryCardView.render(targetCountry);
//   searchBoxView.showBackBtn();
//   searchboxState.searchCausedViewChange = true;
// }

// /**
//  *
//  * @param event
//  */
// function searchSubmit(event: SubmitEvent) {
//   event.preventDefault();

//   try {
//     // Clear any previous matched countries
//     searchboxState.partialmatchedResultsArr.length = 0;

//     const targetCountryCommonName = searchBoxView.searchboxValue;
//     if (!targetCountryCommonName || targetCountryCommonName === '') return;

//     const currRegion = filterboxState.currRegion;
//     const currentRegionMap = getRegionMap(currRegion);
//     const targetCountry = model.modelState.countriesNameMap.get(
//         targetCountryCommonName,
//     );

//     // Correct country prevents from showing coutries whose name contain similar substrings
//     // eg India and British (India)n Ocean Territory in allRegions
//     // if (!targetCountry) {
//     //   // for (const [key, value] of model.modelState.countriesNameMap) {
//     //   //   if (key.indexOf(targetCountryCommonName) >= 0) {
//     //   //     searchboxState.partialmatchedResultsArr.push(value);
//     //   //   }
//     //   // }
//     //   for (const [, value] of currentRegionMap) {
//     //     if (
//     //       value.name.common.toLowerCase().indexOf(targetCountryCommonName) >= 0
//     //     ) {
//     //       searchboxState.partialmatchedResultsArr.push(value);
//     //     }
//     //   }
//     // }

//     for (const [, value] of currentRegionMap) {
//       if (
//         value.name.common.toLowerCase().indexOf(targetCountryCommonName) >= 0
//       ) {
//         searchboxState.partialmatchedResultsArr.push(value);
//       }
//     }

//     if (!targetCountry && searchboxState.partialmatchedResultsArr.length < 1) {
//       // Add body blur and render error modal;
//       searchBoxView.renderError(
//           `No valid country found with the name "${targetCountryCommonName}"`,
//       );

//       // Check for bodyELem and add a one time evenet listener to clear the error model
//       // once clicked outside the modal
//       const bodyElem = htmlElement.body;
//       if (!bodyElem) throw new Error('No body elem found');

//       bodyElem.addEventListener('click', searchBoxView.hideErrorModal, {
//         once: true,
//       });

//       return;
//     }

//     if (
//       targetCountry?.region.toLowerCase() !== currRegion &&
//       currRegion !== config.REGION_KEYS.allRegion &&
//       searchboxState.partialmatchedResultsArr.length < 1
//     ) {
//       // Add body blur and render error modal;
//       searchBoxView.renderError(
//           `No valid country found with the name "${targetCountryCommonName}"
//          in the region "${currRegion}". Try selecting All regions`,
//       );

//       // Check for bodyELem and add a one time evenet listener to clear the error model
//       // once clicked outside the modal
//       const bodyElem = htmlElement.body;
//       if (!bodyElem) throw new Error('No body elem found');

//       bodyElem.addEventListener('click', searchBoxView.hideErrorModal, {
//         once: true,
//       });

//       return;
//     }

//     // If the search query matches a individual country use targetCountry
//     // else send array of partially matched countries
//     // earlier guard clause ensures no matched values produces an error

//     // This c
//     // countryCardView.render(
//     //     targetCountry ?? searchboxState.partialmatchedResultsArr,
//     // );
//     countryCardView.render(
//         searchboxState.partialmatchedResultsArr,
//     );
//     searchBoxView.showBackBtn();
//     searchboxState.searchCausedViewChange = true;
//   } catch (error) {
//     console.error(error);
//   }
// }
