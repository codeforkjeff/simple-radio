import './SaveButton.css';
import { useRef, useState } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { SaveFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function SaveButton({ playerState: { streamListId, dirty, streams }, dispatchPlayer }) {
  
  console.log(`loading SaveButton with ${streamListId}`)
  
  // separate show flag for persisting visibility a short while after Save
  const [show, setShow] = useState(false)
  
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipTarget = useRef(null)
  
  const navigate = useNavigate()

  const persist = () => {
    if(dirty) {
      console.log("persisting stream list")
      const body = JSON.stringify({'content': JSON.stringify(streams) })
      
      setShow(true)

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

          setShowTooltip(true)

          setTimeout(() => {
            setShowTooltip(false)
            setTimeout(() => {
              setShow(false)
            }, 100)
          }, 1500)

          dispatchPlayer({ type: 'set_streamlistid', streamListId: result.hash })
          navigate(`/streamlist/${result.hash}`)
        })
        .catch((error) => {
          alert("Error persisting: " + error)
        })
    }
  }

  return (
    <span>
      { (dirty || show) && (
        <SaveFill ref={tooltipTarget} size="25" onClick={persist}>Save Changes</SaveFill>
      )}
    <Overlay target={tooltipTarget.current} show={showTooltip} placement="bottom">
      {(props) => (
        <Tooltip id="overlay-example" {...props}>
            <span>Saved!</span>
        </Tooltip>
      )}
    </Overlay>
    </span>
  );
}

export default SaveButton
