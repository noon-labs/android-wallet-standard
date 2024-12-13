import type { SuiTransactionBlockResponseOptions } from '@mysten/sui/client';
import type {
  SuiSignAndExecuteTransactionBlockInput,
  SuiSignAndExecuteTransactionInput,
  SuiSignMessageInput,
  SuiSignPersonalMessageInput,
  SuiSignTransactionBlockInput,
  SuiSignTransactionBlockMethod,
  SuiSignTransactionInput,
} from '@mysten/wallet-standard';
import { SUI_METHOD_TYPE } from '../../constants/message/sui';

export type SuiGetAccount = {
  method: typeof SUI_METHOD_TYPE.SUI__GET_ACCOUNT;
  params: unknown;
};

export type SuiSignTransactionBlock = {
  method: typeof SUI_METHOD_TYPE.SUI__SIGN_TRANSACTION_BLOCK;
  param: SuiSignTransactionBlockInput;
};

export type SuiSignTransaction = {
  method: typeof SUI_METHOD_TYPE.SUI__SIGN_TRANSACTION;
  param: SuiSignTransactionInput;
};

export type SuiSignAndExecuteTransactionBlock = {
  method: typeof SUI_METHOD_TYPE.SUI__SIGN_AND_EXECUTE_TRANSACTION_BLOCK;
  param: SuiSignAndExecuteTransactionBlockInput;
};

export type SuiSignAndExecuteTransaction = {
  method: typeof SUI_METHOD_TYPE.SUI__SIGN_AND_EXECUTE_TRANSACTION;
  param: SuiSignAndExecuteTransactionInput;
};

export type SuiSignMessage = {
  method: typeof SUI_METHOD_TYPE.SUI__SIGN_MESSAGE;
  param: SuiSignMessageInput;
};

export type SuiSignPersonalMessage = {
  method: typeof SUI_METHOD_TYPE.SUI__SIGN_PERSONAL_MESSAGE;
  param: SuiSignPersonalMessageInput;
};

export type SuiGetAccountResponse = {
  address: string;
  publicKey: string;
};
