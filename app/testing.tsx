import {Text, View, StyleSheet, Pressable, ScrollView, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {RGB} from "@/types/colours";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Trial} from "@/hooks/useTrials";
import {DataService} from "@/services/dataService";
import {router} from "expo-router";
import SubmitButton from "@/components/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
import {dataQueue} from "@/services/dataQueue";
import {SafeAreaView} from "react-native-safe-area-context";
// Return selected colour,
// overthinking, maybe just pass in the update and toggle functions? horizontal?

interface TestColour {
    RGB: RGB,
    description: string
}

export default function TestingScreen() {
    const [trialData, setTrialData] = useState<Trial[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const testData: TestColour[] = [
        {RGB: {r:255, g:0, b:0}, description: 'Red test'},
        {RGB: {r:0, g:255, b:0}, description: 'Green test'},
        {RGB: {r:0, g:0, b:255}, description: 'Blue test'},
        {RGB: {r:255, g:255, b:0}, description: 'Yellow test'},
        {RGB: {r:255, g:255, b:255}, description: 'White test'}
    ]
    const [backgroundColour, setBackgroundColour] = useState<RGB>(testData[0].RGB);
    const [submitting, setSubmitting] = useState(false);
    const [participantId, setParticipantId] = useState('');
    const [participantCode, setParticipantCode] = useState('');
    const [consent, setConsent] = useState('');


    useEffect(() => {

        const loadTrialData = async () => {
            try {
                const data = await AsyncStorage.getItem('trialData');
                if (data !== null) {
                    const parsedData: Trial[] = JSON.parse(data)
                    setTrialData(parsedData);
                    // const response = parsedData[selectedIndex].renderedRGB
                    // if(response) setBackgroundColour(response)
                }
            } catch (error) {
                console.error('Error loading trial data:', error);
            }
        };

        const loadParticipantID = async () => {
            try {
                const id = await DataService.getParticipantID()
                if (id !== null) {
                    setParticipantId(id);
                }
                const consent = await DataService.getData('consent')
                if(consent !== null){
                    setParticipantCode(consent.participantId)
                    setConsent(consent.consent)
                }
            } catch (error) {
                console.error('Error loading trial data:', error);
            }
        };

        loadTrialData();
        loadParticipantID();
    }, []); // Empty dependency array means this runs once on mount


    const handlePress = (responseColour: RGB, selectedIndex: number) => {
        if(trialData){
            setBackgroundColour(responseColour);
            setSelectedIndex(selectedIndex);
        }
    }

    const handleDelete = async () => {
        if(submitting) return
        setSubmitting(true)
        try{
            Alert.alert(
                'WARNING',
                "Experiment progress will be reset",
                [
                    {
                        text: 'Reset experiment',
                        onPress: async () => {
                            await DataService.deleteData('consent')
                            await DataService.deleteData('trialData')
                            await DataService.deleteData('survey')
                            router.replace('/')
                        },
                        style: "default"
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ],
                {
                    cancelable: true,
                },
            );
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false);
        }
    }

    function DisplayColourButton({index, backgroundRGB, targetColour}: {index: number, backgroundRGB: RGB, targetColour: string }) {
        return (
            <Pressable
                       style={[styles.trialSelector, selectedIndex===index && styles.selectedTrial]}
                       onPress={()=>handlePress(backgroundRGB, index)}>
                <Text style={styles.text}>{index}) {backgroundRGB.r}, {backgroundRGB.g}, {backgroundRGB.b} | {targetColour}</Text>
            </Pressable>
        )
    }

    return (
        <ScrollView style={[globalStyles.scrollViewContainer,{backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})`}]}>
            <SafeAreaView style={styles.container}>
                <Text style={{color: 'black', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>ID: {participantId}</Text>
                <Text style={{color: 'black', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Code: {participantCode}</Text>
                <Text style={{color: 'black', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Consent: {consent}</Text>
                <View style={styles.trialList}>
                    <Text>TEST COLOURS</Text>
                    {
                        testData.map((item, index) =>{
                            return(<DisplayColourButton key={`test-${index}`} index={index} backgroundRGB={item.RGB} targetColour={item.description}/>)
                        })
                    }
                    <Text>TRIAL DATA</Text>
                    {
                        trialData.map((item, index) =>{
                            return(<DisplayColourButton key={`trial-${index}`} index={index+testData.length} backgroundRGB={item.renderedRGB} targetColour={item.targetColour}/>)
                        })
                    }
                </View>
                <View style={styles.buttons}>
                    <SubmitButton text='Sync data' disabledText='Syncing data...' disabled={submitting} onPress={async()=>{
                            setSubmitting(true)
                            try {
                                const successMessage = await dataQueue.processQueue()
                                Alert.alert(successMessage)
                            } catch(error) {
                                console.log(error)
                            }
                            setSubmitting(false)
                        }
                    }
                    style={styles.button}
                    />
                    <SubmitButton text='Delete participant data' disabledText='Deleting data...' disabled={submitting} onPress={handleDelete} style={styles.button}/>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    buttons:{
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 10
    },
    button: {
        backgroundColor: 'black',
        alignSelf: 'flex-start'
    },

    container: {
        padding: 30,
        alignItems: "flex-start",
        minHeight: '100%'
    },
    trialList: {
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 50,
    },
    trialSelector: {
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        padding: 10,
    },
    selectedTrial: {
        backgroundColor: "darkgrey",
    },
    text: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
    },

});

