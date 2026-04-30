const openReviewsModalButton = document.getElementById("open-reviews-modal");
const closeReviewsModalButton = document.getElementById("close-reviews-modal");
const reviewsModal = document.getElementById("reviews-modal");

if (openReviewsModalButton && closeReviewsModalButton && reviewsModal) {
  openReviewsModalButton.addEventListener("click", () => {
    reviewsModal.classList.remove("hidden");
  });

  closeReviewsModalButton.addEventListener("click", () => {
    reviewsModal.classList.add("hidden");
  });

  reviewsModal.addEventListener("click", event => {
    if (event.target === reviewsModal) {
      reviewsModal.classList.add("hidden");
    }
  });
}
