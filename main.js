import GreeterApp from './app/greeterApp';

window.onload = () => {
  new GreeterApp(document.body, 'FirstName', 'LastName');
};
