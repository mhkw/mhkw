import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';

import App from './components/App';
import Login from './components/login';
import Register from './components/register';
import Forget from './components/forget';
import Bind from './components/bind';
import Index from './components/home';
import listViewDemo from './components/listViewDemo';
import designerHome from './components/DesignerHome';
import WorksCollection from './components/worksCollection';
import { IndexWorksCollection } from './components/DesignerHome';
import DesignerComment from './components/designerComment';
import WriterComment from './components/WriterComment';
import PlaceOrder from './components/PlaceOrder';
import { OrderPopup, PayMethod, PayModal} from './components/OrderPopup';
import Hkcircle from './components/hkCircle';
import Search from './components/Search';
import CreatServer from './components/serviceCreate';
import AddServer from './components/AddServer';
import CreateOffer from './components/CreateOffer';
import Mine from './components/mine';
import Account from './components/account';
import OrderList from './components/orderList';
import QuoteList from './components/quoteList';
import QuoteList2 from './components/quoteList2';
import Withdraw from './components/Withdraw';
import Contacts from './components/Contacts';
import HOCoffer from './components/HOCoffer';
import DemandList from './components/DemandList';
import DemandDetail from './components/DemandDetail';
import WorkList from './components/WorkList';
import CreatNeed from './components/CreatNeed';
import CreatWork from './components/CreatWork';
import CreatCard from './components/CreatCard';
import SearchResult from './components/SearchResult';
import Category from './components/Category';
import Test from './components/page1';

import TempTest from './components/TempTest';
import ConfirmOffer from './components/ConfirmOffer';
import HOCdesignerHome from './components/HOCdesignerHome';
import Address from './components/Address';
import BaiduMap from './components/BaiduMap';
import HOC from './components/HOC';
import WorksDetails from './components/WorksDetails';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';
import Feedback from './components/Feedback';
import AboutUs from './components/AboutUs';

import './css/font/iconfont.css'

