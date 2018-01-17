/**
 * 设计师作品展示4张
 * @param {*} props 
 */
const ItemPicLists = (props) => (
    <ul>
        {
            props.works_list.slice(0, 4).map(function (value, idx) {
                return <li>
                    <a href="#">
                        <img src={value.path + '!540x390'} alt="" />
                    </a>
                </li>
            })
        }
    </ul>
)
/**
 * 设计师个人信息展示
 */
const PersonalMsg = (props) => (
    <div className="itemsTop">
        <div className="itemsTopPic fn-left">
            <Link to="/">
                <img src={props.path_thumb} alt="" />
            </Link>
        </div>
        <div className="itemsTopRight">
            <p>
                <span className="fn-left" style={{ fontSize: '16px' }}>
                    {props.nick_name} <i className={props.sex == '男' ? 'iconfont icon-xingbienanxuanzhong' : 'iconfont icon-xingbienv_f'}
                        style={props.sex == '男' ? { color: '#4DA7E0', fontWeight: "800", fontSize: "12px" } : { color: '#F46353', fontWeight: "800", fontSize: "12px" }}></i>
                </span>
                <span className="fn-right personalMsg"><i className="iconfont icon-dingwei"></i>{props.distance}km</span>
            </p>
            <p className="personalMsg">
                <span>{props.group_name}</span> | <span>{props.experience}</span> | <span>{props.works_count}件作品</span> | <span>{props.hits_count}人喜欢</span>
            </p>
        </div>
    </div>
)