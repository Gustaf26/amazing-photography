import { useEffect, useState, useRef } from "react";
import { useMainContext } from "../context/MainContext";
import { useHistory } from "react-router-dom";

import { Container, Row, Card, Media, Button } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const Albums = () => {
  const [albumsLoaded, setLoaded] = useState(false);
  const { allAlbums } = useMainContext();
  const allAlbumsFix = useRef([]);
  const history = useHistory();

  const selectAlbum = (pic, ind) => {
    // document.getElementById(ind).style.outline = "2px solid green";
  };

  const deleteSelection = (pic, ind) => {};

  const updateAlbum = (e) => {
    e.preventDefault();

    history.push("/albums/:albumId/update");
  };

  useEffect(() => {
    if (allAlbums && allAlbums.length) {
      allAlbumsFix.current = [...allAlbums];

      setLoaded(true);
    }
  }, [allAlbums]);

  return (
    <>
      <Container>
        <Row lg={9} className="d-flex mt-5 mx-auto">
          {albumsLoaded &&
            allAlbumsFix.current &&
            allAlbumsFix.current.map((alb, index) => {
              return (
                <Card className="ml-3 mb-3" id="media" key={index}>
                  <Card.Text className="mt-2">Album:</Card.Text>
                  <h2>{alb.title.toUpperCase()}</h2>
                  <Media key={alb.title} className="my-auto">
                    <img
                      width="100%"
                      height="auto"
                      src={alb.photo_urls[0]}
                      alt="Generic placeholder"
                    />
                  </Media>
                  <div className="d-flex mx-auto my-2">
                    <AddCircleOutlineIcon
                      //  onClick={() => selectPic(pic.url, index)}
                      color="primary"
                    />
                    <IndeterminateCheckBoxIcon
                      // onClick={() => deleteSelection(pic.url, index)}
                      color="secondary"
                    />
                  </div>
                  <Button
                    onClick={updateAlbum}
                    className="my-3"
                    variant="primary"
                  >
                    Update Album
                  </Button>
                </Card>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default Albums;
