import {Text, View, StyleSheet, Pressable, ScrollView, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {RGB, LCH, TargetColour} from "@/types/colours";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ColourConverter} from "@/utils/colourConversion";
import {Trial} from "@/hooks/useTrials";
import {DataService} from "@/services/dataService";
import {router} from "expo-router";
import SubmitButton from "@/components/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
// Return selected colour,
// overthinking, maybe just pass in the update and toggle functions? horizontal?

export default function TestingScreen() {
    const [backgroundColour, setBackgroundColour] = useState<RGB>({r: 50, g: 50, b: 50});
    const [trialData, setTrialData] = useState<Trial[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadTrialData = async () => {
            try {
                const data = await AsyncStorage.getItem('trialData');
                if (data !== null) {
                    const parsedData: Trial[] = JSON.parse(data)
                    setTrialData(parsedData);
                    const response = parsedData[selectedIndex].renderedRGB
                    if(response) setBackgroundColour(response)
                }
            } catch (error) {
                console.error('Error loading trial data:', error);
            }
        };

        loadTrialData();
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

    return (
        <ScrollView style={globalStyles.scrollViewContainer} contentContainerStyle={[styles.scrollview,{backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})`}]}>
            <View style={styles.trialList}>
                {
                    trialData.map((item, index) =>{
                        console.log(item.response)
                        return(<Pressable key={`trial-${index}`}
                                          style={[styles.trialSelector, selectedIndex===index && styles.selectedTrial]}
                                          onPress={()=>handlePress(item.renderedRGB, index)}>
                            <Text style={styles.text}>{index}) {item.renderedRGB.r}, {item.renderedRGB.g}, {item.renderedRGB.b}</Text>
                        </Pressable>)
                    })
                }
            </View>
            <SubmitButton text='Delete participant data' disabledText='Deleting data...' disabled={submitting} onPress={handleDelete} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,

    },
    scrollview: {
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
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 40,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "black",
    },
    submitText: {
        color: "white",
    }

});

