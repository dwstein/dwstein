/** code for pulling in the info pologoin balances via covalent api */

/** working exmaple
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 */

  /** example data:
  contract_decimals: 18,
  contract_name: 'Wrapped Matic',
  contract_ticker_symbol: 'WMATIC',
  contract_address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  supports_erc: [ 'erc20' ],
  logo_url: 'https://logos.covalenthq.com/tokens/137/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270.png',
  last_transferred_at: '2022-01-20T22:32:10Z',
  type: 'cryptocurrency',
  balance: '808527631062852515',
  balance_24h: null,
  quote_rate: 1.5479809,
  quote_rate_24h: 1.5602198,
  quote: 1.2515854,
  quote_24h: null,
  nft_data: null. */

/** Assmple the API URL */
    function apiURL (
      _baseURL,         // api.covalenthq.com
      _version,         // v1
      _chainID,         // 137
      _walletAddress,   // 0x4d5aF4843eaCF5C5318E6913f04251b937dbF034
      _infoNature,      // balances_v2
      _cKey             // ckey_22e6256ba15d4d6d8a42df77447
    ){
      const finalAPI = "https://"+ _baseURL + "/" + _version + "/" + _chainID + "/address/" + _walletAddress + "/" + _infoNature + "/?key=" + _cKey;  
      return finalAPI
    };

/** gets final URL */
    function getFinalURL() {
        let baseURL = "api.covalenthq.com";
        let version = "v1";
        let chainID = "137";
        let walletAddress = "0x4d5aF4843eaCF5C5318E6913f04251b937dbF034";
        let infoNature = "balances_v2";
        let cKey = "ckey_22e6256ba15d4d6d8a42df77447"

      let finalURL = apiURL( 
        baseURL,
        version,
        chainID,
        walletAddress,
        infoNature,
        cKey
      )
      console.log(finalURL);
      
      return finalURL
    };

/** get the raw data from the api */
function getRawData(_URL){
  var response = UrlFetchApp.fetch(_URL)
  return response
};

/** clean API Data */
    function cleanAPIData(
      _rawAPIResponse,      // raw api response that needs to be parsed
      _aColumnHeaderList,   // the keys for the final arrays needed for placement in the sheet
      _levelOne,            // first key in object
      _levelTwo){           // second key in object
      var theParsedJSONdata = JSON.parse(_rawAPIResponse)
      // console.log(theParsedJSONdata);
      var aContractData = theParsedJSONdata[_levelOne][_levelTwo];    // returns an array
      /** loop aContractData and put contracts into arrays */
   
exit();
      console.log(contractData);
exit();
      return cleanedAPIData
    }


/** API Controller Funciton */
    /** runs through the other functions in the script */
    function apiControler(){
      let finalURL = getFinalURL();
      let response = getRawData(finalURL);
      let aColumnHeaderList = [ 
        "contract_address",
        "contract_ticker_symbol",
        "balance",
        "quote",
        "type",
        "contract_decimals",
        "contract_name",
        "last_transferred_at"];
      let cleanedAPIData = cleanAPIData(response, aColumnHeaderList, "data", "items");
      console.log(cleanedAPIData);

    }

/** runs Covalent_API.gs */
function runCovalent_API(){
  apiControler()
}

// exit();
// let rawAPIPull = function rawZapperAPIdata(walletAddress, networkName, sProtocal) {
//             console.log("rawAPIdata from runAAVEMain")
//             var apiKEY = "96e0cc51-a62e-42ca-acee-910ea7d2a241"; // API key from Zapper
//             var url = "https://api.zapper.fi/v1/staked-balance/single-staking?addresses%5B%5D=" + walletAddress + "&network=" + networkName + "&api_key=" + apiKEY; // assembles the API URL with the wallet addressa, network and name
//             console.log(url);
//             var response = UrlFetchApp.fetch(url)
//             return response
//         };

// function runDataPull(
//   walletAddress,      /** the wallet adress that's the subject of the querry */
//   networkName,        /** the blockchaing being used; i.e. polygon */
//   sProtocal,          /** the smartcontract being used.  e.s. aave, quickswap, sushiswap...etc. */
//   sTargetSheetName,   /** name of the taret sheet where the data pull will end up */
//   stampRow,           /** the row for the time stamp */
//   stampColumn,        /** the oclumn for the time stamp */
//   sNameingKey,        /** the key in the object to rename they keys (ex. sympbol:DAI) */
//   stampSheet,         /** name of the sheet where the time stmape will go; i.e. Control Sheet */
//   arrayBreak,         /** funciton expression that gets at the correct JSON level */
//   rawAPIPull){        /** funciton expression that assempbles the correct url and hits the API */

//   let rawApiResponse = rawAPIPull (walletAddress,networkName, sProtocal);// function expression - hit the api and get raw JSON repsonse
//   let parsedJson = parseTheAPI(rawApiResponse); /** in Genearl Functions file *  parse the JSON response */
//   console.log(parsedJson)
//   let neededArrayRaw = arrayBreak(parsedJson,walletAddress) /** function expression from arguments */

//   let final2DArray = processArrayIntoPairs(neededArrayRaw, sNameingKey); /** renames keys, check for debt, process into pairs */
 
//   placeFinalArryInSheet(final2DArray, sTargetSheetName, walletAddress, networkName)//place the array onto the sheet
//   timeStamp(stampSheet,stampRow,stampColumn,1,1) // general functions
// }; /** end runDataPUll */
