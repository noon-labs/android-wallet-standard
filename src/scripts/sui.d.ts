import { type IdentifierArray, type Wallet, type WalletAccount, type WalletIcon } from '@mysten/wallet-standard';
declare class SuiStandard implements Wallet {
    readonly version = "1.0.0";
    readonly name: string;
    readonly icon: WalletIcon;
    readonly chains: IdentifierArray;
    features: Readonly<Record<`${string}:${string}`, unknown>>;
    accounts: readonly WalletAccount[];
    constructor();
}
export { SuiStandard };
//# sourceMappingURL=sui.d.ts.map