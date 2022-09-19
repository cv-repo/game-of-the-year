import React, {useState} from 'react'
import queryString from 'query-string'

const GameRules = (props) => {

    const data = queryString.parse(props.location.search)
    const en = data.lan == 'true'

    const [descriptionText, setDescriptionText] = useState(() => {
      if(en) return '"The game of the year" is based on the card game "Cheat" (also known as "Bluff", "Bullshit", "Liar" or "I Doubt It")'
      else return '"El juego del año" esta basado en el juego de cartas "Mentiroso" (tambien conocido como "Desconfio")'
    })

    const [ruleText, setRuleText] = useState(() => {
      if(en) return 'Rule'
      else return 'Regla'
    })

    const [rule1Text, setRule1Text] = useState(() => {
      if(en) return 'The entire deck is dealt equally to all players.'
      else return 'Se reparte toda la baraja por igual a todos los jugadores.'
    })

    const [rule2Text, setRule2Text] = useState(() => {
      if(en) return 'The first player to get rid of their cards wins.'
      else return 'Gana el primer jugador que se deshaga de sus cartas.'
    })

    const [rule3Text, setRule3Text] = useState(() => {
      if(en) return 'If you have 4 cards of the same number, they are automatically discarded.'
      else return 'Si se tienen 4 cartas del mismo numero se descartan automaticamente.'
    })

    const [rule4Text, setRule4Text] = useState(() => {
      if(en) return 'The player who starts the round chooses a combination of cards and a number.'
      else return 'El jugador que inicia la ronda escoge una combinación de cartas y un numero.'
    })

    const [rule5Text, setRule5Text] = useState(() => {
      if(en) return 'All the cards will have to be of the chosen number, if the truth is to be told.'
      else return 'Todas las cartas tendran que ser del número escogido, si se quiere decir la verdad.'
    })

    const [rule5ExText, setRule5ExText] = useState(() => {
      if(en) return '[Ex: 3 threes -> 3,3,3 (true); 2 fours -> 5.4 (lie); 1 seven -> 7 (true)]'
      else return '[Ej: 3 treses -> 3,3,3 (verdad); 2 cuatros -> 5,4 (mentira); 1 siete -> 7 (verdad)]'
    })

    const [rule6Text, setRule6Text] = useState(() => {
      if(en) return "The 1's serve as a wild card when lying."
      else return 'Los 1 sirven como comodin a la hora de mentir.'
    })

    const [rule6ExText, setRule6ExText] = useState(() => {
      if(en) return "[Ex: 3 threes -> 3,1,3 (true); 2 sevens -> 7,1 (true); 1 two -> 1 (true)]"
      else return '[Ej: 3 treses -> 3,1,3 (verdad); 2 sietes -> 7,1 (verdad); 1 dos -> 1 (verdad)]'
    })

    const [rule7Text, setRule7Text] = useState(() => {
      if(en) return 'If it is the turn of a player who does not start the round and believes the last move,'
      else return 'Si es el turno de un jugador que no inicia la ronda y se cree la jugada anterior,'
    })

    const [rule72Text, setRule72Text] = useState(() => {
      if(en) return 'he or she must continue with one or more cards of the current number (if you want to tell the truth)'
      else return 'deberá continuar con una o más cartas del número en juego (si quiere decir la verdad)'
    })

    const [rule7ExText, setRule7ExText] = useState(() => {
      if(en) return '[Eg, "another one", "another two"...]'
      else return '[Ej, «otro más», «otros dos»...]'
    })

    const [rule8Text, setRule8Text] = useState(() => {
      if(en) return 'In case that a player, regardless of his turn, distrusts the last cards played, he can press the "BULLSHIT" button.'
      else return 'En caso de que un jugador, sea cual sea no importa su turno, desconfíe de las ultimas cartas jugadas, puede pulsar el botón "ES MENTIRA".'
    })

    const [rule82Text, setRule82Text] = useState(() => {
      if(en) return 'If the play is true, the unbeliever will take all the cards from the pile and will lose his turn (if he was about to play).'
      else return 'Si la jugada es verdadera, el incrédulo se llevará todas las cartas del montón y perderá su turno (si es que le toca jugar).'
    })

    const [rule83Text, setRule83Text] = useState(() => {
      if(en) return 'Otherwise, it will be the liar who takes all the cards from the pile and the current player (the one who has the turn) will start a new round.'
      else return 'En caso contrario, sera el mentiroso quien se lleve todas las cartas del montón y el jugador actual (quien tiene el turno) iniciará una nueva ronda.'
    })

    const [playWithQuestionsText, setPlayWithQuestionsText] = useState(() => {
      if(en) return 'Play with questions'
      else return 'Jugar con preguntas'
    })

    const [playWithQuestions2Text, setPlayWithQuestions2Text] = useState(() => {
      if(en) return 'There is the possibility of playing with questions if it is played in person or through a call.'
      else return 'Existe la posibilidad de jugar con preguntas si se juega en persona o a traves de llamada.'
    })

    const [playWithQuestions3Text, setPlayWithQuestions3Text] = useState(() => {
      if(en) return 'In this game mode, if someone is "caught" answering a question,'
      else return 'En este modo de juego, si alguien es "cazado" respondiendo a una pregunta,'
    })

    const [playWithQuestions4Text, setPlayWithQuestions4Text] = useState(() => {
      if(en) return 'he will take all the cards on the table and will lose his turn (if he was about to play).'
      else return 'se llevara todas las cartas de la mesa y perderá su turno (si es que le toca jugar).'
    })

    const [playWithQuestions5Text, setPlayWithQuestions5Text] = useState(() => {
      if(en) return 'To play in this mode, whoever is "caught" responding will have to press the "I ANSWERED!" button.'
      else return 'Para jugar en este modo, el que sea "cazado" respondiendo tendrá que pusar el botón "¡HE RESPONDIDO!"'
    })

    return (
      <div className='rules'>
        <li>
          <div class="caption center-align">
            <h4 class="light grey-text text-lighten-3">
            {descriptionText}
            </h4>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 1}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule1Text}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 2}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule2Text}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 3}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule3Text}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 4}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule4Text}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 5}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule5Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {rule5ExText}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 6}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule6Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {rule6ExText}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 7}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule7Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {rule72Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {rule7ExText}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{ruleText + " " + 8}</h3>
            <h5 class="light grey-text text-lighten-3">
              {rule8Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {rule82Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {rule83Text}
            </h5>
          </div>
        </li>
        <li>
          <div class="caption center-align">
            <h3>{playWithQuestionsText}</h3>
            <h5 class="light grey-text text-lighten-3">
              {playWithQuestions2Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {playWithQuestions3Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {playWithQuestions4Text}
            </h5>
            <h5 class="light grey-text text-lighten-3">
              {playWithQuestions5Text}
            </h5>
          </div>
        </li>
      </div>
      )
}

export default GameRules
