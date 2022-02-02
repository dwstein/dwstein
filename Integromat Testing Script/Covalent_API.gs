/** code for pulling in the info pologoin balances via covalent api */

/** working exmaple
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 * api.covalenthq.com/v1/137/address/0x4d5aF4843eaCF5C5318E6913f04251b937dbF034/balances_v2/?key=ckey_22e6256ba15d4d6d8a42df77447
 */

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
function getRawData(_URL_){

};
