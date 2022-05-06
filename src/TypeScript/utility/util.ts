import { APIData } from '../dataTypes/interfaces';
import { htmlElement } from './querySelector';

/**
 *
 * @param data
 * @param localStorageKey
 */
export function setDataToLocalStorage(
    localStorageKey: string,
    data: APIData[] | string,
) {
  if (typeof data === 'string') {
    localStorage.setItem(localStorageKey, data);
  } else {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }
  // console.log('Using available country data from localstorage');
}

/**
 *
 * @param localStorageKey
 * @returns
 */
export function getDataFromLocalStorage(
    localStorageKey: string,
    jsonParse = false,
): APIData[] | string | null {
  let countryData;
  const storageData = localStorage.getItem(localStorageKey);

  if (storageData) {
    if (jsonParse) countryData = JSON.parse(storageData);
    else countryData = storageData;

    return countryData;
  }

  return null;
}

/**
 *
 */
export function addBodyBlur() {
  const bodyElem = htmlElement.body;
  if (!bodyElem) throw new Error('No body element found for bodyBlur');

  bodyElem.classList.add('blur-background');
}
/**
 *
 */
export function removeBodyBlur() {
  const bodyElem = htmlElement.body;
  if (!bodyElem) throw new Error('No body element found for bodyBlur');

  bodyElem.classList.remove('blur-background');
}

/**
 *
 */
export function toggleBodyBlur() {
  const bodyElem = htmlElement.body;
  if (!bodyElem) throw new Error('No body element found for bodyBlur');

  bodyElem.classList.toggle('blur-background');
}

/**
 *
 * @param parentElem
 */
export function noFormSubmitAction(parentElem: HTMLElement) {
  if (parentElem.nodeName.toLowerCase() !== 'form') {
    throw new Error('No\'t a valid form element');
  }

  parentElem.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event.target);
  });
}
