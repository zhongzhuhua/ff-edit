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
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/temp" component={Temp} />
        </Switch>
      </div>
    </HashRouter>
  );
}
render(<App />, document.getElementById('root'));

// /** 
//  * 总入口页
//  * @author all
//  */
// import React from 'react';
// import ReactDOM from 'react-dom';

// import {
//   BrowserRouter as Router,
//   Route
// } from 'react-router-dom';

// // 路由器
// import Home from './views/home';
// import Temp from './views/temp';

// // router entry
// class App extends React.Component {
//   render() {
//     document.title = this.props.children.props.route.title || '';
//     return (
//       <div>
//         {this.props.children}
//       </div>
//     );
//   };
// };

// // 路由配置
// ReactDOM.render(
//   <Router>
//     <Route component={App}>
//       <Route path="/" component={Home} />
//       <Route path="/temp" component={Temp} />
//     </Route>
//   </Router>,
//   document.getElementById('root')
// );
