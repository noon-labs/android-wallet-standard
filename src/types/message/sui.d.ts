import type { SuiTransactionBlockResponseOptions } from '@mysten/sui/client';
import type { SuiSignAndExecuteTransactionBlockInput, SuiSignAndExecuteTransactionInput, SuiSignTransactionBlockInput, SuiSignTransactionInput, WalletAccount } from '@mysten/wallet-standard';
import { SUI_METHOD_TYPE } from '../../constants/message/sui';
export type SuiGetAccount = {
    method: typeof SUI_METHOD_TYPE.SUI__GET_ACCOUNT;
    params: unknown;
};
export type SuiSignTransactionBlockSerializedInput = Omit<SuiSignTransactionBlockInput, 'transactionBlock'> & {
    transactionBlockSerialized: string;
};
export type SuiSignTransactionBlock = {
    method: typeof SUI_METHOD_TYPE.SUI__SIGN_TRANSACTION_BLOCK;
    param: SuiSignTransactionBlockSerializedInput;
};
export type SuiSignTransactionSerializedInput = Omit<SuiSignTransactionInput, 'transaction'> & {
    transactionBlockSerialized: string;
};
export type SuiSignTransaction = {
    method: typeof SUI_METHOD_TYPE.SUI__SIGN_TRANSACTION;
    param: SuiSignTransactionSerializedInput;
};
export type SuiSignAndExecuteTransactionBlockSerializedInput = Omit<SuiSignAndExecuteTransactionBlockInput, 'transactionBlock'> & {
    transactionBlockSerialized: string;
};
export type SuiSignAndExecuteTransactionBlock = {
    method: typeof SUI_METHOD_TYPE.SUI__SIGN_AND_EXECUTE_TRANSACTION_BLOCK;
    param: SuiSignAndExecuteTransactionBlockSerializedInput;
};
export type SuiSignAndExecuteTransactionSerializedInput = Omit<SuiSignAndExecuteTransactionInput, 'transaction'> & {
    transactionBlockSerialized: string;
    options?: SuiTransactionBlockResponseOptions;
};
export type SuiSignAndExecuteTransaction = {
    method: typeof SUI_METHOD_TYPE.SUI__SIGN_AND_EXECUTE_TRANSACTION;
    param: SuiSignAndExecuteTransactionSerializedInput;
};
export type SuiSignMessageInput = {
    message: string;
    account: WalletAccount;
};
export type SuiSignMessage = {
    method: typeof SUI_METHOD_TYPE.SUI__SIGN_MESSAGE;
    param: SuiSignMessageInput;
};
export type SuiSignPersonalMessageInput = {
    message: string;
    account: WalletAccount;
};
export type SuiSignPersonalMessage = {
    method: typeof SUI_METHOD_TYPE.SUI__SIGN_PERSONAL_MESSAGE;
    param: SuiSignPersonalMessageInput;
};
export type SuiGetAccountResponse = {
    address: string;
    publicKey: string;
};
//# sourceMappingURL=sui.d.ts.map