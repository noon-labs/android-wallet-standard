import { registerWallet } from "@wallet-standard/wallet";
import { SuiStandard } from "./scripts/sui";
import { AptosStandard } from "./scripts/aptos";



void (() => {
  registerWallet(new SuiStandard());
  registerWallet(new AptosStandard());
  window.lunch = {
    version: '1.0.0',
    handlerInfos: [],
  };

})();
