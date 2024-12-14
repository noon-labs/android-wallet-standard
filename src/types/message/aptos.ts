import { AptosChangeNetworkInput, AptosConnectInput, AptosSignAndSubmitTransactionInput, AptosSignMessageInput } from '@aptos-labs/wallet-standard';
import { AnyRawTransaction } from '@aptos-labs/ts-sdk';
import type { APTOS_METHOD_TYPE } from '../../constants/message/aptos';


// no popup
export type AptosIsConnected = {
    method: typeof APTOS_METHOD_TYPE.APTOS__IS_CONNECTED;
    param?: undefined;
    id?: number | string;
};

export type AptosIsConnectedResponse = boolean;

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

export type AptosNetworkResponse = string;

// popup
export type AptosConnect = {
    method: typeof APTOS_METHOD_TYPE.APTOS__CONNECT;
    param: [AptosConnectInput];
    id?: number | string;
};

export type AptosConnectResponse = {
    address: string;
    publicKey: string;
};

export type AptosAccount = {
    method: typeof APTOS_METHOD_TYPE.APTOS__ACCOUNT;
    param?: undefined;
    id?: number | string;
};

export type AptosAccountResponse = AptosConnectResponse;

export type AptosSignPayload<T = unknown> = {
    function: string;
    type: string;
    type_arguments: string[];
    arguments: T[];
};

export type AptosSignTransactionInput = {
    transaction: AnyRawTransaction;
    asFeePayer?: boolean
}

export type AptosSignTransaction = {
    method: typeof APTOS_METHOD_TYPE.APTOS__SIGN_TRANSACION;
    param: AptosSignTransactionInput;
    id?: number | string;
};

export type AptosSignTransactionResponse = string;

export type AptosSignAndSubmitTransaction = {
    method: typeof APTOS_METHOD_TYPE.APTOS__SIGN_AND_SUBMIT_TRANSACTION;
    param: AptosSignAndSubmitTransactionInput;
    id?: number | string;
};

export type AptosSignMessageParams = {
    address?: boolean;
    application?: boolean;
    chainId?: boolean;
    message: string;
    nonce: number;
};

export type AptosSignMessage = {
    method: typeof APTOS_METHOD_TYPE.APTOS__SIGN_MESSAGE;
    param: AptosSignMessageInput;
    id?: number | string;
};

export type AptosSignMessageResponse = {
    address: string;
    application: string;
    chainId: number;
    message: string;
    nonce: number;
    fullMessage: string;
    prefix: string;
    signature: string;
};