import App from './app';
import Awesome from './awesome'

window.onload = () => {
  var app = new App(document.body);

  var awesome = new Awesome(app, [], {
    firstName: 'Alexander',
    lastName: 'Kurakin'
  });

  app.plug(awesome);
};
