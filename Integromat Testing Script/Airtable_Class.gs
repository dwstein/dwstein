/** class to for posting data to Airtable via API */

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



function runAirtable_class(){
  let testy = new DataForPost("Inputs", "AAVE Download");
  console.log(testy.atPostTable({"TimeStamp" : "no fcking way"}));
  }



