import { useEffect, useState } from 'react';

function Loader({ streamListId, dispatchPlayer, setError }) {
  
  console.log(`loading Loader with ${streamListId}`)
  
  const [ initialLoad, setInitialLoad ] = useState(true)

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
