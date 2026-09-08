// Popup галерия с изображения към услугите

const serviceCards = document.querySelectorAll(".service-card");
const galleryModal = document.getElementById("serviceGalleryModal");
const closeGalleryBtn = document.getElementById("closeServiceGallery");
const galleryTitle = document.getElementById("galleryTitle");
const galleryDescription = document.getElementById("galleryDescription");
const galleryImages = document.getElementById("galleryImages");

const createImageList = (prefix, count) =>
  Array.from({ length: count }, (_, index) => `${prefix}${index + 1}.jpg`);

const serviceGalleries = {
  planning: {
    title: "Цялостно сватбено планиране",
    description:
      "Примери за цялостна организация, концепция и координация на сватбени събития.",
    images: createImageList("planning", 6)
  },
  decoration: {
    title: "Декорация и стайлинг",
    description:
      "Визуални концепции, флорална декорация и елегантен сватбен стайлинг.",
    images: createImageList("decoration", 9)
  },
  invitations: {
    title: "Сватбени покани",
    description:
      "Примери за покани и печатни материали, съобразени със стила на събитието.",
    images: createImageList("invitations", 9)
  },
  cakes: {
    title: "Сватбени торти",
    description:
      "Идеи за елегантни сватбени торти според дизайн, вкус и концепция.",
    images: createImageList("cakes", 9)
  },
  fireworks: {
    title: "Заря и пироефекти",
    description:
      "Впечатляващи светлинни и пироефекти за специален финал на сватбения ден.",
    images: createImageList("fireworks", 9)
  }
};

// Отваряне на галерията към избраната услуга
serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const gallery = serviceGalleries[card.dataset.gallery];

    if (!gallery) return;

    galleryTitle.textContent = gallery.title;
    galleryDescription.textContent = gallery.description;
    galleryImages.innerHTML = "";

    gallery.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = `images/services/${image}`;
      img.alt = gallery.title;
      galleryImages.appendChild(img);
    });

    galleryModal.classList.add("active");
  });
});

if (closeGalleryBtn) {
  closeGalleryBtn.addEventListener("click", () => {
    galleryModal.classList.remove("active");
  });
}

// Добавяне на услуга към профила на потребителя
document.querySelectorAll(".add-service-btn").forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.stopPropagation();

    const userId = localStorage.getItem("wedding_user_id");
    const serviceName = button.dataset.service;

    if (!userId) {
      alert("Моля, влезте в профила си, за да добавите услуга.");
      window.location.href = "login.html";
      return;
    }

    try {
      const response = await fetch(
        "../backend/php/update_selected_services.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            service_name: serviceName
          })
        }
      );

      const data = await response.json();
      alert(data.message);

      if (data.success) {
        button.textContent = "Добавено ✓";
        button.disabled = true;
      }
    } catch (error) {
      alert("Възникна проблем при добавянето на услугата.");
    }
  });
});