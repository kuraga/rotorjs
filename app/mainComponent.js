/** @jsx h */

import Component from '../lib/component';
import h from 'virtual-dom/h';

export default class MainComponent extends Component {

  constructor(app, parent = null, componentName = 'main') {
    var initialState = {};
    super(app, parent, componentName, initialState);

    return initialState;
  }

  render() {
    return <div>
      Hello! <a href="#/greeter/FirstName/LastName">Click here</a>!
      <br />
      Or try to visit an invalid <a href="#/invalid">link</a>.
    </div>;
  }

}
