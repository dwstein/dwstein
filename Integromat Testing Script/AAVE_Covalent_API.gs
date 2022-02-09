/** example API:  https://api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/stacks/aave_v2/balances/?quote-currency=USD&format=JSON&key=ckey_22e6256ba15d4d6d8a42df77447 */
              /** https://api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/stacks/aave_v2/balances/?quote-currency=USD&format=JSON&key=ckey_22e6256ba15d4d6d8a42df77447 */

/** class to for posting data to Airtable via API */
class DataForPost {
  constructor(sheetName, tableName){
      this.sheetName = sheetName; // text name of the google sheet tab
      this.tableName = tableName; // text name of the table in Airtable; ex. "Balance Tracking"
      
      /** Airtable Variables */
      this.ss = SpreadsheetApp.getActiveSpreadsheet();
      this.inputsSheet = this.ss.getSheetByName(this.sheetName);
      this.myAPIKey = this.inputsSheet.getRange(9,2).getValue();
      this.baseKey = this.inputsSheet.getRange(10,2).getValue();
      this.cAirtableAPIEndpoint = this.inputsSheet.getRange(11,2).getValue();
      this.payloadFrame = {"records": [{"fields": {}}]};
      this.url = this.cAirtableAPIEndpoint + this.baseKey + "/" + encodeURIComponent(this.tableName);
      };


  /** post data to Airtable */
    atPostTable(_payload){
      this.payloadFrame.records[0].fields = _payload;

      var options = 
          {
            method: "POST",
            headers: {
              'Authorization' : 'Bearer ' + this.myAPIKey,
              'Content-Type'  : 'application/json'
            },
            payload : JSON.stringify(this.payloadFrame),
            muteHttpExceptions : true,
            followRedirects: true
          };
      
      var response = UrlFetchApp.fetch(this.cAirtableAPIEndpoint + this.baseKey + "/" + encodeURIComponent(this.tableName), options).getContentText();
      return response
    };
}
/** end class */








/** gets final URL getFinnalPolygonURL*/
function aaveURL() {
  let baseURL = "api.covalenthq.com";
  let version = "v1";
  let chainID = "137";
  let walletAddress = "0x4d5aF4843eaCF5C5318E6913f04251b937dbF034";
  let infoNature = "aave_v2";
  let cKey = "ckey_22e6256ba15d4d6d8a42df77447"

  const finalURL = "https://" + baseURL + "/" + version + "/" + chainID + "/address/" + walletAddress + "/stacks/" + infoNature + "/balances/?quote-currency=USD&format=JSON&key=" + cKey;

  return finalURL
};

/** an array of headers so the output can be adjusted as new headers are needed */
function fAaveHeaders(){ 
    var headerlist = [
      ["balance", "atoken_contract_address"],
      ["balance", "atoken_contract_ticker_symbol"],
      ["balance", "atoken_contract_decimals"],
      ["balance", "atoken_balance"],
      ["balance", "quote_rate"],
      ["balance", "quote"],
      ["balance", "origination_fee"],
      ["supply_position", "supplied"],
      ["supply_position", "balance"],
      ["supply_position", "balance_quote"],
      ["supply_position", "apy"],
      ["borrow_position", "borrowed"],
      ["borrow_position", "balance"],
      ["borrow_position", "balance_quote"],
      ["borrow_position", "apr"]];
    return headerlist
}

/** clean the API Data cleanAaveAPIData */
  /**  returns and array for the spreadsheet */
    function cleanAaveAPIData(_rawAPIResponse) {           
      var theParsedJSONdata = JSON.parse(_rawAPIResponse)
      /**  returns an array that needs loops to get the data */
      /**  the more positions there are, the longer this array (aContractData) will get */
      var aContractData = theParsedJSONdata["data"]["aave"]["balances"];
      var aFullHeaderList = fAaveHeaders(); // a funtion that has all the headers stored in arrays

      // var firstBalance = aContractData[0]["balance"]["atoken_contract_ticker_symbol"];  // example of what data pull would look like
      var aCleanData = [];  // declare an array to be used for final storage
      /** loop through aContractData, pull data out of the objects using aFullHeaderList array */
      for (var n = 0; n <= aContractData.length - 1; n++) {    
          var aTempSubArray =[]     
        
              /** loop through the array of headers and pull out for each of the top level array */
              for (var i = 0; i <= aFullHeaderList.length - 1; i++){
                  /** grab the correct headers in the object by using an arry to keep them in order */
                  /** the last two object levles are aFullHeaderList items 0 and 1 */
                  // console.log(aContractData[n][aFullHeaderList[i][0]][aFullHeaderList[i][1]])
                  aTempSubArray.push(aContractData[n][aFullHeaderList[i][0]][aFullHeaderList[i][1]])
              };
          aCleanData[n] = aTempSubArray
      };
      return aCleanData      
    };

