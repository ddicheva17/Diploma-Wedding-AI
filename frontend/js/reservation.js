// Подготовка на формите за оферта и резервация

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("wedding_user_id");

  // Свързване на офертата и резервацията с текущия потребител
  if (userId) {
    const userIdInputs = [
      document.getElementById("offerUserId"),
      document.getElementById("reservationUserId")
    ];

    userIdInputs.forEach((input) => {
      if (input) input.value = userId;
    });
  }

  // Попълване на резервацията от последно генерираната оферта
  const savedOfferData = sessionStorage.getItem("wedding_offer_form_data");

  if (!savedOfferData) return;

  try {
    const offerData = JSON.parse(savedOfferData);
    const fieldMappings = {
      clientName: "name",
      clientEmail: "email",
      clientPhone: "phone",
      weddingDate: "wedding_date",
      guestCount: "guests",
      budget: "budget",
      weddingSeason: "season",
      weddingStyle: "style"
    };

    Object.entries(fieldMappings).forEach(([elementId, dataKey]) => {
      const element = document.getElementById(elementId);

      if (element && offerData[dataKey]) {
        element.value = offerData[dataKey];
      }
    });
  } catch (error) {
    console.error("Грешка при зареждане на данните от офертата:", error);
  }
});

// Валидация на резервационната форма

const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
  reservationForm.addEventListener("submit", (event) => {
    const guestCount = document.getElementById("guestCount").value;
    const budget = document.getElementById("budget").value;
    const weddingDate = document.getElementById("weddingDate").value;

    if (guestCount <= 0) {
      event.preventDefault();
      alert("Моля, въведете валиден брой гости.");
      return;
    }

    if (budget !== "" && budget < 1000) {
      event.preventDefault();
      alert("Минималният бюджет трябва да бъде поне 1000 € .");
      return;
    }

    if (weddingDate === "") {
      event.preventDefault();
      alert("Моля, изберете дата за събитието.");
    }
  });
}