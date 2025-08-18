import {useState} from "react";
import {Constraint, Range, RGB, LCH, LAB, TargetColour} from "@/types/colours";
import {colourConstraints} from "@/constants/colourConstraints";
import {DataService} from "@/services/dataService";

export interface Trial {
    targetColour: TargetColour;
    startingColour: LCH; // Store LCH or? also allow null or no?
    renderedRGB: RGB;
    response: LCH|LAB;
    rt: number;
}

const NUMBER_OF_TRIAL_BLOCKS = 4

export const useTrials = () => {

    // CREATE TRIALS ARRAY ****************************

    // Function to shuffle the array (Fisher-Yates Shuffle)
    const shuffle = (array: TargetColour[]): void => {
        for(let i= array.length-1; i>0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Swap
        }
    }

    // Creating trials array
    const createTrialsArray= (): TargetColour[] => {
        const trials: TargetColour[] = []
        const hues: TargetColour[] = ['red', 'green', 'blue', 'yellow'] // TargetColours minus white
        // always white trial followed by a random hue trial, cycle through all before repeat
        for (let b=0; b<NUMBER_OF_TRIAL_BLOCKS; b++) {
            shuffle(hues) // Random shuffle on hues
            for(let h=0; h<hues.length; h++){
                trials.push('white')
                trials.push(hues[h]) // maybe could not shuffle hues in place and pop here?
            }
        }
        return trials
    }

    const [trials] = useState<TargetColour[]>(() => {
        // Initialize trials immediately when state is created
        return createTrialsArray();
    });

    // RANDOM STARTING COLOUR ****************************

    const getRandomHue = (excludedHueRange?: Range): number => {
        if(!excludedHueRange) return Math.floor(Math.random() * 360);

        console.log({excludedHueRange})

        // NOTE: below only works when excluding a range in the middle of the circle, which is the case for all current hues exclusion values
            // Currently exclusion zone is inclusive, i.e. final hue should be <min and >max

        // Calculate sizes of allowed sections
        const degreesAfterExclusion = excludedHueRange.min + (360 - excludedHueRange.max) // note 0 and 360 are the same so max is 359 so all values are equal
        const randomPosition = Math.floor(Math.random() * degreesAfterExclusion)
        return randomPosition < excludedHueRange.min // if below min value
            ? randomPosition // return as-is
            : (randomPosition - excludedHueRange.min) + (excludedHueRange.max+1)  // else adjust up out of our excluded range
    };

    const getRandomStartingColour: (targetColour: TargetColour) => LCH  = (targetColour: TargetColour): LCH => {
        const constraints: Constraint = {...colourConstraints[targetColour]}
        const randomHue: number = getRandomHue(constraints.excludedHueRange) // random hue within the allowed ranges
        if(targetColour === 'white') constraints.c *= Math.random()
        // console.log({targetColour, randomHue, constraints})
        return {l: constraints.l, c: constraints.c, h: randomHue}
    }

    const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0);
    //Index derived state: https://lasalshettiarachchi458.medium.com/understanding-derived-state-in-react-when-and-why-to-use-it-0184bf8b9ea8
    const targetColour = trials[currentTrialIndex] || null;

    const [startingColour, setStartingColour] = useState<LCH>(() => getRandomStartingColour(targetColour)); // Could this also be an index derived state?
    const [data, setData] = useState<Trial[]>([]);
    const [timer, setTimer] = useState<number>(performance.now()); // instead of null?

    // This will depend of if trials have been initialised? but should = NUMBER_OF_TRIAL_BLOCKS * possible TargetColours ['white', 'red', 'green', 'blue', 'yellow']
    const isComplete = currentTrialIndex >= trials.length-1;

    const nextTrial = (): void => {
        const nextTrialIndex = currentTrialIndex + 1;
        // TODO: or useEffect to start new trial and cascade this stuff when the index changes?
        setCurrentTrialIndex(nextTrialIndex);
        const nextTrial = trials[nextTrialIndex]
        const randomStartingColour = getRandomStartingColour(nextTrial);
        console.log('randomStartingColour: ',randomStartingColour);
        setStartingColour(randomStartingColour); // TODO: could maybe just return starting colour from here directly? need it to save the trial here but also use in adjust screen
        setTimer(performance.now());
        //currentTrial // this will be out of date at this point?
    };

    const saveTrial = async (responseColour: LCH|LAB, renderedRGB: RGB) => {
        const trialData: Trial = {
            targetColour,
            startingColour,
            response: responseColour,
            renderedRGB,
            rt: performance.now()-timer
        }
        data.push(trialData)
        setData(data)
        // call next trial or?
    }

    const submitData = async () => {
        const dataConsent = await DataService.getSendDataConsent()
        await DataService.saveData(data,'trialData',dataConsent?'CdE5fn8ckU5w':undefined)
    }

    return {
        trials,
        currentTrialIndex,
        isComplete,
        submitData,
        nextTrial,
        targetColour,
        startingColour,
        saveTrial
    };
};