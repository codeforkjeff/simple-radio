import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function EditStream({ streamRef, addStream, saveStream, cancel }) {

  const updateStreamField = (e) => {
    streamRef.current[e.target.name] = e.target.value;
  }

  return (
    <Container>
    <Form>
      <Form.Group className="md-12 mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" placeholder="e.g. WNYC" defaultValue={streamRef.current['name']} onChange={updateStreamField}/>
      </Form.Group>

      <Form.Group className="md-12 mb-3" controlId="desc">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" placeholder="longer description goes here" defaultValue={streamRef.current['description']} onChange={updateStreamField}/>
      </Form.Group>

      <Form.Group className="md-12 mb-3" controlId="formurl">
        <Form.Label>Stream URL</Form.Label>
        <Form.Control type="text" name="url" placeholder="audio stream url" defaultValue={streamRef.current['url']} onChange={updateStreamField}/>
      </Form.Group>

      <Form.Group className="md-12 mb-3" controlId="homepage">
        <Form.Label>Homepage URL</Form.Label>
        <Form.Control type="text" name="homepage" defaultValue={streamRef.current['homepage']} placeholder="e.g. https://www.wync.org"onChange={updateStreamField}/>
      </Form.Group>

      { addStream && (
        <Button onClick={() => addStream(streamRef.current)}>Add</Button>
      )}
      { saveStream && (
        <Button onClick={() => saveStream(streamRef.current)}>Save</Button>
      )}
      { cancel && (
        <Button onClick={cancel}>Cancel</Button>
      )}
    </Form>
    </Container>
  )
}

export default EditStream
