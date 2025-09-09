import { Text, View, StyleSheet } from "react-native";
import {useCallback, useMemo, useState} from "react";
import AdjustColourButton from '@/components/AdjustColourButton'
import { ColourConverter } from '@/utils/colourConversion';
import { colourConstraints } from '@/constants/colourConstraints';
import { LCH, RGB, TargetColour, Constraint } from "@/types/colours";
import SubmitButton from "@/components/SubmitButton";
import {SafeAreaView} from "react-native-safe-area-context";

// Return selected colour,
export default function HueTrial({ startColour, targetColour, onSubmit, submitting }: {startColour: LCH, targetColour: TargetColour, onSubmit: (colour: LCH, renderedRGB: RGB)=>void, submitting: boolean}) {
    const [responseColour, setResponseColour] = useState<LCH>(startColour);
    const [lowerBoundReached, setLowerBoundReached] = useState(false);
    const [upperBoundReached, setUpperBoundReached] = useState(false);

    // Derive RGB when needed for display
    const backgroundColour = useMemo(() =>
            ColourConverter.lch2rgb(responseColour),
        [responseColour]
    );

    function changeHue(change: number, currentColour: LCH): LCH{
        return {
            ...currentColour, // Note must deep copy or ref address same and update ignored
            h: mod(currentColour.h + change, 360)
        };
    }

    // mod function to handle negative numbers //https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
    const mod = useCallback((n: number, m: number) => ((n % m) + m) % m, []);

    function toggleHueButtons(hue: number){
        const constraint: Constraint = colourConstraints[targetColour]
        if(constraint.excludedHueRange){
            const roundedHue = Math.round(hue);
            // TODO: maybe this is why I should be working with the LCH directly.... CHECK WORKS
            setLowerBoundReached(roundedHue === constraint.excludedHueRange.max+1) // >max
            setUpperBoundReached(roundedHue === constraint.excludedHueRange.min-1) // <min
            // console.log('bounds reached: ',hue, hue === constraint.excludedHueRange.min,hue === constraint.excludedHueRange.max, performance.now())
        }
    }

    const handlePress = (change: number) => {
        setResponseColour(prev => {
            // console.log({currentRGB, upperBoundReached, lowerBoundReached}) // TODO looks like red is negative sometimes? out of gamut
            const newHue = changeHue(change, prev)
            toggleHueButtons(newHue.h)
            return newHue
        })
    }

    const handleSubmit = () => {
        // Save data, reset buttons and colour and restart
        if(submitting) return
        try{
            onSubmit(responseColour, backgroundColour)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})` }]}>
            <View style={styles.middle}>
                <AdjustColourButton disabled={lowerBoundReached} onPress={()=>handlePress(-1)} style={styles.left}/>
                <View style={styles.infoAndSubmit}>
                    <Text style={[styles.text, styles.targetColour]}>{targetColour}</Text>
                    <SubmitButton text='Submit' disabledText='Submitting...' disabled={submitting} onPress={handleSubmit} style={{borderColor: 'black'}} textStyle={{color: 'black'}}/>
                </View>
                <AdjustColourButton disabled={upperBoundReached} onPress={()=>handlePress(1)} style={styles.right}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        maxHeight: "100%",
        maxWidth: "100%",
        backgroundColor: "black",
        justifyContent: "center", // TODO: Must be "space-between" on White trial
        alignItems: "stretch"
    },
    top: {
        alignSelf: "center",
    },
    bottom: {
        alignSelf: "center",
        justifyContent: "flex-end",
    },
    middle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    left: {
    },
    right: {
        // alignSelf: "flex-end",
    },

    infoAndSubmit: {
        alignItems: "center"
    },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    text: {
        fontWeight: "bold",
        color: "black",
    },
    targetColour: {
        fontWeight: "bold",
        fontSize: 30,
        textTransform: 'capitalize'
    },
    submitText: {
        fontSize: 15,
    }
});

