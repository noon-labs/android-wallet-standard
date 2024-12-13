import { registerWallet } from "@wallet-standard/wallet";
import { SuiStandard } from "./scripts/sui";


void (() => {
  registerWallet(new SuiStandard());
  window.lunch = {
    version: '1.0.0',
    handlerInfos: [],
  };

})();
