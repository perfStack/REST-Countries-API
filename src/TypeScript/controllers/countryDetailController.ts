import { APIData } from '../dataTypes/interfaces';
import countryDetailView from '../views/countryDetailView';

/**
 * function that calls countryDetailView's render function
 */
export function run(countryMap: Map<string, APIData>) {
  countryDetailView.render(countryMap);
}
