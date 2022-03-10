var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var execSync = require('child_process').execSync;
var SibApiV3Sdk = require('sib-api-v3-sdk');
const { Server } = require('https');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';


var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email


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
            'origin': ' http://192.168.56.1:8081',
            'referer': ' http://192.168.56.1:8081/',
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
        data: JSON.stringify({ "ticketData": bookDate, "lineCode": lineCode, "startStationCode": lineCode.slice(0, 3), "endStationCode": lineCode.slice(3, 6), "boardingPointCode": lineCode.slice(0, 3) + "01", "breakoutPointCode": lineCode.slice(3, 6) + "01", "currency": "2", "ticketCategory": "1", "tickets": [{ "ticketType": "00", "idCard": "310104199905174414", "idType": 1, "userName": "任彦齐", "telNum": "" }], "amount": 6500, "feeType": 9, "totalVoucherpay": 0, "voucherNum": 0, "voucherStr": "", "totalBalpay": 0, "totalNeedpay": 6500, "bookBeginTime": bookTime, "bookEndTime": bookTime, "captcha": captcha, "appId": "HZMBWEB_HK", "joinType": "WEB", "version": "2.7.202203.1092", "equipment": "PC" })
    })
};


const SLEEP_TIME = 1000;
const LONG_SLEEP_TIME = 1000;
let lineCode = "ZHOHKG";


function range(start, end) {
    if (start === end) return [start];
    return [start, ...range(start + 1, end)];
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function main() {
    while (true) {
        try {
            let response = await axios(api.login())
                .catch(error => { throw error; });
            await sleep(SLEEP_TIME);
            let cookie = response.headers['set-cookie'][0].split(';')[0];
            let jwt = response.data.jwt;
            let day = parseInt(moment().format('d'));
            day = day == 0 ? 7 : day;
            let dayRange = range(2, 14 - day);
            let dateArray = dayRange.map(d =>
                moment().add(d, 'd').format("YYYY-MM-D"));
            dateArray = dateArray.sort(() => Math.random() - 0.5);
            console.log("Refetch ...");
            // console.log(dateArray);
            for (let date of dateArray) {
                let response = await axios(api.query(date, lineCode))
                    .then((response) => (
                        response.data
                    ))
                    .catch(error => error);
                await sleep(SLEEP_TIME);

                // console.log(response);
                if (response?.code != "SUCCESS") { throw response?.message || response; }
                if (response?.code == "SUCCESS") {
                    let responseData = response.responseData;
                    // console.log(responseData);
                    if (responseData.length > 0) {
                        responseData = responseData.filter(d => parseInt(d.maxPeople) > 0);
                        if (responseData.length > 0) {
                            responseData = responseData.sort((b, a) => a.maxPeople - b.maxPeople);
                            let availableTime = responseData[0].beginTime;
                            console.log("Found Available: ", date, availableTime);
                            try {
                                fs.appendFileSync('log', moment().format() + 'FOUND: ' + date + ' ' + availableTime + '\n');
                            } catch (error) {

                            }
                            let captcha = "";
                            do {
                                let response = await axios(api.captcha(cookie, lineCode))
                                    .then((response) => {
                                        // console.log(response.headers);
                                        return response.data;
                                    })
                                    .catch(error => { throw error; });
                                // if (response?.code != "SUCCESS") { throw response?.message || response; }
                                await sleep(SLEEP_TIME);

                                // console.log(response);
                                fs.writeFileSync("captcha.png", response);
                                try {
                                    captcha = execSync("python ocr.py").toString().split('\n')[3].slice(0, -1);
                                } catch (error) {
                                    console.log('Exec Error');
                                    throw error;
                                }
                            } while (!captcha.match(/[0-9]{4}/));
                            console.log(`Captcha Solved: ${captcha}`);
                            // console.log(api.buy(jwt, cookie, date, availableTime, captcha, lineCode));
                            let response = await axios(api.buy(jwt, cookie, date, availableTime, captcha, lineCode))
                                .then((response) => {
                                    // console.log(response.headers);
                                    return response.data;
                                })
                                .catch(error => { throw error; });
                            await sleep(SLEEP_TIME);
                            if (response?.code != "SUCCESS") { throw response?.message || response; }
                            if (response?.code == "SUCCESS") {
                                let link = `https://i.hzmbus.com/webhtml/order_details?orderNo=${response.responseData.orderNumber}&tab1=1`;
                                console.log(link);
                                apiInstance.sendTransacEmail({ sender: { email: "john.ren.unimportant@gmail.com" }, to: [{ email: "john.ren.contact@gmail.com", name: "John" }], htmlContent: `${link}`, subject: "抢到票了！！" }).then(function (data) {
                                }, function (error) {
                                    throw error;
                                });
                                return;
                                break;
                            }
                        }
                    }

                }
            }
        } catch (error) {
            let errorText = error?.toString() || error;
            console.log(errorText);
            fs.appendFileSync('log', moment().format() + 'ERROR: ' + errorText + '\n');
        }
        await sleep(LONG_SLEEP_TIME);

    }
}
// async function captcha() {

// }
main();
process.env.PORT && Server.listen(process.env.PORT);