import Checkbox from 'expo-checkbox';
import {View, Text, StyleSheet} from "react-native";
import {useState} from 'react'
import {router} from "expo-router";
import SubmitButton from "@/components/SubmitButton";
import {globalStyles} from "@/styles/appStyles";

export default function ConfirmSettingsScreen() {
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [screenOff, setScreenOff] = useState(false);
    const [doNotDisturb, setDoNotDisturb] = useState(false);

    const handleSubmit = () => {
        if(isSubmitting) return
        setIsSubmitting(true)
        try {
            if(!screenOff || !doNotDisturb) {
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
                    <Text style={globalStyles.text}>Have you switched off any other screen which is nearby?</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        style={styles.checkbox}
                        value={doNotDisturb}
                        onValueChange={(checked)=>setDoNotDisturb(checked)}
                        color={doNotDisturb ? 'grey' : undefined}
                    />
                    <Text style={globalStyles.text}>Have you set your phone to &#39;Do Not Disturb&#39;?</Text>
                </View>
            </View>
            { warning && <Text style={styles.warning}>{warning}</Text>}
            <SubmitButton text='Submit' disabledText='Submitting...' disabled={isSubmitting} onPress={handleSubmit}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        minHeight: '100%',
        padding: 40,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 10,
        color: 'blue',
    },
    checkboxList: {
        rowGap: 10
    },

    warning: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'red',
        marginVertical: 5,
    },
})