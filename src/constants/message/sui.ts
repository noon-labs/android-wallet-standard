export const SUI_METHOD_TYPE = {
    SUI__CONNECT: 'sui_connect',
    SUI__SIGN_TRANSACTION_BLOCK: 'sui_signTransactionBlock',
    SUI__SIGN_TRANSACTION: 'sui_signTransaction',
    SUI__SIGN_AND_EXECUTE_TRANSACTION_BLOCK: 'sui_signAndExecuteTransactionBlock',
    SUI__SIGN_AND_EXECUTE_TRANSACTION: 'sui_signAndExecuteTransaction',
    SUI__SIGN_MESSAGE: 'sui_signMessage',
    SUI__SIGN_PERSONAL_MESSAGE: 'sui_signPersonalMessage',
    SUI__GET_ACCOUNT: 'sui_getAccount',
  } as const;