/** example API:  https://api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/stacks/aave_v2/balances/?quote-currency=USD&format=JSON&key=ckey_22e6256ba15d4d6d8a42df77447 */
              /** https://api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/stacks/aave_v2/balances/?quote-currency=USD&format=JSON&key=ckey_22e6256ba15d4d6d8a42df77447 */


/** new instance of DataForPost */ 
let aave_Airtable_Post = new DataForPost("Inputs", "AAVE Download");

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
      ["supply_position","supplied"],
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
                  /** the last two object levels are aFullHeaderList items 0 and 1 */
                  // console.log(aContractData[n][aFullHeaderList[i][0]][aFullHeaderList[i][1]])
                  aTempSubArray.push(aContractData[n][aFullHeaderList[i][0]][aFullHeaderList[i][1]])
              };
          aCleanData[n] = aTempSubArray
        
      };
      return aCleanData      
    };

/** AIRTABLE POST */

  /** create an object of contracts and balances for posting to airtable  
   *  loops through the number of coins posts to airtable on each loop */
      function loopNPostAave(_aFinalArrray){
        var aPayload = [];
        var aColumnHeaders = fAaveHeaders();  // these will be the keys in the payload object
        aColumnHeaders.unshift("TimeStamp");
        /** parent loop is the filtered data, one loop for each token 
         * 3 tokens, three loops*/
            for (var z = 0; z <= _aFinalArrray.length - 1; z++){
                var oSubPayload = {}
                /** child loop is for the headers. go throug the headers and marry the key:value  */
                for (var n = 0; n <= aColumnHeaders.length - 1; n++){
                    // console.log(aColumnHeaders[n] + " and " + _aFinalArrray[z][n]);
                    oSubPayload[aColumnHeaders[n]] = _aFinalArrray[z][n];
                };
                aPayload[z] = oSubPayload;  // load the parent array with the child object
    
                payload = aPayload[z];

                /** post data to Airtable */
                console.log(aave_Airtable_Post.atPostTable(payload)) // class method from DataForPost
            };
        };



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
  loopNPostAave(finalArray); // for posting to airtable
  placeAPIDataLastRow(finalArray, sheetName); // paste data to googl spreadsheet
  console.log("done with aave download")
};

