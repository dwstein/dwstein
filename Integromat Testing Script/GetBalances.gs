/** start the script with runMain() using the pulldown menu above */

/** 
 * purpose of this script:
 * Go through the most recent balance pull from the API
 * Put the latest data inot the balances sheet
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
    let sLastRow = sourceSheet.getLastRow()      
    let sourceColumn = "B"                                    // column with the contract addresses


    // targe sheet info
    let targetSheet = ss.getSheetByName(_targetSheetName);    // the ultimate target sheet of the data pull
    let targetRange = targetSheet.getDataRange();             // get the entire range of the target sheet
    let tLastRow = targetSheet.getLastRow()
    
    // A] create array of all the conracts from the latest data pull: latest_contracts
    aLatest_contracts = getLatestContracts(sourceSheet, sLastRow)

    // B] create an array of all the good contracts: good_contracts
    // C] create array of all the downloaded contracts that have been confirmed: confirmed_contracts 
    // D] starting with confirmed_contracts, go through latest download sheet and create array of balances: final_balances
    //E] put final_balances into "Balance Tracking sheet"   
    
    console.log("end fController")
}


/** A] create array of all the conracts from the latest data pull: latest_contracts */
function getLatestContracts(_sourceSheet, _sLastRow, _sourceColumn){
    console.log(_sLastRow)

    return aLatest_Contracts

}



/** depricated - finds the next available row in a sheet */
function runCopyToDailyScript(_sourceSheetName,_targetSheetName){
    let ss = SpreadsheetApp.getActiveSpreadsheet();           // get active spredsheet
    let sourceSheet = ss.getSheetByName(_sourceSheetName);
    let targetSheet = ss.getSheetByName(_targetSheetName);
    let nextTargetRow = targetSheet.getLastRow() + 1; // where the next row of data is going

    //console.log(_sourceSheetName)
}

/** 
 * kicks off the script
 */
function runMain() {
    let sourceSheetName = "Raw Polygon Pull";
    let targetSheetName = "Balance Tracking";
    fController(sourceSheetName, targetSheetName)
}

