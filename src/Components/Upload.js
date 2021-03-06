import React, { Component } from "react";
import { storage } from "../firebase/firebase";
import firebase, { firestore } from "firebase";

class Upload extends Component {
  state = {
    imagePreview: "",
    imageAsFile: "",
    imageAsUrl: "",
    location: "",
    comment: "",
  };

  handleImageAsFile = (e) => {
    const image = e.target.files[0];
    const previewUrl = URL.createObjectURL(image);
    this.setState({ imagePreview: previewUrl, imageAsFile: image });
  };

  handleDescription = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  postImageData = (url) => {
    console.log(this.state.imageAsUrl);
    firebase.firestore().collection("Masks").add({
      Image: url,
      Comment: this.state.comment,
      Location: this.state.location,
    });
  };

  handleFireBaseUpload = (e) => {
    e.preventDefault();
    if (this.state.imageAsFile === "") {
      console.error(
        `not an image, the image file is a ${typeof this.state.imageAsFile}`
      );
    }
    const uploadTask = storage
      .ref(`/images/${this.state.imageAsFile.name}`)
      .put(this.state.imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(this.state.imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            this.postImageData(fireBaseUrl);

            this.setState({
                imageAsUrl: fireBaseUrl,
            });
          });
      }
    );
  };

  render() {
    return (
      <div className="UploadForm">
        <form onSubmit={this.handleFireBaseUpload}>
          <input type="file" name="image" onChange={this.handleImageAsFile} />
          <br />
          <label>
            Location:
            <input
              type="text"
              name="location"
              onChange={this.handleDescription}
            />
          </label>
          <br />
          <label>
            Comment:
            <input
              type="text"
              name="comment"
              onChange={this.handleDescription}
            />
          </label>
          <br />

          <button>Upload</button>
        </form>
        <div className="Upload-Preview">
          <img
            src={this.state.imagePreview}
            style={{ maxWidth: "200px", height: "auto" }}
          />
        </div>
      </div>
    );
  }
}

export default Upload;
