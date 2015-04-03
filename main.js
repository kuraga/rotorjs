import App from './app';
import Awesome from './awesome'

var awesome = Awesome({
  firstName: 'Alexander',
  lastName: 'Kurakin'
});

window.onload = () => {
  App(document.body, awesome, Awesome.render);
};
