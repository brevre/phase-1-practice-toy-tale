let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Challenge 1: Fetch and render all toys
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((toy) => {
        renderToy(toy);
      });
    });

  // Challenge 2: Add a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    const newToy = { name, image, likes: 0 };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        renderToy(toy);
        toyForm.reset();
      });
  });

  // Challenge 3: Increase a toy's likes
  toyCollection.addEventListener("click", (event) => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.id;
      const likeCount = event.target.previousElementSibling;
      const currentLikes = parseInt(likeCount.innerText.split(" ")[0]);
      const newLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((response) => response.json())
        .then((updatedToy) => {
          likeCount.innerText = `${updatedToy.likes} Likes`;
        });
    }
  });

  // Function to render a toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    toyCollection.appendChild(card);
  }
});
