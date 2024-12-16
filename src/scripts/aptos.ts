import { v4 as uuidv4 } from 'uuid';


import { APP_NAME as WALLET_NAME, ICON as WALLET_ICON } from "../constants/constants";
import {
    APTOS_MAINNET_CHAIN, APTOS_TESTNET_CHAIN,
    AptosFeatures,
    AptosConnectInput, AptosConnectNamespace, AptosConnectOutput,
    IdentifierArray, UserResponse,
    WalletIcon,
    AptosDisconnectNamespace,
    AptosGetNetworkNamespace,
    AptosSignTransactionNamespace,
    AptosSignAndSubmitTransactionNamespace,
    AptosSignMessageNamespace,
    AptosOnAccountChangeNamespace,
    AptosOnNetworkChangeNamespace,
    AptosGetAccountNamespace,
    AptosChangeNetworkNamespace,
    AptosConnectMethod,
    AptosDisconnectMethod,
    AptosGetNetworkMethod,
    AptosGetNetworkOutput,
    AptosGetAccountMethod,
    AptoGetsAccountOutput,
    AptosSignAndSubmitTransactionMethod,
    AptosSignAndSubmitTransactionInput,
    AptosSignAndSubmitTransactionOutput,
    AptosSignTransactionMethod,
    AptosSignTransactionOutput,
    AptosSignMessageMethod,
    AptosSignMessageInput,
    AptosSignMessageOutput,
    AptosOnAccountChangeMethod,
    AptosOnAccountChangeInput,
    AptosOnNetworkChangeMethod,
    AptosOnNetworkChangeInput,
    AptosChangeNetworkMethod,
    AptosChangeNetworkInput,
    AptosChangeNetworkOutput,
    AptosWallet,
    AptosWalletAccount,
    AccountInfo,
    UserResponseStatus,
    NetworkInfo
} from '@aptos-labs/wallet-standard';
import { AnyRawTransaction, SigningScheme, AccountAddress, Ed25519PublicKey } from '@aptos-labs/ts-sdk';
import { LINE_TYPE } from '../constants/chain';
import { MESSAGE_TYPE } from '../constants/message';
import { APTOS_METHOD_TYPE } from '../constants/message/aptos';
import { AptosListenerType, AptosRequestMessage, ContentScriptToNativeEventMessage, ListenerMessage, ResponseMessage } from '../types/message';
import { AptosAccountResponse } from '../types/message/aptos';
import { fromBase64 } from "@mysten/bcs";

const request = (message: AptosRequestMessage) =>
    new Promise((res, rej) => {
        const messageId = uuidv4();

        const handler = (event: MessageEvent<ContentScriptToNativeEventMessage<ResponseMessage, AptosRequestMessage>>) => {
            if (event.data?.isLunch && event.data?.type === MESSAGE_TYPE.RESPONSE__NATIVE_TO_CONTENT_SCRIPT && event.data?.messageId === messageId) {
                window.removeEventListener('message', handler);

                const { data } = event;
                console.log(event.data?.messageId, ", data: ", data);
                if (data.response?.error) {
                    rej(data.response.error);
                } else {
                    res(data.response.result);
                }
            }
        };

        window.addEventListener('message', handler);
        window.LunchHandler.performNativeTask(
            LINE_TYPE.APTOS,
            messageId,
            JSON.stringify(message)
        );
    });

const on = (eventName: AptosListenerType, eventHandler: (data: unknown) => void) => {
    const handler = (event: MessageEvent<ListenerMessage<ResponseMessage>>) => {
        if (event.data?.isLunch && event.data?.type === eventName && event.data?.line === LINE_TYPE.APTOS) {
            if (eventName === 'accountChange' && !event.data?.message?.result) {
                void (async () => {
                    try {
                        const account = (await request({ method: APTOS_METHOD_TYPE.APTOS__ACCOUNT })) as AccountInfo;

                        eventHandler(account);
                    } catch {
                        eventHandler('');
                    }
                })();
            } else {
                eventHandler(event.data?.message?.result);
            }
        }
    };

    window.addEventListener('message', handler);

    window.lunch.handlerInfos.push({ line: LINE_TYPE.APTOS, eventName, originHandler: eventHandler, handler });
};

