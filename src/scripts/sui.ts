import { v4 as uuidv4 } from 'uuid';
import { isTransaction } from '@mysten/sui/transactions';
import {
    SUI_DEVNET_CHAIN, SUI_MAINNET_CHAIN, SUI_TESTNET_CHAIN,
    StandardConnect,
    StandardEvents,
    type SuiSignMessageInput,
    type SuiSignPersonalMessageInput,
    type IdentifierArray,
    type SignedTransaction,
    type SuiSignAndExecuteTransactionBlockInput,
    type SuiSignAndExecuteTransactionBlockMethod,
    type SuiSignAndExecuteTransactionBlockOutput,
    type SuiSignAndExecuteTransactionInput,
    type SuiSignAndExecuteTransactionMethod,
    type SuiSignAndExecuteTransactionOutput,
    type SuiSignMessageMethod,
    type SuiSignMessageOutput,
    type SuiSignPersonalMessageMethod,
    type SuiSignPersonalMessageOutput,
    type SuiSignTransactionBlockInput,
    type SuiSignTransactionBlockMethod,
    type SuiSignTransactionBlockOutput,
    type SuiSignTransactionInput,
    type SuiSignTransactionMethod,
    type Wallet,
    type WalletAccount,
    type WalletIcon,
} from '@mysten/wallet-standard';

import { APP_NAME as WALLET_NAME, ICON as WALLET_ICON } from "../constants/constants";
import type { ContentScriptToNativeEventMessage, ListenerMessage, ResponseMessage, SuiListenerType, SuiRequestMessage } from '../types/message';
import type {
    SuiGetAccountResponse,
} from '../types/message/sui';
import { MESSAGE_TYPE } from '../constants/message';
import { LINE_TYPE } from '../constants/chain';
import { SUI_METHOD_TYPE } from '../constants/message/sui';

const request = (message: SuiRequestMessage) =>
    new Promise((res, rej) => {
        const messageId = uuidv4();

        const handler = (event: MessageEvent<ContentScriptToNativeEventMessage<ResponseMessage, SuiRequestMessage>>) => {
            if (event.data?.isLunch && event.data?.type === MESSAGE_TYPE.RESPONSE__NATIVE_TO_CONTENT_SCRIPT && event.data?.messageId === messageId) {
                window.removeEventListener('message', handler);

                const { data } = event;

                if (data.response?.error) {
                    rej(data.response.error);
                } else {
                    res(data.response.result);
                }
            }
        };

        window.addEventListener('message', handler);
        window.LunchHandler.performNativeTask(
            LINE_TYPE.SUI,
            messageId,
            JSON.stringify(message)
        );
    });

const getAccounts = async () => {
    return (await request({ method: SUI_METHOD_TYPE.SUI__GET_ACCOUNT, params: undefined })) as SuiGetAccountResponse;
};

const signTransactionBlock: SuiSignTransactionBlockMethod = (input: SuiSignTransactionBlockInput) => {
    if (!isTransaction(input.transactionBlock)) {
        throw new Error('Unexpect transaction format found. Ensure that you are using the `Transaction` class.');
    }

    return request({
        method: 'sui_signTransactionBlock',
        param: input,
    }) as Promise<SuiSignTransactionBlockOutput>;
};

const signTransaction: SuiSignTransactionMethod = async (input: SuiSignTransactionInput) => {

    return request({
        method: 'sui_signTransaction',
        param: input,
    }) as Promise<SignedTransaction>;
};

const signAndExecuteTransactionBlock: SuiSignAndExecuteTransactionBlockMethod = (input: SuiSignAndExecuteTransactionBlockInput) => {
    if (!isTransaction(input.transactionBlock)) {
        throw new Error('Unexpect transaction format found. Ensure that you are using the `Transaction` class.');
    }

    return request({
        method: 'sui_signAndExecuteTransactionBlock',
        param: input,
    }) as Promise<SuiSignAndExecuteTransactionBlockOutput>;
};

const signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async (input: SuiSignAndExecuteTransactionInput) => {

    return request({
        method: 'sui_signAndExecuteTransaction',
        param: input,
    }) as Promise<SuiSignAndExecuteTransactionOutput>;
};

