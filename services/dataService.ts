import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataQueue } from './dataQueue';

export class DataService {
    static async getData(key: string) {
        const dataString = await AsyncStorage.getItem(key);
        return dataString ? JSON.parse(dataString) : null;
    }

    static async saveData(data: Record<string, any>, name: string, datapipeId?: string) {
        data.timestamp = new Date().toISOString();
        const participantId = await this.getParticipantID();
        if (!participantId) throw new Error("Participant ID not found");
        data.participantId = participantId;

        const dataString = JSON.stringify(data);
        await AsyncStorage.setItem(name, dataString);
        // data: CdE5fn8ckU5w, participants: eXM0k3gPdL9y
        if (datapipeId) {
            const filename = `${participantId}_${name}`
            try {
                const response = await this.sendToServer(dataString, filename, datapipeId);
                // Only should have 1 for each day so could totally just tag by day?
                if(!response.ok) await dataQueue.addToQueue(dataString, filename, datapipeId);
            } catch (error) {
                // Network error, server unreachable, etc.
                console.error('Error sending to datapipe: ', error);
                await dataQueue.addToQueue(dataString, filename, datapipeId);
            }
        }
    }

    static async sendToServer(data: string, filename: string, experimentID: string) {
        return await fetch("https://pipe.jspsych.org/api/data/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
            },
            body: JSON.stringify({
                experimentID: experimentID,
                filename: `${filename}.json`,
                data: data,
            }),
        });
    }

    static async deleteData(id: string) {
        await AsyncStorage.removeItem(id);
    }

    static async getSendDataConsent() {
        const consent = await this.getData('consent');
        if (!consent) return null
        return consent.consent === "I consent to take part in this study and agree to my data being recorded."
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