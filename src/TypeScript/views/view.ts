import { htmlElement } from '../utility/querySelector';
import * as util from '../utility/util';

/**
 *
 */
export class View {
  protected parentElement = htmlElement.body;

  /**
   * clear inner html of the parent element
   */
  protected clearParentElement() {
    if (!this.parentElement) throw new Error('No valid parentElement found');

    this.parentElement.innerHTML = '';
  }

  /**
   * render spinner
   * @param parentElement
   */
  renderSpinner(parentElement = this.parentElement) {
    if (!parentElement) throw new Error('No valid parentElement found');

    const spinnerMarkup = `<div class="spinner">
    <div class="spinner-cont">
      <span class="material-icons spinner-icon">sync</span>
    </div>
  </div>`;

    this.clearParentElement();
    parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
  }

  /**
   * attaches a one time eventhandler on body to remove blur as well as error modal
   * useful when displaying error modal
   */
  hideErrorWhenClickedOutsideOnce() {
    const bodyElem = htmlElement.body;
    if (!bodyElem) throw new Error('No body elem found');

    bodyElem.addEventListener('click', this.hideErrorModal, {
      once: true,
    });
  }

  /**
   * show error modal as well as optionally trigger blur background
   * @param blur
   */
  showErrorModal(blur = false) {
    const errorModal = htmlElement.errorModal;
    if (!errorModal) throw new Error('No error modal found');

    try {
      if (blur) util.addBodyBlur();

      errorModal.classList.remove('hidden');
    } catch (error) {
      this.renderError((error as Error).message);
    }
  }

  /**
   * show error modal as well as remove blur background
   */
  hideErrorModal() {
    const errorModal = htmlElement.errorModal;
    if (!errorModal) throw new Error('No error modal found');

    try {
      util.removeBodyBlur();

      errorModal.classList.add('hidden');
    } catch (error) {
      this.renderError((error as Error).message);
    }
  }

  /**
   * renders error modal
   * @param message
   * @param elementToClear
   */
  renderError(
      message: string,
      blurBody = true,
      clearElement = false,
      elementToClear = this.parentElement,
  ) {
    try {
      util.addBodyBlur();

      const errorContent = htmlElement.errorModalContent;
      if (!errorContent) throw new Error('Can\'t find errorContent');

      // If wish is made to clear a HTMLELement before rendering error,
      // it can be done here.
      if (clearElement) {
        if (!elementToClear) {
          throw new Error(`Can't find ${elementToClear} to clear innerHTml`);
        }
        elementToClear.innerHTML = '';
      }

      errorContent.innerHTML = message;
      this.showErrorModal(blurBody);
    } catch (error) {
      this.renderError((error as Error).message);
    }
  }
}
