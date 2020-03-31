# bypass-with-bridge-pay-nodejs

For running the app: npm run server

For testing url bridge pay http://localhost:5000/api/bp/actions.

example payload post
{	
	"ClientIdentifier": "SOAP",
	"TransactionID": "123",
	"RequestType": "001",
	"RequestDateTime": "20171101124522",
	"User": "dhaaspgtest1",
	"Password": "57!sE@3Fm",
	"requestMessage": {
		"MerchantCode": "575000",
		"MerchantAccountCode": "575001",
		"PaymentAccountNumber": "4111111111111111",
		"ExpirationDate": "1222",
		"SecurityCode": "999"
	}	
}
