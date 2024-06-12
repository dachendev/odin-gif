const GIPHY_API_KEY = "IIGtYBZ6vipTowmka5E22iV3PPuaWYTR";

/**
 * Translates a search string into a Giphy GIF.
 *
 * @param {string} str - The search string to translate.
 * @throws {Error} If no search string is provided.
 * @throws {Error} If the request fails.
 * @return {Promise<Object>} The JSON data representing the translated GIF.
 */
async function translate(str) {
  // Check if the search string is provided
  if (!str) {
    throw new Error("No search string");
  }

  // Construct the URL with the search string
  const url = `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${str}`;
  const options = { mode: "cors" }; // Set the CORS mode

  // Make the request to the Giphy API
  const response = await fetch(url, options);

  // Check if the response is successful
  if (!response.ok) {
    throw new Error("Request failed");
  }

  // Parse the response data as JSON
  const data = await response.json();

  // Return the translated GIF data
  return data;
}

/**
 * Translates a search string and updates the image source.
 *
 * @param {string} str - The search string to translate.
 * @throws {Error} If the search string is not provided.
 * @throws {Error} If the translated GIF data does not contain images.
 */
async function translateAndUpdate(str) {
  // Translate the search string into a GIF
  const response = await translate(str);

  // Extract the images from the translated GIF data
  const images = response.data.images;

  // Check if the translated GIF data contains images
  if (!images) {
    throw new Error("No images");
  }

  // Select the image element in the document
  const img = document.querySelector("img");

  // Update the image source with the original URL from the translated GIF data
  img.src = images.original.url;
}

/**
 * Creates an alert element with optional customization options.
 *
 * @param {Object} options - Customization options for the alert element.
 * @param {HTMLElement} options.element - The custom alert element.
 * @returns {Object} - The alert object with methods to set message, status, show, and hide.
 */
function createAlert(options = {}) {
  const alert = {};

  /**
   * Creates a default alert element with default styles.
   * @returns {HTMLElement} - The default alert element.
   */
  function createElement() {
    const element = document.createElement("div");
    element.classList.add("alert");
    element.setAttribute("role", "alert");
    return element;
  }

  // Set the alert element to the custom element if provided, otherwise create a default element
  alert.element = options.element || createElement();

  /**
   * Sets the message of the alert element.
   * @param {string} message - The message to set.
   */
  alert.setMessage = (message) => {
    alert.element.textContent = message;
  };

  /**
   * Sets the status of the alert element.
   * @param {string} status - The status to set, either "error" or "success".
   */
  alert.setStatus = (status) => {
    alert.element.classList.remove("alert-error", "alert-success");

    switch (status) {
      case "error":
        alert.element.classList.add("alert-error");
        break;
      case "success":
        alert.element.classList.add("alert-success");
        break;
    }
  };

  /**
   * Shows the alert element by removing the "hidden" class.
   */
  alert.show = () => {
    alert.element.classList.remove("hidden");
  };

  /**
   * Hides the alert element by adding the "hidden" class.
   */
  alert.hide = () => {
    alert.element.classList.add("hidden");
  };

  return alert;
}

function domLoaded() {
  const form = document.querySelector("form");
  const search = document.querySelector('input[name="search"]');

  // Create the alert element and customize it
  const alert = createAlert();
  alert.element.classList.add("mb-2", "hidden");
  form.insertBefore(alert.element, form.firstChild);

  form.onsubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    const str = search.value;
    if (!str) {
      // If the search input is empty, return early
      return;
    }

    // Translate the search string and update the image source
    translateAndUpdate(str).catch((error) => {
      alert.setMessage(error.message);
      alert.setStatus("error");
      alert.show();
    });
  };
}

window.addEventListener("DOMContentLoaded", domLoaded);
