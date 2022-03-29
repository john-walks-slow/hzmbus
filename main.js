var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var execSync = require('child_process').execSync;
var SibApiV3Sdk = require('sib-api-v3-sdk');
var http = require('http');
const nodeCron = require('node-cron');

const SLEEP_TIME = 150;
const LONG_SLEEP_TIME = 150;
let BLIND_MODE = true;
// let DEV_MODE = true;
let lineCode = "HKGZHO";
let log = "";
let time = 0;
// try {
//     let captcha = execSync("python ocr.py").toString().split('\n')[3].trim();
//     console.log(captcha, captcha.match(/[0-9]{4}/));
// } catch (error) {
//     console.log('Exec Error');
//     throw error;
// }
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';


var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendEmail = (content, subject) => {
    apiInstance.sendTransacEmail({
        sender: { email: "john.ren.unimportant@gmail.com", name: "Huangtu" },
        to: [
            { email: "john.ren.contact@gmail.com", name: "John" },
            { email: "xmhdct@163.com", name: "Lovely Lovely Cat" }
        ],
        htmlContent: content, subject: subject
    }).then(function (data) {
    }, function (error) {
        appendLog('ERROR', error?.toString());
    });
};
//try {

http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`I have fetched ${time} times. Good luck!\n${log}`);
}).listen(process.env.PORT || 8888);

// } catch (error) { }
function appendLog(tag, message) {
    message = moment().tz('Asia/Shanghai').format() + ` ${tag ? `[${tag}]` : ""} ` + message;
    log += message + '\n';
    fs.appendFileSync('log', message + '\n');
    console.log(message);
}

