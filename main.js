import GreeterApp from './app/greeterApp';

window.onload = () => {
  let app = new GreeterApp(document.body);
  app.start('FirstName', 'LastName');
};
