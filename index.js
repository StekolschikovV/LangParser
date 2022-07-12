import axios from "axios";
import * as fsExtra from "fs-extra";
import * as fs from "fs";

const url = "https://docs.google.com/spreadsheets/d/1b_ykT9cCA8kymMeAI6hK5okPAh1V0ETODpPWxGbLheM/gviz/tq?tqx=out:json&sheet=1.csv"

axios.get(url).then(response => {

    const rm1 = "/*O_o*/\n" +
        "google.visualization.Query.setResponse("
    const rm2 = ");"
    let result = response.data
    let result2 = []
    let result3 = []

    result = result.replace(rm1, "").replace(rm2, "")
    const rows = JSON.parse(result).table.rows

    let lineNum = 0
    rows.forEach(row => {
        let line = []
        row.c.forEach(r => {
            if (lineNum === 0) {
                if (r.v.includes("(") && r.v.includes(")")) {
                    line.push(r.v.split("(")[1].split(')')[0].trim().toLowerCase())
                } else {
                    line.push(r.v)
                }
            } else {
                line.push(r?.v || "")
            }
        })
        result2.push(line)
        lineNum++
    })
    for (let i = 1; i < result2[0].length; i++) {
        let codeList = []
        let textList = []
        for (let i2 = 1; i2 < result2.length; i2++) {
            codeList.push(result2[i2][0])
        }
        for (let i2 = 1; i2 < result2.length; i2++) {
            textList.push(result2[i2][i])
        }
        let obj = {}
        for (let i2 = 0; i2 < textList.length; i2++) {
            const keys = codeList[i2].trim().split('.')
            if (keys.length === 1) {
                if (!obj.hasOwnProperty(keys[0])) {
                    obj[keys[0]] = {}
                }
            } else if (keys.length === 2) {
                if (!obj.hasOwnProperty(keys[0])) {
                    obj[keys[0]] = {}
                }
                if (!obj.hasOwnProperty(keys[1])) {
                    obj[keys[0]][keys[1]] = {}
                }
            } else if (keys.length === 3) {
                if (!obj.hasOwnProperty(keys[0])) {
                    obj[keys[0]] = {}
                }
                if (!obj.hasOwnProperty(keys[1])) {
                    obj[keys[0]][keys[1]] = {}
                }
                if (!obj.hasOwnProperty(keys[2])) {
                    obj[keys[0]][keys[1]][keys[1]] = {}
                }
            }
            // for (let i3 = 0; i3 < keys.length; i3++) {
            //     if (i3 === 0) {
            //         if(!obj.hasOwnProperty(keys[i3])) {
            //             obj[keys[0]] = {}
            //         }
            //     } else if (i3 === 1) {
            //         if(!obj.hasOwnProperty(keys[i3]))
            //         obj[keys[0]][[keys[1]]] = {}
            //     } else if (i3 === 2) {
            //         if(!obj.hasOwnProperty(keys[i3]))
            //         obj[keys[0]][[keys[1]]][[keys[3]]] = {}
            //     }
            //     if(obj.hasOwnProperty(keys[i3])) {
            //
            //     }
            // }
            // keys.forEach(key => {
            //     if (prevKey.length > 0) {
            //         obj[prevKey][key] = {}
            //     }
            //     obj[key] = {}
            //     obj[key][key] = {}
            //     // obj.key1.key2 = {}
            //     // prevKey =  prevKey
            // })

        }
        for (let i2 = 0; i2 < textList.length; i2++) {
            const keys = codeList[i2].split('.')
            const value = textList[i2].trim()
            if (keys.length === 1) {
                obj[keys[0]] = value
            }
            if (keys.length === 2) {
                obj[keys[0]][keys[1]] = value
            }
        }
        result3.push(obj)
    }

    let lang = []

    for (let i = 1; i < result2[0].length; i++) {
        lang.push(result2[0][i])
    }

    fsExtra.emptyDirSync('i18n');

    for (let i = 0; i < lang.length; i++) {
        fs.mkdirSync('i18n' + '/' + lang[i]);
        fs.writeFileSync('i18n' + '/' + lang[i] + "/translation.json", JSON.stringify(result3[i], null, ' '));
    }
})