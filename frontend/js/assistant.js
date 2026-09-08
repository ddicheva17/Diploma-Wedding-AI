// AI assistant module

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const userQuestionInput = document.getElementById("userQuestion");
  const chatMessages = document.getElementById("chatMessages");
  const suggestionButtons = document.querySelectorAll(".suggestion-btn");
  const chatUserStatus = document.getElementById("chatUserStatus");

  let currentChatSessionId = localStorage.getItem("wedding_chat_session_id");
  const assistantUserId = localStorage.getItem("wedding_user_id");
  const assistantUserName = localStorage.getItem("wedding_user_name");

  // Resize the message field up to 180px
  function resizeMessageField() {
    if (!userQuestionInput) return;

    const maxHeight = 180;
    userQuestionInput.style.height = "auto";
    userQuestionInput.style.height =
      `${Math.min(userQuestionInput.scrollHeight, maxHeight)}px`;
    userQuestionInput.style.overflowY =
      userQuestionInput.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  if (userQuestionInput) {
    userQuestionInput.addEventListener("input", resizeMessageField);
  }

  if (chatUserStatus) {
    chatUserStatus.textContent = assistantUserName || "Guest";
  }

  function addChatMessage(text, sender) {
    if (!chatMessages) return;

    const message = document.createElement("div");
    message.className = `chat-message ${sender}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addServiceImageMessage(text, imageBase64) {
    if (!chatMessages) return;

    const message = document.createElement("div");
    message.className = "chat-message bot";

    const messageText = document.createElement("div");
    messageText.textContent = text;
    message.appendChild(messageText);

    if (imageBase64) {
      const image = document.createElement("img");
      image.src = `data:image/png;base64,${imageBase64}`;
      image.alt = "AI редактирана сватбена визуализация";
      image.style.width = "100%";
      image.style.maxWidth = "500px";
      image.style.height = "auto";
      image.style.display = "block";
      image.style.marginTop = "12px";
      image.style.borderRadius = "12px";
      message.appendChild(image);
    }

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getLastBotMessage() {
    const botMessages = document.querySelectorAll(".chat-message.bot");
    return botMessages[botMessages.length - 1];
  }

  async function getOrCreateChatSession() {
    if (!assistantUserId) return null;

    const response = await fetch(
      "../backend/php/get_or_create_chat_session.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: assistantUserId })
      }
    );

    const data = await response.json();

    if (data.success) {
      currentChatSessionId = data.session_id;
      localStorage.setItem("wedding_chat_session_id", currentChatSessionId);
      return currentChatSessionId;
    }

    return null;
  }

  async function saveChatMessage(sender, message) {
    if (!currentChatSessionId) return;

    await fetch("../backend/php/save_chat_message.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: currentChatSessionId,
        sender,
        message
      })
    });
  }

  async function saveVisualization(prompt, imageBase64) {
    if (!assistantUserId || !prompt || !imageBase64) return false;

    try {
      const response = await fetch("../backend/php/save_visualization.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: assistantUserId,
          prompt,
          image_base64: imageBase64
        })
      });

      const data = await response.json();

      if (!data.success) {
        console.warn("Визуализацията не беше запазена:", data.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Грешка при запазване на визуализацията:", error);
      return false;
    }
  }

  async function loadSavedChatMessages() {
    if (!currentChatSessionId || !chatMessages) return;

    const response = await fetch("../backend/php/get_chat_messages.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: currentChatSessionId })
    });

    const data = await response.json();

    if (data.success && data.messages.length > 0) {
      chatMessages.innerHTML = "";
      const lastMessages = data.messages.slice(-10);

      if (data.messages.length > 10) {
        const infoMessage = document.createElement("div");
        infoMessage.className = "chat-history-info";
        infoMessage.textContent =
          "Показани са последните съобщения от разговора. Историята е запазена.";
        chatMessages.appendChild(infoMessage);
      }

      lastMessages.forEach((item) => {
        addChatMessage(item.message, item.sender);
      });

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  async function getAssistantReply(question) {
    const previousMessages = [];

    document.querySelectorAll(".chat-message").forEach((message) => {
      previousMessages.push({
        sender: message.classList.contains("user") ? "user" : "bot",
        message: message.textContent
      });
    });

    const response = await fetch("http://127.0.0.1:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        history: previousMessages,
        user_id: assistantUserId
      })
    });

    // The complete response is needed for text and service-image replies
    return response.json();
  }

  if (chatMessages) {
    getOrCreateChatSession().then(() => {
      loadSavedChatMessages();
    });
  }

  if (chatForm) {
    chatForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const question = userQuestionInput.value.trim();
      if (question === "") return;

      addChatMessage(question, "user");
      await saveChatMessage("user", question);

      userQuestionInput.value = "";
      resizeMessageField();
      addChatMessage("Обработвам въпроса...", "bot");

      try {
        const reply = await getAssistantReply(question);
        const loadingMessage = getLastBotMessage();

        if (reply.type === "service_image" && reply.image) {
          if (loadingMessage) loadingMessage.remove();

          addServiceImageMessage(reply.answer, reply.image);
          await saveChatMessage("bot", reply.answer);

          const visualizationPrompt =
            `Редакция на ${reply.service_name || "услуга"}, ` +
            `изображение №${reply.image_number || "-"}: ` +
            `${reply.instruction || question}`;

          await saveVisualization(visualizationPrompt, reply.image);
        } else {
          const answer =
            reply.answer || "Не беше получен отговор от AI асистента.";

          if (loadingMessage) {
            loadingMessage.textContent = answer;
          } else {
            addChatMessage(answer, "bot");
          }

          await saveChatMessage("bot", answer);
        }
      } catch (error) {
        console.error("AI Assistant Error:", error);

        const loadingMessage = getLastBotMessage();
        const errorMessage =
          "Възникна проблем при връзката с AI backend-а.";

        if (loadingMessage) {
          loadingMessage.textContent = errorMessage;
        } else {
          addChatMessage(errorMessage, "bot");
        }
      }
    });
  }

  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!userQuestionInput) return;

      userQuestionInput.value = button.textContent;
      resizeMessageField();
      userQuestionInput.focus();
    });
  });
});