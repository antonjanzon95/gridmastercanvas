import { fetchImages, renderImages } from "./showimgs";

const saveImagePost = async (roomId) => {
  const response = await fetch("http://localhost:3000/image/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId }),
  });
  const data = await response.json();
  viewSavedImages();
};

// view saved images
export const viewSavedImages = async () => {
  const images = await fetchImages();
  renderImages(images);
};

export function handleSaveImage(e) {
  const roomId = e.target.id;
  saveImagePost(roomId);
}
