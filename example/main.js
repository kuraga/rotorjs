'use strict';

import GreeterApplication from './src/greeterApplication';

var application;

window.onload = () => {
  application = new GreeterApplication(document.body);
  application.start();
};

window.onunload = () => {
  application.stop();
};
