import GreeterApp from './app/greeterApp';

var application;

window.onload = () => {
  app = new GreeterApp(document.body);
  app.start('FirstName', 'LastName');
};

window.onunload = () => {
  application.stop();
};
