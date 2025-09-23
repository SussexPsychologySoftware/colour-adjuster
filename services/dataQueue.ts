import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataService } from '@/services/dataService';
import * as Network from "expo-network";
import {Platform} from "react-native";


const STORAGE_KEY = 'dataQueue';

interface QueueItem {
    data: string,
    name: string,
    datapipeId: string,
}

class DataQueue {
    private isProcessing: boolean;

    constructor() {
        this.isProcessing = false;
        this.initNetworkListener();
    }

    async getQueue(): Promise<QueueItem[]> {
        try {
            const dataString = await AsyncStorage.getItem(STORAGE_KEY);
            return dataString ? JSON.parse(dataString) : []
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async getQueueLength(): Promise<number> {
        try {
            const queue = await this.getQueue()
            return queue.length
        } catch (e) {
            console.error(e);
            return 0;
        }
    }

    async hasQueue(): Promise<boolean> {
        try {
            const queue = await this.getQueue();
            return queue.length > 0;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async setQueue(queue: QueueItem[]): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }

    async addToQueue(data: string, name: string, datapipeId: string): Promise<void> {
        const queueItem: QueueItem = {name, data, datapipeId};
        const queue: QueueItem[] = await this.getQueue();
        queue.push(queueItem);
        await this.setQueue(queue);
        // Try to process immediately
        await this.processQueue();
    }

    async processQueue(): Promise<string> {
        // Check connected and not current processing
        if (this.isProcessing) return 'Already processing';
        const { isConnected, isInternetReachable } = await Network.getNetworkStateAsync();
        if (!isConnected || !isInternetReachable) return 'No internet connection';

        this.isProcessing = true;
        try {
            const queue = await this.getQueue();
            if(queue.length === 0) return 'No items to sync';

            let successMessage = 'All items successfully sent to server';
            for (let i = queue.length - 1; i >= 0; i--) {
                const item = queue[i];
                try {
                    const response = await DataService.sendToServer(item.data, item.name, item.datapipeId);
                    if (response && !response.ok) {
                        successMessage = `Send to server failed for ${item.name}`;
                        break;
                    } // On failure assume rest will fail and let app do other stuff
                    // else remove from queue
                    // TODO: Consider adding retrys?
                    queue.splice(i, 1);
                } catch (e) {
                    successMessage = `Send to server failed for ${item.name}`;
                    console.error('Network error syncing queue: ', e);
                    break;
                }
            }

            await this.setQueue(queue);
            return successMessage;
        } finally {
            this.isProcessing = false;
        }
    }

    async initNetworkListener() {
        if (Platform.OS === 'web') {
            this.initWebNetworkListener();
        } else {
            // Use the correct NetInfo package
            Network.addNetworkStateListener(({ isConnected, isInternetReachable }) => {
                if (isConnected && isInternetReachable && !this.isProcessing) {
                    // Network back online - process queue
                    setTimeout(() => this.processQueue(), 1000);
                }
            })
        }
    }

    initWebNetworkListener() {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                if (!this.isProcessing) {
                    setTimeout(() => this.processQueue(), 1000);
                }
            });
        }
    }
}

export const dataQueue = new DataQueue();
