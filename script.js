import {
  auth,
  storage,
  db,
  signOut,
  onAuthStateChanged,
  getDoc,
  getDocs,
  doc,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "./utils/utils.js";

const logout_btn = document.querySelector("#logout_btn");
const login_link = document.querySelector("#login_link");
const user_img = document.querySelector("#user_img");
const cards_container = document.querySelector("#cards-container");
getAllEvents();
// console.log("auth", auth);
// console.log("storage", storage);
// console.log("db", db);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    login_link.style.display = "none";
    user_img.style.display = "inline-block";
    getUserInfo(uid);
    // ...
  } else {
    // User is signed out
    // window.location.href = "/auth/login/index.html";

    login_link.style.display = "inline-block";
    user_img.style.display = "none";
  }
});

logout_btn.addEventListener("click", () => {
  signOut(auth);
});

function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);

  getDoc(userRef).then((data) => {
    console.log(data.id);
    console.log(data.data());
    user_img.src = data.data().img;
  });
}

async function getAllEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    // cards_container.innerHTML = " ";

    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);

      const event = doc.data();

      const {
        createdBy,
        createdByEmail,
        description,
        guests,
        img,
        location,
        time,
        title,
      } = event;

      const card = ` <div
        id="events_cards_container"
        class="card h-[480px] bg-white shadow-lg rounded-lg max-w-sm w-full overflow-hidden"
      >
        <img
          src="${img}"
          alt="Event Image"
          class="w-full h-[57%] object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold text-gray-800">${title}</h2>
          <p class="text-gray-600 mt-1">date:,${time}</p>
          <p class="text-gray-600 mt-1">Creator: ${createdByEmail}</p>
          <p class="text-gray-600 mt-1">Location: ${location}}</p>
        </div>
        <div
          class="p-4 border-t border-gray-200 flex justify-center items-center"
        >
          <div class="flex items-center justify-center bg-yellow-500">
            <button id = "${doc.id}" onClick = "likeEvent(this)" class="Btn">
              <span class="leftContainer">
                <svg
                  fill="white"
                  viewBox="0 0 512 512"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                  ></path>
                </svg>
                <span class="like">${
                  auth?.currentUser &&
                  event?.likes?.includes(auth?.currentUser.uid)
                    ? "Liked"
                    : "Like"
                }</span>
              </span>
              <span class="likeCount">205${
                event?.likes?.length ? event?.likes?.length : "2050"
              }</span>
            </button>
          </div>
        </div>
      </div>`;

      window.likeEvent = likeEvent;

      cards_container.innerHTML += card;

      console.log("event", event);
    });
  } catch (error) {
    alert(error);
  }
}

async function likeEvent(e) {
  console.log(e.innerText);

  if (auth.currentUser) {
    const docRef = doc(db, "events", e.id);

    if (e.innerText == "Liked") {
      updateDoc(docRef, {
        likes: arrayRemove(auth.currentUser.uid),
      })
        .then(() => (e.innerText = "Like"))
        .catch((err) => console.log(err));
    } else {
      updateDoc(docRef, {
        likes: arrayUnion(auth.currentUser.uid),
      })
        .then(() => (e.innerText = "Liked"))
        .catch((err) => console.log(err));
    }
  } else {
    window.location.href = "/auth/login/index.html";
  }
}

// function likeButtonCount() {
//   // Get the button and like count elements
//   const likeButton = document.querySelector(".Btn");
//   const likeCount = document.querySelector(".likeCount");

//   // Initialize the like count
//   let likes = 2050;

//   // Add an event listener to the button
//   likeButton.addEventListener("click", () => {
//     // Toggle the button's state
//     likeButton.classList.toggle("liked");

//     // Update the like count
//     if (likeButton.classList.contains("liked")) {
//       likes++;
//       likeCount.textContent = ` ${likes} `;
//     } else {
//       likes--;
//       likeCount.textContent = ` ${likes} `;
//     }
//   });

//   likeButton.addEventListener("click", () => {
//     likeButton.classList.add("animate");
//     setTimeout(() => {
//       likeButton.classList.remove("animate");
//     }, 500);
//   });
// }
// likeButtonCount();
