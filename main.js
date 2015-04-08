import GreeterApp from './app/greeterApp';

window.onload = () => {
  var app = new GreeterApp(document.body, 'FirstName', 'LastName');
  app.plug();
};
