import {Text, View, StyleSheet, Pressable, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import {ABAxis, LAB, RGB, TargetColour} from "@/types/colours";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Return selected colour,
// overthinking, maybe just pass in the update and toggle functions? horizontal?
interface Trial {
    targetColour: TargetColour;
    startingColour: RGB; // Store LCH or? also allow null or no?
    response: RGB;
    rt: number;
}

export default function TestingScreen() {
    const [backgroundColour, setBackgroundColour] = useState<RGB>({r: 50, g: 50, b: 50});
    const [trialData, setTrialData] = useState<Trial[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const loadTrialData = async () => {
            try {
                const data = await AsyncStorage.getItem('trialData');
                if (data !== null) {
                    const parsedData: Trial[] = JSON.parse(data)
                    setTrialData(parsedData);
                    setBackgroundColour(parsedData[selectedIndex].response)
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

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.scrollview,{backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})`}]}>
            <View style={styles.trialList}>
                {
                    trialData.map((item, index) =>{
                        console.log(item.response)
                        return(<Pressable key={`trial-${index}`}
                                          style={[styles.trialSelector, selectedIndex===index && styles.selectedTrial]}
                                          onPress={()=>handlePress(item.response, index)}>
                            <Text style={styles.text}>{index}) R: {item.response.r}, G: {item.response.g}, B: {item.response.b}</Text>
                        </Pressable>)
                    }

                    )
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,

    },
    scrollview: {
        paddingVertical: 30,
        alignItems: "center"
    },
    trialList: {
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 10,
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
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
});

