interface Window {
    lunch: {
        version: string;
        handlerInfos: {
            line: import('~/types/chain').LineType;
            eventName: string;
            originHandler: (data: unknown) => void;
            handler: (event: MessageEvent<ListenerMessage>) => void;
        }[];
    };
    LunchHandler:LunchHandler;
}