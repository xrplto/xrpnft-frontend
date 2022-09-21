import React, { Component, createRef } from "react";
import { useState, useEffect, useRef } from 'react';

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';

const SlotBox = styled('div')(
  ({ theme }) => `
    // padding-top: 40px;
    height: 240px;
    width: 240px;
    margin-bottom: 20px;
    margin-top: 20px;
    // border-style: solid;
    justify-content: center;
    overflow: hidden;
    line-height: 4;
`
);

const SlotBoxArea = styled('div') (
    ({ theme }) => `
        display: flex;
        justify-content: center;
  `
);

const numberOfSymbolsPerSlot = 18;
const spinDuration = 40000;


const generateRefsArray = () => {
    const numberOfSlots = 1;
    var refsArray = [];

    for (var i = 0; i < numberOfSlots; i++) {
        refsArray.push(createRef());
    }
    return refsArray;
};

export default function MySlot({collection}) {

    let counter = 0;

    let symbolArray = [];

    const testRef = [...generateRefsArray()];

    const images = [
        "/static/casino/alcoholic.svg",
        "/static/casino/ace-of-hearts.svg",
        "/static/casino/black-jack.svg",
        "/static/casino/card-game.svg",
        "/static/casino/precious-stone.svg",
        "/static/casino/slot-machine.svg"
    ];

    const [state, setState] = useState({
        currentTime: 0,
        playState: "idle",
        spinState: "idle",
        spin: 0,
        animState: false,
        lastThreeSymbols: []
    });

    const [reelSymbols, setReelSymbols] = useState([]);

    useEffect(() => {
        setReelArraySymbols().then((syms) => {
            setReelSymbols(syms);
        });
    }, []);

    // Generate slots dynamically
    const generateSlots = () => {
        const numberOfSlots = 1;
        var slots = [];
        for (var i = 0; i < numberOfSlots; i++) {
            slots.push(
                <SlotBox key={i} id={i}>
                    <div
                        // className="SlotReelContainer"
                        ref={testRef[i]}
                        onAnimationEnd={onAnimationEnd}
                        onAnimationStart={onAnimationStart}
                    >
                        {/* {
                          generateImageColumn(numberOfSymbolsPerSlot)
                          } */}
                        {reelSymbols[i]}
                    </div>
                </SlotBox>
            );
        }
        return slots;
    }

    const onAnimationStart = () => {
        setState({ spin: 1 });
    };

    const onAnimationEnd = () => {
        const numberOfSlots = 1;

        counter++;
        if (counter === testRef.length) {
            for (var i = 0; i < numberOfSlots; i++) {
                // testRef[i].current.className = "SlotReelContainer";
                testRef[i].current.style.animation = ``;
                //console.log(testRef[i].current.style.animation);
                //console.log(testRef[i].current.className);
                setState({ spin: 0 });
            }
        }
        setState({ animState: false });
        // console.log("End", counter);
    };

    //symbolArray=[]
    //symbolArray=[generateImageColumn(21),generateImageColumn(21),generateImageColumn(21),generateImageColumn(21)]
    const setReelArraySymbols = (callback) => {
        return new Promise((resolve, reject) => {
            resolve(
                (symbolArray = [
                    generateImageColumn(numberOfSymbolsPerSlot),
                    generateImageColumn(numberOfSymbolsPerSlot),
                    generateImageColumn(numberOfSymbolsPerSlot),
                    generateImageColumn(numberOfSymbolsPerSlot)
                ])
            );
        });
    };

    // sampleImage = (<img alt="Oops..." src={images[1]} />);
    //testSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const setImage = (index) => {
        return (
            <img
                alt="Oops..."
                src={images[index]}
                style={{
                    width: '240px',
                    height: '240px',
                    // padding: '10px'
                }}
            />
        )
    }

    const generateImageColumn = (numberOfSymbols) => {
        var nums2 = [];
        var numIndexes = [];

        for (var i = 0; i < numberOfSymbols; i++) {
            var randomIndex = Math.floor(Math.random() * images.length);
            nums2.push(setImage(randomIndex));
            numIndexes.push(randomIndex);
        }

        setState({ lastThreeSymbols: nums2.slice(0, 3) });
        console.log(state.lastThreeSymbols);
        // console.log(nums2.slice(0, 3));
        var output = [nums2, state.lastThreeSymbols];
        console.log(output);
        return output;
    }

    const animateSlotsDownSequentially = () => {
        var increment = 0.5;
        const numberOfSlots = 1;

        for (var i = 0; i < numberOfSlots; i++) {
            // console.log(testRef[i].current.style.animation);

            increment = increment + 0.2;
            // testRef[i].current.className = `SlotReelContainer`;
            testRef[i].current.style.animation = `spinner ${0.6 + increment}s forwards ease-in-out`;
        }
    }

    const spin = () => {
        //resetAllSlots();
        counter = 0;
        setReelArraySymbols().then((syms) => {
            setReelSymbols(syms);
        });

        animateSlotsDownSequentially();
    }
    

    return (
        <div>
            <SlotBoxArea>{generateSlots()}</SlotBoxArea>

            <div>
                <button
                    onClick={() => spin()}
                    disabled={state.spin}
                >
                    {state.spin ? "Spinning??" : "Spin"}
                </button>
            </div>
        </div>
    );
}
