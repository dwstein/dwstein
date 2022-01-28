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
 *    B]1) creat an array of all the contracts on Polygon Contracts sheet
 *    B]2) filter that array into an array with just the good contracts.
 * C] create array of all the downloaded contracts that have been confirmed: confirmed_contracts
 *    C]1) compare source contracts to polygon contracts
 *    C]2) create the new array of good contracts
 * D] starting with confirmed_contracts, go through latest download sheet and create array of balances: final_balances
 * E] put final_balances into "Balance Tracking sheet"
 * F] fController() - controler function - called by main - runs the funcitons in order
 * G] runMain() -  main fuction
 */


/** F] fController() - controler function - called by main - runs the funcitons in order */
  function fController(){
    //console.log('Arument 1: ' + _sourceSheetName, ' Argument 2: ' + _targetSheetName)

    /** general variables */
    let ss = SpreadsheetApp.getActiveSpreadsheet();           // get active spredsheet
    let sourceSheetName = "Raw Polygon Pull";
    let contractsSheetName = "Polygon Contracts"
    let targetSheetName = "Balance Tracking";
    
    /** source sheet info */
    let sourceSheet = ss.getSheetByName(sourceSheetName);    // the source of the latest balance pull
    let sourceLastRow = sourceSheet.getLastRow();     
    let sourceColumn = 2                                      // column with the contract addresses
    let sourceStartRow = 2                                    // 1 = no header, 2 = header
    let sourceColumnsRange = 1;

    /** sheet with the list of contracts we care about */
    // contractsSheet, contractsLastRow, contractsColumn, contractsStartRow
    let contractsSheet = ss.getSheetByName(contractsSheetName);
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
 
    /** B]1) creat an array of all the contracts on Polygon Contracts sheet */
    aPolygonContracts = createArrayFromColumn(contractsSheet, contractsLastRow, contractsColumn, contractsStartRow, contractsColumnsRange)
    // console.log(aPolygonContracts);

    /** B]2) filter that array into an array with just the good contracts. 
     *    SO answer here https://stackoverflow.com/questions/70899195/how-to-get-the-first-item-in-nested-filtered-array-in-javascirpt/70899368#70899368
     *    aPolygonContracts has this as an output example:
     *    [[ '0x8ae127d224094cb1b27e1b28a472e588cbcc7620', 0 ],
          [ '0xcbf4ab00b6aa19b4d5d29c7c3508b393a1c01fe3', 0 ],
          [ '0x03cd191f589d12b0582a99808cf19851e468e6b5', 0 ],
          [ '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a', 1 ]]
          need to filter for contracts with for second item (1 or 0),
          then map each sub array to get just the first elememtn
    */
    const aGoodContracts = aPolygonContracts.filter(contracts => contracts[1]===1).map(c => c[0]);  // returns an array of just the good contracts
    console.log(aGoodContracts)


    /** C]1) compare source contracts to polygon contracts */


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

