const GIPHY_API_KEY = "IIGtYBZ6vipTowmka5E22iV3PPuaWYTR";

async function translateGif(str) {
  const url = `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${str}`;
  const options = { mode: "cors" };

  return fetch(url, options).then((response) => {
    return response.json();
  });
}

function updateGif(str) {
  if (!str) return;

  const img = document.querySelector("img");
  img.src = "";

  translateGif(str).then((data) => {
    img.src = data.data.images.original.url;
  });
}

function domLoaded() {
  const form = document.querySelector("form");
  const search = document.querySelector('input[name="search"]');

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateGif(search.value);
  });

  updateGif("cats");
}

window.addEventListener("DOMContentLoaded", domLoaded);
