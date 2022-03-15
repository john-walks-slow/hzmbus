var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var execSync = require('child_process').execSync;
var SibApiV3Sdk = require('sib-api-v3-sdk');
var http = require('http');
const nodeCron = require('node-cron');

const SLEEP_TIME = 150;
const LONG_SLEEP_TIME = 150;
let BLIND_MODE = false;
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
// try {

//     http.createServer(function (request, response) {
//         response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
//         response.end(`I have fetched ${time} times. Good luck!\n${log}`);
//     }).listen(process.env.PORT || 8888);

// } catch (error) {

// }
function appendLog(tag, message) {
    message = moment().tz('Asia/Shanghai').format() + ` [${tag}] ` + message;
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
async function main() {
    let cookie = "PHPSESSID=49hgk3dvo5dq0jn4ql5f0bevlf";
    let jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJla2p0X2lzcyIsImlhdCI6MTY0NzM0ODkxMiwiZXhwIjoxNjQ3MzU2MTEyLCJhdWQiOiJla2p0X2NsaWVudF9hdWQiLCJzdWIiOiJla2p0X2NsaWVudF9zdWIiLCJuYmYiOjE2NDczNDg5MTIsImp0aSI6ImVranRfanRpXzE2NDczNDg5MTIiLCJkYXRhIjoiRUJoVXp4OW5ucnlLbUhcL1IxZ1Z0NEFoRzZ2dGZmXC8yRVpWSVR1bklkZ0FhMGRNRDJHRk5UQVVDR1Y0WUdcLzY2cEY1UHY0YkdKanJ6S3JXdGlDa3BIbldaYTBHZ1RTWjR1YXNxTFF1RUg4XC9lVHByUjdIWnpwa0NIdVZpTUVNTDErMGtyeGI2cCtcL1d5ZnFYR0kyNUFXUDR5ZHVKWDlaWHVvQ2JPeEs1M2RQVW1OdCtZK1VKQ2ZqaVJCbmhvK01yT3JTekpaXC9nN2pYNktoQXhGVTlSY0xDcHJERzg2dmJqNEc5S1V2dzBqNWdWVElMSFhxaFltOHgrRUdIQVVKa2tadExzT1ZicUNYbis1M01TS2UxWFwvUHpcL2NqNlB3YTZjVDZMY2J1cm4waUlHU2FJcE1JRk9Pd2QxUnU0TnZ6Qk5KV1laT08wUXRQR1F3ZnkySlcrSzdWWDZqb0NLclZsT25SVUNzbTgyNjBUTTFYdXA0ZHJwOWdIUjBBa21zRVNsOEpTWWc2MytKRzliT1F6VzhpR2xyT3VnVE5FUGxHWFZySWd1MnBZVXdVYkNyZ3NWVXcxeGJSb3ZHVWlFV2lKMnpqTmZLTXdkSUpQaVZKSmpWTjNOcDJqV1lta2Ftb0F6eUFWTVRFdnVZTW5JaWlIZnF5bTFlU3A4blVKM09Od2VuZkZaSlhMWFJqVVhvSU94UWNLMVFERnJ0akxMWjFFM1V1ZG9vdFozREpkUUd3ZzBJWURxb0lEdjhzVStGc2FjWVl4YUtVeEljckVlRjhKQis1QUZoTFdLd0RISU1FNkl6cG9xWVVWeTdrYkhXakdTYUZCcXJWQ0ZiS2xZVjAxMHB0SEFLd0kxV05hQUR4amxieDNyc3ZFaUlwRzlaamwzRzF1WW9IaWdjUkNCSnZ3cFhLNThoZUpJQ1wvekx5TVwvRnM5U0Y4WTZuK2lPWCtaVVJmZGRBVHVyY2o4QlVJSTAxVE9TRnB4VWxybFZZaUdOZjRHZ2ZKV00wKzVXaE05WkFJQWtqOGpcL2xNZGZMNHpuQWdUZEJpdzh0UDBCaXhrQVZYc21tOG1kS0tKNTNwWWp3VXIwNGcrMGphRExwMUtOMHZXVFJ5dkE2UzZpbHU2dk1kT3YzTm1JVzdMOTJ0aGJwUjVqWk1wdzBMY2RnWms2WnZkMFkrdjlTSEZIc1FQK1JOcHN6WDZaaEI4UzRaaEI2dENtcXdtTjRBTmVyNlZmOTBvRXcwWkhtZTBzZlJRNjRJRHQyZEpIdzBxTXlZXC82aHpialJcL3dzTENWRGQ5dUdqV3I2cVdYb3lDb1lhK2JSUUg0d3ljMU9jWVhJSUN4bDNjSElJUlRqSlVEQjNJSDNEakwifQ.lqTZceFk4c_AtlrMGfw2BRw8BKsy1zwiD_iTAamQSfI";
    async function login() {
        console.log(
            'login...'
        );
        response = await axios(api.login())
            .catch(async error => { console.log(error.toString()); await login(); });
        if (response?.headers && response?.data?.jwt) {
            cookie = response.headers['set-cookie'][0].split(';')[0];
            jwt = response.data.jwt;
        } else { await login(); }
    }
    await login();

    await sleep(SLEEP_TIME);

    console.log('Log in succeed');
    // setInterval(async () => {
    //     let response = await axios(api.login())
    //         .catch(error => { throw error; });
    //     await sleep(SLEEP_TIME);
    //     cookie = response.headers['set-cookie'][0].split(';')[0];
    //     jwt = response.data.jwt;
    // }, 1000 * 60 * 60);
    // sendEmail(`吱吱吱，我会认真工作的。`, "吱！黄兔开工了");
    appendLog('START', '黄兔开工了');


    while (true) {
        time++;
        try {
            let dateArray;
            if (!BLIND_MODE) {
                let day = parseInt(moment().format('d'));
                day = day == 0 ? 7 : day;
                day = day == 1 ? 8 : day;
                // let dayRange = range(2, 14 - day);
                let dayRange = range(8 - day, 14 - day);
                dateArray = dayRange.map(d =>
                    moment().add(d, 'd').format("YYYY-MM-D"));
                dateArray = dateArray.sort(() => Math.random() - 0.5);
            } else {
                let day = parseInt(moment().format('d'));
                day = day == 0 ? 7 : day;
                let dayRange = range(8 - day, 14 - day);
                // dayRange = range(2, 4);
                dateArray = dayRange.map(d =>
                    moment().add(d, 'd').format("YYYY-MM-D"));
                dateArray = dateArray.sort(() => Math.random() - 0.5);
                // dateArray = ['2022-03-26', '2022-03-21', '2022-03-26', '2022-03-27'].sample();
            }
            // console.log("Retry ...");
            date = dateArray.sample();
            console.log("Trying:", date);
            let availableTime;
            if (!BLIND_MODE) {
                let response = await axios(api.query(date, lineCode))
                    .then((response) => (
                        response.data
                    ))
                    .catch(error => { throw error; });
                await sleep(SLEEP_TIME);
                if (response?.code != "SUCCESS") { throw new Error("Query fail: " + JSON.stringify(response)); }
                if (response?.code == "SUCCESS") {
                    let responseData = response.responseData;
                    // console.log(responseData);
                    responseData = responseData?.filter(d => parseInt(d.maxPeople) > 0);
                    if (responseData && responseData.length > 0) {
                        responseData = responseData.sort((b, a) => a.maxPeople - b.maxPeople);
                        availableTime = responseData[0].beginTime;
                        appendLog('FOUND', date + ' ' + availableTime);
                    } else { continue; }
                }
            } else {
                availableTime = [11, 12, 14, 15, 17, 18].map(t => t + ":00:00").sample();
                // availableTime = [18].map(t => t + ":00:00").sample();
            }
            if (!jwt) { throw new Error("Empty JWT"); }
            let captcha = "";
            do {
                let response = await axios(api.captcha(cookie, lineCode))
                    .then((response) => {
                        // console.log(response.headers);
                        return response.data;
                    })
                    .catch(error => { throw new Error("Captcha fail: " + error?.message); });
                // if (response?.code != "SUCCESS") { throw new Error(response?.message); }
                await sleep(SLEEP_TIME);
                fs.writeFileSync("captcha.png", response);
                try {
                    captcha = execSync("python ocr.py").toString().split('\n')[3].trim();
                } catch (error) {
                    throw error;
                }
            } while (!captcha.match(/[0-9]{4}/));
            console.log(`Captcha Solved: ${captcha}`);
            // console.log(api.buy(jwt, cookie, date, availableTime, captcha, lineCode));
            console.log('Buying', date, availableTime);
            let response;
            async function buy() {
                response = await axios(api.buy(jwt, cookie, date, availableTime, captcha, lineCode))
                    .then(async (response) => {
                        // console.log(response.headers);
                        if (response?.data?.code != "SUCCESS") {
                            throw new Error(response?.data?.message || response?.data?.code);
                        } else {
                            return response.data;
                        }
                    })
                    .catch(async error => {
                        console.log("Buying error:", error?.message);
                        if (error.message != "預約班次錯誤或不存在" && error.message != "預約人數超出當前可預約的總人數" && error.message != "验证码不正确") {
                            await buy();
                        }

                    });
            };
            await buy();
            await sleep(SLEEP_TIME);
            // if (response?.code != "SUCCESS") { throw new Error("Buy fail: " + JSON.stringify(response)); }
            if (response?.code == "SUCCESS") {
                let link = `https://i.hzmbus.com/webhtml/order_details?orderNo=${response.responseData.orderNumber}&tab1=1`;
                sendEmail(`购票链接：${link}`, "吱吱吱！抢到票了！！");
                appendLog('SUCCESS', link);
                await sleep(60 * 1000 * 15);
                // return;
                // break;
            }
        } catch (error) {
            let errorText = error.toString();
            if (error.message == "请先登录" || (!jwt)) {
                let response = await axios(api.login())
                    .catch(error => { throw error; });
                await sleep(SLEEP_TIME);
                cookie = response.headers['set-cookie'][0].split(';')[0];
                jwt = response.data.jwt;
                console.log('Log in ...');
            } else {
                appendLog('ERROR', errorText);
            }
        }
        await sleep(LONG_SLEEP_TIME);

    }
}
// async function captcha() {

// }
main();
