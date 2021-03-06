/** code for pulling in the info "Raw Polygon Tracking" via covalent api */

/** working exmaple
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 */

/** example data:
contract_decimals: 18,
contract_name: 'Wrapped Matic',
contract_ticker_symbol: 'WMATIC',
contract_address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
supports_erc: [ 'erc20' ],
logo_url: 'https://logos.covalenthq.com/tokens/137/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270.png',
last_transferred_at: '2022-01-20T22:32:10Z',
type: 'cryptocurrency',
balance: '808527631062852515',
balance_24h: null,
quote_rate: 1.5479809,
quote_rate_24h: 1.5602198,
quote: 1.2515854,
quote_24h: null,
nft_data: null. */

/** clear the sheet before download - everything below the first row */
function clearSheet(_sheet) {
  var lastRow = _sheet.getLastRow();
  var lastColumn = _sheet.getLastColumn();
  clearRange = _sheet.getRange(2, 1, lastRow, lastColumn)
  clearRange.clear()
};

/** Assemble the API URL polygonAPIurl */
function polygonAPIurl(
  _baseURL,         // api.covalenthq.com
  _version,         // v1
  _chainID,         // 137
  _walletAddress,   // 0x4d5aF4843eaCF5C5318E6913f04251b937dbF034
  _infoNature,      // balances_v2
  _cKey             // ckey_22e6256ba15d4d6d8a42df77447
) {
  const finalAPI = "https://" + _baseURL + "/" + _version + "/" + _chainID + "/address/" + _walletAddress + "/" + _infoNature + "/?key=" + _cKey;
  return finalAPI
};

/** gets final URL getFinnalPolygonURL*/
function getFinnalPolygonURL() {
  let baseURL = "api.covalenthq.com";
  let version = "v1";
  let chainID = "137";
  let walletAddress = "0x4d5aF4843eaCF5C5318E6913f04251b937dbF034";
  let infoNature = "balances_v2";
  let cKey = "ckey_22e6256ba15d4d6d8a42df77447"

  let finalURL = polygonAPIurl(
    baseURL,
    version,
    chainID,
    walletAddress,
    infoNature,
    cKey
  )
  return finalURL
};

/** get the raw data from the api */
// function getRawData(_URL) {
//   var response = UrlFetchApp.fetch(_URL)
//   return response
// };

/** clean API Data cleanPolygonAPIData*/
function cleanPolygonAPIData(
  _rawAPIResponse,      // raw api response that needs to be parsed
  _aColumnHeaderList,   // the keys for the final arrays needed for placement in the sheet
  _levelOne,            // first key in object
  _levelTwo) {           // second key in object
  var theParsedJSONdata = JSON.parse(_rawAPIResponse)

  var aContractData = theParsedJSONdata[_levelOne][_levelTwo];    // returns an array

  /** loop aContractData and put contracts into a 2D array */
  var aCleanData = [];
  for (var n = 0; n <= aContractData.length - 1; n++) {  // go thorugh all the contracts
    var aTempSubArray = [];
    for (var i = 0; i <= _aColumnHeaderList.length - 1; i++) {  // loop through the headers array
      // console.log(aContractData[n][_aColumnHeaderList[i]])  // call the key to the object nested in the array
      aTempSubArray.push(aContractData[n][_aColumnHeaderList[i]]) // add the values from the keys to the temp array
    };
    aCleanData.push(aTempSubArray);
  };
  return aCleanData       // 2D array
}


