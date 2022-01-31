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
 *    E]1) check to see if contracts in latest pull are in the balance sheet
 *          E]1)a) grab array of current target headers (contracts): targe_headers
 *          E]1)b) if not there, add the needed column
 *    E]2) once all columns are there, put the balances in the last row
 * F] fController() - controler function - called by main - runs the funcitons in order
 * G] runMain() -  main fuction
 */


/** F] fController() - controler function - called by main - runs the funcitons in order */
function fController(){
  /** General Variables */
      /** sheet names */
        let ss = SpreadsheetApp.getActiveSpreadsheet();           // get active spredsheet
        let sourceSheetName = "Raw Polygon Pull";
        let approvedContractsSheetName = "Polygon Contracts"
        let targetSheetName = "Balance Tracking";
      
      /** source sheet info. sheet = "Raw Polygon Pull" -  where the raw data from the api lands */
        let sourceSheet = ss.getSheetByName(sourceSheetName);     // the source of the latest balance pull
        let sourceLastRow = sourceSheet.getLastRow();     
        let sourceStartColumn = 2                                 // column with the contract addresses
        let sourceStartRow = 2                                    // 1 = no header, 2 = header
        let sourceColumnsRange = 3;                               // column range from A - netted out against start column

      /** Full Download variables */
        let fullDownloadStartColumn = 1
        let fullDownloadColumnsRange = 5;

      /**   Approved contracts variables from "Polygon Contrats" sheet
        sheet with the list of approved contracts.  Determine what token balances are tracked. */
        let approvedContractsSheet = ss.getSheetByName(approvedContractsSheetName);
        let approvedContractsLastRow = approvedContractsSheet.getLastRow();
        let approvedContractsStartColumn = 1;     // contracts are in the first column
        let approvedContractsStartRow = 2;
        let approvedContractsColumnsRange = 3;    // need two collumns: contracts and weather or not we're tracking them
      
      /**   Balances sheet vaiables; i.e. the targe sheet variables */
          /** top row will have contract addresses */
          let targetSheet = ss.getSheetByName(targetSheetName); 
          let targetStartColumn = 2;                                // target contracts start in second column   
          let targetStartRow = 1;                                   // target headers are in the first row
          let targetHeaderRows = 1;                                    // putting in for last row for target headrs array
          let targetRange = targetSheet.getDataRange();             // get the entire range of the target sheet
          let targetLastRow = targetSheet.getLastRow();
          let targetLastColumn = targetSheet.getLastColumn();

  /** A] create array of all the conracts from the latest data pull: source_contracts */
    var aSource_Contracts = turnRangeIntoArray(
        sourceSheet, 
        sourceStartRow, 
        sourceStartColumn, 
        sourceLastRow, 
        sourceColumnsRange);
 
  /** B]1) create an array of all the contracts (polyong contracts sheet) aAll_Polygon_Contracts  */
    var aAll_Polygon_Contracts = turnRangeIntoArray(
      approvedContractsSheet, 
      approvedContractsStartRow, 
      approvedContractsStartColumn, 
      approvedContractsLastRow, 
      approvedContractsColumnsRange);

  /** B]2) filter array will all the contracts into an array with just the aFiltered_Polygon_Contracts.
   *      filters for just contracts that are approved and then removed the send element in the array
          SO answer here https://stackoverflow.com/questions/70899195/how-to-get-the-first-item-in-nested-filtered-array-in-javascirpt/70899368#70899368
          aAll_Polygon_Contracts has this as an output example:
          [[ '0x8ae127d224094cb1b27e1b28a472e588cbcc7620', 0 ],
          [ '0xcbf4ab00b6aa19b4d5d29c7c3508b393a1c01fe3', 0 ],
          [ '0x03cd191f589d12b0582a99808cf19851e468e6b5', 0 ],
          [ '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a', 1 ]]
          need to filter for contracts with for second item (1 or 0),
          then map each sub array to get just the first elememtn */
    var aFiltered_Polygon_Contracts = aAll_Polygon_Contracts.filter(contracts => contracts[1]===1).map(c => c[0]);  
    

  /** C] create array of intersection of recent download contracts and approved contracts: aConfirmed_Contracts */
        /** filters one array with another
        /** SO answer here: https://stackoverflow.com/questions/30389599/comparing-and-filtering-two-arrays */
    var aConfirmed_Contracts = aFiltered_Polygon_Contracts.filter(function(e) {
        return aFiltered_Polygon_Contracts.indexOf(e) >-1;
    });
    console.log(aConfirmed_Contracts);
    console.log("end aConfirmed_Contracts")

  /** D]1) get array of all the most recent downloaded info, including prices: aGross_Recent_Pull */
    const aGross_Recent_Pull = turnRangeIntoArray(
          sourceSheet, 
          sourceStartRow,
          fullDownloadStartColumn,
          sourceLastRow,
          fullDownloadColumnsRange
          );


  /** D]2) get an array of good contracts and thier data: good_contract_data */
        /** filters the full_download array using the confirmed_contracts array */
        var aGood_Contract_Data = aGross_Recent_Pull.filter(c => aConfirmed_Contracts.includes(c[0]));

        console.log(aGood_Contract_Data)
        console.log("aGood_contract_Data")

    
  /** D]3) filter good_contracts_data array into just contracts and their pricdes: good_contract_data */
        for (var i = aGood_Contract_Data.length - 1; i >= 0; i--){  // cleans sub arrays to get just the contracts and balances
            aGood_Contract_Data[i].splice(1,2);  // deletes the middle two of 4 items (starts at 1 and deltes 2)
        };
        // console.log(aGood_Contract_Data);
    
  /** E]1)a) grab array of current target headers (contracts): targe_headers */
      /** need to replace hard code arguments with variables */
      // const test_array = turnRangeIntoArray(targetSheet, 1, 2, 1, targetLastColumn)
      // console.log(test_array);

  /** 1 - get an array of the target headers
      *  2 - get an array of the balances that is ordered exactly like the target headers
      *  3 - put a time-stamp at the front of the balances
      *  4 - place the array of the time-stamped balances in the last row of the balances tab
      */

  console.log("end fController");
}


