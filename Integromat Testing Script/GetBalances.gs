/** start the script with runMain() using the pulldown menu above */

/** 
 * purpose of this script:
 * Go through the most recent balance pull from the API
 * Put the latest data inot the balances sheet
*/

/** Convensions
 *  _arguments
 *  aArrays for arrays
 */

/**
 * PSUEDO-SCRIPT
 * A] create array of all the conracts from the latest data pull: latest_contracts
 * B] create an array of all the good contracts: good_contracts
 * C] create array of all the downloaded contracts that have been confirmed: confirmed_contracts 
 * D] starting with confirmed_contracts, go through latest download sheet and create array of balances: final_balances
 * E] put final_balances into "Balance Tracking sheet"
 * F] fController() - controler function - called by main - runs the funcitons in order
 * G] runMain() -  main fuction
 */


/** F] fController() - controler function - called by main - runs the funcitons in order */
function fController(_sourceSheetName, _targetSheetName){
    //console.log('Arument 1: ' + _sourceSheetName, ' Argument 2: ' + _targetSheetName)

    // setting basic parameters
    let ss = SpreadsheetApp.getActiveSpreadsheet();           // get active spredsheet
    
    // source sheet info
    let sourceSheet = ss.getSheetByName(_sourceSheetName);    // the source of the latest balance pull
    let sourceRange = sourceSheet.getDataRange();             // get the entire range of the source sheet
    let sourceLastRow = sourceSheet.getLastRow();     
    let sourceColumn = 2                                      // column with the contract addresses
    let sourceStartRow = 2                                    // 1 = no header, 2 = header


    // targe sheet info
    let targetSheet = ss.getSheetByName(_targetSheetName);    // the ultimate target sheet of the data pull
    let targetRange = targetSheet.getDataRange();             // get the entire range of the target sheet
    let targetLastRow = targetSheet.getLastRow();
    
    // A] create array of all the conracts from the latest data pull: latest_contracts
    aLatest_Contracts = createArrayFromColumn(sourceSheet, sourceLastRow, sourceColumn, sourceStartRow)
 
    // B] create an array of all the good contracts: good_contracts
    // C] create array of all the downloaded contracts that have been confirmed: confirmed_contracts 
    // D] starting with confirmed_contracts, go through latest download sheet and create array of balances: final_balances
    //E] put final_balances into "Balance Tracking sheet"   
    
    console.log("end fController");
}


/** A] create array of all the conracts from the latest data pull: latest_contracts 
 * Notes:
 * getRange(row, column, numRows, numColumns)
 * sets the range of all the contract data - subtract 1 to account for header row
 * sets the value of an array of arrays with all the contract addresses.
 * "flat() creastes a new arrawy with sub array elements concatenated... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat"
 */
function getLatestContracts(_sourceSheet, _sLastRow, _sourceColumn){
    contractsRange = _sourceSheet.getRange(2,_sourceColumn,_sLastRow - 1,1);
    aLatest_Contracts = contractsRange.getValues().flat();
    return aLatest_Contracts
}

/** B] create an array of all the good contracts: good_contracts */



/** generic get a columon of data function and return an array */
/** _sheet = the sheet in question
 *  _lastRow = the last row of data in the sheet
 *  _columnNum = the number of the column in question
 *  _startingRow = 1 is no header, 2 is with header
 *  .flat() colapses the array of arrays
 */
function createArrayFromColumn(_sheet, _lastRow, _columnNum, _startingRow){ 
    contractsRange = _sheet.getRange(_startingRow, _columnNum, _lastRow,1);
    aArrayFromColumn = contractsRange.getValues().flat();
    return aArrayFromColumn
}



/** 
 * kicks off the script
 */
function runMain() {
    let sourceSheetName = "Raw Polygon Pull";
    let targetSheetName = "Balance Tracking";
    fController(sourceSheetName, targetSheetName)
}


/** 
 * kicks off the script
 */
function runMain() {
    let sourceSheetName = "Raw Polygon Pull";
    let targetSheetName = "Balance Tracking";
    fController(sourceSheetName, targetSheetName)
}

