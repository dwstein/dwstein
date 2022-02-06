const myAPIKey = "API KEY";
const cAirtableAPIEndpoint = "https://api.airtable.com/v0/";
const tableName = "Balance Tracking"
const baseKey = "BASE KEY"

var payload = {
  "records": [

        {
        "fields": {
            "Contract Address": "test",
            "0x8df3aad3a84da6b69a4da8aec3ea40d9091b2ac4": "66699"
        }
        }
  ]
}

function atPostTable_(baseKey, tableName, payload)
{
  var options = 
      {
        method: 'POST',
        headers: {
          'Authorization' : 'Bearer ' + myAPIKey,
          'Content-Type'  : 'application/json'
        },
        payload : JSON.stringify(payload),
        muteHttpExceptions : true,
        followRedirects: true
      };
  var response = UrlFetchApp.fetch(cAirtableAPIEndpoint + baseKey + "/" + encodeURIComponent(tableName), options).getContentText();
  console.log(response);
}

function mainPostRun(){
  atPostTable_(baseKey, tableName, payload)
}
