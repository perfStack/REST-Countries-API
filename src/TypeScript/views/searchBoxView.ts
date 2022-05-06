import { APIData } from '../dataTypes/interfaces';
import { htmlElement } from '../utility/querySelector';
import { View } from './view';

/**
 *
 */
class SearchBox extends View {
  /**
   * hides close btn
   */
  private showCloseIcon() {
    const closeBtn = htmlElement.searchboxCloseIcon as HTMLElement;
    if (!closeBtn) throw new Error('No close btn found in searchbox');

    closeBtn.classList.remove('hidden');
  }

  /**
   * generates a list of values that contain the given string.
   * so if querys is in every country common name that contains "in"
   * will be created. if atleast one value can be found then suggestion list is displayed
   * or else is hidden.
   */
  private autoSuggest() {
    const searchBox = htmlElement.searchBoxId as HTMLInputElement;
    if (!searchBox) throw new Error('No searchbox found');
    if (!searchBox.value) return;

    const searchboxList = htmlElement.searchboxList as HTMLElement;
    if (!searchboxList) throw new Error('No list to update');

    const searchValue = searchBox.value.toLowerCase();
    let suggestionsVisible = 0;
    for (const countryNode of searchboxList.childNodes) {
      const countryName = (countryNode as HTMLElement).innerText;

      // if the substing/searchQuery can be found within entries of list
      // then unhide the entries or else hide them
      if (countryName.toLowerCase().indexOf(searchValue) >= 0) {
        (countryNode as HTMLElement).classList.remove('hidden');
        suggestionsVisible++;
      } else {
        (countryNode as HTMLElement).classList.add('hidden');
      }
    }

    // If no suggestion is visible, hide the entire list container
    // and if atleast 1 suggestion is available, unhide list container
    if (suggestionsVisible < 1) {
      htmlElement.searchboxListCont?.classList.add('hidden');
    } else htmlElement.searchboxListCont?.classList.remove('hidden');
  }

  /**
   * hides suggestion list
   */
  hideSearchSuggestions() {
    const suggestionsListCont = htmlElement.searchboxListCont;
    if (!suggestionsListCont) {
      throw new Error('Cannot find serachbox suggestions list cont');
    }

    suggestionsListCont.classList.add('visually-hidden');
  }

  /**
   * keyup handler that toggles visibility of suggestion list,
   *  as well as close btn and submit btn based on if any value can be
   * found in searchbox.
   */
  private toggleSearchSuggestions(event: KeyboardEvent) {
    const suggestionsListCont = htmlElement.searchboxListCont;
    if (!suggestionsListCont) {
      throw new Error('Cannot find searchbox suggestions list cont');
    }

    event.stopPropagation();
    const searchBox = htmlElement.searchBoxId as HTMLInputElement;
    if (!searchBox) throw new Error('No searchbox found');
    // Display search suggestion list only if atleast one letter is typed inside
    // if the searchbox value is empty then hide the list
    // a trim is added so pressing space without a valid letter won't trigger the following
    if (searchBox.value.trim()) {
      this.showCloseIcon();
      this.showSubmitBtn();
      suggestionsListCont.classList.remove('visually-hidden');
    } else {
      this.hideCloseIcon();
      this.hideSubmitBtn();
      suggestionsListCont.classList.add('visually-hidden');
    }
    console.log(searchBox.value);
  }

  /**
   * keyup hander for searchbox which checks if key is "enter"
   * if so hides suggestion list and then returs
   * else toggles suggestion list
   */
  private searchboxKeyUpHandler(event: KeyboardEvent) {
    // No showing search suggestion when a user presses enter hide any existing suggestions,
    // as it most likely signals intent to submit data
    const keyPressed = event.key.toLowerCase();
    if (keyPressed === 'enter') {
      this.hideSearchSuggestions();
      return;
    }

    this.toggleSearchSuggestions(event);
    this.autoSuggest();
  }

  /**
   * submit btn handler function that fires a new submit event on the serachbox if
   * conditions are met.
   * @param event
   */
  private submitBtnHandler(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const newSubmitEvent = new Event('submit', {
      bubbles: false,
      cancelable: true,
    });

    htmlElement.navbarForm?.dispatchEvent(newSubmitEvent);
  }

  /**
   * show submit btn
   */
  private showSubmitBtn() {
    const showBtn = htmlElement.searchboxSubmit;
    if (!showBtn) throw new Error('No searchbox submit btn');

    showBtn.classList.remove('hidden');
  }

  /**
   * hide submit btn
   */
  hideSubmitBtn() {
    const showBtn = htmlElement.searchboxSubmit;
    if (!showBtn) throw new Error('No searchbox submit btn');

    showBtn.classList.add('hidden');
  }

  /**
   * hide close btn or "X" icon
   */
  hideCloseIcon() {
    const closeBtn = htmlElement.searchboxCloseIcon as HTMLElement;
    if (!closeBtn) throw new Error('No close btn found in searchbox');

    closeBtn.classList.add('hidden');
    this.searchboxValue = '';
  }

