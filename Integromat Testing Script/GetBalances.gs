/** start the script with runMain() using the pulldown menu above */

/** 
 * purpose of this script:
 * Go through the most recent balance pull from the API
 * Put the latest data inot the balances sheet
*/

/** Conventions
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
 * D] starting with confirmed_contracts, go through latest download sheet and create array of balances: final_balances
 *    D]1) get array of all the downloaded info, including prices: full_download
 *    D]2) get an array of good contracts and thier data: good_contract_data
 *    D]3) filter good_contracts_data array into just contracts and their pricdes: good_contract_data
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
    const aLatest_Contracts = createArrayFromColumn(sourceSheet, sourceLastRow, sourceColumn, sourceStartRow, sourceColumnsRange)
 
    /** B]1) creat an array of all the contracts on Polygon Contracts sheet */
    const aPolygonContracts = createArrayFromColumn(contractsSheet, contractsLastRow, contractsColumn, contractsStartRow, contractsColumnsRange)

    /** B]2) filter array will all the contracts into an array with just the good_contracts. 
     *    SO answer here https://stackoverflow.com/questions/70899195/how-to-get-the-first-item-in-nested-filtered-array-in-javascirpt/70899368#70899368
     *    aPolygonContracts has this as an output example:
     *    [[ '0x8ae127d224094cb1b27e1b28a472e588cbcc7620', 0 ],
          [ '0xcbf4ab00b6aa19b4d5d29c7c3508b393a1c01fe3', 0 ],
          [ '0x03cd191f589d12b0582a99808cf19851e468e6b5', 0 ],
          [ '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a', 1 ]]
          need to filter for contracts with for second item (1 or 0),
          then map each sub array to get just the first elememtn */
    const aGood_Contracts = aPolygonContracts.filter(contracts => contracts[1]===1).map(c => c[0]);  // returns an array of just the good contracts

    /** C] create array of all the downloaded contracts that have been confirmed: confirmed_contracts */
    /** filters one array with another
     *  returns an array of contracts that are ready to have their balances recorded in the balances sheet */
    /** SO answer here: https://stackoverflow.com/questions/30389599/comparing-and-filtering-two-arrays */
    const aConfirmed_Contracts = aGood_Contracts.filter(function(e) {
        return aLatest_Contracts.indexOf(e) >-1;
    });

    /** D]1) get array of all the downloaded info, including prices: full_download */
    const aFull_Download = createArrayFromColumn(sourceSheet, sourceLastRow, 2, 2, 4);

    /** D]2) get an array of good contracts and thier data: good_contract_data */
    /** filters the full_download array using the confirmed_contracts array */
    var aGood_Contract_Data = aFull_Download.filter(c => aConfirmed_Contracts.includes(c[0]));
    
    /** D]3) filter good_contracts_data array into just contracts and their pricdes: good_contract_data */
    for (var i = aGood_Contract_Data.length - 1; i >= 0; i--){  // cleans sub arrays to get contracts and balances
        aGood_Contract_Data[i].splice(1,2);
    };

    console.log(aGood_Contract_Data);
    
    

    // console.log(aFull_Download)


    console.log("end fController");
}






/** generic get a columon of data function and return an array */
/** 
 *  .flat() colapses the array of arrays
 *  getRange(row, column, numRows, numColumns)
 */
function createArrayFromColumn(
  _sheet,         // the sheet in question
  _lastRow,       // the last row of data in the sheet
  _columnNum,     // the number of the column in question - the starting column if more than one
  _startingRow,   // 1 is no header, 2 is with header
  _columns        // numbef of colums
  ){ 
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
     fController()
}

