'use strict';

import '../css/style.css';

import { run as themeSwitcher } from './themes/darkMode';
import { run as controller } from './controllers/mainController';

/**
 * Starter function to breathe life into the application.
 */
function run() {
  // todo settiemout
  // todo add background blur while searching
  themeSwitcher();
  controller();
}

run();
