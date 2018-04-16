// import axios from "axios";
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

axios({
    method: "get",
    url: 'http://localhost:4994/TestCity/area_tb_da.json'
})
    .then((res) => {
        OldJson = res.data;
        
        for (let index = 0; index < OldJson.length -1; index++) {
            const element = OldJson[index];
            
            
        }


    })
    .catch((error) => {
        console.log(error);
    });

function pushNewData(last, next, index) {
    if (last.codeid == next.parentid) {
        last.children.push(rename(next));
        
    } else {
        newJson.push(rename(last))
        return ++index;
    }
}

function rename(obj) {
    return {
        value: obj.codeid,
        label: obj.cityName,
        children: []
    }
}