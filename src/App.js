import './App.css';
import Audio from './components/Audio';
import CurrentStream from './components/CurrentStream';
import KeyPressListener from './components/KeyPressListener';
import StreamList from './components/StreamList';
import StreamPlayerControls from './components/StreamPlayerControls';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function App() {

  const streams = [
    {
      description: 'Seattle NPR station',
      name: 'KEXP',
      url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
      homepage: 'https://kexp.org'
    },
    {
      description: 'Seattle NPR station',
      name: 'KUOW - 94.9',
      url: 'https://14993.live.streamtheworld.com/KUOWFM_HIGH_MP3.mp3'
    },
    {
      name: 'KISW',
      url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KISWFM.mp3'
    },
    {
      description: "The End",
      name: 'KNDD',
      url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KNDDFMAAC.aac'
    },
    {
      description: "Electronica",
      name: 'KNHC - 89.5 FM',
      url: 'http://streams.c895.org/live'
    },
    {
      description: "in Philly",
      name: 'WXPN',
      url: 'https://wxpn.xpn.org/xpnmp3hi'
    }
  ]

  console.log("rendering App")

  const playerReducer = (state, action) => {
    switch(action.type) {
      case 'stop':
        return {
          ...state,
          ...{
            isPlaying: false
          }
        }
      case 'play':
        return {
          ...state,
          ...{
            isPlaying: true
          }
        }
      case 'play_stream':
        // sets currentStreamIndx and plays, in one call
        console.log("handling play_stream")
        const newState = {
          ...state,
          ...{
            isPlaying: true,
            currentStreamIndex: action.currentStreamIndex
          }
        }
        console.log(newState)
        return newState
      case 'skip_backward':
        if(state.currentStreamIndex > 0) {
          return {
            ...state,
            ...{
              currentStreamIndex: state.currentStreamIndex - 1
            }
          }
        }
        return state
      case 'skip_forward':
        if(state.currentStreamIndex < state.streams.length - 1) {
          return {
            ...state,
            ...{
              currentStreamIndex: state.currentStreamIndex + 1
            }
          }
        }
        return state
      case 'add_stream':
        return {
          ...state,
          ...{
            streams: state.streams.concat([ action.stream ])
          }
        }
      case 'remove_stream':
        const filtered = state.streams.filter((s, index) => index !== action.stream_index)
        return {
          ...state,
          ...{
            currentStreamIndex: null,
            streams: filtered,
            isPlaying: false,
          }
        }
      default:
        throw new Error()
    }
  }

  const [playerState, dispatchPlayer] = useReducer(playerReducer, {
    streams: streams,
    currentStreamIndex: null,
    isPlaying: false,
  });

  return (
    <>
    <KeyPressListener
      playerState={playerState}
      dispatchPlayer={dispatchPlayer}
    />
    <Container style={{marginTop: "1em"}}>
      <Row>
        <Col md={4}>
          <StreamList
            playerState={playerState}
            dispatchPlayer={dispatchPlayer}
          />
        </Col>
        <Col md={8}>
          { playerState.currentStreamIndex !== null ? (
            <CurrentStream
              playerState={playerState}
              dispatchPlayer={dispatchPlayer}
              />
          ) : (
            <>
              <h2>Simple Radio</h2>
              <p>A simple stream player. This is
                a <span className="text-danger">work in progress</span>.
                Expect things to be incomplete or broken.</p>
              <p>Try the number keys.</p>
            </>
          )}
          <StreamPlayerControls
              playerState={playerState}
              dispatchPlayer={dispatchPlayer}
          />
          <Audio
            playerState={playerState}
          />
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default App;
