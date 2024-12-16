export const APTOS_METHOD_TYPE = {
    APTOS__CONNECT: 'aptos_connect',
    APTOS__ACCOUNT: 'aptos_account',
    APTOS__SIGN_AND_SUBMIT_TRANSACTION: 'aptos_signAndSubmitTransaction',
    APTOS__SIGN_TRANSACION: 'aptos_signTransaction',
    APTOS__SIGN_MESSAGE: 'aptos_signMessage',
    APTOS__DISCONNECT: 'aptos_disconnect',
    APTOS__NETWORK: 'aptos_network',
    APTOS__CHANGE_NETWORK: 'aptos_changeNetwork',
} as const;