var api = {
    login: () => ({
        method: 'post',
        url: 'https://i.hzmbus.com/webh5api/login',
        // withCredentials: true,
        headers: {
            'authority': 'i.hzmbus.com',
            'scheme': 'https',
            'accept': ' application/json, text/plain, */*',
            'accept-encoding': ' gzip, deflate, br',
            'accept-language': ' zh-CN,zh;q=0.9',
            'authorization': '',
            'content-length': ' 157',
            'content-type': ' application/json;charset=UTF-8',
            'dnt': ' 1',
            'origin': ' https://i.hzmbus.com',
            'referer': ' https://i.hzmbus.com/webhtml/personal_center',
            'sec-ch-ua': ' " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
            'sec-ch-ua-mobile': ' ?0',
            'sec-ch-ua-platform': ' "Windows"',
            'sec-fetch-dest': ' empty',
            'sec-fetch-mode': ' cors',
            'sec-fetch-site': ' cross-site',
            'user-agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
        },
        data: JSON.stringify({ "webUserid": "john.ren.contact@gmail.com", "passWord": "john2014", "code": "", "appId": "HZMBWEB_HK", "joinType": "WEB", "version": "2.7.202203.1092", "equipment": "PC" })
    }),
    query: (bookDate, lineCode = "HKGZHO") => ({
        method: 'post',
        url: 'https://i.hzmbus.com/webh5api/manage/query.book.info.data',
        headers: {
            'authority': 'i.hzmbus.com',
            'scheme': 'https',
            'accept': ' application/json, text/plain, */*',
            'accept-encoding': ' gzip, deflate, br',
            'accept-language': ' zh-CN,zh;q=0.9',
            'content-length': ' 128',
            'content-type': ' application/json;charset=UTF-8',
            'dnt': ' 1',
            'sec-ch-ua': ' " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
            'sec-ch-ua-mobile': ' ?0',
            'sec-ch-ua-platform': ' "Windows"',
            'sec-fetch-dest': ' empty',
            'sec-fetch-mode': ' cors',
            'sec-fetch-site': ' cross-site',
            'user-agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
        },
        data: JSON.stringify({ "bookDate": bookDate, "lineCode": lineCode, "appId": "HZMBWEB_HK", "joinType": "WEB", "version": "2.7.202203.1092", "equipment": "PC" },)
    }),
    captcha: (cookie, lineCode = "HKGZHO") => ({
        method: 'get',
        url: 'https://i.hzmbus.com/webh5api/captcha',
        // withCredentials: true,
        responseType: "arraybuffer",
        headers: {
            'authority': 'i.hzmbus.com',
            'scheme': 'https',
            'accept': ' image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'accept-encoding': ' gzip, deflate, br',
            'accept-language': ' zh-CN,zh;q=0.9',
            'dnt': ' 1',
            'cookie': ` ${cookie}`,
            'referer': lineCode == "HKGZHO" ? ' https://i.hzmbus.com/webhtml/ticket_details?xlmc_1=%E9%A6%99%E6%B8%AF&xlmc_2=%E7%8F%A0%E6%B5%B7&xllb=1&xldm=HKGZHO&code_1=HKG&code_2=ZHO' : " https://i.hzmbus.com/webhtml/ticket_details?xlmc_1=%E7%8F%A0%E6%B5%B7&xlmc_2=%E9%A6%99%E6%B8%AF&xllb=1&xldm=ZHOHKG&code_1=ZHO&code_2=HKG",
            'sec-ch-ua': ' " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
            'sec-ch-ua-mobile': ' ?0',
            'sec-ch-ua-platform': ' "Windows"',
            'sec-fetch-dest': ' image',
            'sec-fetch-mode': ' no-cors',
            'sec-fetch-site': ' same-origin',
            'user-agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
        }
    }
    ),
    buy: (jwt, cookie, bookDate, bookTime, captcha, lineCode = "HKGZHO") => ({
        method: 'post',
        url: 'https://i.hzmbus.com/webh5api/ticket/buy.ticket',
        // withCredentials: true,
        headers: {
            'authority': 'i.hzmbus.com',
            'scheme': 'https',
            'accept': ' application/json, text/plain, */*',
            'accept-encoding': ' gzip, deflate, br',
            'accept-language': ' zh-CN,zh;q=0.9',
            'authorization': jwt,
            'content-type': ' application/json;charset=UTF-8',
            'dnt': ' 1',
            'cookie': ` ${cookie}`,
            'origin': ' https://i.hzmbus.com',
            'referer': lineCode == "HKGZHO" ? ' https://i.hzmbus.com/webhtml/ticket_details?xlmc_1=%E9%A6%99%E6%B8%AF&xlmc_2=%E7%8F%A0%E6%B5%B7&xllb=1&xldm=HKGZHO&code_1=HKG&code_2=ZHO' : " https://i.hzmbus.com/webhtml/ticket_details?xlmc_1=%E7%8F%A0%E6%B5%B7&xlmc_2=%E9%A6%99%E6%B8%AF&xllb=1&xldm=ZHOHKG&code_1=ZHO&code_2=HKG",
            'sec-ch-ua': ' " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
            'sec-ch-ua-mobile': ' ?0',
            'sec-ch-ua-platform': ' "Windows"',
            'sec-fetch-dest': ' empty',
            'sec-fetch-site': ' same-origin',
            'user-agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
        },
        data: JSON.stringify({
            "ticketData": bookDate, "lineCode": lineCode, "startStationCode": lineCode.slice(0, 3), "endStationCode": lineCode.slice(3, 6), "boardingPointCode": lineCode.slice(0, 3) + "01", "breakoutPointCode": lineCode.slice(3, 6) + "01", "currency": "2",
            "ticketCategory": "1", "tickets": [{ "ticketType": "00", "idCard": "310104199905174414", "idType": 1, "userName": "任彦齐", "telNum": "" }], "amount": 6500,
            "feeType": 9, "totalVoucherpay": 0, "voucherNum": 0, "voucherStr": "", "totalBalpay": 0, "totalNeedpay": 6500, "bookBeginTime": bookTime, "bookEndTime": bookTime, "captcha": captcha, "appId": "HZMBWEB_HK", "joinType": "WEB", "version": "2.7.202203.1092", "equipment": "PC"
        })
    })
};

Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
};


