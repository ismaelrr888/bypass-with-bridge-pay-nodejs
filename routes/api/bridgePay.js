const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const jsonxml = require('jsontoxml');
const base64 = require('base-64');
const xml2js = require('xml2js');

var parser = new xml2js.Parser();

const instance = axios.create({
    baseURL: "https://www.bridgepaynetsecuretest.com/PaymentService/RequestHandler.svc",
    headers: {
        'SOAPAction': 'http://bridgepaynetsecuretx.com/requesthandler/IRequestHandler/ProcessRequest',
        'Content-Type': 'text/xml'
    }
})

router.post("/actions", (req, res) => {
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

module.exports = router;

