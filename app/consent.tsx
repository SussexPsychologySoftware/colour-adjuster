import { useState } from "react";
import {Text, View, StyleSheet, TextInput, ScrollView, Pressable} from 'react-native';
import RadioList from "@/components/RadioList";

export default function ConsentScreen() {
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responses, setResponses] = useState({});

    const handleSubmit = () => {
        if(isSubmitting) return
        setIsSubmitting(true)
        try {
            const validResponses = testNoMissingResponses()
            if(!validResponses){
                setWarning('Please answer all questions')
                return
            }
            setWarning('')
            // TODO: Submit responses
        } catch (e) {
            console.log(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.pageTitle}>Information & Consent Form</Text>
            <Text style={styles.paragraph}>
                Thank you for carefully reading this information sheet, a copy of which you can keep for your records.
                This study is being conducted by Yesesvi Konakanchi (yk357@sussex.ac.uk) and Dr John Maule (j.maule@sussex.ac.uk)
                from the School of Psychology, University of Sussex, who are happy to be contacted if you have any questions.
            </Text>
            <Text style={styles.sectionTitle}>Invitation to take part</Text>
            <Text style={styles.paragraph}>
                You are being invited to take part in a research study to further our understanding of colour vision.
                The research is being funded by the School of Psychology, University of Sussex.
            </Text>
            <Text style={styles.sectionTitle}>WHY HAVE I BEEN INVITED FOR TESTING AND WHAT WILL I DO?</Text>
            <Text style={styles.paragraph}>
                We are testing adults colour perception on their phones. The experiment will take no more than 30 minutes. It involves making remote colour adjustments on your mobile device, followed by a short questionnaire.
            </Text>
            <Text style={styles.paragraph}>
                For the study, you will be required to download an app on your mobile device by following this link – https://sussex-psychology-software-team.github.io/Colour-Adjust. Although it is preferred to complete the study on the phone, you can still follow the link on a computer device and complete the study, if so, please state in the questionnaire that you are not doing the study on your phone.
            </Text>
            <Text style={styles.paragraph}>
                After completing the task, you will be invited to do a small calibration procedure which measures the display range of your mobile device. The procedure would be quick and would have no effect on the device's performance. This is optional and would only be conducted with your consent.
            </Text>
            <Text style={styles.paragraph}>
                Additionally, you have the option to choose to participate without your data being recorded. Participation in this study is part of your practical learning of psychology experiments but is not binding to your data being collected. All data collection is optional and consensual and choosing not to submit your data will not affect your grades or progress.
            </Text>
            <Text style={styles.sectionTitle}>WHAT WILL HAPPEN TO THE RESULTS AND MY PERSONAL INFORMATION?</Text>
            <Text style={styles.paragraph}>
                The results of this research may be written into a scientific report for a psychology dissertation and/or publication.
                We anticipate being able to provide a summary of our findings on request from January 2025.
            </Text>
            <Text style={styles.paragraph}>
                Your privacy will be ensured in the way described in the consent information below.
                Please read this information carefully and then, if you wish to take part, please proceed to show you have fully understood this sheet,
                and that you consent to take part in the study as it is described here.
            </Text>
            <Text style={styles.paragraph}>
                You will generate your own participant code by giving us four pieces of information to form a code which will be unique to you but could not identify you.
                This code will be used to pair your data from the online task with measurements from your device.
                The use of this code does not mean that your data is strictly anonymous but instead that the data cannot be attributed to a specific participant without the use of additional information.
                This additional information is only available if you provide it in future (e.g. you wish to withdraw).
                Your consent will be recorded with your personal code and responses.
            </Text>
            <Text style={styles.paragraph}>
                All data will be transmitted from the JsPsych interface of the online task through the Open Science Framework, a data management system.
                Raw data will be stored in a private OSF repository, available only to the research team. Both comply with the General Data Protection Regulation (EU) 2016/679 and UK data protection legislation will only be accessible to members of the project team.
                If any data is made available to the wider scientific community your experimental data may be available with your participant code (pseudonym), but never your name.
                This means that no data provided can be identifiable back to you.
            </Text>
            <Text style={styles.paragraph}>
                If you have concerns about the collection, storage, or use of your personal data, you can contact University of Sussex Data Protection Officer: dpo@sussex.ac.uk.
            </Text>
            <Text style={styles.sectionTitle}>Who has approved this study?</Text>
            <Text style={styles.paragraph}>
                The research has been approved by the Science & Technology Cross-Schools Research Ethics Committee (C-REC) ethical review process. (ER/YK357/4)
            </Text>
            <Text style={styles.sectionTitle}>Contact for Further Information</Text>
            <Text style={styles.paragraph}>
                If you have any concerns relating to this project please contact Yesesvi Konakanchi (yk357@sussex.ac.uk), Dr John Maule (j.maule@sussex.ac.uk) and/or the Chair of the Science and Technology Cross Schools Research Ethics Committee, (crecscitec@sussex.ac.uk).
            </Text>
            <Text style={styles.sectionTitle}>Insurance</Text>
            <Text style={styles.paragraph}>
                The University of Sussex has insurance in place to cover its legal liabilities in respect of this study.
            </Text>

            <Text style={styles.sectionTitle}>CONSENT</Text>
            <View style={styles.indentedList}>
                <Text style={styles.bulletPoint}>{'\u2B24'} I understand that by signing below I am agreeing to take part in the University of Sussex research described here, and that I have read and understood this information sheet.</Text>
                <Text style={styles.bulletPoint}>{'\u2B24'} I understand that my participation is entirely voluntary, that I can choose not to participate in part or all of the study,
                    and that I can withdraw at any stage of testing without having to give a reason and without being penalised in any way (e.g., if I am a student, my decision whether or not to take part will not affect my grades or personal record).
                </Text>
                <Text style={styles.bulletPoint}>{'\u2B24'} I understand I can request without penalty that my contact details can be withdrawn and deleted after testing is complete. Your experimental data (the responses we record during the study) can be withdrawn prior to data analysis (4 weeks after date of testing).</Text>
                <Text style={styles.bulletPoint}>{'\u2B24'} I understand that my personal data will be used for the purposes of this research study and will be handled in accordance with Data Protection legislation. I understand that the University's Privacy Notice provides further information on how the University uses personal data in its research.</Text>
                <Text style={styles.bulletPoint}>{'\u2B24'} I understand that my collected data will be stored using only my research participant code I understand my data, identified by participant code only, may be made publicly available through online data repositories or at the request of other researchers.</Text>
                <Text style={styles.bulletPoint}>{'\u2B24'} I understand that my participation will remain confidential in any written reports of this research, and that no information I disclose will lead to the identification in those reports of any individual either by the researchers or by any other party, without first obtaining my written permission.</Text>
            </View>

            <Text style={styles.sectionTitle}>Form Elements:</Text>
            <Text style={styles.checkbox}>☐ Our research group at the University of Sussex carries out studies on colour vision and colour perception. Please check this box if you are happy for us to include your data again in future studies if these have gained independent ethical approval, based on the strict confidentiality terms described above.</Text>
            <RadioList options={['I consent to take part in this study and agree to my data being recorded.','I would like to continue without my data being recorded.']} onSelect={(option)=>console.log(option)} />

            <Text style={styles.sectionTitle}>Participant code:</Text>
            <View style={styles.indentedList}>
                { ['Please enter the last letter of your place of birth', 'Please enter the second letter of your second name','Please enter the first letter of the street where you live','Please enter the final digit of your mobile phone number'].map(q => (
                        <View key={q} style={styles.idContainer}>
                            <Text>{q}:</Text>
                            <TextInput maxLength={1} style={[styles.textInput, styles.idInput]}/>
                        </View>
                    ))
                }
            </View>
            <Text>This study may have additional runs, and you may be invited back for further testing sessions. If you&#39;re interested in continuing your participation, please include your email address so you can be contacted for further tests</Text>
            <TextInput style={styles.textInput}></TextInput>
            { warning && <Text style={styles.warning}>{warning}</Text>}
            <Pressable onPress={handleSubmit}
                       style={styles.submitButton}>
                <Text>Submit</Text>
            </Pressable>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    idContainer: {
        flexDirection: 'row',
        gap: 10
    },
    idInput: {
        width: 20
    },

    page: {
        minHeight: '100%',
        padding: 10,
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    surveyContainer: {

    },
    sectionContainer: {
        gap: 10,
        marginVertical: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    questionContainer: {

    },
    questionText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    input: {

    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    numericInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    radioInput: {

    },
    choiceOptionsContainer: {

    },
    radioOption: {

    },

    warning: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'red',
        marginVertical: 5,
    },
    submitButton: {
        backgroundColor: 'lightblue',
        alignSelf: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    }

})