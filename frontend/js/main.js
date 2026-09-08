// Управление на видеото в началната секция

document.addEventListener("DOMContentLoaded", () => {
  const heroVideo = document.getElementById("heroVideo");

  if (!heroVideo) return;

  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.volume = 0;

  const playVideo = () => {
    heroVideo.play().catch((error) => {
      console.warn(
        "Автоматичното стартиране на видеото беше блокирано:",
        error
      );
    });
  };

  if (heroVideo.readyState >= 2) {
    playVideo();
  } else {
    heroVideo.addEventListener("canplay", playVideo, { once: true });
  }

  window.addEventListener("pageshow", playVideo);
});