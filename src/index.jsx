import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import './css/font/iconfont.css'

import App from './components/App';
import Login from './components/login';
import Register from './components/register';
import Forget from './components/forget';
import Bind from './components/bind';
import Index from './components/home';
import listViewDemo from './components/listViewDemo';
import designerHome from './components/DesignerHome';
import WorksCollection from './components/worksCollection';
import DesignerComment from './components/designerComment';
import WriterComment from './components/WriterComment';
import Hkcircle from './components/hkCircle';

import 'lib-flexible/flexible'
// import 'js/flexible.debug'
// import 'js/flexible_css.debug'

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
            <IndexRoute component={Index} />
            <Route path="/circle" component={Hkcircle} />                    
        </Route>
        <Route path="/city" component={listViewDemo} />        
        <Route path="/bind" component={Bind} />
        <Route path="/forget" component={Forget} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/designerHome" component={designerHome}>
            <IndexRoute component={WorksCollection} />
            <Route path="worksCollection" component={WorksCollection} />
            <Route path="designerComment" component={DesignerComment} />
        </Route>
        {/* 测试,评论页不是单独一页 */}
        <Route path="/designerComment" component={DesignerComment} />
        <Route path="/writerComment" component={WriterComment} />
    </Router>
    , document.getElementById('container'));