const signMessage: SuiSignMessageMethod = (input: SuiSignMessageInput) =>

    request({
        method: 'sui_signMessage',
        param: input,
    }) as Promise<SuiSignMessageOutput>;

const signPersonalMessage: SuiSignPersonalMessageMethod = async (input: SuiSignPersonalMessageInput) =>
    request({
        method: 'sui_signPersonalMessage',
        param: input,
    }) as Promise<SuiSignPersonalMessageOutput>;

const off = (eventName: SuiListenerType, eventHandler?: (data: unknown) => void) => {
    const handlerInfos = window.lunch.handlerInfos.filter(
        (item) => item.line === LINE_TYPE.SUI && item.eventName === eventName && item.originHandler === eventHandler,
    );
    const notHandlerInfos = window.lunch.handlerInfos.filter(
        (item) => !(item.line === LINE_TYPE.SUI && item.eventName === eventName && item.originHandler === eventHandler),
    );

    handlerInfos.forEach((handlerInfo) => {
        window.removeEventListener('message', handlerInfo.handler);
    });

    window.lunch.handlerInfos = notHandlerInfos;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const on = (eventName: SuiListenerType, eventHandler: (data: any) => void) => {
    const handler = (event: MessageEvent<ListenerMessage<ResponseMessage>>) => {
        if (event.data?.isLunch && event.data?.type === eventName && event.data?.line === 'SUI') {
            if (eventName === 'accountChange' && !event.data?.message?.result) {
                eventHandler('');
            } else {
                eventHandler(event.data?.message?.result);
            }
        }
    };

    window.addEventListener('message', handler);

    window.lunch.handlerInfos.push({ line: LINE_TYPE.SUI, eventName, originHandler: eventHandler, handler });

    return () => off(eventName, eventHandler);
};

class SuiStandard implements Wallet {
    readonly version = '1.0.0';

    readonly name: string = WALLET_NAME;

    readonly icon: WalletIcon = WALLET_ICON

    readonly chains: IdentifierArray = [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN, SUI_MAINNET_CHAIN];

    features: Readonly<Record<`${string}:${string}`, unknown>> = {};

    accounts: readonly WalletAccount[] = [];

    constructor() {
        this.features = {
            [StandardConnect]: {
                version: '1.0.0',
                connect: async () => {
                    const account = await getAccounts();
                    this.accounts = [
                        {
                            address: account.address,
                            publicKey: new TextEncoder().encode(account.publicKey),
                            chains: this.chains,
                            features: [
                                'standard:connect',
                                'sui:signAndExecuteTransactionBlock',
                                'sui:signAndExecuteTransaction',
                                'sui:signTransactionBlock',
                                'sui:signTransaction',
                                'sui:signMessage',
                                'sui:signPersonalMessage',
                            ],
                        },
                    ];

                    return { accounts: this.accounts };
                },
            },
            [StandardEvents]: {
                version: '1.0.0',
                on,
            },

            'sui:signTransactionBlock': {
                version: '1.0.0',
                signTransactionBlock,
            },

            'sui:signTransaction': {
                version: '2.0.0',
                signTransaction,
            },

            'sui:signAndExecuteTransactionBlock': {
                version: '1.0.0',
                signAndExecuteTransactionBlock,
            },

            'sui:signAndExecuteTransaction': {
                version: '2.0.0',
                signAndExecuteTransaction,
            },

            'sui:signMessage': {
                version: '1.0.0',
                signMessage,
            },

            'sui:signPersonalMessage': {
                version: '2.0.0',
                signPersonalMessage,
            },
        };
        void (async () => {
            try {
                const account = await getAccounts();
                this.accounts = [
                    {
                        address: account.address,
                        publicKey: new TextEncoder().encode(account.publicKey),
                        chains: this.chains,
                        features: [
                            StandardConnect,
                            'sui:signAndExecuteTransactionBlock',
                            'sui:signAndExecuteTransaction',
                            'sui:signTransactionBlock',
                            'sui:signTransaction',
                            'sui:signMessage',
                            'sui:signPersonalMessage',
                        ],
                    },
                ];

                // eslint-disable-next-line no-empty
            } catch { }
        })();
    }
}

export { SuiStandard };