(function(app) {
  "use strict";

  window.iWantStopGameNow = false

  const config = {
    0: 0,
    1: 10,
    2: 260,
    3: 6760
  }

  function checkIfNeedBet() {
    let valid = true

    document.querySelectorAll('.odd-item').forEach(el => {
      if (!el.querySelector('.odd-value') || el.querySelector('.odd-value').innerHTML !== '5.20') {
        valid = false
      }
    })

    return valid
  }

  function makeBet() {

  }

  class gameBet {
    constructor() {
      this.timeId = null

      this.iteration = 1
      this.alreadyBetForThisPack = false
      this.lastGameLost = false

      this.lastGameNumber = 0
      this.gameNumber = 0
      this.winInRow = [0]
      this.loseInRow = [0]
      this.winMoney = 0

      this.lastWinner = null
      this.winnerInRow = 0
      this.winThreeInRowTimes = 0
      this.winThreeArray = []


      this.checkAll = this.checkAll.bind(this)
      this.bet = this.bet.bind(this)
      this.statistic = this.statistic.bind(this)
      this.findWinner = this.findWinner.bind(this)
      this.calculateLost = this.calculateLost.bind(this)
      this.calculateWin = this.calculateWin.bind(this)
      this.stopGame = this.stopGame.bind(this)

      this.init()
    }

    bet() {
      // TODO this is must && (new Date()).getHours() > 24

      if (this.iteration === 1 && window.iWantStopGameNow) {
        this.stopGame()
        console.log('Stop for today');
        return;
      }

      console.log("I`m making bet")
      this.gameNumber++;
      makeBet()
    }

    calculateLost() {
      if (this.lastGameLost) {
        this.loseInRow[this.loseInRow.length - 1] = this.loseInRow[this.loseInRow.length - 1] + 1
      } else {
        this.loseInRow.push(1)
      }

      this.lastGameLost = true
      this.iteration++
    }

    calculateWin(winnerCount, winnerIndex) {
      const countWinnersForMoney = winnerIndex === 5 ? winnerCount - 1 : winnerCount
      const koef = countWinnersForMoney * 5.20 - 5

      let prevLost = 0

      for(let i=this.iteration-1; i>0; i--) {
        prevLost = prevLost + (config[this.iteration - 1] * 5)
      }

      this.winMoney = this.winMoney + +(config[this.iteration] * koef).toFixed(2) - prevLost

      if (this.lastGameLost) {
        this.winInRow.push(1)
      } else {
        this.winInRow[this.winInRow.length - 1] = this.winInRow[this.winInRow.length - 1] + 1
      }

      this.lastGameLost = false
      this.iteration = 1
    }

    findWinner() {
      let winnerCount = 0
      let winnerIndex = null

      document.querySelectorAll('.odd-item').forEach((el, id) => {
        if (el.querySelector('.odd-status.won')) {
          winnerCount++
          winnerIndex = id
        }
      })

      if (winnerCount === 0 || this.lastGameNumber === this.gameNumber) {
        return false
      }

      this.lastGameNumber = this.gameNumber

      if (winnerCount === 1 && winnerIndex === 5) {
        this.calculateLost()
      } else {
        this.calculateWin(winnerCount, winnerIndex)
      }

      if (winnerCount === 1) {
        if (this.lastWinner === winnerIndex) {
          this.winnerInRow++
        } else {
          this.winnerInRow = 0
        }
      }

      if (this.winnerInRow === 2) {
        this.winThreeArray.push(winnerIndex)
        this.winThreeInRowTimes++
      }

      this.lastWinner = winnerIndex

      this.statistic()

      return true
    }

    statistic() {
      let counted = 0

      this.loseInRow.forEach(el => {
        counted+= el
      })

      this.winInRow.forEach( el => {
        counted+= el
      })

      const missedWin = this.gameNumber - counted


      console.log('Game number', this.gameNumber)
      console.log('winInRow ', this.winInRow)
      console.log('loseInRow ', this.loseInRow)
      console.log('missedWin', missedWin)
      console.log('date', new Date())
      console.log('winThreeInRowTimes', this.winThreeInRowTimes)
      console.log('this.winThreeArray', this.winThreeArray)
      console.log('winMoney', this.winMoney)

      window.loseInRow = this.loseInRow
      window.winInRow = this.winInRow

      if (this.loseInRow[this.loseInRow.length - 1] === 3) {
        // this.stopGame()

        console.log('EVERYTHING LOST')
      }
    }

    stopGame() {
      clearInterval(this.timeId);
    }

    checkAll() {
      if (this.findWinner()) {
        this.alreadyBetForThisPack = false
      }

      if (!checkIfNeedBet()) {
        return
      }

      if (this.alreadyBetForThisPack) {
        return
      }

      this.alreadyBetForThisPack = true
      this.bet()
    }

    init() {
      this.timeId = setInterval(() => this.checkAll() , 1000);
    }
  }

  // TODO bet

  new gameBet()
})(document);

