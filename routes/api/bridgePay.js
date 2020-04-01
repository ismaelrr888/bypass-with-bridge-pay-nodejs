const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const jsonxml = require('jsontoxml');
const base64 = require('base-64');
const xml2js = require('xml2js');

const moment = require('moment');
const xmlParser = require('xml2json');

var parser = new xml2js.Parser();

const QUERY_URL = 'https://www.bridgepaynetsecuretest.com/PaymentService/Default.aspx';
const USER = 'zte089test';
const PASS = '57!sE@3Fm';
const MERCHANT_CODE = '12122000';
const MERCHANT_ACCOUNT_CODE = '12122001';

const instance = axios.create({
    baseURL: "https://www.bridgepaynetsecuretest.com/PaymentService/RequestHandler.svc",
    headers: {
        'SOAPAction': 'http://bridgepaynetsecuretx.com/requesthandler/IRequestHandler/ProcessRequest',
        'Content-Type': 'text/xml'
    }
})

router.post("/actions", (req, res) => {
    // return res.json(req.body);
    const toFormatJson = {
        requestHeader:{
            ...req.body
        }
    }
    const xml = jsonxml(toFormatJson);
    const xmlToBase64 = base64.encode(xml)
    const xmlToBase64ToSend = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:req="http://bridgepaynetsecuretx.com/requesthandler">
    <soapenv:Header/>
        <soapenv:Body>
            <req:ProcessRequest> 
                <req:requestMsg>
                    ${xmlToBase64}
                </req:requestMsg>
            </req:ProcessRequest>
        </soapenv:Body>
    </soapenv:Envelope>
    `;
    instance.post(null, xmlToBase64ToSend).then(resp=>{
            parser.parseString(resp.data, function (err, result) {
                const base64Resp = base64.decode(result['s:Envelope']['s:Body'][0]['ProcessRequestResponse'][0]['ProcessRequestResult'][0]);                
                parser.parseString(base64Resp, (err, result)=>{
                    return res.json(result);
                })
            });
        }    
    ).catch(err=>res.json(err));
});

router.post("/query-string", async (req, res)=>{
    try{
        const respData = await axios.post(QUERY_URL, null, {params: req.body});

        return res.json(xmlParser.toJson(respData.data));
    }catch(err){
        return res.json(err);
    }
});

module.exports = router;
