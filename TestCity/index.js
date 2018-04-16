// import axios from "axios";
var fs = require("fs");
var axios = require("axios");

let OldJson = Object.create(null);

let MetaData = Object.create(null, {
    value: {
        writable: true,
        configurable: true,
        value: ''
    },
    label: {
        writable: true,
        configurable: true,
        value: ''
    },
    children: {
        writable: true,
        configurable: true,
        value: []
    }
});

let newJson = [];

let province = []; //省
let city = []; //市
let area = []; //区

axios({
    method: "get",
    url: 'http://localhost:4994/TestCity/area_tb_da.json'
})
    .then((res) => {
        OldJson = res.data;
        
        for (let i = 0; i < OldJson.length; i++) {
            const element = OldJson[i];
            if (element.parentid == "0") {
                province.push(rename(element))
            }
            if (element.codeid.length == 4) {
                city.push(rename(element))
            }
            if (element.codeid.length == 6) {
                area.push(rename(element))
            }
        }

        for (let i = 0; i < city.length; i++) {
            for (let j = 0; j < area.length; j++) {
                if (city[i].value == area[j].value.slice(0,4)) {
                    city[i].children.push(area[j])
                }
            }
        }

        for (let i = 0; i < province.length; i++) {
            for (let j = 0; j < city.length; j++) {
                if (province[i].value == city[j].value.slice(0,2)) {
                    province[i].children.push(city[j])
                }
            }
        }


        // console.log(area);
        fs.writeFile('./cityData.json', JSON.stringify(province),function(err){
            if(err) console.log('写文件操作失败');
            else console.log('写文件操作成功');
        });

    })
    .catch((error) => {
        console.log(error);
    });

// function pushNewData(last, next, index) {
//     if (last.codeid == next.parentid) {
//         last.children.push(rename(next));
        
//     } else {
//         newJson.push(rename(last))
//         return ++index;
//     }
// }

function rename(obj) {
    return {
        value: obj.codeid,
        label: obj.cityName,
        children: []
    }
}
// function rename2(obj) {
//     return {
//         value: obj.codeid,
//         label: obj.cityName,
//         children: []
//     }
// }

// const length = OldJson.length;

// function fun(i) {
//     if (i == length) {
//         return newJson
//     }
//     if (OldJson[i].codeid == OldJson[i + 1].parentid) {
//         return {
//             value: obj.codeid,
//             label: OldJson[i].cityName,
//             children: []
//         }
//     } else {
//         newJson.push(rename1(obj))
//     }
// }
// function fun2(i) {
//     return []
// }

// function oldCode() {
//     // console.log(OldJson[0]);
//     newJson.push(rename1(OldJson[0]));
//     // console.log(newJson);
//     for (let i = 0; i < OldJson.length -1; i++) {
        
//         if (OldJson[i].codeid == OldJson[i + 1].parentid) {
//             for (let k = i; k < OldJson.length - 1; k++) {
                
//                 // console.log(OldJson[i], i, OldJson.length)
//                 if (OldJson[i].codeid == OldJson[i + 1].parentid) {

//                     for (let j = 0; j < OldJson.length - 1; j++) {
                        
//                         if (OldJson[i].parentid == OldJson[i + 1].parentid) {
//                             newJson[newJson.length - 1].children[newJson[newJson.length - 1].children.length - 1].children.push(rename1(OldJson[i + 1]))
//                         } else {
//                             break;
//                         }
//                         i++;
//                     }
                    
//                 } else {
//                     newJson[newJson.length - 1].children.push(rename1(OldJson[i + 1]))

//                 }
//                 i++;
//             }
            
//         } else {
//             newJson.push(rename1(OldJson[i + 1]));
//         }
//     }
// }