import type {ConnectionStatus, RemoteMessage} from "../types/remote.ts";

type PendingRequest = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (value: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RemoteListener = (...args: any[]) => void;

class RemoteClientRegistry {
    private ws: WebSocket | null = null;
    private pendingRequests = new Map<string | number, PendingRequest>();
    private listeners = new Map<string, Set<RemoteListener>>();
    private authToken: string | null = null;

    public async connect(url: string, username?: string, password?: string): Promise<void> {
        this.onStatusChange?.('connecting', null);

        return new Promise((resolve, reject) => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) return resolve();

            this.ws = new WebSocket(url);

            this.ws.onopen = async () => {
                console.log('[RemoteClient] Connected to server.');

                if (username && password) {
                    console.log('[RemoteClient] Sending Identify packet...');

                    try {
                        const response = await this.invoke('auth:identify', username, password);
                        console.log('[RemoteClient] Authenticated successfully!');

                        if (response && response.mediaToken) this.authToken = response.mediaToken;

                        this.onStatusChange?.('connected', null);
                        resolve();
                    } catch (e) {
                        console.error('[RemoteClient] Authentication failed:', e);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        this.onStatusChange?.('disconnected', (e as any).message || 'Authentication failed');
                        this.disconnect();
                        reject(e);
                    }
                } else {
                    console.log('[RemoteClient] No credentials provided, skipping authentication.');
                    this.onStatusChange?.('connected', null);
                    resolve();
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data) as RemoteMessage;
                    this._handleIncomingMessage(msg);
                } catch (e) {
                    console.error('[RemoteClient] Failed to parse message:', event.data, e);
                }
            };

            this.ws.onerror = (error) => {
                console.error('[RemoteClient] WebSocket error:', error);
                if (this.ws?.readyState !== WebSocket.OPEN) {
                    this.onStatusChange?.('disconnected', 'Network error. Cannot reach server.');
                    reject(new Error('Network error'));
                }
            };

            this.ws.onclose = () => {
                console.log('[RemoteClient] Disconnected from server.');
                this._rejectAllPendingRequests(new Error('WebSocket disconnected'));
                this.ws = null;
                this.authToken = null;
                this.onStatusChange?.('disconnected', 'Connection lost.');
            };
        });
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.authToken = null;
            this.onStatusChange?.('disconnected', null);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async invoke<T = any>(channel: string, ...args: any[]): Promise<T> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return Promise.reject(new Error('WebSocket is not connected'));

        return new Promise((resolve, reject) => {
            const nonce = this.generateNonce();

            this.pendingRequests.set(nonce, {resolve, reject});

            const payload = {
                op: channel,
                nonce: nonce,
                args: args
            };

            this.ws!.send(JSON.stringify(payload));
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public send(channel: string, ...args: any[]): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.warn(`[RemoteClient] Cannot send ${channel}, WebSocket is not connected`);
            return;
        }

        const payload = {
            op: channel,
            args: args
        };

        this.ws.send(JSON.stringify(payload));
    }

    public listen(channel: string, listener: RemoteListener): () => void {
        if (!this.listeners.has(channel)) this.listeners.set(channel, new Set());
        this.listeners.get(channel)!.add(listener);

        return () => {
            const channelListeners = this.listeners.get(channel);
            if (channelListeners) {
                channelListeners.delete(listener);
                if (channelListeners.size === 0) this.listeners.delete(channel);
            }
        };
    }

    public onStatusChange?: (status: ConnectionStatus, error?: string | null) => void;

    public getAuthToken() {
        return this.authToken;
    }

    private generateNonce(): string {
        return Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15);
    }

    private _handleIncomingMessage(msg: RemoteMessage) {
        if (msg.nonce && this.pendingRequests.has(msg.nonce)) {
            const request = this.pendingRequests.get(msg.nonce)!;
            this.pendingRequests.delete(msg.nonce);

            if (msg.success) request.resolve(msg.data);
            else request.reject(new Error(msg.error || 'Unknown server error'));

            return;
        }

        if (this.listeners.has(msg.op)) {
            const channelListeners = this.listeners.get(msg.op)!;

            const args = Array.isArray(msg.args) ? msg.args : [];

            channelListeners.forEach(listener => {
                try {
                    listener(...args);
                } catch (e) {
                    console.error(`[RemoteClient] Error in listener for ${msg.op}:`, e);
                }
            });
        }
    }

    private _rejectAllPendingRequests(error: Error) {
        for (const [, request] of this.pendingRequests.entries()) request.reject(error);
        this.pendingRequests.clear();
    }
}

export const remoteClient = new RemoteClientRegistry();