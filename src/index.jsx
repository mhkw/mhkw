import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';

import 'babel-polyfill';

import App2 from './components/App2';
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
import DesignerComment2 from './components/designerComment2';
import WriterComment from './components/WriterComment';
import PlaceOrder from './components/PlaceOrder';
import { OrderPopup, PayMethod, PayModal} from './components/OrderPopup';
import Hkcircle from './components/hkCircle';
import hkCircle2 from './components/hkCircle2';
import PostBar from './components/PostBar2';
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
import CreatWork2 from './components/CreatWork2';
import CreatCard from './components/CreatCard';
import MyNotice from './components/MyNotice';
import Collect from './components/Collect';
import SearchResult from './components/SearchResult';
import Category from './components/Category';
import Test from './components/page1';

import TempTest from './components/TempTest';
import ConfirmOffer from './components/ConfirmOffer';
import HOCdesignerHome from './components/HOCdesignerHome';
import Address from './components/Address';
// import Address from './components/AddressH5';
import BaiduMap from './components/BaiduMap';
// import BaiduMap from './components/BaiduMapH5';
import HOC from './components/HOC';
import WorksDetails from './components/WorksDetails';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';
import Feedback from './components/Feedback';
import AboutUs from './components/AboutUs';
import Activity from './components/Activity';
import CommonAddress from './components/CommonAddress';
import UserBlackList from './components/UserBlackList'; 
import UserFansList from './components/UserFansList';
import SetUp from './components/SetUp';
import PerfectInfo from './components/PerfectInfo';
import UploadAvatar from './components/UploadAvatar';
import DesignerAuth from './components/DesignerAuth';
import HOCdesignerAuth from './components/HOCdesignerAuth';
import AuthSelf from './components/AuthSelf';
import AuthMotto from './components/AuthMotto';
import AuthSkill from './components/AuthSkill';
import AuthWorks from './components/AuthWorks';
import UserWorks from './components/UserWorks';
import RealName from './components/RealName';
import ChatList from './components/ChatList';
import SystemNotice from './components/SystemNotice';
import DesignerComment3 from './components/designerComment3';
import UploadPhoto from "./components/UploadPhoto";
import MyCustomer from "./components/MyCustomer";
import AddCustomer from "./components/AddCustomer";
import AllContactHistory from "./components/AllContactHistory";
import MessageRemind from "./components/MessageRemind";

import './css/font/iconfont.css';

import 'lib-flexible/flexible';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/"  component={HOC}>
            <Route component={App}>
                <IndexRoute component={Index} />
                <Route path="circle" component={hkCircle2} />
                <Route path="mine" component={Mine} />
                <Route path="chatList" component={ChatList} />
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
            <Route path="creatWork2" component={CreatWork2} />
            <Route path="collect" component={Collect} />
            <Route path="myNotice" component={MyNotice} />
            <Route path="creatCard" component={CreatCard} />
            <Route path="Searchresult" component={SearchResult} />
            <Route path="category" component={Category} />
            <Route path="activity" component={Activity} />
            <Route path="postBar" component={PostBar} />
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
                    <IndexRoute component={IndexWorksCollection} />
                    <Route path="indexWorksCollection" component={IndexWorksCollection} />
                    <Route path="designerComment" component={DesignerComment} />
                </Route>
                {/* 所有留言列表，可以加载下一页的 */}
                <Route path="commentlist" component={DesignerComment} />
                <Route path="workCommentlist" component={DesignerComment3} />
                {/* 单个留言详情 */}
                <Route path="commentDetails" component={DesignerComment2} />
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
            <Route path="myContacts" component={Contacts} />            
            <Route path="TempTest" component={TempTest} />
            <Route path="withdraw" component={Withdraw} />
            <Route path="settings" component={Settings} />
            <Route path="changePassword" component={ChangePassword} />
            <Route path="feedback" component={Feedback} />
            <Route path="aboutUs" component={AboutUs} />
            <Route path="commonAddress" component={CommonAddress} />
            <Route path="userBlackList" component={UserBlackList} />
            <Route path="userFansList" component={UserFansList} />
            <Route path="setUp" component={SetUp} />
            <Route path="perfectInfo" component={PerfectInfo} />
            <Route path="uploadAvatar" component={UploadAvatar} />
            <Route component={HOCdesignerAuth}>
                <Route path="designerAuth" component={DesignerAuth} >
                    <IndexRoute component={UserWorks} />
                    <Route path="userWorks" component={UserWorks} />
                </Route>
                <Route path="authSelf" component={AuthSelf} />
                <Route path="authMotto" component={AuthMotto} />
                <Route path="authSkill" component={AuthSkill} />
                <Route path="authWorks" component={AuthWorks} />
                <Route path="userWorks" component={UserWorks} />
            </Route>
            <Route path="realName" component={RealName} />
            <Route path="systemNotice" component={SystemNotice} />
            <Route path="uploadPhoto" component={UploadPhoto} />
            <Route path="myCustomer" component={MyCustomer} />
            <Route path="addCustomer" component={AddCustomer} />
            <Route path="allContactHistory" component={AllContactHistory} />
            <Route path="messageRemind" component={MessageRemind} />
        </Route>
    </Router>
    , document.getElementById('container'));
