import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import { useHistory } from "react-router-dom";

import { Container, Row, Card, Media, Button } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const Album = () => {
  const [picsLoaded, setLoaded] = useState(false);
  const {
    setAllPics,
    resetPicsSelection,
    setAlbumPics,
    currentAlbum,
    albumPics,
  } = useMainContext();
  const thisAlbumFix = useRef([]);
  const history = useHistory();

  const selectPic = (pic, ind) => {
    // document.getElementById(ind).style.outline = "2px solid green";

    thisAlbumFix.current.map((picture) => {
      if (picture.url === pic) {
        console.log({ ...thisAlbumFix.current });
        return (picture.selected = true);
      }
    });

    db.collection("pics")
      .doc("all-pics")
      .set({ ...thisAlbumFix.current })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const deleteSelection = (pic, ind) => {
    // document.getElementById(ind).style.outline = "2px solid red";
    thisAlbumFix.current.map((picture) => {
      if (picture.url === pic) {
        console.log({ ...thisAlbumFix.current });
        return (picture.selected = false);
      }
    });
    db.collection("pics")
      .doc("all-pics")
      .set({ ...thisAlbumFix.current })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const updateAlbum = (e) => {
    e.preventDefault();
    //setAllPics(allPicsFix.current);
    history.push(`/albums/${currentAlbum.code}/update`);
  };

  useEffect(() => {
    if (albumPics && albumPics.length) {
      resetPicsSelection();
      thisAlbumFix.current.push(...albumPics);

      setLoaded(true);
    }
  }, [albumPics]);

  return (
    <>
      <Container>
        <Row lg={9} className="d-flex mt-5 mx-auto">
          {picsLoaded &&
            thisAlbumFix.current &&
            thisAlbumFix.current.map((pic, index) => {
              return (
                <Card
                  className={
                    pic.selected
                      ? "pic-selected ml-3 mb-3"
                      : "not-selected ml-3 mb-3"
                  }
                  id="media"
                  key={index}
                >
                  <Media key={pic.id} className="my-auto">
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
      <Button onClick={updateAlbum} className="my-3" variant="primary">
        Update Album
      </Button>
    </>
  );
};

export default Album;
