import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Col,
  Alert,
  Card,
  Media,
} from "react-bootstrap";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import UploadImage from "./UploadImage";
import "../App.css";

const Update = () => {
  const [loaded, setLoaded] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const {
    allPicsInDb,
    currentAlbum,
    user,
    resetPicsSelection,
  } = useMainContext();
  const [code, setCode] = useState("");
  const [file, setFile] = useState(false);

  const confirmFile = (message) => {
    if (message === true) {
      setFile(false);
    } else {
      setFile(true);
    }
  };

  //Function to update the album
  const updateAlbum = async (id) => {
    const truthy = allPicsInDb.filter((pic) => pic.selected === true);
    const urls = truthy.map((pic) => pic.url);

    let ranNum;
    ranNum = Math.floor(Math.random() * 10000000);
    await db
      .collection("albums")
      .doc(id)
      .set({
        title: albumName.toLowerCase(),
        cust_apppproved: false,
        url: Math.floor(Math.random() * 200).toString(),
        photo_urls: [...urls],
        code: ranNum,
        user: user.email,
      })
      .then(function () {
        console.log("Document successfully written!");
        setLoaded(false);
        setCode(ranNum);
        resetPicsSelection();
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  //Function to get the album with same title and same user as user
  const checkAlbum = async (e) => {
    e.preventDefault();

    const selected = allPicsInDb.filter((pic) => pic.selected === true);

    if (!selected.length) {
      alert("You need to upload or select at least 1 pic");
      return;
    } else {
      let albumsWithTitle = [];
      let albumToUpdate;
      db.collection("albums")
        .where("title", "==", albumName.toLowerCase())
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            albumsWithTitle.push({ id: doc.id, data: doc.data() });
            if (albumsWithTitle.length) {
              albumToUpdate = albumsWithTitle.filter(
                (alb) => alb.data.user === user.email
              );
            }
          });
          setTimeout(() => {
            updateAlbum(albumToUpdate[0].id);
          }, 2000);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      setLoaded(true);
    }
  }, [allPicsInDb]);

  useEffect(() => {
    setAlbumName(currentAlbum.title);
  }, [currentAlbum]);

  return (
    <>
      {!code && albumName && loaded && allPicsInDb && (
        <Container>
          <Col lg={10} className="my-5 pt-5 mx-auto">
            <Form className="mx-auto form px-5 py-5" onSubmit={checkAlbum}>
              <Form.Group>
                <Form.Label>
                  <h2>UPDATE YOUR ALBUM: {albumName.toUpperCase()}</h2>
                </Form.Label>
                <Col lg={12} md={10} className="d-flex flex-wrap">
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
                <UploadImage albumName={albumName} setErrorMsg={confirmFile} />
                <Button className="mt-0" variant="primary" type="submit">
                  Confirm
                </Button>
              </Form.Group>
            </Form>
            {!file && (
              <Alert variant="warning">You haven´t uploaded any pics</Alert>
            )}
          </Col>
        </Container>
      )}
      {!albumName && (
        <div>
          <Alert variant="warning">
            Oops, something went wrong. Please go back to albums
          </Alert>
          <Link to="/albums">
            <p>Go back to albums</p>
          </Link>
        </div>
      )}
      {code && (
        <Alert variant="success">
          <h2>Album succesfully updated!</h2>
          <div>
            The album code for your customer is (copy this link){" "}
            <p>
              <a href={`/review/${code}`}>
                <strong>photography.catala-sverdrup.se/review/{code}</strong>
              </a>
            </p>
            <Link to="/albums">
              <p>Go back to albums</p>
            </Link>
          </div>
        </Alert>
      )}
    </>
  );
};

export default Update;