const off = (eventName: AptosListenerType, eventHandler?: (data: unknown) => void) => {
    const handlerInfos = window.lunch.handlerInfos.filter(
        (item) => item.line === LINE_TYPE.APTOS && item.eventName === eventName && item.originHandler === eventHandler,
    );
    const notHandlerInfos = window.lunch.handlerInfos.filter(
        (item) => !(item.line === LINE_TYPE.APTOS && item.eventName === eventName && item.originHandler === eventHandler),
    );

    handlerInfos.forEach((handlerInfo) => {
        window.removeEventListener('message', handlerInfo.handler);
    });

    window.lunch.handlerInfos = notHandlerInfos;
};

const connect: AptosConnectMethod =
    (...args: AptosConnectInput): Promise<UserResponse<AptosConnectOutput>> => {
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__CONNECT,
                param: [args]
            })
                .then(result => {
                    const account = aptosAccountResponseToAccountInfo(result as AptosAccountResponse)
                    console.log('account:', account)
                    resolve({
                        status: UserResponseStatus.APPROVED,
                        args: account
                    })
                })
                .catch(error =>
                    reject({
                        message: error,
                        state: UserResponseStatus.REJECTED
                    })
                );
        });
    };

const disconnect: AptosDisconnectMethod =
    (): Promise<void> => {
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__DISCONNECT,
            })
                .then(_ =>
                    resolve()
                )
                .catch(error =>
                    reject(error)
                );
        });
    };

const network: AptosGetNetworkMethod =
    (): Promise<AptosGetNetworkOutput> => {
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__NETWORK,
            })
                .then(result => resolve(result as AptosGetNetworkOutput))
                .catch(error => reject(error));
        });
    };

const account: AptosGetAccountMethod =
    (): Promise<AptoGetsAccountOutput> => {
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__ACCOUNT
            })
                .then(result => {
                    const account = aptosAccountResponseToAccountInfo(result as AptosAccountResponse)
                    console.log('account:', account)
                    resolve(account)
                })
                .catch(error =>
                    reject(error)
                );
        });
    };

const signAndSubmitTransaction: AptosSignAndSubmitTransactionMethod =
    (transaction: AptosSignAndSubmitTransactionInput): Promise<UserResponse<AptosSignAndSubmitTransactionOutput>> => {
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__SIGN_AND_SUBMIT_TRANSACTION,
                param: transaction
            })
                .then(result =>
                    resolve({
                        status: UserResponseStatus.APPROVED,
                        args: result as AptosSignAndSubmitTransactionOutput
                    })
                )
                .catch(error =>
                    reject({
                        message: error,
                        state: UserResponseStatus.REJECTED
                    })
                );
        });
    };

const signTransaction: AptosSignTransactionMethod =
    (transaction: AnyRawTransaction, asFeePayer?: boolean): Promise<UserResponse<AptosSignTransactionOutput>> => {
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__SIGN_TRANSACION,
                param: {
                    transaction: transaction,
                    asFeePayer: asFeePayer
                }
            })
                .then(result =>
                    resolve({
                        status: UserResponseStatus.APPROVED,
                        args: result as AptosSignTransactionOutput
                    })
                )
                .catch(error =>
                    reject({
                        message: error,
                        state: UserResponseStatus.REJECTED
                    })
                );
        });
    };

const signMessage: AptosSignMessageMethod =
    (input: AptosSignMessageInput): Promise<UserResponse<AptosSignMessageOutput>> => {
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__SIGN_MESSAGE,
                param: input
            })
                .then(result =>
                    resolve({
                        status: UserResponseStatus.APPROVED,
                        args: result as AptosSignMessageOutput
                    })
                )
                .catch(error =>
                    reject({
                        message: error,
                        state: UserResponseStatus.REJECTED
                    })
                );
        });
    };

const onAccountChange: AptosOnAccountChangeMethod =
    async (input: AptosOnAccountChangeInput): Promise<void> => {
        console.log("onAccountChange function called")
        const result = (await request({ method: APTOS_METHOD_TYPE.APTOS__ACCOUNT })) as AptosAccountResponse;
        const account = aptosAccountResponseToAccountInfo(result)
        console.log('account:', account)
        input(account)
    };