import 'lib-flexible/flexible'

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
// ReactDOM.render(
//     <Router history={hashHistory}>
//         <Route component={HOC}>
//             <Route path="/" component={App}>
//                 <IndexRoute component={Index} />
//                 <Route path="/circle" component={Hkcircle} />
//                 <Route path="/mine" component={Mine} />
//             </Route>
//             <Route path="/baiduMap" component={BaiduMap} />
//             <Route path="/address" component={Address} />
//             <Route path="/city" component={listViewDemo} />
//             <Route path="/page1" component={Test} />
//             <Route path="/bind" component={Bind} />
//             <Route path="/forget" component={Forget} />
//             <Route path="/login" component={Login} />
//             <Route path="/register" component={Register} />
//             <Route path="/search" component={Search} />
//             <Route path="/account" component={Account} >
//                 <Route component={OrderPopup}>
//                     <IndexRoute component={PayModal} />
//                     <Route path="payModal" component={PayModal} />
//                     <Route path="payMethod" component={PayMethod} />
//                 </Route>
//             </Route>
//             <Route path="/orderList" component={OrderList} />
//             <Route path="/demand" component={DemandList} />
//             <Route path="/demandDetail" component={DemandDetail} />
//             <Route path="/workList" component={WorkList} />
//             <Route path="/creatNeed" component={CreatNeed} />
//             {/* <Route path="/quoteList" component={QuoteList} /> */}
//             <Route path="/quoteList" component={QuoteList2}>
//                 <Route component={OrderPopup}>
//                     <IndexRoute component={PayModal} />
//                     <Route path="payModal" component={PayModal} />
//                     <Route path="payMethod" component={PayMethod} />
//                 </Route>
//             </Route>
//             <Route path="/" component={HOCdesignerHome}>
//                 <Route path="designerHome" component={designerHome}>
//                     <IndexRoute component={IndexWorksCollection} />
//                     <Route path="indexWorksCollection" component={IndexWorksCollection} />
//                     <Route path="designerComment" component={DesignerComment} />
//                 </Route>
//                 {/* 先将作品提出来，写完了再嵌套到/designerHome */}
//                 <Route path="worksCollection" component={WorksCollection} />
//                 <Route path="writerComment" component={WriterComment} />
//                 <Route path="placeOrder" component={PlaceOrder}>
//                     <Route component={OrderPopup}>
//                         <IndexRoute component={PayModal} />
//                         <Route path="payModal" component={PayModal} />
//                         <Route path="payMethod" component={PayMethod} />
//                     </Route>
//                 </Route>
//             </Route>
//             {/* 测试,评论页不是单独一页 */}
//             {/* <Route path="/designerComment" component={DesignerComment} /> */}
//             <Route path="/" component={HOCoffer}>
//                 <Route path="creatServer" component={CreatServer} />
//                 <Route path="addServer" component={AddServer} />
//                 <Route path="createOffer" component={CreateOffer} />
//                 <Route path="confirmOffer" component={ConfirmOffer} />
//                 <Route path="contacts" component={Contacts} />
//             </Route>
//             <Route path="/TempTest" component={TempTest} />
//             <Route path="/withdraw" component={Withdraw} />
//         </Route>
//     </Router>
//     , document.getElementById('container'));

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/"  component={HOC}>
            <Route component={App}>
                <IndexRoute component={Index} />
                <Route path="circle" component={Hkcircle} />
                <Route path="mine" component={Mine} />
            </Route>
            <Route path="baiduMap" component={BaiduMap} />
            <Route path="address" component={Address} />
            <Route path="city" component={listViewDemo} />
            <Route path="page1" component={Test} />
            <Route path="bind" component={Bind} />
            <Route path="forget" component={Forget} />
            <Route path="login" component={Login} />
            <Route path="register" component={Register} />
            <Route path="search" component={Search} />
            <Route path="account" component={Account} >
                <Route component={OrderPopup}>
                    <IndexRoute component={PayModal} />
                    <Route path="payModal" component={PayModal} />
                    <Route path="payMethod" component={PayMethod} />
                </Route>
            </Route>
            <Route path="orderList" component={OrderList} />
            <Route path="demand" component={DemandList} />
            <Route path="demandDetail" component={DemandDetail} />
            <Route path="workList" component={WorkList} />
            <Route path="creatNeed" component={CreatNeed} />
            <Route path="creatWork" component={CreatWork} />
            <Route path="creatCard" component={CreatCard} />
            <Route path="Searchresult" component={SearchResult} />
            <Route path="category" component={Category} />
            {/* <Route path="/quoteList" component={QuoteList} /> */}
            <Route path="quoteList" component={QuoteList2}>
                <Route component={OrderPopup}>
                    <IndexRoute component={PayModal} />
                    <Route path="payModal" component={PayModal} />
                    <Route path="payMethod" component={PayMethod} />
                </Route>
            </Route>
            <Route path="worksDetails" component={WorksDetails} />
            <Route component={HOCdesignerHome}>
                <Route path="designerHome" component={designerHome}>
                    <IndexRoute component={DesignerComment} />
                    <Route path="indexWorksCollection" component={IndexWorksCollection} />
                    <Route path="designerComment" component={DesignerComment} />
                </Route>
                <Route path="designerWorksDetails" component={WorksDetails} />
                {/* 先将作品提出来，写完了再嵌套到/designerHome */}
                <Route path="worksCollection" component={WorksCollection} />
                <Route path="writerComment" component={WriterComment} />
                <Route path="placeOrder" component={PlaceOrder}>
                    <Route component={OrderPopup}>
                        <IndexRoute component={PayModal} />
                        <Route path="payModal" component={PayModal} />
                        <Route path="payMethod" component={PayMethod} />
                    </Route>
                </Route>
            </Route>
            {/* 测试,评论页不是单独一页 */}
            {/* <Route path="/designerComment" component={DesignerComment} /> */}
            <Route component={HOCoffer}>
                <Route path="creatServer" component={CreatServer} />
                <Route path="addServer" component={AddServer} />
                <Route path="createOffer" component={CreateOffer} />
                <Route path="confirmOffer" component={ConfirmOffer} />
                <Route path="contacts" component={Contacts} />
            </Route>
            <Route path="TempTest" component={TempTest} />
            <Route path="withdraw" component={Withdraw} />
            <Route path="settings" component={Settings} />
            <Route path="changePassword" component={ChangePassword} />
            <Route path="feedback" component={Feedback} />
            <Route path="aboutUs" component={AboutUs} />
        </Route>
    </Router>
    , document.getElementById('container'));
