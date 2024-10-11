export function JodiCalculator(open, close) {
    let jodiResult = null
    if (open && close) {
        let openString = open.toString();
        let closeString = close.toString();
        let jodiOpen = parseInt(openString[0]) + parseInt(openString[1]) + parseInt(openString[2]);
        let jodiClose = parseInt(closeString[0]) + parseInt(closeString[1]) + parseInt(closeString[2]);
        if (jodiOpen >= 10) {
            jodiOpen = jodiOpen % 10;
        }
        if (jodiClose >= 10) {
            jodiClose = jodiClose % 10;
        }
        return jodiOpen.toString() + jodiClose.toString();
        // jodiResult = parseInt(jodiSum);
    }
    return jodiResult;

}

export function SinglePannaCalculator(open, close) {
    let singlePanna = null
    if (open || close) {
        if (!/(.)\1/.test(open) && ! /^(.)\1+$/.test(open)) {
            singlePanna = {
                open: parseInt(open) || null,
                close: null
            }
        }
        if (! /(.)\1/.test(close) && /^(.)\1+$/.test(close)) {
            singlePanna = {
                open: null,
                close: parseInt(close) || null
            }
        }
        if (!/(.)\1/.test(open) && !/^(.)\1+$/.test(close)) {
            singlePanna = {
                open: parseInt(open) || null,
                close: parseInt(close) || null
            }
        }
        if (/(.)\1/.test(close) && /^(.)\1+$/.test(close) && /(.)\1/.test(open) && /^(.)\1+$/.test(open)) {
            singlePanna = null
        }
    }
    return singlePanna;
}
export function DoublePannaCalculator(open, close) {
    let doublePanna = null
    if (open || close) {
        if (!/^(\d)\1+$/.test(open) && !/^(\d)\1+$/.test(close)) {
            if (/(.)\1/.test(open) && !/(.)\1/.test(close)) {
                doublePanna = {
                    open: parseInt(open) || null,
                    close: null
                }
            }
            if (!/(.)\1/.test(open) && /(.)\1/.test(close)) {
                doublePanna = {
                    open: null,
                    close: parseInt(close) || null
                }
            }
            if (/(.)\1/.test(open) && /(.)\1/.test(close)) {
                doublePanna = {
                    open: parseInt(open) || null,
                    close: parseInt(close) || null
                }
            }
        }
        if (!/(.)\1/.test(open) && !/(.)\1/.test(close)) {
            doublePanna = null
        }

    }
    return doublePanna;
}
export function TriplePannaCalculator(open, close) {
    let TriplePanna = null
    if (open || close) {
        if (/^(\d)\1+$/.test(open) && /^(\d)\1+$/.test(close)) {
            TriplePanna = {
                open: parseInt(open) || null,
                close: parseInt(close) || null
            }
        }
        if (/^(\d)\1+$/.test(open) && !/^(\d)\1+$/.test(close)) {
            TriplePanna = {
                open: parseInt(open) || null,
                close: null
            }
        }
        if (!/^(\d)\1+$/.test(open) && /^(\d)\1+$/.test(close)) {
            TriplePanna = {
                open: null,
                close: parseInt(close) || null
            }
        }
        if (!/^(\d)\1+$/.test(open) && !/^(\d)\1+$/.test(close)) {
            TriplePanna = null
        }

    }
    return TriplePanna;
}


// halfSangamA 

export function HalfSangamACalculatorA(open, jodi) {
    let halfSangamAResult = null;
    if (open && jodi) {
        let jodiString = jodi.toString()[1];
        halfSangamAResult = {
            open: open,
            closeDigit: parseInt(jodiString)
        }
    }
    return halfSangamAResult;
}
export function HalfSangamACalculatorB(close, jodi) {
    let halfSangamAResult = null;
    if (close && jodi) {
        let jodiString = jodi.toString()[0];
        halfSangamAResult = {
            close: close,
            closeDigit: parseInt(jodiString)
        }
    }
    return halfSangamAResult;
}



export function isGameMatching(game, payload) {
    //singleAnk handling 
    let gameData = null

    if (game.singleAnk) {
        if (!payload.isUpdating && game.open) {
            let gameNumbers = game.singleAnk
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.singleAnk?.open
                if (payloadNumber >= 10) {
                    payloadNumber = payloadNumber % 10
                }
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 95
                    }
                }
            })
        } else {
            let gameNumbers = game._doc.singleAnk
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.singleAnk?.close
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 95
                    }
                }
            })
        }
    }
    if (game._doc.jodi) {
        let gameNumbers = game._doc.jodi
        gameNumbers.forEach((gameNumber) => {

            let payloadNumber = payload?.jodi
            if (gameNumber.number === payloadNumber) {
                gameData = {
                    userId: game.userID,
                    points: game.jodi.points * 950
                }
            }

        })


    }
    if (game.singlePanna) {
        if (!payload.isUpdating &&game._doc.open) {
            let gameNumbers = game._doc.singlePanna
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.singlePanna?.open
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 1400
                    }
                }
            })
        } else {
            let gameNumbers = game._doc.singlePanna
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.singlePanna?.close
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 1400
                    }
                }
            })
        }
    }
    if (game.doublePanna) {
        if (!payload.isUpdating &&game._doc.open) {
            let gameNumbers = game._doc.doublePanna
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.doublePanna?.open
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 2800
                    }
                }
            })
        } else {
            let gameNumbers = game._doc.doublePanna
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.doublePanna?.close
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 2800
                    }
                }
            })
        }
    }
    if (game.triplePanna) {
        if (!payload.isUpdating &&game._doc.open) {
            let gameNumbers = game._doc.triplePanna
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.triplePanna?.open
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 7000
                    }
                }
            })
        } else {
            let gameNumbers = game._doc.triplePanna
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload.triplePanna?.close
                if (gameNumber.number === payloadNumber) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 7000
                    }
                }
            })
        }
    }
    if (game.halfSangamA || game._doc.halfSangamB) {
        if (!payload.isUpdating &&game._doc.open) {
            let gameNumbers = game._doc.halfSangamA
            gameNumbers.forEach((gameNumber) => {
                let payloadNumber = payload?.halfSangamA
                if (gameNumber.open === payloadNumber.open && gameNumber?.closeDigit === payload.halfSangamA?.closeDigit) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 10000
                    }
                }
            })
        } else {
            let gameNumbers = game._doc.halfSangamB
            let payloadNumber = payload.halfSangamB
            gameNumbers.forEach((gameNumber) => {

                if (gameNumber.close === payloadNumber.close && gameNumber?.openDigit === payload.halfSangamB?.openDigit) {
                    gameData = {
                        userId: game.userID,
                        points: gameNumber.points * 10000
                    }
                }
            })
        }
    }
    if (game.fullSangam) {
        let gameNumbers = game._doc.fullSangam
        let payloadNumber = payload?.fullSangam
        gameNumbers.forEach((gameNumber) => {
            if (gameNumber?.open === payloadNumber?.open && gameNumber?.close === payloadNumber?.close) {
                gameData = {
                    userId: game.userID,
                    points: gameNumber.points * 100000
                }
            }
        })
    }

    return gameData

}