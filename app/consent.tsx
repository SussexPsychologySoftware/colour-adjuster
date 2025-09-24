import { useState } from "react";
import {Text, View, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Linking} from 'react-native';
import RadioList from "@/components/RadioList";
import {Checkbox} from 'expo-checkbox';
import {router} from "expo-router";
import { DataService } from '@/services/dataService';
import SubmitButton from "@/components/SubmitButton";
import * as Device from 'expo-device';

import { globalStyles } from '@/styles/appStyles';
import {SafeAreaView} from "react-native-safe-area-context";
import NumericInput from "@/components/NumericInput";
// import DeviceInfo from "react-native-device-info";

interface Consent {
    futureStudies: boolean
    consent: string
    placeOfBirth: string
    secondLetterSecondName: string
    firstLetterStreetName: string
    finalDigitMobileNumber: string
    email: string
}

export default function ConsentScreen() {
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [futureStudies, setFutureStudies] = useState(false);
    const [consent, setConsent] = useState('');
    const [codeBirth, setCodeBirth] = useState('');
    const [codeName, setCodeName] = useState('');
    const [codeStreet, setCodeStreet] = useState('');
    const [codePhone, setCodePhone] = useState('');
    const [email, setEmail] = useState('');
    // const participantId = [codeBirth, codeName, codeStreet, codePhone].join('');

    const testNoMissingResponses = () => {
        //'I consent to take part in this study and agree to my data being recorded.'
        //'I would like to continue without my data being recorded.'
        if (consent === '') return 'Please choose one of the consent options above'
        const codeRequired = consent === 'I consent to take part in this study and agree to my data being recorded.'
        if (codeRequired && [codeBirth, codeName, codeStreet, codePhone].includes('')) {
            return 'Please fill out participant code'
        }
        if (email !== '' && !email.split('').includes('@')) {
            return 'Please enter a valid email address'
        } else return true
    }

    const constructParticipantCode = () => {
        return [codeBirth, codeName, codeStreet, codePhone].join('')
    }

    function generateRandomID(length: number) {
        let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += (characters[Math.floor(Math.random() * characters.length)]);
        }
        return id
    }

    const getDeviceInfo = async () => {
        //https://github.com/react-native-device-info/react-native-device-info?tab=readme-ov-file
        // react-native-device-info
        // return {
        //     // Device id
        //     deviceId: await DeviceInfo.getUniqueId(),
        //     brand: DeviceInfo.getBrand(),
        //     model: DeviceInfo.getModel(),
        //     hardware: DeviceInfo.getHardware(),
        //     product: DeviceInfo.getProduct(),
        //     isTablet: DeviceInfo.isTablet(),
        //     deviceType: DeviceInfo.getDeviceType(), // 'Handset', 'Tablet', etc.
        //     userAgent: await DeviceInfo.getUserAgent(),
        //     // os
        //     systemName: DeviceInfo.getSystemName(),
        //     systemVersion: DeviceInfo.getSystemVersion(),
        //     systemBuildId: DeviceInfo.getBuildId(),
        //     // app
        //     appVersion: DeviceInfo.getVersion(),
        //     appBuildNumber: DeviceInfo.getBuildNumber(),
        // }

        return {
            deviceType: Device.deviceType,
            brand: Device.brand,
            androidDesignName: Device.designName,
            deviceYearClass: Device.deviceYearClass,
            isDevice: Device.isDevice,
            modelId: Device.modelId,
            manufacturer: Device.manufacturer,
            modelName: Device.modelName,
            osBuildId: Device.osBuildId,
            osName: Device.osName,
            osVersion: Device.osVersion,
            productName: Device.productName
        }
    }

        const handleSubmit = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            const validResponses = testNoMissingResponses()
            if (validResponses !== true) {
                setWarning(validResponses)
                return
            }
            setWarning('')

            const participantId = constructParticipantCode()
            const randomId = generateRandomID(16)
            const deviceInfo = await getDeviceInfo()
            const consentData = {
                futureStudies,
                consent,
                email,
                participantId,
                randomId,
                deviceInfo
            }
            await DataService.setParticipantID(randomId)
            const sendDataConsent = consent === "I consent to take part in this study and agree to my data being recorded."
            await DataService.setSendDataConsent(sendDataConsent)
            await DataService.saveData(consentData, 'consent', sendDataConsent ? 'PivGLj2cDZ2w' : undefined)
            router.replace('/confirmSettings')
        } catch (e) {
            console.log(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <ScrollView style={globalStyles.scrollViewContainer}
                        contentContainerStyle={{backgroundColor: 'black'}}>
                <SafeAreaView>
                <Text style={globalStyles.pageTitle}>Information & Consent Form</Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    Thank you for carefully reading this information sheet, a copy of which you can keep for your
                    records.
                    This study is being conducted by Yesesvi Konakanchi (yk357@sussex.ac.uk) and Dr John Maule
                    (j.maule@sussex.ac.uk)
                    from the School of Psychology, University of Sussex, who are happy to be contacted if you have any
                    questions.
                </Text>
                <Text style={globalStyles.sectionTitle}>Invitation to take part</Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    You are being invited to take part in a research study to further our understanding of colour
                    vision.
                    The research is being funded by the School of Psychology, University of Sussex.
                </Text>
                <Text style={globalStyles.sectionTitle}>Why have I been invited for testing and what will I do?</Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    We are testing adults colour perception on their phones. The experiment will take no more than 30
                    minutes. It involves making remote colour adjustments on your mobile device, followed by a short
                    questionnaire.
                </Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    For the study, you will be required to download an app on your mobile device. Although it is preferred to
                    complete the study on the phone, you can access the study on a computer device here:
                    <Text style={[globalStyles.text, globalStyles.link]}
                          onPress={() => Linking.openURL('https://sussexpsychologysoftware.github.io/colour-adjuster/')}>
                        {' '}https://sussexpsychologysoftware.github.io/colour-adjuster/{' '}
                    </Text>
                      and complete the
                    study, if so, please state in the questionnaire that you are not doing the study on your phone.
                </Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    After completing the task, you will be invited to do a small calibration procedure which measures
                    the display range of your mobile device.
                    The procedure would be quick and would have no effect on the device&#39;s performance.
                    This is optional and would only be conducted with your consent.
                </Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    Additionally, you have the option to choose to participate without your data being recorded.
                    Participation in this study is part of your practical learning of psychology experiments but is not
                    binding to your data being collected. All data collection is optional and consensual and choosing
                    not to submit your data will not affect your grades or progress.
                </Text>
                <Text style={globalStyles.sectionTitle}>What will happen to the results of my personal
                    information?</Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    The results of this research may be written into a scientific report for a psychology dissertation
                    and/or publication.
                    We anticipate being able to provide a summary of our findings on request from January 2025.
                </Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    Your privacy will be ensured in the way described in the consent information below.
                    Please read this information carefully and then, if you wish to take part, please proceed to show
                    you have fully understood this sheet,
                    and that you consent to take part in the study as it is described here.
                </Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    You will generate your own participant code by giving us four pieces of information to form a code
                    which will be unique to you but could not identify you.
                    This code will be used to pair your data from the online task with measurements from your device.
                    The use of this code does not mean that your data is strictly anonymous but instead that the data
                    cannot be attributed to a specific participant without the use of additional information.
                    This additional information is only available if you provide it in future (e.g. you wish to
                    withdraw).
                    Your consent will be recorded with your personal code and responses.
                </Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    All data will be transmitted from the JsPsych interface of the online task through the Open Science
                    Framework, a data management system.
                    Raw data will be stored in a private OSF repository, available only to the research team. Both
                    comply with the General Data Protection Regulation (EU) 2016/679 and UK data protection legislation
                    will only be accessible to members of the project team.
                    If any data is made available to the wider scientific community your experimental data may be
                    available with your participant code (pseudonym), but never your name.
                    This means that no data provided can be identifiable back to you.
                </Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    If you have concerns about the collection, storage, or use of your personal data, you can contact
                    University of Sussex Data Protection Officer: dpo@sussex.ac.uk.
                </Text>
                <Text style={globalStyles.sectionTitle}>Who has approved this study?</Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    The research has been approved by the Science & Technology Cross-Schools Research Ethics Committee
                    (C-REC) ethical review process (ER/YK357/4)
                </Text>
                <Text style={globalStyles.sectionTitle}>Contact for Further Information</Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    If you have any concerns relating to this project please contact Yesesvi Konakanchi
                    (yk357@sussex.ac.uk), Dr John Maule (j.maule@sussex.ac.uk) and/or the Chair of the Science and
                    Technology Cross Schools Research Ethics Committee, (crecscitec@sussex.ac.uk).
                </Text>
                <Text style={globalStyles.sectionTitle}>Insurance</Text>
                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    The University of Sussex has insurance in place to cover its legal liabilities in respect of this
                    study.
                </Text>

                <Text style={globalStyles.sectionTitle}>CONSENT</Text>
                <View style={styles.indentedList}>
                    <Text style={globalStyles.text}>• I understand that by signing below I am agreeing to take part in
                        the University of Sussex research described here, and that I have read and understood this
                        information sheet.</Text>
                    <Text style={globalStyles.text}>• I understand that my participation is entirely voluntary, that I
                        can choose not to participate in part or all of the study,
                        and that I can withdraw at any stage of testing without having to give a reason and without
                        being penalised in any way (e.g., if I am a student, my decision whether or not to take part
                        will not affect my grades or personal record).
                    </Text>
                    <Text style={globalStyles.text}>• I understand I can request without penalty that my contact details
                        can be withdrawn and deleted after testing is complete. Your experimental data (the responses we
                        record during the study) can be withdrawn prior to data analysis (4 weeks after date of
                        testing).</Text>
                    <Text style={globalStyles.text}>• I understand that my personal data will be used for the purposes
                        of this research study and will be handled in accordance with Data Protection legislation. I
                        understand that the University&#39;s Privacy Notice provides further information on how the
                        University uses personal data in its research.</Text>
                    <Text style={globalStyles.text}>• I understand that my collected data will be stored using only my
                        research participant code I understand my data, identified by participant code only, may be made
                        publicly available through online data repositories or at the request of other
                        researchers.</Text>
                    <Text style={globalStyles.text}>• I understand that my participation will remain confidential in any
                        written reports of this research, and that no information I disclose will lead to the
                        identification in those reports of any individual either by the researchers or by any other
                        party, without first obtaining my written permission.</Text>
                </View>
                <View style={styles.consentOptionsContainer}>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            style={styles.checkbox}
                            value={futureStudies}
                            onValueChange={(checked) => setFutureStudies(checked)}
                            color={futureStudies ? 'grey' : undefined}
                        />
                        <Text style={globalStyles.text}>Our research group at the University of Sussex carries out
                            studies on colour vision and colour perception.
                            Please check this box if you are happy for us to include your data again in future studies
                            if these have gained independent ethical approval,
                            based on the strict confidentiality terms described above.
                        </Text>
                    </View>
                    <RadioList
                        options={['I consent to take part in this study and agree to my data being recorded.', 'I would like to continue without my data being recorded.']}
                        onSelect={setConsent}/>
                </View>

                <Text style={globalStyles.sectionTitle}>Participant code:</Text>
                <View style={styles.codeSection}>
                    <View style={styles.codeItem}>
                        <Text style={globalStyles.text}>1. Please enter the last letter of your place of birth:</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={codeBirth}
                            onChangeText={(text) => setCodeBirth(text.replace(/[^a-zA-Z]/g, '').slice(0, 1))}
                            maxLength={1}
                            autoCapitalize="characters"
                            placeholder="Letter"
                            placeholderTextColor='#aaaaaa'
                            disableFullscreenUI={true}
                        />
                    </View>

                    <View style={styles.codeItem}>
                        <Text style={globalStyles.text}>2. Please enter the second letter of your second name:</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={codeName}
                            onChangeText={(text) => setCodeName(text.replace(/[^a-zA-Z]/g, '').slice(0, 1))}
                            maxLength={1}
                            autoCapitalize="characters"
                            placeholder="Letter"
                            placeholderTextColor='#aaaaaa'
                            disableFullscreenUI={true}
                        />
                    </View>

                    <View style={styles.codeItem}>
                        <Text style={globalStyles.text}>3. Please enter the first letter of the street where you
                            live:</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={codeStreet}
                            onChangeText={(text) => setCodeStreet(text.replace(/[^a-zA-Z]/g, '').slice(0, 1))}
                            maxLength={1}
                            autoCapitalize="characters"
                            placeholder="Letter"
                            placeholderTextColor='#aaaaaa'
                            disableFullscreenUI={true}
                        />
                    </View>

                    <View style={styles.codeItem}>
                        <Text style={globalStyles.text}>4. Please enter the final digit of your mobile phone
                            number:</Text>
                        <NumericInput
                            value={codePhone}
                            onChange={(text) => setCodePhone(text.replace(/[^0-9]/g, '').slice(0, 1))}
                            placeholder="Digit"
                            maxLength={1}
                        />
                    </View>
                </View>
                {/*<Text style={globalStyles.sectionTitle}>Final ID: {participantId}</Text>*/}
                <Text style={[globalStyles.paragraph, globalStyles.text]}>This study may have additional runs, and you
                    may be invited back for further testing sessions.
                    If you&#39;re interested in continuing your participation, please include your email address so you
                    can be contacted for further tests:</Text>
                <TextInput
                    style={globalStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email (optional)"
                    placeholderTextColor='#aaaaaa'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disableFullscreenUI={true}
                />
                {warning && <Text style={styles.warning}>{warning}</Text>}
                <SubmitButton text='Submit' disabledText='Submitting...' disabled={isSubmitting}
                              onPress={handleSubmit}/>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    paragraph: {
        marginVertical: 5,
    },
    indentedList: {
        marginLeft: 20,
        gap: 10,
        marginBottom: 10
    },
    consentOptionsContainer: {
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
        gap: 10,
        // flex: 1,
        // flexWrap: 'nowrap',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // flex: 1,
        // flexWrap: 'nowrap',
    },
    checkbox: {
        marginRight: 10,
    },
    codeSection: {
        gap: 10,
        marginBottom: 10,
        justifyContent: 'center',
        marginHorizontal: 10
    },
    codeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        color: 'lightgrey',
        justifyContent: 'space-between',
    },
    codeInput: {
        height: '100%',
        color: 'lightgrey',
    },
    codeLabel: {
        color: 'lightgrey',
    },
    emailInput: {
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 5,
        color: 'lightgrey',
        // margin: 5,
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
    disabled: {
        backgroundColor: 'gray',
        color: 'lightgrey',
    },



    page: {
        minHeight: '100%',
        padding: 20,
        backgroundColor: 'black',
    },
    pageTitle: {
        fontSize: 45,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'lightgray',
    },
    sectionContainer: {
        gap: 10,
        marginVertical: 10
    },
    questionText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    numericInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
    },
})
