import { APIData } from '../dataTypes/interfaces';
import countryCardView from '../views/countryCardView';

/**
 * function that calles countryCardView to render spinner
 */
export function renderSpinner() {
  countryCardView.renderSpinner();
}

/**
 * Helper function to render error
 * @param errorMsg
 */
export function renderError(errorMsg: string, clearParent = true) {
  countryCardView.renderError(errorMsg, clearParent);
}

/**
 * function that calls countryCardView's render function
 */
export function run(countryMap: Map<string, APIData>) {
  try {
    countryCardView.render(countryMap);
  } catch (error) {
    renderError((error as Error).message);
  }
}
