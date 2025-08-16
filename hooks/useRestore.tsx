import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useRestore = () => {
    useEffect(() => {
        const restoreAppState = async () => {
            try {
                const data = await AsyncStorage.getItem('trialData');
                if (!data) {
                    router.replace('/');
                    return
                }
                router.replace('/testing');

            } catch (error) {
                console.error('Error restoring app: ', error);
            }
        };

        restoreAppState();
    }, []);
};