import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import { useHistory } from "react-router-dom";

import { Container, Row, Card, Media, Button } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const Pics = () => {
  const [picsLoaded, setLoaded] = useState(false);
  const { setAllPics } = useMainContext();
  const allPicsFix = useRef("");
  const history = useHistory();

  const selectPic = (pic, ind) => {
    // document.getElementById(ind).style.outline = "2px solid green";

    allPicsFix.current.map((picture) => {
      if (picture.url === pic) {
        return (picture.selected = true);
      }
    });

    db.collection("pics")
      .doc("all-pics")
      .set({ ...allPicsFix.current })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const deleteSelection = (pic, ind) => {
    // document.getElementById(ind).style.outline = "2px solid red";
    allPicsFix.current.map((picture) => {
      if (picture.url === pic) {
        return (picture.selected = false);
      }
    });
    db.collection("pics")
      .doc("all-pics")
      .set({ ...allPicsFix.current })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const createAlbum = (e) => {
    e.preventDefault();
    setAllPics(allPicsFix.current);
    history.push("/albums/create");
  };

  useEffect(() => {
    let snapshotPics;

    db.collection(`pics`).onSnapshot((querySnapshot) => {
      snapshotPics = [];
      setLoaded(false);

      querySnapshot.forEach((doc) => {
        snapshotPics.push(doc.data());
      });
      allPicsFix.current = Object.values(...snapshotPics);
      setLoaded(true);
    });

    return setLoaded(false);
  }, []);

  return (
    <>
      <Container>
        <Row lg={6} className="d-flex mt-5 mx-auto">
          {picsLoaded &&
            allPicsFix.current &&
            allPicsFix.current.map((pic, index) => {
              return (
                <Card
                  className={
                    pic.selected ? "pic-selected ml-3" : "not-selected ml-3"
                  }
                  id="media"
                  key={index}
                >
                  <Media key={pic.id}>
                    <img
                      width="100%"
                      height="auto"
                      src={pic.url}
                      alt="Generic placeholder"
                    />
                  </Media>
                  <div className="d-flex mx-auto my-2">
                    <AddCircleOutlineIcon
                      onClick={() => selectPic(pic.url, index)}
                      color="primary"
                    />
                    <IndeterminateCheckBoxIcon
                      onClick={() => deleteSelection(pic.url, index)}
                      color="secondary"
                    />
                  </div>
                </Card>
              );
            })}
        </Row>
      </Container>
      <Button onClick={createAlbum} className="my-3" variant="primary">
        Create Album
      </Button>
    </>
  );
};

export default Pics;