const onNetworkChange: AptosOnNetworkChangeMethod =
    async (input: AptosOnNetworkChangeInput): Promise<void> => {
        console.log("onNetworkChange function called")
        const result = (await request({ method: APTOS_METHOD_TYPE.APTOS__NETWORK })) as AptosGetNetworkOutput;
        const network = JSON.parse(JSON.stringify(result))
        console.log('network:', network)
        input(network)
    };

const changeNetwork: AptosChangeNetworkMethod =
    (input: AptosChangeNetworkInput): Promise<UserResponse<AptosChangeNetworkOutput>> => {
        console.log("changeNetwork function called")
        return new Promise((resolve, reject) => {
            request({
                method: APTOS_METHOD_TYPE.APTOS__CHANGE_NETWORK,
                param: input
            })
                .then(result =>
                    resolve({
                        status: UserResponseStatus.APPROVED,
                        args: result as AptosChangeNetworkOutput
                    })
                )
                .catch(error =>
                    reject({
                        message: error,
                        state: UserResponseStatus.REJECTED
                    })
                );
        });
    };



class AptosStandard implements AptosWallet {

    id?: string | undefined;

    readonly url: string = "https://lunchlunch.xyz";

    readonly version = '1.0.0';

    readonly name: string = "Lunch Aptos Wallet";

    readonly icon: WalletIcon = WALLET_ICON

    readonly chains: IdentifierArray = [APTOS_TESTNET_CHAIN, APTOS_MAINNET_CHAIN];

    get features(): AptosFeatures {
        return {
            [AptosConnectNamespace]: {
                version: '1.0.0',
                connect: connect,
            },
            [AptosDisconnectNamespace]: {
                version: '1.0.0',
                disconnect: disconnect,
            },
            [AptosGetNetworkNamespace]: {
                version: '1.0.0',
                network: network,
            },
            [AptosSignTransactionNamespace]: {
                version: '1.0.0',
                signTransaction: signTransaction,
            },
            [AptosSignAndSubmitTransactionNamespace]: {
                version: '1.1.0',
                signAndSubmitTransaction: signAndSubmitTransaction
            },
            [AptosSignMessageNamespace]: {
                version: "1.0.0",
                signMessage: signMessage,
            },
            [AptosOnAccountChangeNamespace]: {
                version: "1.0.0",
                onAccountChange: onAccountChange,
            },
            [AptosOnNetworkChangeNamespace]: {
                version: "1.0.0",
                onNetworkChange: onNetworkChange,
            },
            [AptosGetAccountNamespace]: {
                version: "1.0.0",
                account: account,
            },
            [AptosChangeNetworkNamespace]: {
                version: "1.0.0",
                changeNetwork: changeNetwork,
            },
        }
    };

    accounts: readonly AptosWalletAccount[] = [];

    constructor() {
        void (async () => {
            try {
                this.accounts = [
                    aptosWalletAccountFromAccountInfo(await account())
                ];
                // eslint-disable-next-line no-empty
            } catch { }
        })();
    }

}

const aptosAccountResponseToAccountInfo: (account: AptosAccountResponse) => AccountInfo =
    (account: AptosAccountResponse): AccountInfo => {
        return new AccountInfo({
            address: new AccountAddress(fromBase64(account.address)),
            publicKey: new Ed25519PublicKey(fromBase64(account.publicKey))
        })
    }

const aptosWalletAccountFromAccountInfo: (account: AccountInfo) => AptosWalletAccount =
    (input: AccountInfo): AptosWalletAccount => {
        return {
            address: input.address.toString(),
            publicKey: input.publicKey.toUint8Array(),
            chains: [APTOS_TESTNET_CHAIN, APTOS_MAINNET_CHAIN],
            features: [
                AptosConnectNamespace,
                AptosDisconnectNamespace,
                AptosGetNetworkNamespace,
                AptosSignTransactionNamespace,
                AptosSignAndSubmitTransactionNamespace,
                AptosSignMessageNamespace,
                AptosOnAccountChangeNamespace,
                AptosOnNetworkChangeNamespace,
                AptosGetAccountNamespace,
                AptosChangeNetworkNamespace,
            ],
            icon: WALLET_ICON,
            signingScheme: SigningScheme.Ed25519,
        }
    };

export { AptosStandard }