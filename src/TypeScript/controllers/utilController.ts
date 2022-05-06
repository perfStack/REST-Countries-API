import * as config from '../utility/config';
import * as model from '../scripts/model';


/**
 * return the appropriate region map based on the string passed
 * @param region
 */
export function getRegionMap(region: string | undefined) {
  // todo improve with string literals
  if (!region) {
    throw new Error('Not a valid string');
  }

  switch (region) {
    case config.REGION_KEYS.allRegion:
      return model.modelState.allCountriesMap;
    case config.REGION_KEYS.africa:
      return model.modelState.africaMap;
    case config.REGION_KEYS.americas:
      return model.modelState.americasMap;
    case config.REGION_KEYS.asia:
      return model.modelState.asiaMap;
    case config.REGION_KEYS.europe:
      return model.modelState.europeMap;
    case config.REGION_KEYS.oceania:
      return model.modelState.oceaniaMap;
    case config.REGION_KEYS.antarctic:
      return model.modelState.miscRegionMap;
    default:
      throw new Error('Cannot find any appropriate map');
  }
}
