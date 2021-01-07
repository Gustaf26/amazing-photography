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
import UploadImage from "./UploadImage";
import "../App.css";

const Create = () => {
  const [loaded, setLoaded] = useState(false);
  const [falseyPics, setFalsey] = useState(false);
  //   const { login } = useAuth();
  const { user, allPicsInDb } = useMainContext();

  const createAlbum = (e) => {
    e.preventDefault();
    alert("createing album");
  };

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      setLoaded(true);
      const truthy = allPicsInDb.filter((pic) => pic.selected === true);
      console.log(truthy);
      if (!truthy.length) {
        setFalsey(true);
      }
    }
  }, [allPicsInDb]);

  return (
    <>
      {loaded && allPicsInDb && !falseyPics && (
        <Container>
          <Col lg={10} className="my-5 pt-5 mx-auto">
            <Form className="mx-auto form px-5 py-5" onSubmit={createAlbum}>
              <Form.Group>
                <Form.Label>
                  <h2>CREATE YOUR ALBUM</h2>
                </Form.Label>
                <Form.Control
                  className="my-3"
                  type="text"
                  placeholder="Set an album name"
                />
                <Col lg={12} md={10} className="d-flex">
                  {allPicsInDb &&
                    allPicsInDb.map((pic, index) => {
                      if (pic.selected === true) {
                        return (
                          <Card className="ml-3" id="media" key={index}>
                            <Media key={pic.id} className="my-auto">
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
                </Col>
                <UploadImage />
                <Button className="my-3" variant="primary" type="submit">
                  Confirm
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Container>
      )}
      {loaded && falseyPics && (
        <Alert variant="success">You haven´t chosen any pics</Alert>
      )}
    </>
  );
};

export default Create;
