/** 
 * 总入口页
 * @author all
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

// 路由器
import Home from './views/home';
alert('zhong');

// 路由配置
ReactDOM.render(
  <Router>
    <Route path="/" component={Home}>
      <Route path="/zhong" component={Home} />
    </Route>
  </Router>,
  document.getElementById('root')
);
