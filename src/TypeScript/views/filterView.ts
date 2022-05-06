import { REGION_KEYS } from '../utility/config';
import { htmlElement } from '../utility/querySelector';

/**
 *
 *
 */
class FilterView {
  private viewState = {
    toggleDropdownList: this.toggleDropdownList.bind(this),
  };

  /**
   * hides dropdown list as removes active class from dropdown box
   */
  private hideDropdownList() {
    htmlElement.dropdownboxListCont?.classList.add('visually-hidden');
    htmlElement.dropdownboxIcon?.classList.remove('dropdown-box__icon--active');
  }

  /**
   * function to toggle the of visibility dropdown list as well as toggles active class on
   * dropdown arrow
   */
  private toggleDropdownList(event: MouseEvent) {
    htmlElement.dropdownboxIcon?.classList.toggle('dropdown-box__icon--active');
    htmlElement.dropdownboxListCont?.classList.toggle('visually-hidden');
    event.stopPropagation();
    htmlElement.body?.addEventListener('click', this.hideDropdownList);
  }

  /**
   * updates the value of the current selected region dropbox as well as data-region value
   */
  updateSelectedValue(displayVal: string, datasetVal: string) {
    const currentSelected = htmlElement.dropdownboxSelected;
    if (!currentSelected) {
      throw new Error('Can\'t get the current selected value in filter box');
    }

    currentSelected.innerText = displayVal;
    currentSelected.dataset.region = datasetVal;
  }

  /**
   * helper function for dropdown list click handler
   * @param handlerFunction
   */
  dropdownListClickHandler(handlerFunction: (event: MouseEvent) => void) {
    htmlElement.dropdownboxListCont?.addEventListener('click', handlerFunction);
  }

  /**
   * get current region value from data-region values set on currently sected item in dropdownbox
   */
  getCurrentRegionDataset() {
    const currentSelected = htmlElement.dropdownboxSelected;
    if (!currentSelected) throw new Error('No selected region found');

    const currentRegion = currentSelected.dataset.region;
    if (currentRegion === '') return REGION_KEYS.allRegion;

    return currentRegion;
  }

  /**
   * main function to toggle visibility of dropdown list
   */
  render() {
    htmlElement.dropdownbox?.addEventListener(
        'click',
        this.viewState.toggleDropdownList,
    );
  }
}

export default new FilterView();
