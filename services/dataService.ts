import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataQueue } from './dataQueue';
import {Platform} from "react-native";
import {HttpService} from "@/services/HttpService";

export class DataService {
    static async getData(key: string) {
        const dataString = await AsyncStorage.getItem(key);
        return dataString ? JSON.parse(dataString) : null;
    }

    static async saveData(data: Record<string, any>, name: string, datapipeId?: string) {
        data.timestamp = new Date().toISOString();
        const participantId = await this.getParticipantID();
        if (!participantId) throw new Error("Participant ID not found");
        data.randomId = participantId; // Name of this is annoying but in line with previous web-based version

        const dataString = JSON.stringify(data);
        await AsyncStorage.setItem(name, dataString);
        // data: CdE5fn8ckU5w, participants: eXM0k3gPdL9y
        if (datapipeId && Platform.OS !== 'web') {
            const filename = `${participantId}_${name}`
            try {
                const response = await HttpService.sendToServer(dataString, filename, datapipeId); // Use HttpService
                if(response && !response.ok) await dataQueue.addToQueue(dataString, filename, datapipeId);
            } catch (error) {
                // Network error, server unreachable, etc.
                console.error('Error sending to datapipe: ', error);
                await dataQueue.addToQueue(dataString, filename, datapipeId);
            }
        }
    }

    static async deleteData(id: string) {
        await AsyncStorage.removeItem(id);
    }

    static async setSendDataConsent(sendDataConsent: boolean) {
        await AsyncStorage.setItem('sendDataConsent', JSON.stringify(sendDataConsent))
    }

    // ============ Participant ID ============
    // Bit easier to just set this as a single string directly, used quite often
    static async setParticipantID(id: string) {
        await AsyncStorage.setItem('participantID', id);
    }

    static async getParticipantID() {
        return await AsyncStorage.getItem('participantID');
    }

}
