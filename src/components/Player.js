import './Player.css';
import Audio from './Audio';
import CurrentStream from './CurrentStream';
import KeyPressListener from './KeyPressListener';
import Loader from './Loader';
import StreamList from './StreamList';
import StreamPlayerControls from './StreamPlayerControls';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useParams } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';

const insert = (a, index, element) => {
  console.log(`insert ${a} ${index} ${element}`)
  const a1 = a.slice(0, index)
  const a2 = a.slice(index)
  return a1.concat([ element ]).concat(a2)
}

const move = (index_original, index_new, a) => {
  // save, remove, then insert
  const saved = a[index_original]
  const removed = a.filter((s, index) => index !== index_original)
  return insert(removed, index_new, saved)
}

function Player() {

  const { streamListId } = useParams()

  console.log(`rendering Player with streamListId=${streamListId}`)

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
            streams: insert(state.streams, action.position, action.stream),
            dirty: true
          }
        }
      case 'edit_stream':
        const replaced = state.streams.map((s, index) => index === action.stream_index ? action.stream : s)
        return {
          ...state,
          ...{
            currentStreamIndex: action.position,
            streams: move(action.stream_index, action.position, replaced),
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
      case 'set_streamlistid':
        return {
          ...state,
          ...{
            streamListId: action.streamListId,
            dirty: false
          }
        }
      case 'set_streamlistid_and_streams':
        return {
          ...state,
          ...{
            streamListId: action.streamListId,
            streams: action.streams,
            dirty: false
          }
        }
      default:
        throw new Error(`unrecognized type: ${action.type}`)
    }
  }

  const [playerState, dispatchPlayer] = useReducer(playerReducer, {
    streamListId: null,
    dirty: false,
    streams: [],
    currentStreamIndex: null,
    isPlaying: false,
  });

  useBeforeunload((event) => {
    if (playerState.dirty) {
      event.preventDefault()
    }
  });

  const [ error, setError ] = useState(false)

  return (
    <>
    <KeyPressListener
      playerState={playerState}
      dispatchPlayer={dispatchPlayer}
    />
    <Loader
      streamListId={streamListId}
      dispatchPlayer={dispatchPlayer}
      setError={setError}
    />
    { playerState.streamListId && (
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
    )}
    { error && (
      <Container className="app">
        <h1>Whoops!</h1>
        <p>Sorry, couldn't load the stream list. This error occurred: <span className="fw-bold">{error}</span></p>
        <p>Check that you typed or pasted the URL correctly. Or try <a href="/">starting over</a>.</p>
      </Container>
    )}
    <Audio
      playerState={playerState}
    />
    </>
  );
}

export default Player;
