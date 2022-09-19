import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';

import PACK_OF_CARDS from '../utils/packOfCards'
import shuffleArray from '../utils/shuffleArray'

import Spinner from './Spinner'
import CardBackDeck from './CardBackDeck'
import queryString from 'query-string'
import useSound from 'use-sound'
import io from 'socket.io-client'

import badLuck from '../assets/sounds/badLuck.mp3'
import isALieSound from '../assets/sounds/toxicidadFuera.mp3'
import bgMusic from '../assets/sounds/digref.mp3'

let socket
const ENDPOINT = 'http://localhost:5000'

const Game = (props) => {
  const data = queryString.parse(props.location.search)

  //initialize socket state
  const [room, setRoom] = useState(data.roomCode)
  const [roomFull, setRoomFull] = useState(false)
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(0)

  useEffect(() => {
      const connectionOptions =  {
          "forceNew" : true,
          "reconnectionAttempts": "Infinity",
          "timeout" : 10000,
          "transports" : ["websocket"]
      }

      socket = io.connect(ENDPOINT, connectionOptions)

      socket.emit('join', {room: room}, (error) => {
          if(error) setRoomFull(true)
      })

      return (() => {socket.disconnect()})

  }, [])

  //initialize game state
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(0)
  const [turn, setTurn] = useState(1)
  const [player1Deck, setPlayer1Deck] = useState([])
  const [player2Deck, setPlayer2Deck] = useState([])
  const [player3Deck, setPlayer3Deck] = useState([])
  const [player4Deck, setPlayer4Deck] = useState([])
  const [lastCardsPlayed, setLastCardsPlayed] = useState([])
  const [currentNumber, setCurrentNumber] = useState(0)
  const [centerCards, setCenterCards] = useState([])
  const [selectedCards, setSelectedCards] = useState([])
  const [discardedCards, setDiscardedCards] = useState([])
  const [isSoundMuted, setSoundMuted] = useState(false)
  const [isMusicMuted, setMusicMuted] = useState(true)
  const [en, setEn] = useState(() => {
    if(data.lan=='true') return true
    else return false
  })

  //set sound effects
  const [playBgMusic, { pause }] = useSound(bgMusic, { loop: true })
  const [playIsALieSound] = useSound(isALieSound)
  const [playBadLuck] = useSound(badLuck)

  //runs once on component mount
  useEffect(() => {
      //shuffle PACK_OF_CARDS array
      const shuffledCards = shuffleArray(PACK_OF_CARDS)

      //extract first 10 elements to player1Deck and check discarded cards
      const player1Deck = manageDiscardedCards(shuffledCards.splice(0, 10))

      //extract first 10 elements to player2Deck and check discarded cards
      const player2Deck = manageDiscardedCards(shuffledCards.splice(0, 10))

      //extract first 10 elements to player1Deck and check discarded cards
      const player3Deck = manageDiscardedCards(shuffledCards.splice(0, 10))

      //extract first 10 elements to player2Deck and check discarded cards
      const player4Deck = manageDiscardedCards(shuffledCards.splice(0, 10))

      //send initial state to server
      socket.emit('initGameState', {
          player1Deck: [...player1Deck],
          player2Deck: [...player2Deck],
          player3Deck: [...player3Deck],
          player4Deck: [...player4Deck],
      })
  }, [])

  useEffect(() => {
      socket.on('initGameState', ({player1Deck, player2Deck, player3Deck, player4Deck}) => {
          setPlayer1Deck(player1Deck)
          setPlayer2Deck(player2Deck)
          setPlayer3Deck(player3Deck)
          setPlayer4Deck(player4Deck)
      })

      socket.on('updateGameState', ({ gameOver, winner, turn, player, playerDeck, currentNumber, lastCardsPlayed, centerCards}) => {
          if(gameOver) setGameOver(gameOver)
          if(winner) setWinner(winner)
          if(player == 1) setPlayer1Deck(playerDeck)
          if(player == 2) setPlayer2Deck(playerDeck)
          if(player == 3) setPlayer3Deck(playerDeck)
          if(player == 4) setPlayer4Deck(playerDeck)
          if(currentNumber != null) setCurrentNumber(currentNumber)
          if(lastCardsPlayed) setLastCardsPlayed(lastCardsPlayed)
          if(centerCards) setCenterCards(centerCards)
          if(turn) setTurn(turn)
      })

      socket.on("roomData", ({ users }) => {
          setUsers(users)
      })

      socket.on('currentUserData', ({ name }) => {
          setCurrentUser(name)
      })

  }, [])

  //some util functions
  function checkGameOver(player_deck) {
      return (!player_deck.length)
  }

  function checkWinner(player_deck, player) {
      if(!player_deck.length) return player
      else return 0
  }

  function nextPlayer(player) {
      if(player == 4) return 1
      else return player + 1
  }

  function prevPlayer(current) {
      if(current == 1) return 4
      else return current-1
  }

  function playerDeck(player) {
      if(player == 1) return player1Deck
      else if(player == 2) return player2Deck
      else if(player == 3) return player3Deck
      else return player4Deck
  }

  function manageDiscardedCards(deck) {
      let numbers = [0,0,0,0,0,0,0,0,0,0]
      for(let i = 0; i < deck.length; ++i){
          ++numbers[parseInt(deck[i][0])]
      }

      let newDeck = deck.filter(function (elem) {
        return numbers[parseInt(elem[0])] != 4
      })

      return newDeck
  }

  function removeBfromA(a, b) {
      let newArray = a.filter(function (item) {
        return !b.includes(item)
      })
      return newArray
  }

  function isSelected(e) {
      return selectedCards.includes(e)
  }

  function select(item) {
      let newSelectedCards = [...selectedCards]
      newSelectedCards.push(item)
      setSelectedCards(newSelectedCards)
  }

  function unSelect(item) {
      let newSelectedCards = [...selectedCards]
      newSelectedCards.splice(newSelectedCards.indexOf(item),1)
      setSelectedCards(newSelectedCards)
  }

  function backgroundMusic() {
      if(isMusicMuted) {
        playBgMusic()
        setSoundMuted(true)
      }
      else pause()
      setMusicMuted(!isMusicMuted)
  }

  function soundBehavour() {
    if(isSoundMuted && !isMusicMuted) {
      pause()
      setMusicMuted(true)
    }
    setSoundMuted(!isSoundMuted)
  }

  function handleLie() {
      !isSoundMuted && playIsALieSound()
      //Add center cards to previous player
      let liar = prevPlayer(turn)
      let newDeck = [...playerDeck(liar),...centerCards]
      newDeck = manageDiscardedCards(newDeck)
      //Update state
      socket.emit('updateGameState', {
          player: liar,
          playerDeck: newDeck,
          currentNumber: 0,
          lastCardsPlayed: [],
          centerCards: []
      })
  }

  function handleTrue() {
      !isSoundMuted && playBadLuck()
      //Get center cards
      let newDeck = [...playerDeck(currentUser),...centerCards]
      newDeck = manageDiscardedCards(newDeck)
      //Update state
      let prevPlayerDeck = playerDeck(prevPlayer(turn))
      let playerTurn = turn
      if(currentUser == turn) playerTurn = nextPlayer(turn)
      socket.emit('updateGameState', {
          gameOver: checkGameOver(prevPlayerDeck),
          winner: checkWinner(prevPlayerDeck, prevPlayer(turn)),
          turn: playerTurn,
          player: currentUser,
          playerDeck: newDeck,
          currentNumber: 0,
          lastCardsPlayed: [],
          centerCards: []
      })
      setSelectedCards([])
  }

  //button handlers
  const playCardsHandler = (number) => {
      if(!selectedCards.length) {
        if(en) alert("Select cards first")
        else alert("Seleccione cartas primero")
      }
      else {
          let newDeck = removeBfromA(playerDeck(turn), selectedCards)
          let prevPlayerDeck = playerDeck(prevPlayer(turn))
          socket.emit('updateGameState', {
              gameOver: checkGameOver(prevPlayerDeck),
              winner: checkWinner(prevPlayerDeck, prevPlayer(turn)),
              player: turn,
              playerDeck: [...newDeck],
              currentNumber: number,
              lastCardsPlayed: [...selectedCards],
              centerCards: [...centerCards,...selectedCards],
              turn: nextPlayer(turn)
          })
          setSelectedCards([])
      }
  }

  const isALieHandler = () => {
      if(centerCards.length) {
        let lie = false;
        for(var i = 0; i < lastCardsPlayed.length && !lie; ++i) {
            let x = parseInt(lastCardsPlayed[i][0])+1
            if(x != currentNumber && x != 1) lie = true
        }
        if(lie) handleLie()
        else handleTrue()
      }
  }

  const answerHandler = () => {
      if(centerCards.length) handleTrue()
  }

  //texts
  const [lanButtonText, setLanButtonText] = useState(() => {
    if(en) return 'ES'
    else return 'EN'
  })

  const [gameOverText, setGameOverText] = useState(() => {
    if(en) return 'GAME OVER'
    else return 'FIN DEL JUEGO'
  })

  const [roomFullText, setRoomFullText] = useState(() => {
    if(en) return 'Room Full'
    else return 'Sala llena'
  })

  const [quitText, setQuitText] = useState(() => {
    if(en) return 'QUIT'
    else return 'SALIR'
  })

  const [isALieText, setIsALieText] = useState(() => {
    if(en) return 'BULLSHIT'
    else return 'ES MENTIRA'
  })

  const [playCardsText, setPlayCardsText] = useState(() => {
    if(en) return 'PLAY YOUR CARDS'
    else return 'JUEGA TUS CARTAS'
  })

  const [selectANumberText, setSelectANumberText] = useState(() => {
    if(en) return 'Select a number'
    else return 'Selecciona un Numero'
  })

  const [playerText, setPlayerText] = useState(() => {
    if(en) return 'Player'
    else return 'Jugador'
  })

  const [winnerText, setWinnerTextText] = useState(() => {
    if(en) return 'wins!'
    else return 'gana!'
  })

  const [gameCodeText, setGameCodeText] = useState(() => {
    if(en) return 'Game Code:'
    else return 'Código sala:'
  })

  const [currentNumberText, setCurrentNumberText] = useState(() => {
    if(en) return 'Current Number:'
    else return 'Numero en juego:'
  })

  const [lastCardsPlayedText, setLastCardsPlayedText] = useState(() => {
    if(en) return 'Last Played Cards:'
    else return 'Ultimas cartas jugadas:'
  })

  const [centerCardsText, setCenterCardsText] = useState(() => {
    if(en) return "Cards on the table:"
    else return "Cartas en la mesa:"
  })

  const [waiting1Text, setWaiting1Text] = useState(() => {
    if(en) return "Waiting for 1 Player."
    else return "Esperando a 1 jugador."
  })

  const [waiting2Text, setWaiting2Text] = useState(() => {
    if(en) return "Waiting for 2 Players."
    return "Esperando a 2 jugadores."
  })

  const [waiting3Text, setWaiting3Text] = useState(() => {
    if(en) return "Waiting for 3 Players."
    return "Esperando a 3 jugadores."
  })

  const [exclamation, setExclamation] = useState(() => {
    if(en) return ""
    return "¡"
  })

  const [answerText, setAnswerText] = useState(() => {
    if(en) return "I'VE ANSWERED!"
    return "¡HE RESPONDIDO!"
  })

  const [screenText, setScreenText] = useState(() => {
    if(en) return "Screen size not suported"
    return "Tamaño de pantalla no soportado"
  })

  function changeLanguage(){
    if(en) {
      setLanButtonText('EN')
      setGameOverText('FIN DEL JUEGO')
      setRoomFullText('Sala llena')
      setQuitText('SALIR')
      setIsALieText('ES MENTIRA')
      setPlayCardsText('JUEGA TUS CARTAS')
      setSelectANumberText('Selecciona un Numero')
      setPlayerText('Jugador')
      setWinnerTextText('gana!')
      setGameCodeText('Código sala:')
      setCurrentNumberText('Numero en juego:')
      setLastCardsPlayedText('Ultimas cartas jugadas:')
      setCenterCardsText('Cartas en la mesa: ')
      setWaiting1Text("Esperando a 1 jugador.")
      setWaiting2Text("Esperando a 2 jugadores.")
      setWaiting3Text("Esperando a 3 jugadores.")
      setExclamation("¡")
      setAnswerText("¡HE RESPONDIDO!")
      setScreenText("Tamaño de pantalla no soportado")
      setEn(false)
    }
    else {
      setLanButtonText('ES')
      setGameOverText('GAME OVER')
      setRoomFullText('Room Full')
      setQuitText('QUIT')
      setIsALieText('BULLSHIT')
      setPlayCardsText('PLAY YOUR CARDS')
      setSelectANumberText('Select a number')
      setPlayerText('Player')
      setWinnerTextText('wins!')
      setGameCodeText('Game Code:')
      setCurrentNumberText('Current Number:')
      setLastCardsPlayedText('Last Played Cards:')
      setCenterCardsText("Cards on the table:")
      setWaiting1Text("Waiting for 1 Player.")
      setWaiting2Text("Waiting for 2 Players.")
      setWaiting3Text("Waiting for 3 Players.")
      setExclamation("")
      setAnswerText("I'VE ANSWERED!")
      setScreenText("Screen size not suported")
      setEn(true)
    }
  }

  return (
    <div className= 'game'>
      {
        (!roomFull) ?
        <>
          <div className='top-info'>
            <h1>{gameCodeText + " " + room}</h1>
            <div>
              <button className='game-button green'
                onClick={() => soundBehavour()}>
                {
                  isSoundMuted ?
                  <span className="material-icons">volume_off</span>
                  :
                  <span className="material-icons">volume_up</span>
                }
              </button>
              <button className='game-button green'
                onClick={() => backgroundMusic()}>
                {
                  isMusicMuted ?
                  <span className="material-icons">music_off</span>
                  :
                  <span className="material-icons">music_note</span>
                }
              </button>
              <button className='game-button green'
                onClick={() => changeLanguage()}>
                {lanButtonText}
              </button>
              <a href='/'>
                <button className="game-button red">{quitText}</button>
              </a>
            </div>
          </div>

          {users.length == 1 && <h1 className='waiting-text'>{waiting3Text}</h1>}
          {users.length == 2 && <h1 className='waiting-text'>{waiting2Text}</h1>}
          {users.length == 3 && <h1 className='waiting-text'>{waiting1Text}</h1>}
          {
            users.length==4 &&
            <>
              {
                (gameOver) ?
                <div>
                  <h1>{gameOverText}</h1>
                  <h2>
                    {exclamation + playerText + " " + winner + " " + winnerText}
                  </h2>
                </div>
                :
                <div className='player-distribution'>
                  <div className='column-layout' style={{pointerEvents: 'none'}}>
                    <div className='row-layout corrected-margin align-baseline'>
                      <p className='player-deck-text'>
                        {playerText + " " + nextPlayer(nextPlayer(currentUser))}
                      </p>
                      {turn===prevPlayer(prevPlayer(currentUser)) && <Spinner/>}
                    </div>
                    <CardBackDeck
                      deck = {playerDeck(nextPlayer(nextPlayer(currentUser)))}
                      display = "row-layout"
                      presentation = "card-back"
                    />
                  </div>
                  <br />
                  <div className='middle-info'>
                    <div className='row-layout'>
                      <div className='column-layout margin-right'>
                        <p className='player-deck-text'>
                          {playerText + " " + prevPlayer(currentUser)}
                        </p>
                        {turn===prevPlayer(currentUser) && <Spinner/>}
                      </div>
                      {
                        (playerDeck(prevPlayer(currentUser)).length > 24) &&
                        <CardBackDeck
                          deck = {playerDeck(prevPlayer(currentUser)).slice(24)}
                          display = 'column-layout margin-10'
                          presentation = 'card-back rotated-90 column-gap-20'
                        />
                      }
                      {
                        (playerDeck(prevPlayer(currentUser)).length > 18) &&
                        <CardBackDeck
                          deck = {playerDeck(prevPlayer(currentUser)).slice(18,23)}
                          display = "column-layout margin-10"
                          presentation = "card-back rotated-90 column-gap-20"
                        />
                      }
                      {
                        (playerDeck(prevPlayer(currentUser)).length > 12) &&
                        <CardBackDeck
                          deck = {playerDeck(prevPlayer(currentUser)).slice(12,17)}
                          display = "column-layout margin-10"
                          presentation = "card-back rotated-90 column-gap-20"
                        />
                      }
                      {
                        (playerDeck(prevPlayer(currentUser)).length > 6) &&
                        <CardBackDeck
                          deck = {playerDeck(prevPlayer(currentUser)).slice(6,11)}
                          display = "column-layout margin-10"
                          presentation = "card-back rotated-90 column-gap-20"
                        />
                      }
                      <CardBackDeck
                        deck = {playerDeck(prevPlayer(currentUser)).slice(0,5)}
                        display = "column-layout margin-10"
                        presentation = "card-back rotated-90 column-gap-20"
                      />

                    </div>

                    <div>

                      <div className='row-layout'>
                        <button className='game-button'
                                onClick={isALieHandler}>
                                {isALieText}
                        </button>
                        <button className='game-button'
                                onClick={answerHandler}>
                                {answerText}
                        </button>
                      </div>

                      <div className='game-info'>
                        <p className='centerCardsText'>
                          {centerCardsText + " " + centerCards.length}
                        </p>
                        <p className='lastCardsPlayedText'>
                          {lastCardsPlayedText + " " + lastCardsPlayed.length}
                        </p>
                        <p className='currentNumberText'>
                          {currentNumberText + " " + currentNumber}
                        </p>
                      </div>

                      {
                        (currentNumber != 0) ?
                        <button className='game-button orange'
                                disabled={turn !== currentUser}
                                onClick= {() => playCardsHandler(currentNumber)}>
                                {playCardsText}
                        </button>
                        :
                        <Popup
                          trigger={
                            <button className='game-button orange'
                                    disabled={turn !== currentUser}>
                                    {playCardsText}
                            </button>}
                          modal
                          nested
                        >
                          {close => (
                            <div className="modal">
                              <div className="header"> {selectANumberText}</div>
                              <div className="content">
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(1) && close}
                                >
                                  1
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(2) && close}
                                >
                                  2
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(3) && close}
                                >
                                  3
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(4) && close}
                                >
                                  4
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(5) && close}
                                >
                                  5
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(6) && close}
                                >
                                  6
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(7) && close}
                                >
                                  7
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(8) && close}
                                >
                                  8
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(9) && close}
                                >
                                  9
                                </button>
                                <button
                                  className="game-button orange"
                                  onClick= {() => playCardsHandler(10) && close}
                                >
                                  10
                                </button>
                              </div>
                            </div>
                          )}
                        </Popup>
                      }

                    </div>

                    <div className='row-layout'>
                      <CardBackDeck
                        deck = {playerDeck(prevPlayer(currentUser)).slice(0,5)}
                        display = 'column-layout margin-10 z-index-4'
                        presentation = 'card-back rotated-270 column-gap-20'
                      />
                      {
                        (playerDeck(nextPlayer(currentUser)).length > 6) &&
                        <CardBackDeck
                          deck = {playerDeck(nextPlayer(currentUser)).slice(6,11)}
                          display = 'column-layout margin-10 z-index-3'
                          presentation = 'card-back rotated-270 column-gap-20'
                        />
                      }
                      {
                        (playerDeck(nextPlayer(currentUser)).length > 12) &&
                        <CardBackDeck
                          deck = {playerDeck(nextPlayer(currentUser)).slice(12,17)}
                          display = 'column-layout margin-10 z-index-2'
                          presentation = 'card-back rotated-270 column-gap-20'
                        />
                      }
                      {
                        (playerDeck(nextPlayer(currentUser)).length > 18) &&
                        <CardBackDeck
                          deck = {playerDeck(nextPlayer(currentUser)).slice(18,23)}
                          display = 'column-layout margin-10 z-index-1'
                          presentation = 'card-back rotated-270 column-gap-20'
                        />
                      }
                      {
                        (playerDeck(nextPlayer(currentUser)).length > 24) &&
                        <CardBackDeck
                          deck = {playerDeck(nextPlayer(currentUser)).slice(14)}
                          display = 'column-layout margin-10'
                          presentation = 'card-back rotated-270 column-gap-20'
                        />
                      }
                      <div className='column-layout'>
                        <p className='player-deck-text'>
                          {playerText + " " + nextPlayer(currentUser)}
                        </p>
                        {turn===nextPlayer(currentUser) && <Spinner/>}
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className='row-layout centered margin-top-10'
                       style={(turn == currentUser) ? null : {pointerEvents: 'none'}}
                   >
                    {
                      playerDeck(currentUser).map((item, i) => (
                        (!isSelected(item)) ?
                        <img
                          key={i}
                          className="card-front"
                          onClick={() => select(item)}
                          src={require('../assets/cards-front/' + item + '.png').default}
                          />
                        :
                        <img
                          key={i}
                          className="card-front margin-top-20 selected"
                          onClick={() => unSelect(item)}
                          src={require('../assets/cards-front/' + item + '.png').default}
                          />
                      ))
                    }
                  </div>
                </div>
              }
            </>
          }
        </>
        :
        <h1>{roomFullText}</h1>
      }
    </div>
  )
}

export default Game
