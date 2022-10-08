import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


function AddStreamModal({ show, setShow, playerState: { streams }, dispatchPlayer }) {

  const [ searchText, setSearchText ] = useState("")

  const [ streamsDbLoadState, setStreamsDbLoadState ] = useState("not_loaded")

  const [ streamsDb, setStreamsDb ] = useState([])

  const [ searchResults, setSearchResults ] = useState([])

  const handleClose = () => setShow(false)

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    if(show && streamsDbLoadState != "loaded") {
      setStreamsDbLoadState("loading")
      console.log("loading database")
      fetch("stations.json")
        .then(res => res.json())
        .then((result) => {
          console.log("got result")
          setStreamsDb(result)
          setStreamsDbLoadState("loaded")
        })
        .catch((error) => {
          console.log("whoa")
        })
    }
  })

  const search = (e) => {
    e.preventDefault()
    const needle = searchText.toUpperCase()
    const results = streamsDb.filter((streamRecord) => streamRecord.name.toUpperCase().indexOf(needle) != -1)
    setSearchResults(results)
  }

  const addStream = (e, result) => {
    e.preventDefault()
    streams.push(result)
    setShow(false)
  }

  const formatResult = (result) => {
    return (
      <span>{result.name} ({result.countrycode})</span>
    )
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add a Stream</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { streamsDbLoadState === "loading" && (
          <p>Loading, hang on ...</p>
        )}
        { streamsDbLoadState === "loaded" && (
          <>
          <Form onSubmit={search}>
            <Form.Group className="md-3" controlId="formBasicEmail">
              <Form.Label>Search</Form.Label>
              <Form.Control type="text" onChange={(e) => handleSearchTextChange(e)}/>
            </Form.Group>
          </Form>
          <Container>
            {searchResults.map((result, index) => (
              <Row>
                <Col md="12" key={index} ><a href="" onClick={(e) => addStream(e, result)}>{formatResult(result)}</a></Col>
              </Row>
            ))}
          </Container>
          </>
        )}
        </Modal.Body>
    </Modal>
  )
}

export default AddStreamModal
