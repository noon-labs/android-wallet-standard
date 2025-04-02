import { AptosFeatures, IdentifierArray, WalletIcon, AptosWallet, AptosWalletAccount } from '@aptos-labs/wallet-standard';
declare class AptosStandard implements AptosWallet {
    id?: string | undefined;
    readonly url: string;
    readonly version = "1.0.0";
    readonly name: string;
    readonly icon: WalletIcon;
    readonly chains: IdentifierArray;
    get features(): AptosFeatures;
    accounts: readonly AptosWalletAccount[];
    constructor(name?: string);
}
export { AptosStandard };
//# sourceMappingURL=aptos.d.ts.map