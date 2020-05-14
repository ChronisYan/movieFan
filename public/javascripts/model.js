// MODAL FUNCTIONALITY
const modalButton = document.querySelector(".modal-button");
const modalWrapper = document.querySelector(".modal-wrapper");
const closeModal = document.querySelector(".modal-close");

modalButton.addEventListener("click", () => {
  modalWrapper.style.display = "block";
  document.body.style.overflow = "hidden";
});

closeModal.addEventListener("click", () => {
  modalWrapper.style.display = "none";
  document.body.style.overflow = "visible";
});

modalWrapper.addEventListener("click", (e) => {
  if (e.target.classList[0] === "modal-wrapper") {
    modalWrapper.style.display = "none";
    document.body.style.overflow = "visible";
  }
});
