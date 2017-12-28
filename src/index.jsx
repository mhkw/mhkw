import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';

import App from './components/App';
import Login from './components/login';
import Register from './components/register';

import 'lib-flexible/flexible'
import './css/index.scss';
//设置路由
// class Index extends React.Component {
//   render() {
//     return (
//       <div className="body">
//         <h1>Stages list</h1>
//         <ul role="nav">
//           <li><Link to="/s1">ListView + Carousel</Link></li>
//         </ul>
//       </div>
//     );
//   }
// }
//路由配置
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      {/*<IndexRoute component={Index} />*/}
      <Route path="s2" component={Register} />
    </Route>
    <Route path="s1" component={Login} />
  </Router>
, document.getElementById('container'));

// ReactDOM.render(
//     <div className="body">
//         <App></App>
//     </div>
//     , document.getElementById('container')
// );