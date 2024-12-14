import { LINE_TYPE } from "../../constants/chain";
import { APTOS_LISTENER_TYPE, MESSAGE_TYPE, SUI_LISTENER_TYPE } from "../../constants/message";
import {
  AptosAccount,
  AptosChangeNetwork,
  AptosConnect,
  AptosDisconnect,
  AptosIsConnected,
  AptosNetwork,
  AptosSignAndSubmitTransaction,
  AptosSignMessage,
  AptosSignTransaction
} from "./aptos";
import {
  SuiGetAccount,
  SuiSignAndExecuteTransaction,
  SuiSignAndExecuteTransactionBlock,
  SuiSignMessage,
  SuiSignPersonalMessage,
  SuiSignTransaction,
  SuiSignTransactionBlock
} from "./sui";

export type SuiRequestMessage =
  | SuiGetAccount
  | SuiSignAndExecuteTransactionBlock
  | SuiSignAndExecuteTransaction
  | SuiSignTransactionBlock
  | SuiSignTransaction
  | SuiSignMessage
  | SuiSignPersonalMessage;

export type AptosRequestMessage =
  | AptosAccount
  | AptosConnect
  | AptosNetwork
  | AptosChangeNetwork
  | AptosDisconnect
  | AptosIsConnected
  | AptosSignTransaction
  | AptosSignAndSubmitTransaction
  | AptosSignMessage;

type ValueOf<T> = T[keyof T];

export type SuiListenerType = ValueOf<typeof SUI_LISTENER_TYPE>;
export type AptosListenerType = ValueOf<typeof APTOS_LISTENER_TYPE>;
export type ListenerType = SuiListenerType | AptosListenerType;

export type ResponseMessage = {
  error?: unknown | null;
  result?: unknown | null;
};

export type MessageType = ValueOf<typeof MESSAGE_TYPE>;
export type LineType = ValueOf<typeof LINE_TYPE>;

export type ListenerMessage<T = unknown> = {
  isLunch: boolean;
  line: LineType;
  type: ListenerType;
  message?: T;
};

export type NativeToContentScriptEventMessage<T> = {
  isLunch: boolean;
  line: LineType;
  type: MessageType;
  messageId: string;
  message: T;
};

export type ContentScriptToNativeEventMessage<T, U> = Omit<NativeToContentScriptEventMessage<U>, 'line'> & {
  response: T;
};