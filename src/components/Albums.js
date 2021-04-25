import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";

import { Container, Row, Card, Media } from "react-bootstrap";

const Albums = () => {
  const [albumsLoaded, setLoaded] = useState(false);
  const {
    allAlbums,
    setCurrentAlbum,
    user,
    resetPicsSelection,
    allPicsInDb,
  } = useMainContext();
  const allAlbumsFix = useRef([]);
  const navigate = useNavigate();

  const selectPicsFromAlb = (alb) => {
    alb.photo_urls.map((url) =>
      allPicsInDb.map((pic) => {
        if (pic.url == url) {
          pic.selected = true;
        }
      })
    );

    db.collection("pics")
      .doc("all-pics")
      .set({ ...allPicsInDb })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const goToAlbum = (alb) => {
    setCurrentAlbum(alb);
    selectPicsFromAlb(alb);
    setTimeout(() => {
      navigate(`/albums/${alb.code}`);
    }, 1000);
  };

  useEffect(() => {
    if (allAlbums && allAlbums.length) {
      allAlbumsFix.current = [...allAlbums];
      setCurrentAlbum("");
      resetPicsSelection();
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
              if (alb.user === user.email) {
                return (
                  <Card className="ml-3 mb-3 photo" id="media" key={index}>
                    <Card.Text className="mt-2">Album:</Card.Text>
                    <h2>{alb.title.toUpperCase()}</h2>
                    <Media
                      key={alb.title}
                      className="my-auto"
                      onClick={() => goToAlbum(alb)}
                    >
                      <img
                        width="100%"
                        height="auto"
                        src={
                          alb.photo_urls[0].url
                            ? alb.photo_urls[0].url
                            : alb.photo_urls[0]
                        }
                        alt="Generic placeholder"
                      />
                      {alb.cust_approved === true && (
                        <p className="custumer_approved">Approved</p>
                      )}
                    </Media>
                  </Card>
                );
              }
            })}
        </Row>
      </Container>
    </>
  );
};

export default Albums;