/** AIRTABLE POST */
  
  /** function that handles post to airtable */
      // function postAaveToAirtable (_aFinalArrray){ // a 2D array of the values, but no keys
              /** Airtabel Variables */
              /** need to make this into a class that can be called */
                // let ss = SpreadsheetApp.getActiveSpreadsheet();
                // let inputsSheet = ss.getSheetByName("Inputs");
                // let myAPIKey = inputsSheet.getRange(9,2).getValue();
                // const cAirtableAPIEndpoint = "https://api.airtable.com/v0/"
                // const tableName = "AAVE Download";
                // let baseKey = inputsSheet.getRange(10,2).getValue();
                // paylod is composed below

                // /** initialize payload data with a bit of test data.  Overwritten later */
                // var payload = {
                //     "records": [
                //           {
                //             "fields": 
                //                 { TimeStamp: 'Tue, 08 Feb 2022 20:13:55 GMT',
                //                   'balance,atoken_contract_address': '0x8df3aad3a84da6b69a4da8aec3ea40d9091b2ac4',
                //                   'balance,atoken_contract_ticker_symbol': 'amWMATIC',
                //                   'balance,atoken_contract_decimals': 18,
                //                   'balance,atoken_balance': 2116707603245406298309,
                //                   'balance,quote_rate': 1.8755709,
                //                   'balance,quote': 3970.0352,
                //                   'balance,origination_fee': 8219635842947470272251774,
                //                   'supply_position,supplied': '2116.71 amWMATIC supplied',
                //                   'supply_position,balance': 2116707603245406298309,
                //                   'supply_position,balance_quote': 3970.0352,
                //                   'supply_position,apy': 0.008219636,
                //                   'borrow_position,borrowed': '<0.0001 amWMATIC borrowed',
                //                   'borrow_position,balance': 0,
                //                   'borrow_position,balance_quote': 0,
                //                   'borrow_position,apr': 0.10711182
                //             }
                //           }
                //     ]
                //   }
                  // /** post data to Airtable */
                  // atPostTable(
                  //   baseKey,             // the key for the airtable base; provided by Airtable
                  //   tableName,           // text name of the table; ex. "Balance Tracking"
                  //   payload,          // an object that has the data to be sent to airtable
                  //   myAPIKey,            // api key from airtable
                  //   cAirtableAPIEndpoint // api endpoint form airtable
                  // );
              

  /** create an object of contracts and balances for posting to airtable  
   *  loops through the number of coins posts to airtable on each loop */
      function loopNPostAave(_aFinalArrray){
        var aPayload = [];
        var aColumnHeaders = fAaveHeaders();  // these will be the keys in the payload object
        aColumnHeaders.unshift("TimeStamp");
        /** parent loop is the filtered data, one loop for each token 
         * 3 tokens, three loops
        */
            for (var z = 0; z <= _aFinalArrray.length - 1; z++){
                var oSubPayload = {}
                /** child loop is for the headers. go throug the headers and marry the key:value  */
                for (var n = 0; n <= aColumnHeaders.length - 1; n++){
                    // console.log(aColumnHeaders[n] + " and " + _aFinalArrray[z][n]);
                    oSubPayload[aColumnHeaders[n]] = _aFinalArrray[z][n];
                };
                // console.log("z is: " + z);
                aPayload[z] = oSubPayload;  // load the parent array with the child object
                // console.log(aPayload[z]);
                payload = aPayload[z];
      
                console.log("before atPostTable");
                /** post data to Airtable */
                console.log(aave_Airtable_Post.atPostTable(payload)) // class method from DataForPost
                console.log("after atPostTable");
            };
        };


  
/** new instance of DataForPost */ 
let aave_Airtable_Post = new DataForPost("Inputs", "AAVE Download");

/** controlls the aave specific API call */
/** pulls data form aave api and puts data into AAVE Downlaod sheet */
function aaveAPIControler() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "AAVE Download";
  var downloadSheet = ss.getSheetByName(sheetName);
  //clearSheet(downloadSheet);
  var finalURL = aaveURL();                       //  aaveURL() assembles the URL
  var response = getRawData(finalURL);            // getRawData is in General_Functions
  var cleanedAPIData = cleanAaveAPIData(response);
  var finalArray = addTimeStamp(cleanedAPIData);  // general functions
  // loopNPostAave(finalArray); // for posting to airtable
  placeAPIDataLastRow(finalArray, sheetName);
  console.log("done with aave download")
};

