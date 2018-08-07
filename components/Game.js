import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button, } from 'react-native';
import RandomNumber from "./RandomNumber";
import shuffle from 'lodash.shuffle';

export default class Game extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedIds: [],
            timeRemain: this.props.initialSeconds
        }

        this.gameStatus = 'PLAYING';
        
        this.randomNumbers = Array 
                    .from({ length:this.props.randomNumberCount })
                    .map(() => 1 + Math.floor(10 * Math.random()));

        this.target = this.randomNumbers
            .slice(0, this.props.randomNumberCount - 3 /*(2 + Math.floor(10 * Math.random()))*/)
            .reduce((acc, curr) => acc + curr, 0);
        
        this.shuffledRandomNumbers = shuffle(this.randomNumbers);
    }

    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
        onPlayAgain: PropTypes.func.isRequired,
        onWin: PropTypes.func.isRequired,
        winCount: PropTypes.number,
        highScore: PropTypes.number,
    };

    componentDidMount = () => {
      this.intervalId = setInterval(() => {
        this.setState(prevState => {
            return { timeRemain: prevState.timeRemain - 1 };
        }, () => {
            if (this.state.timeRemain === 0) {
                clearInterval(this.intervalId);
            }
        });
      }, 1000);
    }
    
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    isNumberSelected(index) {
        return this.state.selectedIds.indexOf(index) >= 0;
    }

    selectNumber(numberIndex) {
        if(!this.isNumberSelected(numberIndex)){
            this.setState(prevState => ({
                selectedIds: [...prevState.selectedIds, numberIndex]
            }));
        }
        else {
            this.setState(prevState => ({
                selectedIds: prevState.selectedIds.filter(num => num !== numberIndex)
            }));
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.selectedIds !== this.state.selectedIds || nextState.timeRemain === 0) {
            this.gameStatus = this.calcGameStatus(nextState);
            if (this.gameStatus !== 'PLAYING') {
                clearInterval(this.intervalId);
            }
        }
    }

    calcGameStatus(nextState) {
        const sumSelected = nextState.selectedIds.reduce((acc, curr) => acc + this.shuffledRandomNumbers[curr], 0);
        if (nextState.timeRemain === 0) {
            return 'LOST';
        }
        if(sumSelected < this.target) {
            return 'PLAYING';
        }
        if (sumSelected === this.target) {
            this.props.onWin()
            return 'WON';
        }
        if(sumSelected > this.target) {
            return 'LOST';
        }
    }

    timer = () => {
        if (this.state.timeRemain <= 3) {
            return 'BAD';
        } else {
            return 'GOOD';
        }
    }

    render() {
        const gameStatus = this.gameStatus;
        return (
        <View style={styles.container}>
            <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
            <View style={styles.randomContainer}>
                {this.shuffledRandomNumbers.map((randomNumber, index) => {
                    return (
                        <RandomNumber 
                        key={index} 
                        number={randomNumber} 
                        isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'} 
                        onPress={this.selectNumber.bind(this)}
                        id={index}
                        status={gameStatus}
                        /> 
                    );
                })}
            </View>
            <View>
                {this.gameStatus === 'LOST' && (
                    <Button title="Play Again" onPress={this.props.onPlayAgain} />
                )}
                <Text style={styles[`STATUS_${this.timer()}`]}>Time: {this.state.timeRemain}</Text>
                <Text>Score: {this.props.winCount}</Text>
                <Text>High Score: {this.props.highScore}</Text>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
    },
    target: {
        fontSize: 50,
        backgroundColor: '#bbb',
        margin: 50,
        textAlign: 'center'
    },
    randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    STATUS_WON: {
        backgroundColor: 'green'
    },
    STATUS_LOST: {
        backgroundColor: 'red'
    },
    STATUS_PLAYING: {
        backgroundColor: '#bbb'
    },
    STATUS_BAD: {
        color: 'red'
    },
    STATUS_GOOD: {
        color: 'green'
    }
});
