/** @jsx h */

import { Component } from './helpers/rotorJsClasses.mjs';

import h from './helpers/virtualDomSpreadH.mjs';  // eslint-disable-line no-unused-vars

export default class MainComponent extends Component {
  constructor(application, parent = null, name = 'main') {
    super(application, parent, name);
  }

  render() {
    return <div>
      Hello! <a href="#greeter/FirstName/LastName">Click here</a>!
      <br />
      Or try to visit an invalid <a href="#invalid">link</a>.
    </div>;
  }
}
