import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useRestore = () => {
    useEffect(() => {
        const restoreAppState = async () => {
            try {
                const consent = await AsyncStorage.getItem('consent');
                if (!consent) {
                    console.log('Restoring consent');
                    router.replace('/consent');
                    return
                }

                const trials = await AsyncStorage.getItem('trialData');
                if (!trials) {
                    console.log('Trial data not found');
                    router.replace('/adjust');
                    return
                }

                const survey = await AsyncStorage.getItem('survey');
                if (!survey) {
                    console.log('Survey not found');
                    router.replace('/survey');
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
