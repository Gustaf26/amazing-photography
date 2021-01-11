import { useEffect, useState, useRef } from "react";
import { useMainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";

import { Container, Row, Card, Media } from "react-bootstrap";

const Albums = () => {
  const [albumsLoaded, setLoaded] = useState(false);
  const { allAlbums, setCurrentAlbum } = useMainContext();
  const allAlbumsFix = useRef([]);
  const navigate = useNavigate();

  const goToAlbum = (alb) => {
    setCurrentAlbum(alb);
    setTimeout(() => {
      navigate(`/albums/${alb.code}`);
    }, 1000);
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
                  <Media
                    key={alb.title}
                    className="my-auto"
                    onClick={() => goToAlbum(alb)}
                  >
                    <img
                      width="100%"
                      height="auto"
                      src={alb.photo_urls[0]}
                      alt="Generic placeholder"
                    />
                  </Media>

                  {/* <Button
                    onClick={updateAlbum}
                    className="my-3"
                    variant="primary"
                  >
                    Update Album
                  </Button> */}
                </Card>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default Albums;
