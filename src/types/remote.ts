export type RemoteMessage = {
    op: string;
    nonce?: string | number;
    success?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    error?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export type ResourceType = 'thumbnail' | 'track' | 'file';