function range(start, end) {
    if (start === end) return [start];
    return [start, ...range(start + 1, end)];
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function enterBlindMode() {
    BLIND_MODE = true;
    // sendEmail(`吱吱吱，冲冲冲`, "吱！启动疯狂抢票模式");
    appendLog('MODE', "进入疯狂抢票模式");
}
function exitBlindMode() {
    BLIND_MODE = false;
    // sendEmail(``, "疯狂抢票模式结束");
    appendLog('MODE', "疯狂抢票模式结束");
}
nodeCron.schedule("0 30 11 * * 2", function () {
    enterBlindMode();
}, { timezone: "Asia/Shanghai" });
// nodeCron.schedule("0 0 14 * * 2", function () {
//     exitBlindMode();
// }, { timezone: "Asia/Shanghai" });
nodeCron.schedule("0 0 21 * * *", function () {
    sendEmail(`我今天挖了${time}个洞，发现了以下情况:\n${log}`, "吱！汇报进度");
}, { timezone: "Asia/Shanghai" });
if (BLIND_MODE) {
    enterBlindMode();
}
async function customAxios(name, query, validate, retry = true, maxRetry = 5) {
    let response;
    let request = async () => {
        response = await axios(query);
        // .then((response) => (
        // response.data
        // ));
        if (typeof validate == "boolean") {
            if (!validate) {
                throw new Error(`${response?.data?.message || response?.data?.messages || JSON.stringify(response?.data)}`);
            }
        }
        if (typeof validate == "function") {
            if (!validate(response)) {
                throw new Error(`${response?.data?.message || response?.data?.messages || JSON.stringify(response?.data)}`);
            }
        }


        await sleep(SLEEP_TIME);
        return response;
    };
    try {
        return await request();
    } catch (error) {
        error.tag = name.toUpperCase();
        // console.log(`Error in ${name}: ${error.toString()}`);
        if (typeof retry == "boolean") {
            if (retry) {
                console.log(`Retrying ${name}: ${error.toString()}`);
                return await request();
            } else { throw error; }
        }
        if (typeof retry == "function") {
            if (retry(response)) {
                console.log(`Retrying ${name}: ${error.toString()}`);
                return await request();
            } else { throw error; }
        }
    }
}
async function main() {
    let cookie;
    let jwt;
    // cookie = "PHPSESSID=t64rlbt0b7b14kgv5fpbbbbo14";
    // jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJla2p0X2lzcyIsImlhdCI6MTY0ODUyOTMyNiwiZXhwIjoxNjQ4NTM2NTI2LCJhdWQiOiJla2p0X2NsaWVudF9hdWQiLCJzdWIiOiJla2p0X2NsaWVudF9zdWIiLCJuYmYiOjE2NDg1MjkzMjYsImp0aSI6ImVranRfanRpXzE2NDg1MjkzMjYiLCJkYXRhIjoiZ0J4ZmVaMmtoOGxPSXJXYjZFZ0dTZW0zZzhjQ2t6RWk3VGJ4bDc5SitIbEx0YTI0WUJmMllNQnJtdlpBREJtZUlLZmRUZklwVHNXM3hqN1BkRGs0XC9KQ0RVeDZLdmFlN3dMdjc5OHN0aUFibjFmK01OamFlem11MmZYN2o3bXVBVjVpaVlsRUJDKytFd21WdG5WOWNyeGVoVEw5WFZnbW1lMGpjUVREbFpEbW5sbTRQN0Q2bUVocWFEbnBWUnBBajRGV2JOSHVZSE5sYTZvaFVXQVZGZ3BSbTh0ZWtnZ3pvdmtieUtkcjgzXC9IXC9wbzRcL0JpUVdIRE5iYVdDYUszWStJRjY5REpMdFFqRE5qbmNqNHJxbU5SaEJsU0dnWU1menBvcStrcHR4enZmMUNpdFBnMFNBcVdZSmh3d3pIN0V5ekZQMVNUSzY2SWtJZFBUZjVmQ1IxSzdQcERMQkd5VHA3MGM4K2ZqMUlHcm54TEtiSDd4dXhPT1VzXC9kc1d0ckVFMkszOCtycnlXUUk0b1VmaVpDSVQ4Z0Jsc0ZkSzdndTZaS2FQelR4TjhOQ0RJRytCV3dpRnZvd2FVXC9VR2Z0dkVoeTRUc1Y1Q2orQjlXc3Q1SVNtWFBZMG1OaldzdFVNVkFTMVNvWk9wa0lXWUp2RHdwWm9GaGRFMnFSQkl0TWlNYkNVV1lIZmRRT2pUM3BuZzZxQmhIZThNbFN2Y1M0N0h4SkE0QWtDMDJDTWtDUE9xUG9mT2xEMVBxQzBKMUhaK2JRa2tXUnluSXhqbVNkS1RYblNGXC9OYTE0b0h0U2lhZStrOUlFb3d1cVI1cGhmbUtkcDg5dkNESGtnUXRsR2VLMjZla0JOQnMwUUU4MmFGd2JXaXpTcXJvWXc0SWdzMk1LaWl2VEhVUXJOaDlXYnVDOWZaS25iYldpRVJzVHRoY2VLU1wvY3VIa2ZZNE5EbDNTclhNU2owVnZPQ2NZSVBzejhreGh3M2pjUXNSKzd5azhTRTlaZ2NaQTV1Q2Fxa3Q5S3FGenVvZTRkU0xHdzVYQ0ZZbWthYmE2dExtM0FyTjFiK0pwT0w5elNXUkxXSjcyVWNWQXppYnMyTlg4OFV4UTAxTngxRWRyN2VjRGN1RXVETFFsVTNWRFJpOFZBVm1LK0pWQXV5NVRGb0N1WXVLQWQzbktiTTdpemdsZVNQNkEzN2E3WlNadG80MVlDcGs2QVkwTFFmOFd0dm1WZHY2RWsycVwvaW5vSnErMGxTaHlqcTBUcmp5WGNUUE1sUW9kRlk4ZXJvXC9EVkY4ZFwvWll6NUdzZU51cnBlYWNiVFBcLzdtRytkd2FjR2Q2YWxGZ0NnZ3hhelBxdjFlZmZhM2NaayJ9.3DKygVmrCu_rEbcJCZfThubixd5C7DXF37P2zTiXIMk";

    appendLog('START', '黄兔开工了');

    while (true) {
        time++;
        try {
            if (!cookie || !jwt || cookie.length == 0 || jwt.length == 0) {
                let response = await customAxios("login", api.login(), response => response?.headers && response?.data?.jwt, true);
                cookie = response.headers['set-cookie'][0].split(';')[0];
                jwt = response.data.jwt;
                console.log('Log in succeed');

            }
            let dateArray;
            if (!BLIND_MODE) {
                let day = parseInt(moment().format('d'));
                day = day == 0 ? 7 : day;
                day = day == 1 ? 8 : day;
                // let dayRange = range(2, 14 - day);
                let dayRange = range(8 - day, 14 - day);
                dateArray = dayRange.map(d =>
                    moment().add(d, 'd').format("YYYY-MM-DD"));
                dateArray = dateArray.sort(() => Math.random() - 0.5);
            } else {
                // let day = parseInt(moment().format('d'));
                // day = day == 0 ? 7 : day;
                // let dayRange = range(8 - day, 14 - day);
                // // dayRange = range(2, 4);
                // dateArray = dayRange.map(d =>
                //     moment().add(d, 'd').format("YYYY-MM-D"));
                // dateArray = dateArray.sort(() => Math.random() - 0.5);
                dateArray = ['2022-04-04', '2022-04-08', '2022-04-07'];
            }
            // console.log("Retry ...");
            date = dateArray.sample();
            let availableTime;
            if (!BLIND_MODE) {
                console.log("Trying:", date);
                let response = await customAxios("query", api.query(date, lineCode), response => response?.data?.code != "SUCCESS", true);
                let responseData = response.responseData;
                console.log(responseData);
                responseData = responseData?.filter(d => parseInt(d.maxPeople) > 0);
                if (responseData && responseData.length > 0) {
                    responseData = responseData.sort((b, a) => a.maxPeople - b.maxPeople);
                    availableTime = responseData[0].beginTime;
                    appendLog('FOUND', date + ' ' + availableTime);
                } else { continue; }
            } else {
                availableTime = [11, 12, 14, 15, 17, 18].map(t => t + ":00:00").sample();
                // availableTime = [18].map(t => t + ":00:00").sample();
            }

            // if (!jwt) { throw new Error("Empty JWT"); }

            let captcha = "";
            do {
                let response = await customAxios("captcha", api.captcha(cookie, lineCode), true, true);
                fs.writeFileSync("captcha.png", response.data);
                try {
                    captcha = execSync("python ocr.py").toString().split('\n')[3].trim();
                } catch (error) {
                    throw error;
                }
            } while (!captcha.match(/[0-9]{4}/));
            console.log(`Captcha Solved: ${captcha}`);
            // console.log(api.buy(jwt, cookie, date, availableTime, captcha, lineCode));
            console.log('Buying', date, availableTime);
            let response = await customAxios("buy", api.buy(jwt, cookie, date, availableTime, captcha, lineCode),
                response => (response?.data?.code != "SUCCESS" && response?.data?.orderNumber),
                false
                // response => response?.message != "验证码不正确"
            );
            let link = `https://i.hzmbus.com/webhtml/order_details?orderNo=${response.data.orderNumber}&tab1=1`;
            // sendEmail(`购票链接：${link}`, "吱吱吱！抢到票了！！");
            appendLog('SUCCESS', link);
            await sleep(60 * 1000 * 15);
        } catch (error) {
            let errorText = error.toString() || error.message;
            if (error.message == "请先登录") {
                jwt = false;
                cookie = false;
            } else {
                appendLog(error.tag, errorText);
            }
        }
    }

}
// async function captcha() {

// }
main();
