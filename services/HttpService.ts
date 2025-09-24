import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native";

export class HttpService {
    static async sendToServer(data: string, filename: string, experimentID: string) {
        const sendDataConsent = await this.getSendDataConsent()
        if(!sendDataConsent) return null
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

    static async getSendDataConsent() {
        if(Platform.OS === 'web') return null
        const sendDataConsent = await AsyncStorage.getItem('sendDataConsent')
        if(!sendDataConsent) return null;
        return JSON.parse(sendDataConsent)
    }
}
