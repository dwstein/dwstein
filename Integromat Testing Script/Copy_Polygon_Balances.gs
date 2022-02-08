/** need to rewrite using objets more than arrays
 *  * dot notation easier to read and maintain than array indexes*/
/** start the script with runMain() using the pulldown menu above */

/** 
 * purpose of this script:
 * Go through the most recent balance pull from the Polygon API
 * Put the latest data into the balances sheet
*/

/** Conventions
 *  local _arguments
 *  aArrays for arrays
 *  oObjects for objects
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
 *          E]1)a) grab array of current target headers (contracts): aTarget_Contracts
 *          E]1)b) if recently pulled contracts no in targe sheet, add the needed column
 *    E]2) once all columns are there, put the balances in the last row
 *          E]2)a) - get an array of contract headers that includes new contracts: aFinal_Contract_Headers
 *          E]2)b) - get the final balances into the proper order: aFinal_Balances
 *          E]2)c) - add the time stamp to the front of the aFinal_Balances array
 *          E]2)d) - put the final balances into Balance Tracking Sheet
 * F] fController() - controler function - called by main - runs the funcitons in order
 * G] runMain() -  main fuction
 */


/** F] controller() - controler function - called by main - runs the funcitons in order */
/** copies data form Raw Polygon Pull to Balance Tracking: copyPolygonController*/
function copyPolygonController(){
  /** GENERAL VARIABLES */
      

      /** sheet names */
        let ss = SpreadsheetApp.getActiveSpreadsheet();           // get active spredsheet
        let sourceSheetName = "Raw Polygon Pull";
        let approvedContractsSheetName = "Polygon Contracts"
        let targetSheetName = "Balance Tracking";
        let inputsSheetName = "Inputs";

      /** Airtabel Variables */
        let inputsSheet = ss.getSheetByName(inputsSheetName);
        let myAPIKey = inputsSheet.getRange(9,2).getValue();
        const cAirtableAPIEndpoint = "https://api.airtable.com/v0/"
        const tableName = "Balance Tracking";
        let baseKey = inputsSheet.getRange(10,2).getValue();
        // paylod is composed below
       

      
      /** source sheet info. sheet = "Raw Polygon Pull" -  where the raw data from the api lands */
        let sourceSheet = ss.getSheetByName(sourceSheetName);     // the source of the latest balance pull
        let sourceStartColumn = 2                                 // column with the contract addresses
        let sourceStartRow = 2                                    // 1 = no header, 2 = header
        let sourceColumnsRange = 1;                               // number of columns
        let sourceLastRow = sourceSheet.getLastRow() - sourceStartRow + 1;  
        let sourceTimeRange = sourceSheet.getRange(2,1);
        let sourceTimeStamp = sourceTimeRange.getValue();

      /** Full Download variables */
        let fullDownloadStartColumn = 1
        let fullDownloadColumnsRange = 7;     //  moved to 7 to get the decimals

      /**   Approved contracts variables from "Polygon Contrats" sheet
        sheet with the list of approved contracts.  Determine what token balances are tracked. */
        let approvedContractsSheet = ss.getSheetByName(approvedContractsSheetName);
        let approvedContractsRowsTotal = approvedContractsSheet.getLastRow() - 1;
        let approvedContractsStartColumn = 1;     // contracts are in the first column
        let approvedContractsStartRow = 2;
        let approvedContractsColumnsRange = 2;    // need two collumns: contracts and weather or not we're tracking them
      
      /**   Balance Tracking sheet variables; i.e. the targe sheet variables */
        /** top row will have contract addresses */
        let targetSheet = ss.getSheetByName(targetSheetName); 
        /** contracts array for cleaning data for aTarget_Contracts */
            let targetContractsColumn = 2;     // target sheet contracts start in second column       
            let targetContractsRow = 1;        // contract addreses are in the first row
            let targetContractsHeadersColumns = targetSheet.getLastColumn() - 1;  // total columns where contract addresses are stored
        /** for putting the final filtered balances into the balances sheet called Balance Tracking */
            let targetContractsHeadersRows = 1;   // number of rows deep for the contract headers
            let targetStartColumn = 1;    // time stamp in the first column, recorded balances start in second column
            let targetStartRow = 5;       // recorded balances start in the 5th row
            let targetRange = targetSheet.getDataRange();       // get the entire range of the target sheet
            let targetLastRow = targetSheet.getLastRow();
            let targetLastColumn = targetSheet.getLastColumn();
  
  /** FUNCTION OPERATIONS */
    /** A] create array of all the conracts from the latest data pull: aSource_Contracts */
      var aSource_Contracts = turnRangeIntoArray(
          sourceSheet, 
          sourceStartRow, 
          sourceStartColumn, 
          sourceLastRow, 
          sourceColumnsRange);
      
      
  
  
    /** B]1) create an array of all the contracts (polygon contracts sheet) aAll_Polygon_Contracts  */
      var aAll_Polygon_Contracts = turnRangeIntoArray(
        approvedContractsSheet, 
        approvedContractsStartRow, 
        approvedContractsStartColumn, 
        approvedContractsRowsTotal, 
        approvedContractsColumnsRange);

    /** B]2) filter array will all the contracts into an array with just the aFiltered_Polygon_Contracts.
      filters for just contracts that are approved and then removed the send element in the array
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

    /** D]1) get array of all the most recent downloaded info, including prices: aGross_Recent_Pull */
      const aGross_Recent_Pull = turnRangeIntoArray(
            sourceSheet, 
            sourceStartRow,
            fullDownloadStartColumn,
            sourceLastRow,
            fullDownloadColumnsRange
            );

    /** D]2) get an array of good contracts and their gross data: aGood_Gross_Contract_Data */
          /** filters the full_download array using the confirmed_contracts array */
          var aGood_Gross_Contract_Data = aGross_Recent_Pull.filter(c => aConfirmed_Contracts.includes(c[1])); // contracts are the second item


          /** turning the balances into numbers that we can use; i.e. divide the balances by the decimals */
          /** Dividing the balance (which is a very large integer) by 10 rased to the decimals */
          function divideByDecimal(){
            z = 0;
              for (var n = aGood_Gross_Contract_Data.length - 1; n >= 0; n--){
                z = Number(aGood_Gross_Contract_Data[n][3]) / (10**Number(aGood_Gross_Contract_Data[n][6]));
                aGood_Gross_Contract_Data[n][3] = z;
              }
            return aGood_Gross_Contract_Data
          };
          var aGood_Gross_Contract_Data = divideByDecimal(aGood_Gross_Contract_Data);


    /** D]3) filter aGood_Gross_Contract_Data array into just contracts and their balances: aGood_Net_Contract_Data */
        /** SO info here: https://stackoverflow.com/questions/9425009/remove-multiple-elements-from-array-in-javascript-jquery */
        /** removing data based on "Raw Polygon Pull" sheet */
          var aRemoveValFromIndex = [0, 2, 4, 5, 6]; // the elemnts of the sub arrays removed to leave contract and balance
          var aGood_Net_Contract_Data = []; 
          for (var z = aGood_Gross_Contract_Data.length - 1; z >= 0; z--){  // loop through the entire 2D array
              var aIndividualContract = [];
              var aIndividualContract = aGood_Gross_Contract_Data[z];      
              for (var n = aRemoveValFromIndex.length -1; n>=0; n--) {      // loop thorugh the sub array and remove unwanted data
                  aIndividualContract.splice(aRemoveValFromIndex[n],1);
              };
               aGood_Net_Contract_Data[z] = aIndividualContract;         // array of cleaned contracts and their balances
          };

    /** AIRTABLE POST */

            /** create an object of contracts and balances for posting to airtable  */
            let oNetContracts = arr2obj(aGood_Gross_Contract_Data);

            /** initialize payload data with a bit of test data.  Overwritten later */
            var payload = {
                "records": [
                      {
                        "fields": {
                          "Contract Address": "test",
                            "0x8df3aad3a84da6b69a4da8aec3ea40d9091b2ac4": "6665"
                        }
                      }
                ]
            }
            /** adds the TimeStamp for the data */
            oNetContracts["TimeStamp"] = sourceTimeStamp;

            /** overwrite the "fields" value with the object containing the latest contract and balances */
            payload.records[0].fields = oNetContracts;

            /** Post the contracts and balances to Airtable via API: in General Functions */
            atPostTable(
                baseKey,             // the key for the airtable base; provided by Airtable
                tableName,           // text name of the table; ex. "Balance Tracking"
                payload,             // an object that has the data to be sent to airtable
                myAPIKey,            // api key from airtable
                cAirtableAPIEndpoint // api endpoint form airtable
                );



    /** E]1)a) grab array of current target headers (contracts): aTarget_Contracts */
        var aTarget_Contracts = turnRangeIntoArray(
          targetSheet, 
          targetContractsRow, 
          targetContractsColumn, 
          targetContractsRow, 
          targetContractsHeadersColumns).flat(); // getRange(row, column, numRows, numColumns)

    /** E]1)b) if recently pulled contracts are not in targe sheet, add the needed columns */
        var aMissing_Contracts = [];
        // go through every good contract, see if it's in the target sheet, if no, put in aMissing_Contracts
        for (var b = aGood_Net_Contract_Data.length - 1; b >= 0; b--) {
            if (!aTarget_Contracts.includes(aGood_Net_Contract_Data[b][0])) {
                aMissing_Contracts.push(aGood_Net_Contract_Data[b][0]);
            };
        }; 

        if (aMissing_Contracts.length >0) {       // are there any missing contracts?
            /** turn aMissing_contracts into 2d array: aTwoDMissing_Contracts */
            var aTwoDMissing_Contracts = [];
            aTwoDMissing_Contracts[0] = aMissing_Contracts; // creates 2d array with one "row"
            let targetContractsRange = targetSheet.getRange(
              targetContractsRow,
              targetLastColumn + 1, 
              targetContractsHeadersRows, 
              aMissing_Contracts.length);                        
            targetContractsRange.setValues(aTwoDMissing_Contracts);
        };

    /** E]2)a) - get an array of contract headers that includes new contracts: aFinal_Contract_Headers */
        targetLastColumn = targetSheet.getLastColumn(); // update to include any additional contrats
        var aFinal_Balances = turnRangeIntoArray(
          targetSheet,
          targetContractsRow,
          targetContractsColumn,                        // need to start in column 2
          targetContractsHeadersRows,
          targetContractsHeadersColumns                 // last column - 1 to account for starting in column 2
        ).flat();     // rmeoves outer array

    /** E]2)b) - get the final balances into the proper order: aFinal_Balances_Ordered */
        // aGood_Net_Contract_Data has the contract data
        /** converts 2D arry into object where contracts can be the key */
        oGood_Net_Contract_Data = Object.fromEntries(aGood_Gross_Contract_Data); 

        var aFinal_Balances_Ordered = [];
        for  (var q = 0; q <= aFinal_Balances.length - 1; q++) {  // loop through final contracts to get the proper order
            var finalIndex = aFinal_Balances.indexOf(aFinal_Balances[q]);  // get the index of the final balances, in order
            var keyNeeded = aFinal_Balances[finalIndex];   // get the key for the object
            aFinal_Balances_Ordered.push(oGood_Net_Contract_Data[keyNeeded]);  // using square brakcets because the keys start with numbers
        };
   
    
    /** E]2)c) - add the time stamp to the front of the aFinal_Balances array */
      // sourceTimeStam
      aFinal_Balances_Ordered.unshift(sourceTimeStamp);
  
    /** E]2)d) - put the final balances into Balance Tracking Sheet */
      let finalBalanceRange = targetSheet.getRange(
          targetLastRow + 1,      // add 1 otherwise it all goes into the headers
          targetStartColumn, 
          targetContractsHeadersRows, 
          aFinal_Balances_Ordered.length
      );
      var aTwoDFinal_Balances_Ordered = [];
      aTwoDFinal_Balances_Ordered[0] = aFinal_Balances_Ordered;
      finalBalanceRange.setValues(aTwoDFinal_Balances_Ordered);


console.log("end fController");
};

/** get range and turn into an array */
// getRange(row, column, numRows, numColumns)
function turnRangeIntoArray(
    _sheet,
    _startRow,
    _startColumn,
    _totalRows,
    _totalColumns       
    ){
    theRange = _sheet.getRange(_startRow, _startColumn, _totalRows , _totalColumns);
    returnArray = theRange.getValues();
    return returnArray;
}

/** 
 * kicks off the script
 */
function runPolygonMain() {
     copyPolygonController()
}

/** for testing the post */
// function testPayload(){

//   const payload = {
//         "records": [

//               {
//               "fields": {
//                   "Contract Address": "testpm",
//                   "0x8df3aad3a84da6b69a4da8aec3ea40d9091b2ac4": "166699"
//               }
//               }
//         ]
//       };

//   return payload
// }




