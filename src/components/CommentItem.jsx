const CommentItem = (props) => {
    let commentReplyElement; //留言回复的ul DOM
    let likeElement; //觉得很赞的ul DOM
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
                {/* <span className="scoreTitle">评分</span> */}
                <i className={props.score > 0 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 1 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 2 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 3 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <i className={props.score > 4 ? "iconfont icon-wujiaoxing light" : "iconfont icon-wujiaoxing"} />
                <span className="score-remark">{props.remark ? '￥' + props.remark : null}</span>
            </div>
        </div>
        <div className="context">
            <p className="text">{props.content}</p>
            {/* <span className="get-all">更多</span> */}
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
                    <span className="box-collect" onClick={() => { props.AddLove(props.id, likeElement); switchLoveColor() }}>
                    <i ref={(e) => loveElement = e} className="iconfont icon-xin-1" style={{"color": props.islove ? "rgb(64, 154, 214)" : "rgb(204, 204, 204)"}}></i>
                    <span className="number">{props.love_count}</span>
                </span>
                <span className="dashed-arrow"></span>
                <span className="box-comment" onClick={() => { props.onTouchComment(props.id, props.user_id_from, props.nick_name) }}>
                    <i className="iconfont icon-icon-talk"></i>
                    <span className="number">{props.commentrep_data.length}
                </span>
                </span>
            </div>
        </div>
        <div className="comment-like-box clearfix" style={{ "display": props.love_list.length > 0 ? "block" : "none"  }}>
            <i className="iconfont icon-xin-1"></i>
            <ul className="like-user" ref={(e) => likeElement = e}>
                {
                    props.love_list.length > 0 &&
                    props.love_list.map((value,index,elem)=>(
                        <li>{value.nick_name}{ index < elem.length - 1 ? ',' : null}</li>
                    ))
                }
            </ul>
            <span className="txt"> 觉得很赞</span>
        </div>
        <div ref={(e) => commentReplyElement = e} className="comment-reply-box" style={{ "display": props.commentrep_data.commentrep_list.length > 0 ? "block" : "none"  }}>
            {/* <div className="reply-line"
                onClick={(e) => { props.onTouchReply(props.id, '方少言') }}
            >
                <span className="origin">方少言:</span>
                <p className="txt">无敌赞</p>
            </div> */}
            
            {
                    props.commentrep_data.commentrep_list.length > 0 &&
                    props.commentrep_data.commentrep_list.map((value, index)=>(
                        <div className="reply-line"
                            onTouchStart={(e) => { e.target.style.backgroundColor = "#ccc" }}
                            onTouchEnd={(e) => { e.target.style.backgroundColor = "#f4f4f4" }}
                            onClick={(e) => { props.onTouchReply(value.comment_id, value.user_id, value.nick_name) }}
                        >
                            {
                                value.user_id_to == props.user_id_from ?(
                                    <span className="origin">{value.nick_name}:</span>
                                ) : (
                                    <span className="origin">{value.nick_name} 回复 {value.nick_name_to}:</span>
                                )
                            }
                            <p className="txt">{value.content}</p>
                        </div>
                ))
            }
        </div>
        <div 
            className="comment-reply-box more"
            onTouchStart={(e) => { e.target.style.backgroundColor = "#ccc" }}
            onTouchEnd={(e) => { e.target.style.backgroundColor = "#f4f4f4" }}
            style={{ "display": props.commentrep_data.is_next_page > 0 ? "block" : "none" }}
            onClick={(e) => { props.clickMoreComment(props.id) }}
            >查看更多评论...</div>
    
    </div>
)}

export default CommentItem;