import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AppRoot() {

  console.log("rendering AppRoot")

  const [ streamListId, setStreamListId ] = useState(null)
  const [ error, setError ] = useState(null)

  useEffect(() => {
    fetch(`/api/v1/config/`)
    .then(res => res.json())
    .then((result) => {
      setStreamListId(result.config.default_stream_list_id)
    })
    .catch((error) => {
      setError("Error loading config: " + error)
    })
  })

  return (
    <>
    {streamListId && (
      <Navigate to={`/streamlist/${streamListId}`} />
    )}
    {error && (
      <p>Couldn't load application configuration, backend is probably not running</p>
    )}
    </>
  )
}

export default AppRoot;
