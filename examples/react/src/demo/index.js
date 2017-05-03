/** 
 * 总入口页
 * @author all
 */
import React  from 'react';
import {
  render
} from 'react-dom';
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import Home from './views/home';
import Temp from './views/temp';

function App() {
  return (
    <HashRouter>
      <Switch>
         <Route exact path="/" component={Home} />
         <Route path="/temp" component={Temp} />
      </Switch>
    </HashRouter>
  );
}
render(<App />, document.getElementById('root'));
