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
import { useNavigate } from 'react-router-dom';

function Loader({ streamListId, dispatchPlayer, setError }) {
  
  console.log(`loading Loader with ${streamListId}`)
  
  const [ initialLoad, setInitialLoad ] = useState(true)

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTarget = useRef(null);
  
  const navigate = useNavigate()

  useEffect(() => {
    if(initialLoad) {
      // first load
      if(streamListId) {
        console.log(`Loading stream list id ${streamListId}`)
        fetch(`/api/v1/hashed_content/${streamListId}`)
          .then(res => {
            if(res.status !== 404) {
              return res.json()
            } else {
              setError(`streamListId ${streamListId} not found`)
            }
          })
          .then((result) => {
            console.log("got stream list from API")
            const streams = JSON.parse(result.content)
            dispatchPlayer({ type: 'set_streamlistid_and_streams', streamListId: result.hash, streams: streams })
          })
          .catch((error) => {
            console.log("Error loading: " + error)
          })
      }

      setInitialLoad(false)
    }
  }, [ initialLoad ])

}

export default Loader
