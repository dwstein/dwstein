/** Airtable API class*/

    class DataForPost {
      constructor(sheetName, tableName){
          this.sheetName = sheetName; // text name of the google sheet tab
          this.tableName = tableName; // text name of the table in Airtable; ex. "Balance Tracking"
          
          /** Airtable Variables */
          this.ss = SpreadsheetApp.getActiveSpreadsheet();
          this.inputsSheet = this.ss.getSheetByName(this.sheetName);
          this.myAPIKey = this.inputsSheet.getRange(9,2).getValue();
          this.baseKey = this.inputsSheet.getRange(10,2).getValue();
          this.cAirtableAPIEndpoint = this.inputsSheet.getRange(11,2).getValue();
          this.payloadFrame = {"records": [{"fields": {}}]};
          this.url = this.cAirtableAPIEndpoint + this.baseKey + "/" + encodeURIComponent(this.tableName);
          };

      /** post data to Airtable */
        atPostTable(_payload){
          this.payloadFrame.records[0].fields = _payload;

          var options = 
              {
                method: "POST",
                headers: {
                  'Authorization' : 'Bearer ' + this.myAPIKey,
                  'Content-Type'  : 'application/json'
                },
                payload : JSON.stringify(this.payloadFrame),
                muteHttpExceptions : true,
                followRedirects: true
              };
          
          var response = UrlFetchApp.fetch(this.cAirtableAPIEndpoint + this.baseKey + "/" + encodeURIComponent(this.tableName), options).getContentText();
          return response
        };
    }

/** covalent API Class */

    class CovalentAPI{
        constructor(_dataType){
            this._dataType = _dataType; // type of data coming from the chain e.x. balances_v2, transactions_v2...et.c
            this.ss = SpreadsheetApp.getActiveSpreadsheet();
            this.sheetName = "Inputs";            
            this.inputsSheet = this.ss.getSheetByName(this.sheetName);    
            this.myAPIKey = this.inputsSheet.getRange(5,1).getValue();
            this.walletAddress = this.inputsSheet.getRange(2,1).getValue();     // wallet address in question
            this.url = "api.covalenthq.com/v1/137/address/" + this.walletAddress + "/" + this._dataType + "/?key=" + this.myAPIKey;
          }
        /** get the raw data from the api */
        getJSONData() {
            var rawAPIResponse = UrlFetchApp.fetch(this.url)
            var jsonResponse = JSON.parse(rawAPIResponse)
            return jsonResponse
        }        
};


    

// api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447

function testCovalentClass(){
  let cCovalentAPI = new CovalentAPI("balances_v2");
  console.log(cCovalentAPI.url)
  console.log(cCovalentAPI.getJSONData());
}


