import React, { Component, createRef } from "react";

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
    border-style: solid;
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

const numberOfSlots = 1;
const numberOfSymbolsPerSlot = 18;
const spinDuration = 40000;
const log = (toLog) => {
  console.log(toLog);
};

export default class MySlot extends Component {
    constructor() {
        super();
        this.state = {
            currentTime: 0,
            playState: "idle",
            spinState: "idle",
            spin: 0,
            animState: false,
            reelSymbols: [],
            lastThreeSymbols: []
        };

        const generateRefsArray = (numberOfRefs) => {
            var refsArray = [];
            for (var i = 0; i < numberOfRefs; i++) {
                refsArray.push(createRef());
            }
            return refsArray;
        };
        this.testRef = [...generateRefsArray(numberOfSlots)];
        // this.symbolArray = []
    }
    images = [
        "/static/casino/alcoholic.svg",
        "/static/casino/ace-of-hearts.svg",
        "/static/casino/black-jack.svg",
        "/static/casino/card-game.svg",
        "/static/casino/precious-stone.svg",
        "/static/casino/slot-machine.svg"
    ];

    startingArray = [];
    //symbolArray=[]
    //symbolArray=[this.generateImageColumn(21),this.generateImageColumn(21),this.generateImageColumn(21),this.generateImageColumn(21)]
    setReelArraySymbols = (callback) => {
        return new Promise((resolve, reject) => {
            resolve(
                (this.symbolArray = [
                    this.generateImageColumn(numberOfSymbolsPerSlot),
                    this.generateImageColumn(numberOfSymbolsPerSlot),
                    this.generateImageColumn(numberOfSymbolsPerSlot),
                    this.generateImageColumn(numberOfSymbolsPerSlot)
                ])
            );
        });
    };

    generateNumberOfSlotsArray(num) {
        var numArray = [];
        for (var i = 0; i < num; i++) {
            numArray.push(i);
        }
        return numArray;
    }

    // sampleImage = (<img alt="Oops..." src={this.images[1]} />);
    //testSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    setImage(index) {
        return (
            <img
                alt="Oops..."
                src={this.images[index]}
                style={{
                    width: '240px',
                    height: '240px',
                    // padding: '10px'
                }}
            />
        )
    }

    lastThreeIcons = [];
    generateImageColumn(numberOfSymbols) {
        var nums2 = [];
        var numIndexes = [];

        for (var i = 0; i < numberOfSymbols; i++) {
            var randomIndex = Math.floor(Math.random() * this.images.length);
            nums2.push(this.setImage(randomIndex));
            numIndexes.push(randomIndex);
            // if (i > 18) {
            //   this.lastThreeIcons.push(nums2[i]);
            // }
        }
        //  this.startingArray.push(numIndexes.slice(0, 3));
        //  console.log(numIndexes.slice(0, 3));
        // console.log("Starting Arr:", this.startingArray);

        this.lastThreeIcons.push(nums2.slice(0, 3));
        //Get the first 3 elements of random reel
        //console.log(this.lastThreeIcons);
        this.setState({ lastThreeSymbols: nums2.slice(0, 3) });
        console.log(this.state.lastThreeSymbols);
        // console.log(nums2.slice(0, 3));
        var output = [nums2, this.state.lastThreeSymbols];
        console.log(output);
        return output;
    }

    onAnimationStart = () => {
        this.setState({ spin: 1 });
    };
    counter = 0;
    onAnimationEnd = () => {
        this.counter++;
        if (this.counter === this.testRef.length) {
            for (var i = 0; i < numberOfSlots; i++) {
                this.testRef[i].current.className = "SlotReelContainer";
                this.testRef[i].current.style.animation = ``;
                //console.log(this.testRef[i].current.style.animation);
                //console.log(this.testRef[i].current.className);
                this.setState({ spin: 0 });
                this.lastThreeIcons = [];
            }
        }
        this.setState({ animState: false });
        // console.log("End", this.counter);
    };

    //Generate slots dynamically
    generateSlots(numberOfSlots) {
        var slots = [];
        for (var i = 0; i < numberOfSlots; i++) {
            slots.push(
                <SlotBox key={i} id={i}>
                    <div
                        className={`SlotReelContainer ${
                            this.state.animState ? "animation" : ""
                        }`}
                        ref={this.testRef[i]}
                        onAnimationEnd={this.onAnimationEnd}
                        onAnimationStart={this.onAnimationStart}
                    >
                        {/* {
                          this.generateImageColumn(numberOfSymbolsPerSlot)
                          } */}
                        {this.state.reelSymbols[i]}
                    </div>
                </SlotBox>
            );
        }
        return slots;
    }
    currentTop = 0;
    top = 0;

    animateUpDown() {
      this.currentTop = `${this.top}px`;

      this.setState({ playState: "running" });
      //this.setState({ spin: 0 });
      var increment = 0;
      for (var i = 0; i < this.testRef.length; i++) {
          increment = increment + 0.1;
          this.testRef[i].current.style.transition = `top ease-in-out ${6 + increment}s `;
          if (
              this.testRef[i].current.style.top === `${0}px` ||
              this.testRef[i].current.style.top === ""
          ) {
              this.testRef[i].current.style.top = `${-1200}px`;
          } else if (this.testRef[i].current.style.top === `${-1200}px`) {
              this.testRef[i].current.style.top = `${0}px`;
          }
      }
      //Disable transition and return top to 0px
    }
    sliceOffChildren(index) {
        this.testRef[index].current.lastChild.remove();
    }

    animateSlotsDownSequentially(numberOfSlots) {
        var increment = 0.5;

        for (var i = 0; i < numberOfSlots; i++) {
            // console.log(this.testRef[i].current.style.animation);

            increment = increment + 0.2;
            this.testRef[i].current.className = `SlotReelContainer animation`;
            this.testRef[i].current.style.animation = `mymove ${0.6 + increment}s forwards ease-in-out`;
        }
    }
    spin() {
        //this.resetAllSlots();

        this.lastThreeIcons = [];
        this.counter = 0;
        this.setReelArraySymbols().then((syms) => {
          this.setState({ reelSymbols: syms });
          // console.log(this.state.reelSymbols);
        });

        // console.log("length", this.testRef.length);

        //console.log("Yes")
        //  this.animateUpDown();

        //this.setState({ animState: true });

        this.animateSlotsDownSequentially(numberOfSlots);
        //console.log(this.testRef[0].current.style.top);

        //console.log(this.symbolArray)
        // console.log(this.state.reelSymbols)

        // this.setState({ playState: "idle" });
        //  console.log(this.testRef[0].current.style.transition);
        // console.log(this.testRef[0].current.children);

        //console.log(this.testRef[0].current.style.top)
        //  console.log(this.state.animState);
    }
    componentDidMount() {
        this.setReelArraySymbols().then((syms) => {
            this.setState({ reelSymbols: syms });
            //console.log(this.state.reelSymbols);
        });
    }

    render() {
        return (
            <div className="Main">
                <SlotBoxArea>{this.generateSlots(numberOfSlots)}</SlotBoxArea>

                <div>
                    <button
                        onClick={() => this.spin()}
                        disabled={this.state.spin}
                        className={this.state.spin ? `Spinning` : ``}
                    >
                        {this.state.spin ? "Spinning??" : "Spin"}
                    </button>
                </div>
            </div>
        );
    }
}
