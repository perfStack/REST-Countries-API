import * as config from '../utility/config';
import filterView from '../views/filterView';
import countryCardView from '../views/countryCardView';
import { getRegionMap } from './utilController';
import {
  generateSearchSuggestions,
  resetSearchResults,
} from './searchboxController';

export const filterboxState = {
  currRegion: config.REGION_KEYS.allRegion,
};

/**
 * function that updates the value in dropbox/filterbox.
 * 1) when a new option is selected it checks if the the value is different
 * if it is indeed then the new value is updated as visually  as gets the
 * corresponding region map and calls countryCardView.render() to display
 * all the countires specific to that region.
 * 2) Additionally it clears the searchbox and updates searchbox suggestion list
 * to the countries in this new region when a new value is selected.
 * @param event - click event
 */
function updateSelectedValue(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const optionSelected = target?.closest(
      '.dropdown-box__list-item',
  ) as HTMLElement;

  if (!optionSelected) return;

  const currentDatasetVal = filterView.getCurrentRegionDataset();
  const newSelectedRegion = optionSelected.innerText;
  const newDatasetVal = optionSelected.dataset.region;
  if (!newDatasetVal) {
    throw new Error('Can\'t find any dataset value on the selected option');
  }

  if (currentDatasetVal !== newDatasetVal) {
    filterView.updateSelectedValue(newSelectedRegion, newDatasetVal);
    // Update current selected region
    filterboxState.currRegion = newDatasetVal;

    const currentRegionMap = getRegionMap(newDatasetVal);
    countryCardView.render(currentRegionMap);

    resetSearchResults();
    generateSearchSuggestions(currentRegionMap);
  }
}

/**
 * calls filterView.render() as well as passes to updateSelectedValue to
 * filterView.dropdownListClickHandler().
 */
export function run() {
  filterView.render();
  filterView.dropdownListClickHandler(updateSelectedValue);
}