/** API Controller Funciton */
/** runs through the other functions in the script polygonAPIControler*/
function polygonAPIControler() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Raw Polygon Pull"
  var downloadSheet = ss.getSheetByName(sheetName);
  clearSheet(downloadSheet);
  var finalURL = getFinnalPolygonURL();
  var response = getRawData(finalURL);  // getRawData is in General_Functions
  var aColumnHeaderList = [
    "contract_address",
    "contract_ticker_symbol",
    "balance",
    "quote",
    "type",
    "contract_decimals",/** code for pulling in the info "Raw Polygon Tracking" via covalent api */

/** working exmaple
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 */

/** example data:
contract_decimals: 18,
contract_name: 'Wrapped Matic',
contract_ticker_symbol: 'WMATIC',
contract_address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
supports_erc: [ 'erc20' ],
logo_url: 'https://logos.covalenthq.com/tokens/137/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270.png',
last_transferred_at: '2022-01-20T22:32:10Z',
type: 'cryptocurrency',
balance: '808527631062852515',
balance_24h: null,
quote_rate: 1.5479809,
quote_rate_24h: 1.5602198,
quote: 1.2515854,
quote_24h: null,
nft_data: null. */

/** clear the sheet before download - everything below the first row */
function clearSheet(_sheet) {
  var lastRow = _sheet.getLastRow();
  var lastColumn = _sheet.getLastColumn();
  clearRange = _sheet.getRange(2, 1, lastRow, lastColumn)
  clearRange.clear()
};

/** Assemble the API URL polygonAPIurl */
function polygonAPIurl(
  _baseURL,         // api.covalenthq.com
  _version,         // v1
  _chainID,         // 137
  _walletAddress,   // 0x4d5aF4843eaCF5C5318E6913f04251b937dbF034
  _infoNature,      // balances_v2
  _cKey             // ckey_22e6256ba15d4d6d8a42df77447
) {
  const finalAPI = "https://" + _baseURL + "/" + _version + "/" + _chainID + "/address/" + _walletAddress + "/" + _infoNature + "/?key=" + _cKey;
  return finalAPI
};

/** gets final URL getFinnalPolygonURL*/
function getFinnalPolygonURL() {
  let baseURL = "api.covalenthq.com";
  let version = "v1";
  let chainID = "137";
  let walletAddress = "0x4d5aF4843eaCF5C5318E6913f04251b937dbF034";
  let infoNature = "balances_v2";
  let cKey = "ckey_22e6256ba15d4d6d8a42df77447"

  let finalURL = polygonAPIurl(
    baseURL,
    version,
    chainID,
    walletAddress,
    infoNature,
    cKey
  )
  return finalURL
};

/** get the raw data from the api */
// function getRawData(_URL) {
//   var response = UrlFetchApp.fetch(_URL)
//   return response
// };

/** clean API Data cleanPolygonAPIData*/
function cleanPolygonAPIData(
  _rawAPIResponse,      // raw api response that needs to be parsed
  _aColumnHeaderList,   // the keys for the final arrays needed for placement in the sheet
  _levelOne,            // first key in object
  _levelTwo) {           // second key in object
  var theParsedJSONdata = JSON.parse(_rawAPIResponse)

  var aContractData = theParsedJSONdata[_levelOne][_levelTwo];    // returns an array

  /** loop aContractData and put contracts into a 2D array */
  var aCleanData = [];
  for (var n = 0; n <= aContractData.length - 1; n++) {  // go thorugh all the contracts
    var aTempSubArray = [];
    for (var i = 0; i <= _aColumnHeaderList.length - 1; i++) {  // loop through the headers array
      // console.log(aContractData[n][_aColumnHeaderList[i]])  // call the key to the object nested in the array
      aTempSubArray.push(aContractData[n][_aColumnHeaderList[i]]) // add the values from the keys to the temp array
    };
    aCleanData.push(aTempSubArray);
  };
  return aCleanData       // 2D array
}


/** API Controller Funciton */
/** runs through the other functions in the script polygonAPIControler*/
function polygonAPIControler() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Raw Polygon Pull"
  var downloadSheet = ss.getSheetByName(sheetName);
  clearSheet(downloadSheet);
  var finalURL = getFinnalPolygonURL();
  var response = getRawData(finalURL);  // getRawData is in General_Functions
  var aColumnHeaderList = [
    "contract_address",
    "contract_ticker_symbol",
    "balance",
    "quote",
    "type",
    "contract_decimals",
    "contract_name",
    "last_transferred_at"];
  var cleanedAPIData = cleanPolygonAPIData(response, aColumnHeaderList, "data", "items");
  var finalArray = addTimeStamp(cleanedAPIData);
  // placeAPIData(cleanedAPIData, sheetName);  // in genearal functions
  placeAPIDataLastRow(cleanedAPIData, sheetName);
  console.info("Raw records placed in Raw Polygon Pull: " + cleanedAPIData.length);
};

/** runs Polygon_Covalent_API.gs */
function runPolygonCovalent_API() {
  polygonAPIControler()
  console.log("runPolygonCovalent_API script over")
}


    "contract_name",
    "last_transferred_at"];
  var cleanedAPIData = cleanPolygonAPIData(response, aColumnHeaderList, "data", "items");
  var finalArray = addTimeStamp(cleanedAPIData);
  // placeAPIData(cleanedAPIData, sheetName);  // in genearal functions
  placeAPIDataLastRow(cleanedAPIData, sheetName);
  console.info("Raw records placed in Raw Polygon Pull: " + cleanedAPIData.length);
};

/** runs Polygon_Covalent_API.gs */
function runPolygonCovalent_API() {
  polygonAPIControler()
  console.log("runPolygonCovalent_API script over")
}

