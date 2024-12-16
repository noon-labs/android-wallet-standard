import { AptosChangeNetworkInput, AptosConnectInput, AptosSignAndSubmitTransactionInput, AptosSignMessageInput } from '@aptos-labs/wallet-standard';
import { AnyRawTransaction } from '@aptos-labs/ts-sdk';
import type { APTOS_METHOD_TYPE } from '../../constants/message/aptos';
export type AptosDisconnect = {
    method: typeof APTOS_METHOD_TYPE.APTOS__DISCONNECT;
    param?: undefined;
    id?: number | string;
};
export type AptosDisconnectResponse = null;
export type AptosNetwork = {
    method: typeof APTOS_METHOD_TYPE.APTOS__NETWORK;
    param?: undefined;
    id?: number | string;
};
export type AptosChangeNetwork = {
    method: typeof APTOS_METHOD_TYPE.APTOS__CHANGE_NETWORK;
    param: AptosChangeNetworkInput;
    id?: number | string;
};
export type AptosConnect = {
    method: typeof APTOS_METHOD_TYPE.APTOS__CONNECT;
    param: [AptosConnectInput];
    id?: number | string;
};
export type AptosAccount = {
    method: typeof APTOS_METHOD_TYPE.APTOS__ACCOUNT;
    param?: undefined;
    id?: number | string;
};
export type AptosAccountResponse = {
    address: string;
    publicKey: string;
};
export type AptosSignTransactionInput = {
    transaction: AnyRawTransaction;
    asFeePayer?: boolean;
};
export type AptosSignTransaction = {
    method: typeof APTOS_METHOD_TYPE.APTOS__SIGN_TRANSACION;
    param: AptosSignTransactionInput;
    id?: number | string;
};
export type AptosSignAndSubmitTransaction = {
    method: typeof APTOS_METHOD_TYPE.APTOS__SIGN_AND_SUBMIT_TRANSACTION;
    param: AptosSignAndSubmitTransactionInput;
    id?: number | string;
};
export type AptosSignMessage = {
    method: typeof APTOS_METHOD_TYPE.APTOS__SIGN_MESSAGE;
    param: AptosSignMessageInput;
    id?: number | string;
};
//# sourceMappingURL=aptos.d.ts.map