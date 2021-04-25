import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import "../App.css";

const EditTitle = () => {
  const { currentAlbum, user } = useMainContext();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  //Function to update the album
  const updateAlbum = async (id) => {
    currentAlbum.title = title.toLowerCase();

    let ranNum;
    ranNum = Math.floor(Math.random() * 10000000);
    await db
      .collection("albums")
      .doc(id)
      .set({
        title: title.toLowerCase(),
        cust_apppproved: false,
        url: Math.floor(Math.random() * 200).toString(),
        photo_urls: [...currentAlbum.photo_urls],
        code: ranNum,
        user: user.email,
      })
      .then(() => {
        setTimeout(() => {
          navigate(`/albums/${currentAlbum.code}`);
        }, 1500);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const checkAlbum = (e) => {
    e.preventDefault();

    if (title === "") {
      alert("You need to enter a valid album title");
      return;
    }

    let albumsWithTitle = [];
    let albumToUpdate;
    db.collection("albums")
      .where("title", "==", currentAlbum.title.toLowerCase())
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
  };

  return (
    <div>
      {currentAlbum && (
        <Container>
          <h2 className="my-4">
            Update your album: {currentAlbum.title.toUpperCase()}
          </h2>
          <Form
            className="mx-auto form px-5 py-5"
            onSubmit={(e) => checkAlbum(e)}
          >
            <Form.Group>
              <Form.Label>Enter your new title</Form.Label>
              <Form.Control
                id="album-title"
                type="text"
                placeholder={currentAlbum.title}
                className="my-5 w-50 mx-auto"
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button className="mt-0" variant="primary" type="submit">
                Update title
              </Button>
            </Form.Group>
          </Form>
        </Container>
      )}
      {!currentAlbum && (
        <div>
          <Alert variant="warning">
            Oops, something went wrong. Please go back to albums
          </Alert>
          <Link to="/albums">
            <p>Go back to albums</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EditTitle;
