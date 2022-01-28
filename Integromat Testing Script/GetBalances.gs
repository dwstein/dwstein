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
  function fController(){
    //console.log('Arument 1: ' + _sourceSheetName, ' Argument 2: ' + _targetSheetName)

    // setting basic parameters
    let ss = SpreadsheetApp.getActiveSpreadsheet();           // get active spredsheet
    let sourceSheetName = "Raw Polygon Pull";
    let contractsSheetName = "Polygon Contracts"
    let targetSheetName = "Balance Tracking";
    
    /** source sheet info */
    let sourceSheet = ss.getSheetByName(sourceSheetName);    // the source of the latest balance pull
    let sourceRange = sourceSheet.getDataRange();             // get the entire range of the source sheet
    let sourceLastRow = sourceSheet.getLastRow();     
    let sourceColumn = 2                                      // column with the contract addresses
    let sourceStartRow = 2                                    // 1 = no header, 2 = header
    let sourceColumnsRange = 1;

    /** sheet with the list of contracts we care about */
    // contractsSheet, contractsLastRow, contractsColumn, contractsStartRow
    let contractsSheet = ss.getSheetByName(contractsSheetName);
    let contractsRange = contractsSheet.getDataRange();
    let contractsLastRow = contractsSheet.getLastRow();
    let contractsColumn = 1;                                  // contracts are in the first column
    let contractsStartRow = 2;
    let contractsColumnsRange = 2;                            // need two collumns: contracts and weather or not we're tracking them



    /** targe sheet info */
    let targetSheet = ss.getSheetByName(targetSheetName);    // the ultimate target sheet of the data pull
    let targetRange = targetSheet.getDataRange();             // get the entire range of the target sheet
    let targetLastRow = targetSheet.getLastRow();
    
    /** A] create array of all the conracts from the latest data pull: latest_contracts */
    aLatest_Contracts = createArrayFromColumn(sourceSheet, sourceLastRow, sourceColumn, sourceStartRow, sourceColumnsRange)
    console.log(aLatest_Contracts);
 
    /** B] create an array of all the good contracts: good_contracts */
    aGoodContracts = createArrayFromColumn(contractsSheet, contractsLastRow, contractsColumn, contractsStartRow, contractsColumnsRange)
    console.log(aGoodContracts);



    console.log("end fController");
}


/** B] create an array of all the good contracts: good_contracts */



/** generic get a columon of data function and return an array */
/** _sheet = the sheet in question
 *  _lastRow = the last row of data in the sheet
 *  _columnNum = the number of the column in question
 *  _startingRow = 1 is no header, 2 is with header
 *  .flat() colapses the array of arrays
 *  getRange(row, column, numRows, numColumns)
 */
function createArrayFromColumn(_sheet, _lastRow, _columnNum, _startingRow, _columns){ 
    if (_startingRow = 2) {
        _lastRow = _lastRow -1;       // if there's a header, need to cut the range down
    };

    contractsRange = _sheet.getRange(_startingRow, _columnNum, _lastRow, _columns);

    // if there's more than one collumn, don't flattan the array of arrays
    if (_columns > 1) {
      aArrayFromColumn = contractsRange.getValues();
      return aArrayFromColumn
    } else {
      aArrayFromColumn = contractsRange.getValues().flat();
      return aArrayFromColumn
    }
}



/** 
 * kicks off the script
 */
function runMain() {
  /**  let sourceSheetName = "Raw Polygon Pull";
    let contractsSheetName = "Polygon Contracts"
    let targetSheetName = "Balance Tracking";
    fController(sourceSheetName, contractsSheetName, targetSheetName) */
     fController()
}

