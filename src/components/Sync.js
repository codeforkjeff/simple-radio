import './Sync.css';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Overlay from 'react-bootstrap/Overlay';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { Clipboard2 } from 'react-bootstrap-icons';

function Sync({ playerState: { hash, dirty, streams }, dispatchPlayer }) {

  const get_url = () => {
    
    return `${window.location.origin}?stream_list=${hash}`
  }
  
  const [ initialLoad, setInitialLoad ] = useState(true)

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTarget = useRef(null);

  useEffect(() => {
    if(initialLoad) {
      // first load
      const queryString = window.location.search
      
      const urlParams = new URLSearchParams(queryString)
      const hash_to_load = urlParams.get('stream_list') || hash

      if(hash_to_load) {
        console.log(`Loading stream list using hash = ${hash_to_load}`)
        fetch(`/api/v1/hashed_content/${hash_to_load}`)
          .then(res => {
            if(res.status !== 404) {
              return res.json()
            } else {
              // TODO: indicate that we couldn't load the stream list
              throw new Error('Got a 404 trying to load stream list');
            }
          })
          .then((result) => {
            console.log("got stream list from API")
            const streams = JSON.parse(result.content)
            dispatchPlayer({ type: 'set_hash_and_streams', hash: result.hash, streams })
          })
          .catch((error) => {
            console.log("Error loading: " + error)
          })
      }

      setInitialLoad(false)
    }
  }, [ initialLoad ])

  const persist = () => {
    if(dirty) {
      console.log("persisting stream list")
      const body = JSON.stringify({'content': JSON.stringify(streams) })

      fetch("/api/v1/hashed_content/", { 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: body 
      })
        .then(res => res.json())
        .then((result) => {
          console.log("got result from persisting stream list")
          dispatchPlayer({ type: 'set_hash', hash: result.hash })
        })
        .catch((error) => {
          alert("Error persisting: " + error)
        })
    }
  }

  //const clipboard = () => navigator.clipboard

  const flashTooltip = () => {
    if(navigator.clipboard) {
      navigator.clipboard.writeText(get_url())
        .then(() => {
          console.log("copy succeeded")
        })
        .catch(() => {
          console.log("copy failed")
        })
    }

    setShowTooltip(true)
    
    setTimeout(() => {
      setShowTooltip(false)
    }, 1500)
  }

  return (
    <div>
          <Form>
            <InputGroup className="md-12">
              <InputGroup.Text id="basic-addon1">URL:</InputGroup.Text>
                { dirty ? (
                  <Button variant="warning" onClick={persist} className="save-streams-button">Save Changes to Stream List</Button>
                ) : (
                  <Form.Control type="text" value={get_url()} disabled/>
                )}
              <InputGroup.Text ref={tooltipTarget} onClick={flashTooltip} style={{background: "transparent"}}><Clipboard2/></InputGroup.Text>
            </InputGroup>
          </Form>
    <Overlay target={tooltipTarget.current} show={showTooltip} placement="bottom">
      {(props) => (
        <Tooltip id="overlay-example" {...props}>
          { navigator.clipboard ? (
            <span>Copied to clipboard</span>
          ) : (
            <span>Error copying to clipboard! Please copy the URL yourself</span>
          )}
        </Tooltip>
      )}
    </Overlay>
    </div>
  );
}

export default Sync