/** get range and turn into an array */
// getRange(row, column, numRows, numColumns)
function turnRangeIntoArray(
    _sheet,
    _startRow,
    _startColumn,
    _totalRows,
    _totalColumns       /** columns starting from column A.  If you want collumns C, D, and E start column is 3 and total collumns is 6 */
    ){
    theRange = _sheet.getRange(_startRow, _startColumn, _totalRows - _startRow + 1, _totalColumns - _startColumn);
    returnArray = theRange.getValues();
    return returnArray;
}

/** generic get a columon of data function and return an array */
/** 
 *  .flat() colapses the array of arrays
 *  getRange(row, column, numRows, numColumns)
 */

/** NEED TO REPLACE ALL REFERENCES TO THSI WITH THE NEW GENERIC FUNCTION */
                // function createArrayFromColumn(
                //   /** this can be refactored into a general get arary-from-sheet function */
                //   _sheet,         // the sheet in question
                //   _lastRow,       // the last row of data in the sheet
                //   _columnNum,     // the number of the column in question - the starting column if more than one
                //   _startingRow,   // 1 is no header, 2 is with header
                //   _columns        // number of colums
                //   ){ 
                //     if (_startingRow = 2) {
                //         _lastRow = _lastRow -1;       // if there's a header, need to cut the range down
                //     };
                //     contractsRange = _sheet.getRange(_startingRow, _columnNum, _lastRow, _columns);

                //     // if there's more than one collumn, don't flattan the array of arrays
                //     if (_columns > 1) {
                //       aArrayFromColumn = contractsRange.getValues();
                //       return aArrayFromColumn
                //     } else {
                //       aArrayFromColumn = contractsRange.getValues().flat();
                //       return aArrayFromColumn
                //     }
                // }



/** 
 * kicks off the script
 */
function runMain() {
     fController()
}

