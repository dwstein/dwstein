/** Functions that are used in more than one script */


/** turn 2D array into an object */
function arr2obj(arr) {
        let obj = {};
        arr.forEach((v) => {
          // Extract the key and the value
          let key = v[0];
          let value = v[1];
          // Add the key and value to
          // the object
          obj[key] = value;
        });
        return obj;
}

/** post data to Airtable */
function atPostTable(
  _baseKey,             // the key for the airtable base; provided by Airtable
  _tableName,           // text name of the table; ex. "Balance Tracking"
  _payload,             // an object that has the data to be sent to airtable
  _myAPIKey,            // api key from airtable
  _cAirtableAPIEndpoint // api endpoint form airtable
  )
{
  var options = 
      {
        method: 'POST',
        headers: {
          'Authorization' : 'Bearer ' + _myAPIKey,
          'Content-Type'  : 'application/json'
        },
        payload : JSON.stringify(_payload),
        muteHttpExceptions : true,
        followRedirects: true
      };
  var response = UrlFetchApp.fetch(_cAirtableAPIEndpoint + _baseKey + "/" + encodeURIComponent(_tableName), options).getContentText();
  console.log(response);
};

/** get the raw data from the api */
function getRawData(_URL) {
  var response = UrlFetchApp.fetch(_URL)
  return response
};

/** add a a timestamp too the front of each sub array */
/** used imidiatly prior to putting cleanred data into a sheet */
function addTimeStamp(_aCleanedData) {
  const timeElapsed = Date.now();         // same timestamp for all the data so it's easier to track as a group
  const today = new Date(timeElapsed);
  const todayFormated = today.toUTCString();

  for (var n = _aCleanedData.length - 1; n >= 0; n--) {
    _aCleanedData[n].unshift(todayFormated);
  }
  return _aCleanedData
}

/** place the cleaned API data into the raw data into downloadh sheet: placeAPIData*/
/** it takes a 2D array and places data into a rectagles starting with the second row and the first collumn */
// function placeAPIData(_cleanedAPIData, _sheetName) {
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
//   var downloadSheet = ss.getSheetByName(_sheetName);
//   var downloadRange = downloadSheet.getRange(2, 1, _cleanedAPIData.length, _cleanedAPIData[0].length)
//   downloadRange.setValues(_cleanedAPIData);
// }

/** place the cleaned API data into the raw data into downloadh sheet: placeAPIDataLastRow*/
/** places data in the last row of the sheet */
function placeAPIDataLastRow(_cleanedAPIData, _sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var downloadSheet = ss.getSheetByName(_sheetName);
  var downloadRange = downloadSheet.getRange(downloadSheet.getLastRow() + 1, 1, _cleanedAPIData.length, _cleanedAPIData[0].length)
  downloadRange.setValues(_cleanedAPIData);
}

function placementTest(){
  const testArray = [["a", "b", "C"], ["foo", "bar", "baz"]];
  placeAPIDataLastRow(testArray, "AAVE Download");
  console.log("placement test")
};