  /**
   * helper function that passes on handler function from controller on click
   * on close btn
   * @param handlerFunction
   */
  hideCloseIconHandler(handlerFunction: (event: MouseEvent) => void) {
    const closeBtn = htmlElement.searchboxCloseIcon as HTMLElement;
    if (!closeBtn) throw new Error('No close btn found in searchbox');

    closeBtn.addEventListener('click', handlerFunction);
  }

  /**
   * show back btn that appears after a succesful search
   */
  showBackBtn() {
    const backBtn = htmlElement.backBtn;
    if (!backBtn) throw new Error('No valid backBtn found');

    backBtn.classList.remove('hidden');
  }

  /**
   * hide back btn that appears after a succesful search
   */
  hideBackBtn() {
    const backBtn = htmlElement.backBtn;
    if (!backBtn) throw new Error('No valid backBtn found');

    backBtn.classList.add('hidden');
  }

  /**
   * helper function that passes on handler function from controller on click
   * on back btn that appears after a succesful search
   * @param handlerFunction
   */
  backBtnClickHandler(handlerFunction: (event: MouseEvent) => void) {
    const backBtn = htmlElement.backBtn;
    if (!backBtn) throw new Error('No valid backBtn found');

    backBtn.addEventListener('click', handlerFunction);
  }

  /**
   * returns the current value int the searchbox
   */
  get searchboxValue() {
    const searchbox = htmlElement.searchBoxId as HTMLInputElement;
    if (!searchbox) throw new Error('No searchbox found');

    return searchbox.value.toLowerCase();
  }

  /**
   * sets the current value in the searchbox with the one passed as argument
   * @param valueToSet
   */
  set searchboxValue(valueToSet: string) {
    const searchBox = htmlElement.searchBoxId as HTMLInputElement;
    if (!searchBox) throw new Error('No searchbox found');

    searchBox.value = valueToSet;
  }

  /**
   * helper function that passes on handler function from controller on click
   * on submit btn that appears after entering a valid letter in searchbox
   */
  submitHandler(handlerFunction: (event: SubmitEvent) => void) {
    const navbarForm = htmlElement.navbarForm;
    if (!navbarForm) throw new Error('No valid Navbar form element');

    navbarForm.addEventListener('submit', handlerFunction);
  }

  /**
   * helper function that passes on handler function from controller on click
   * on search suggestion list that appears after entering a valid letter in searchbox
   * @param handlerFunction
   */
  searchboxSuggestionHandler(handlerFunction: (event: MouseEvent) => void) {
    const suggestionsList = htmlElement.searchboxList;
    if (!suggestionsList) {
      throw new Error('Cannot find serachbox suggestions list');
    }

    suggestionsList.addEventListener('click', handlerFunction);
  }

  /**
   * helper function that passes on handler function from controller on input
   * on searchbox
   * @param handlerFunction
   */
  resetSearchHandler(handlerFunction: () => void) {
    const searchBox = htmlElement.searchBoxId as HTMLInputElement;
    if (!searchBox) throw new Error('No searchbox found');

    searchBox.addEventListener('input', handlerFunction);
  }

  /**
   * generates a list of search suggestion based on the values passed as argument
   * @param countriesMap
   */
  generateSearchSuggestions(countriesMap: Map<string, APIData>) {
    const searchboxList = htmlElement.searchboxList;
    if (!searchboxList) {
      throw new Error(
          'No htmlELement list found for inserting search suggestions',
      );
    }
    searchboxList.innerHTML = '';

    let htmlMarkup = '';
    for (const [key, value] of countriesMap) {
      htmlMarkup += `<li class="searchbox__list-item" data-cca3="${key}">${value.name.common}</li>`;
    }

    searchboxList.innerHTML = htmlMarkup;
  }

  /**
   * adds event listetner
   * on keyup on searchbox
   * click event on body to hide search suggestion
   * click event on submit btn
   */
  render() {
    try {
      const searchboxCont = htmlElement.searchboxCont;
      if (!searchboxCont) throw new Error('Cannot find searchbox cont');

      const htmlBody = htmlElement.body;
      if (!htmlBody) throw new Error('Cannot find body');

      const searchboxSubmit = htmlElement.searchboxSubmit;
      if (!searchboxSubmit) throw new Error('Cannot find submit btn');

      // searchboxCont.addEventListener('keyup', this.toggleSearchSuggestions);
      // searchboxCont.addEventListener('keyup', this.autoSuggest);
      searchboxCont.addEventListener(
          'keyup',
          this.searchboxKeyUpHandler.bind(this),
      );
      htmlBody.addEventListener('click', this.hideSearchSuggestions);
      searchboxSubmit.addEventListener('click', this.submitBtnHandler);
    } catch (error) {
      throw error;
    }
  }
}

export default new SearchBox();
