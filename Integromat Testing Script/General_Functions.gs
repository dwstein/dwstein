/** Functions that are used in more than one script */

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

/** place the cleaned API data into the raw data into downloadh sheet: */
/** it takes a 2D array and places data into a rectagles starting with the second row and the first collumn */
function placePolygonAPIData(_cleanedAPIData, _sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var downloadSheet = ss.getSheetByName(_sheetName);
  var downloadRange = downloadSheet.getRange(2, 1, _cleanedAPIData.length, _cleanedAPIData[0].length)
  downloadRange.setValues(_cleanedAPIData);
}
