import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Col,
  Alert,
  Card,
  Media,
} from "react-bootstrap";
// import { useAuth } from "../context/AuthContext";
import { useMainContext } from "../context/MainContext";
import "../App.css";

const Create = () => {
  const [loaded, setLoaded] = useState(false);
  //   const { login } = useAuth();
  const { user, allPicsInDb } = useMainContext();

  const createAlbum = (e) => {
    e.preventDefault();
    alert("createing album");
  };

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {loaded && allPicsInDb && (
        <Container>
          <Col lg={4} className="my-5 pt-5 mx-auto">
            <Form className="mx-auto form px-5 py-5" onSubmit={createAlbum}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Yur new album</Form.Label>
                {allPicsInDb &&
                  allPicsInDb.map((pic, index) => {
                    if (pic.selected === true) {
                      return (
                        <Card className="ml-3" id={index} key={index}>
                          <Media id="media" key={pic.id}>
                            <img
                              width="100%"
                              height="auto"
                              src={pic.url}
                              alt="Generic placeholder"
                            />
                          </Media>
                        </Card>
                      );
                    }
                  })}
                <Button variant="primary" type="submit">
                  Confirm
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Container>
      )}
      {!loaded && !allPicsInDb && (
        <Alert variant="success">You haven´t chosen any pics</Alert>
      )}
    </>
  );
};

export default Create;
