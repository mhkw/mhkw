// 移动端只能有一个报价单多个部分
Mock.mock(localUrl + '/www',{"history" :[
    {   //项目
        "section": {
            "id": 123,
            "runTimeOut": 1859655845,    //报价发送的时间，时间到了自动取消报价
            "agreement": true,           //对方是否同意了报价
            "proname": "三汇集团",      //项目名称
            "main": [   //报价单（移动端就一个报价单）
                {
                    "priceName": "企业官网建设",  //报价单名称 = 项目名称
                    "cash": "要发票(税6%)",    //默认6%
                    "remarks": "备注备注备注备注备注备注备注备注备注备注",
                    "totalAll": "33660.00",      //报价单总计
                    "parts": [   //部分（每个服务当一部分，只会有一条详细，不会有多条）
                        {
                            "description": "交互设计",       //对应图中的1
                            "achievement": "黑白流程说明",   //对应图中的2
                            "part": [
                                {
                                    "order": "1",   //可以默认为1
                                    "content": "交互策略（微型BS）1",        //对应图中的1
                                    "desResult": "交互原则互动演绎，融合产品与用户的需要参与策划与数据整合（线框图）",  //对应图中的2
                                    "unit": "套",    //对应图中的3
                                    "price": "1000.00",   //对应图中的4
                                    "number": "30",        //对应图中的5
                                    "rate": "200.00",   //对应图中的6
                                    "total": "1800.00"   //对应图中的7
                                }
                            ]
                        },
                        {
                            "description": "交互设计（在原来的功能的基础上进行用户使用流程优化方案设计）",
                            "achievement": "成果：黑白流程说明",
                            "part": [
                                {
                                    "order": "1",    
                                    "content": "交互策略（微型BS）4",
                                    "desResult": "交互原则互动演绎，整合（线框图）",
                                    "unit": "套",
                                    "price": "1000.00",
                                    "number": "30",
                                    "rate": "200.55",
                                    "total": "1800.00"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
]})