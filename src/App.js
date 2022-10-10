import './App.css';
import Audio from './components/Audio';
import CurrentStream from './components/CurrentStream';
import KeyPressListener from './components/KeyPressListener';
import Sync from './components/Sync';
import StreamList from './components/StreamList';
import StreamPlayerControls from './components/StreamPlayerControls';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function App() {

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
              currentStreamIndex: state.currentStreamIndex - 1,
              isPlaying: true
            }
          }
        }
        return state
      case 'skip_forward':
        if(state.currentStreamIndex < state.streams.length - 1) {
          return {
            ...state,
            ...{
              currentStreamIndex: state.currentStreamIndex + 1,
              isPlaying: true
            }
          }
        }
        return state
      case 'add_stream':
        return {
          ...state,
          ...{
            streams: state.streams.concat([ action.stream ]),
            dirty: true
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
            dirty: true
          }
        }
      case 'set_hash':
        return {
          ...state,
          ...{
            hash: action.hash,
            dirty: false
          }
        }
      case 'set_hash_and_streams':
        return {
          ...state,
          ...{
            hash: action.hash,
            streams: action.streams,
          }
        }
      default:
        throw new Error()
    }
  }

  const [playerState, dispatchPlayer] = useReducer(playerReducer, {
    hash: "3939c14eb6",
    dirty: false,
    streams: [],
    currentStreamIndex: null,
    isPlaying: false,
  });

  return (
    <>
    <KeyPressListener
      playerState={playerState}
      dispatchPlayer={dispatchPlayer}
    />
    <Container className="app">
      <Row>
        <Col md={4}>
          <StreamList
            playerState={playerState}
            dispatchPlayer={dispatchPlayer}
          />
        </Col>
        <Col md={8}>
          <Container>
            <Row className="sync-container">
              <Col md="12">
                <Sync
                  playerState={playerState}
                  dispatchPlayer={dispatchPlayer}
                />
              </Col>
            </Row>
            { playerState.currentStreamIndex !== null && (
              <Row>
                <Col md="12">
                <CurrentStream
                  playerState={playerState}
                  dispatchPlayer={dispatchPlayer}
                  />
                  </Col>
              </Row>
            )}
            { playerState.currentStreamIndex !== null && (
              <Row>
                <Col md="12">
                <StreamPlayerControls
                    playerState={playerState}
                    dispatchPlayer={dispatchPlayer}
                />
                </Col>
              </Row>
            )}
            { playerState.currentStreamIndex === null && (
              <Row md="12">
                      <h2>Simple Radio</h2>
                      <p>A simple stream player. This is
                        a <span className="text-danger">work in progress</span>.
                        Expect things to be incomplete or broken.</p>
                      <p>Try the number keys.</p>
              </Row>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
    <Audio
    playerState={playerState}
    />
    </>
  );
}

export default App;
