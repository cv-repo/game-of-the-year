import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import randomCodeGenerator from '../utils/randomCodeGenerator'

const Homepage = () => {
    const [roomCode, setRoomCode] = useState('')
    const [en, setEn] = useState(false)

    //text
    const [lanButtonText, setLanButtonText] = useState('EN')
    const [playWithFriendsText, setPlayWithFriendsText] = useState('Hablando es mejor: Invita a tus amigos a una llamada de voz (Ej: Discord, Zoom)')
    const [createGameText, setCreateGameText] = useState('CREAR SALA')
    const [orText, setOrText] = useState('O')
    const [joinGameText, setJoinGameText] = useState('UNIRSE A SALA')
    const [gameCodeText, setGameCodeText] = useState('Código Sala')
    const [rulesText, setRulesText] = useState('REGLAS')

    function changeLanguage(){
      if(en) {
        setLanButtonText('EN')
        setPlayWithFriendsText('Hablando es mejor: Invita a tus amigos a una llamada de voz (Ej: Discord, Zoom)')
        setCreateGameText('CREAR SALA')
        setOrText('O')
        setJoinGameText('UNIRSE A SALA')
        setGameCodeText('Código Sala')
        setRulesText('REGLAS')
        setEn(false)
      }
      else {
        setLanButtonText('ES')
        setPlayWithFriendsText('Calling is better: Invite your friends to a voice call (e.g.: Discord, Zoom)')
        setCreateGameText('CREATE GAME')
        setOrText('OR')
        setJoinGameText('JOIN GAME')
        setGameCodeText('Game Code')
        setRulesText('RULES')
        setEn(true)
      }
    }

    return (
        <div className='Homepage'>
            <div className='left-settings'>
              <button className='game-button green' onClick={() => changeLanguage()}>{lanButtonText} </button>
              <Link to={`/rules?lan=${en}`}>
                <button className='game-button green'>{rulesText}</button>
              </Link>
            </div>
            <div className='homepage-menu'>
                <img src={require('../assets/logo.png').default} width='200px' />
                <div className='homepage-form'>
                    <div className='homepage-join'>
                        <input type='text' placeholder={gameCodeText} onChange={(event) => setRoomCode(event.target.value)} />
                        <Link to={`/play?roomCode=${roomCode}&lan=${en}`}><button className="game-button green">{joinGameText}</button></Link>
                    </div>
                    <h1>{orText}</h1>
                    <div className='homepage-create'>
                        <Link to={`/play?roomCode=${randomCodeGenerator(5)}&lan=${en}`}><button className="game-button orange">{createGameText}</button></Link>
                    </div>
                </div>
                <div className='play-with-friends'>
                  <h3>{playWithFriendsText}</h3>
                </div>
            </div>
        </div>
    )
}

export default Homepage
