const CommentItem = (props) => {
    let loveElement; //点赞的DOM元素
    const switchLoveColor = () => {
        let color = loveElement.style.color;
        if (color == "rgb(64, 154, 214)") {
            loveElement.style.color = "rgb(204, 204, 204)";
        } else {
            loveElement.style.color = "rgb(64, 154, 214)";
        }
    }
    return (
    <div className="comment-item">
        <div className="user-pic">
            <img src={props.avatarImg} className="user-img" />
        </div>
        <div className="comment-top">
            <div className="user-name">{props.nick_name}</div>
            <div className="info">
                <span className="scoreTitle">评分</span>
                <i className={props.score > 0 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 1 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 2 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 3 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 4 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
            </div>
        </div>
        <div className="context">
            <p className="text">{props.content}</p>
            <span className="get-all">更多</span>
        </div>
        <div className="dishPic">
            {/* {
                props.dishPic.map((imgUrl, index, elem) => (
                    <div onClick={() => { props.TouchImg(index, elem) }} className="imgFrame"><img src={imgUrl} /></div>
                ))
            } */}
            {
                props.dishPic.length > 0 &&
                props.dishPic.map((imgUrl, index, elem) => (
                    <div onClick={() => { props.TouchImg(index, elem) }} className="imgFrame"><img src={imgUrl.path_thumb} /></div>
                ))
            }
        </div>
        <div className="bottom-box">
            <span className="time">{props.time}</span>
            <div className="comment-icon">
                <span className="box-collect" onClick={()=>{ props.AddLove(props.id); switchLoveColor() }}>
                    <i ref={(e) => loveElement = e} className="iconfont icon-xin-1" style={{"color": props.islove ? "rgb(64, 154, 214)" : "rgb(204, 204, 204)"}}></i>
                    <span className="number">{props.love_count}</span>
                </span>
                <span className="dashed-arrow"></span>
                <span className="box-comment">
                    <i className="iconfont icon-icon-talk"></i>
                    <span className="number">{props.commentrep_data.length}</span>
                </span>
            </div>
        </div>
        <div className="comment-like-box clearfix" style={{ "display": props.love_list.length > 0 ? "block" : "none"  }}>
            <i className="iconfont icon-xin-1"></i>
            <ul className="like-user">
                {
                    props.love_list.length > 0 &&
                    props.love_list.map((value,index,elem)=>(
                        <li>{value.nick_name}{ index < elem.length - 1 ? ',' : null}</li>
                    ))
                }
            </ul>
            <span className="txt"> 觉得很赞</span>
        </div>
        <div className="comment-reply-box">
            <div className="reply-line"
                onClick={(e) => { props.onActive(props.index, e) }}
            >
                <span className="origin">方少言:</span>
                <p className="txt">无敌赞</p>
            </div>
            <div className="reply-line"
                onClick={(e) => { props.onActive(props.index, e) }}
            >
                <span className="origin">方少言 回复 晓风残月:</span>
                <p className="txt">芭芭拉啦啦把芭芭拉啦啦666666啦啦啦啦啦8888888</p>
            </div>
        </div>
    </div>
)}

export default CommentItem;