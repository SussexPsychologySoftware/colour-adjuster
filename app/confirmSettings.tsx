import Checkbox from 'expo-checkbox';
import {View, Text, StyleSheet, Pressable} from "react-native";
import {useState} from 'react'
import {router} from "expo-router";

export default function ConfirmSettingsScreen() {
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [screenOff, setScreenOff] = useState(false);
    const [doNotDisturb, setDoNotDisturb] = useState(false);
    const [fillScreen, setFillScreen] = useState(false);

    const handleSubmit = () => {
        if(isSubmitting) return
        setIsSubmitting(true)
        try {
            if(!screenOff || !fillScreen || !doNotDisturb) {
                setWarning('You must tick all boxes to proceed')
                return
            }
            setWarning('')
            router.replace('/adjust')
        } catch (e) {
            console.log(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.checkboxList}>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        style={styles.checkbox}
                        value={screenOff}
                        onValueChange={(checked)=>setScreenOff(checked)}
                        color={screenOff ? 'grey' : undefined}
                    />
                    <Text style={styles.text}>Have you switched off any other screen which is nearby?</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        style={styles.checkbox}
                        value={doNotDisturb}
                        onValueChange={(checked)=>setDoNotDisturb(checked)}
                        color={doNotDisturb ? 'grey' : undefined}
                    />
                    <Text style={styles.text}>Have you set Do Not Disturb?</Text>
                </View>
                {/* TODO: remove this? */}
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        style={styles.checkbox}
                        value={fillScreen}
                        onValueChange={(checked)=>setFillScreen(checked)}
                        color={fillScreen ? 'grey' : undefined}
                    />
                    <Text style={styles.text}>Is the App currently filling your screen?</Text>
                </View>
            </View>
            { warning && <Text style={styles.warning}>{warning}</Text>}
            <Pressable onPress={handleSubmit}
                       style={styles.submitButton}>
                <Text style={styles.text}>Submit</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        minHeight: '100%',
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
    },
    checkbox: {
        marginRight: 10,
        color: 'blue',
    },
    checkboxList: {
        rowGap: 10
    },
    text: {
        color: 'lightgrey',
    },
    warning: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'red',
        marginVertical: 5,
    },
    submitButton: {
        backgroundColor: 'black',
        alignSelf: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        marginVertical: 10
    },
})