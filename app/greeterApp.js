import App from '../lib/app';
import GreeterComponent from './greeterComponent'

export default class GreeterApp extends App {

  constructor(rootElement, firstName, lastName) {
    var greeterComponentState = new GreeterComponent(this, [], {
      firstName, lastName
    });

    super(rootElement, greeterComponentState);
  }

};
