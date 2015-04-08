import App from './app';
import Awesome from './awesome'

class MyApp extends App {

  constructor(firstName, lastName) {
    super();

    this.awesome = new Awesome(app, [], {
      firstName, lastName
    });
  }

  plug() {
    super.plug(this.awesome);
  }
};

window.onload = () => {
  var app = new App(document.body);
  app.plug();
};
