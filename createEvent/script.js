import {
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  db,
  collection,
  addDoc,
} from "../utils/utils.js";

const event_form = document.querySelector("#event_form");

event_form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log(e);

  const eventInfo = {
    title: e.target[0].value,
    location: e.target[1].value,
    description: e.target[2].value,
    time: e.target[3].value,
    guests: e.target[5].value,
    img: e.target[6].files[0],
  };

  console.log("eventinfoooo =>", eventInfo);

  console.log("title =>", eventInfo.title);
  console.log("location =>", eventInfo.location);
  console.log("description =>", eventInfo.description);
  console.log("time =>", eventInfo.time);
  console.log("guests =>", eventInfo.guests);
  console.log("img =>", eventInfo.img);

  const imgRef = ref(storage, eventInfo.img.name);

  uploadBytes(imgRef, eventInfo.img).then(() => {
    console.log("file upload done");

    getDownloadURL(imgRef).then((url) => {
      console.log("url agya", url);

      eventInfo.img = url;

      // # add documents to events collection

      const eventCollection = collection(db, "events");

      addDoc(eventCollection, eventInfo).then(() => {
        console.log("doc added");

        window.location.href = "/";
      });
    });
  });
});
