import React, { useCallback, useState, useEffect } from "react";
import { db, storage } from "../firebase/index";
import { useDropzone } from "react-dropzone";
import { useMainContext } from "../context/MainContext";

const UploadImage = ({ albumName, setErrorMsg }) => {
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState("");
  const { allPicsInDb, user } = useMainContext();

  useEffect(() => {
    setErrorMsg(true);
  }, []);

  useEffect(() => {
    if (!file) {
      setErrorMsg(true);
      setError(true);
      setIsSuccess(false);

      return;
    }

    //This is basically cause' we need a title for uploading a pic with album name - reference in all-pics collection
    if (!albumName) {
      alert("You need to set first an album name");
      return;
    }

    // reset environment
    setError(null);
    setErrorMsg(false);
    setIsSuccess(false);

    // get file reference
    const fileRef = storage.ref(`allPics/${file.name}`);

    // upload file to fileRef
    const uploadTask = fileRef.put(file);

    // are we there yet?
    uploadTask.then((snapshot) => {
      // retrieve URL to uploaded file
      snapshot.ref.getDownloadURL().then((url) => {
        // add uploaded file to db
        if (url) {
          // imageUrl.current = url;

          let allPics = { ...allPicsInDb };
          let ranNum = Math.floor(Math.random() * 1000);

          db.collection("pics")
            .doc("all-pics")
            .set({
              ...allPics,
              ranNum: {
                id: ranNum,
                url: url,
                albums: [`${albumName.toLowerCase()}`],
                selected: true,
                user: user.email,
              },
            })
            .then(function () {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            });
        }
      });
    });
  }, [file]);

  const onDrop = useCallback((acceptedFiles) => {
    //Allow only uploding 1 pic at a time
    if (acceptedFiles.length > 1) {
      alert("Upload only one doc at a time, thanks");
      return;
    }

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        // const binaryStr = reader.result;
        // console.log(binaryStr);
        setFile(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="upload-dropzone mx-auto my-5" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>
        Drag 'n' drop some files here, or click to select files -One at a time-
      </p>
    </div>
  );
};

export default UploadImage;
