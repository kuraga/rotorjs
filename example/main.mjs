'use strict';

import GreeterApplication from './src/greeterApplication.mjs';

var application;

window.onload = () => {
  application = new GreeterApplication(document);
  application.start();

  document.body.appendChild(application.target);
};

window.onunload = () => {
  application.stop();

  document.body.removeChild(application.target);
};
