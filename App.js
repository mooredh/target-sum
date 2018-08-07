import React, { Component } from 'react';
import Game from './components/Game'

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gameId: 1,
            winCount: 0,
            randomNumberCount: 4,
            highScore: 0
        }
    }

    resetGame = () => {
        this.setState(prevState => {
            return { gameId: prevState.gameId + 1, winCount: 0, randomNumberCount: 4 };
        });

    }

    winInc = () => {
        if (this.state.winCount > 1 && this.state.winCount % 2 === 0) {
            if (this.state.highScore === this.state.winCount) {
                this.setState(prevState => {
                    return { gameId: prevState.gameId + 1, winCount: prevState.winCount + 1, randomNumberCount: (prevState.randomNumberCount < 11) ? prevState.randomNumberCount + 1 : prevState.randomNumberCount, highScore: prevState.winCount + 1 }
                });
            } else {
                this.setState(prevState => {
                    return { gameId: prevState.gameId + 1, winCount: prevState.winCount + 1, randomNumberCount: (prevState.randomNumberCount < 11) ? prevState.randomNumberCount + 1 : prevState.randomNumberCount }
                });
            }
        } else {
            if (this.state.highScore === this.state.winCount) {
                this.setState(prevState => {
                    return { gameId: prevState.gameId + 1, winCount: prevState.winCount + 1, highScore: prevState.winCount + 1 }
                });
            } else {
                this.setState(prevState => {
                    return { gameId: prevState.gameId + 1, winCount: prevState.winCount + 1, }
                });
            }
        }
    }

    render() {
        return ( <
            Game key = { this.state.gameId }
            onPlayAgain = { this.resetGame }
            randomNumberCount = { this.state.randomNumberCount }
            initialSeconds = { 10 }
            onWin = { this.winInc }
            winCount = { this.state.winCount }
            highScore = { this.state.highScore }
            />
        );
    }
}