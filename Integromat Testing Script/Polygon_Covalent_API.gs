/** code for pulling in the info "Raw Polygon Tracking" via covalent api */

/** clear the sheet before download - everything below the first row */
function clearSheet(_sheet) {
  var lastRow = _sheet.getLastRow();
  var lastColumn = _sheet.getLastColumn();
  clearRange = _sheet.getRange(2, 1, lastRow, lastColumn)
  clearRange.clear()
};

/** clean API Data cleanPolygonAPIData*/
function cleanPolygonAPIData(
  _theParsedJSONdata,      
  _aColumnHeaderList,   // the keys for the final arrays needed for placement in the sheet
  _levelOne,            // first key in object
  _levelTwo) {           // second key in object
  // var theParsedJSONdata = JSON.parse(_rawAPIResponse)

  var aContractData = _theParsedJSONdata[_levelOne][_levelTwo];    // returns an array

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
  let cCovalentAPI = new CovalentAPI("balances_v2");  // class located in Classes.gs file
  let jsonFromAPI = cCovalentAPI.getJSONData();

  /** identify and clear download sheet */
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Raw Polygon Pull"
  var downloadSheet = ss.getSheetByName(sheetName);
  clearSheet(downloadSheet);

  /** list of headers sued to keep the array in the correct order */
  var aColumnHeaderList = [
    "contract_address",
    "contract_ticker_symbol",
    "balance",
    "quote",
    "type",
    "contract_decimals",
    "contract_name",
    "last_transferred_at"];

  var cleanedAPIData = cleanPolygonAPIData(jsonFromAPI, aColumnHeaderList, "data", "items");
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

