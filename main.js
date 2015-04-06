import App from './app';
import Awesome from './awesome'

window.onload = () => {
  var awesome = new Awesome({
    firstName: 'Alexander',
    lastName: 'Kurakin'
  });

  var app = new App(document.body, awesome, Awesome.render);
};
