import App from '../lib/app';
import GreeterComponent from './greeterComponent'

export default class GreeterApp extends App {

  constructor(rootElement, firstName, lastName) {
    super(rootElement);

    this.greeterComponent = new GreeterComponent(this, [], {
      firstName, lastName
    });
  }

  plug() {
    super.plug(this.greeterComponent);
  }

};
