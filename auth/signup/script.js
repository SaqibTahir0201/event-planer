import {
  getAuth,
  auth,
  createUserWithEmailAndPassword,
  doc,
  db,
  storage,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../utils/utils.js";

// #1 create account =>  createUserWithEmailAndPassword,
// #2 upload images => ref, uploadBytes, getDownloadURL,
// #3 set complete data into Firestore =>  doc, setDoc,

const signup_btn = document.querySelector("#signup_form");
const submit_btn = document.querySelector("#submit_btn");

signup_btn.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(e);
  const imgInput = e.target[0];
  const img = imgInput.files[0];
  if (!img) {
    alert("Please select an image");
    return;
  }

  const firstName = e.target[1].value;
  const lastName = e.target[2].value;
  const email = e.target[3].value;
  const password = e.target[4].value;
  console.log("img =>", img);
  console.log("firstName =>", firstName);
  console.log("lastName =>", lastName);
  console.log("email =>", email);
  console.log("password =>", password);

  const userInfo = {
    img,
    email,
    password,
    firstName,
    lastName,
  };
  console.log(userInfo);

  //@ Create Account
  submit_btn.disabled = true;
  submit_btn.innerText = "Loading...";
  // const renderedText = htmlElement.innerText; = true;
  createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      console.log("user =>", user);
      console.log("user =>", user.user.uid);
      //@ Upload IMG
      //# pehle reference bnana perhta hai
      const userRef = ref(storage, `user/${user.user.uid}`);
      uploadBytes(userRef, img)
        .then(() => {
          console.log("img upload");
          getDownloadURL(userRef)
            .then((url) => {
              console.log("url agya", url);

              //# update user info object
              userInfo.img = url;

              //# user kai docoment ka refrence
              const userDbRef = doc(db, "users", user.user.uid);

              //# set this document to db
              setDoc(userDbRef, userInfo).then(() => {
                console.log("user object updated into db");
                window.location.href = "/";
                submit_btn.disabled = false;
                submit_btn.innerText = "Submit";
              });
            })
            .catch(() => {
              console.log("firebase url nhi dai rha");
              submit_btn.disabled = false;
              submit_btn.innerText = "Submit";
            });
        })
        .catch(() => {
          console.log("img upload nhi hoi ");
          submit_btn.disabled = false;
          submit_btn.innerText = "Submit";
        });
    })
    .catch((err) => {
      alert(err);
      submit_btn.disabled = false;
      submit_btn.innerText = "Submit";
    });
});

// signup_btn.addEventListener('submit', (e) => {
// });
