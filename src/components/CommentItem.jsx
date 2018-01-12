const CommentItem = (props) => (
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
            <p className="text">更新一组影吧风格，吉茶屋  用原创个性字体进行组合设计。更新一组影吧风格，吉茶屋  用原创个性字体进行组合设计。</p>
            <span className="get-all">更多</span>
        </div>
        <div className="dishPic">
            {
                props.dishPic.map((imgUrl, index, elem) => (
                    <div onClick={() => { props.TouchImg(index, elem) }} className="imgFrame"><img src={imgUrl} /></div>
                ))
            }
        </div>
        <div className="bottom-box">
            <span className="time">{props.time}</span>
            <div className="comment-icon">
                <span className="box-collect">
                    <i className="iconfont icon-xin-1"></i>
                    <span className="number">1</span>
                </span>
                <span className="dashed-arrow"></span>
                <span className="box-comment">
                    <i className="iconfont icon-icon-talk"></i>
                    <span className="number">0</span>
                </span>
            </div>
        </div>
        <div className="comment-like-box clearfix">
            <i className="iconfont icon-xin-1"></i>
            <ul className="like-user">
                <li>hkw151541,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>晓风残月,</li>
                <li>方少言</li>
            </ul>
            <span className="txt">觉得很赞</span>
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
)

export default CommentItem;