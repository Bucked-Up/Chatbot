const setUpChat = ({ items, webhookEndpoint, klaviyoA, klaviyoG, waitingTime }) => {
  const wrapper = document.getElementById("chat-wrapper");
  const form = document.createElement("form");
  form.id = "chat";
  form.classList.add("chat");
  wrapper.appendChild(form)
  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  let spinner = document.createElement("div");
  spinner.innerHTML =
    '<svg id="spinner" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style>.spinner_S1WN{animation:spinner_MGfb .8s linear infinite;animation-delay:-.8s}.spinner_Km9P{animation-delay:-.65s}.spinner_JApP{animation-delay:-.5s}@keyframes spinner_MGfb{93.75%,100%{opacity:.2}}</style><circle class="spinner_S1WN" cx="4" cy="12" r="3"/><circle class="spinner_S1WN spinner_Km9P" cx="12" cy="12" r="3"/><circle class="spinner_S1WN spinner_JApP" cx="20" cy="12" r="3"/></svg>';
  spinner = spinner.firstChild;

  const createMessage = (params) => {
    const message = document.createElement("div");
    message.innerHTML = params.question;
    message.classList.add("message");
    message.classList.add("message-bot");
    if (params.inputType === "submit" || params.inputType === "last-response") message.classList.add("has-pic");
    return message;
  };

  const createResponse = (text) => {
    const response = document.createElement("div");
    response.innerHTML = text;
    response.classList.add("message");
    response.classList.add("message-user");
    return response;
  };

  const handleSubmitQuestion = (input) => {
    if (input.value.trim() !== "") input.type = "hidden";
  };

  const createInput = (params) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("text-input");
    const button = document.createElement("button");
    button.type = "button";
    const input = document.createElement("input");
    input.type = params.inputType;
    input.id = params.inputId;
    input.placeholder = "Type here...";
    wrapper.appendChild(input);
    wrapper.appendChild(button);
    button.addEventListener("click", () => handleSubmitQuestion(input));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSubmitQuestion(input);
      }
    });
    return wrapper;
  };

  const createOptions = (params) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("select-wrapper");
    params.options.forEach((option) => {
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.innerHTML = option.text;
      label.for = option.id;
      input.type = "radio";
      input.id = option.id;
      input.value = option.text;
      input.name = params.optionsName;
      label.appendChild(input);
      wrapper.appendChild(label);
    });
    return wrapper;
  };

  const questions = [];
  items.forEach((item) => {
    switch (item.inputType) {
      case "no-input": {
        questions.push({ type: "message", element: createMessage(item) });
        break;
      }

      case "submit": {
        questions.push({ type: "submit", element: createMessage(item) });
        break;
      }

      case "text":
      case "number":
      case "email": {
        const message = createMessage(item);
        message.appendChild(createInput(item));
        questions.push({ type: "text-question", element: message });
        break;
      }

      case "options": {
        const wrapper = document.createElement("div");
        wrapper.classList.add("message-wrapper");
        wrapper.appendChild(createMessage(item));
        wrapper.appendChild(createOptions(item));
        questions.push({ type: "option-question", element: wrapper });
        break;
      }
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const handleQuestions = async (step = 0) => {
    document.getElementById("spinner")?.remove();
    const nextStep = step + 1;
    const { type, element } = questions[step];
    switch (type) {
      case "message": {
        form.appendChild(element);
        handleNextQuestion(nextStep);
        break;
      }
      case "text-question": {
        const input = element.querySelector("input")
        form.appendChild(element);
        input.focus();
        const handleQuestionSubmit = () => {
          if (input.value.trim() !== "") {
            form.appendChild(createResponse(element.querySelector("input").value));
            handleNextQuestion(nextStep);
          }
        };
        element.querySelector("button").addEventListener("click", handleQuestionSubmit);
        input.addEventListener("keydown", e => e.key === "Enter" && handleQuestionSubmit(input));
        break;
      }
      case "option-question": {
        form.appendChild(element);
        element.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => {
          form.appendChild(createResponse(element.querySelector("input:checked").value));
          handleNextQuestion(nextStep)
        }));
        break;
      }
      case "submit": {
        form.appendChild(element);
        form.appendChild(spinner);
        const body = {}
        Array.from(form.querySelectorAll("input:not([type='radio'])")).forEach(input => {
          body[input.id] = input.value
        })
        Array.from(form.querySelectorAll("input[type='radio']:checked")).forEach(input => {
          body[input.name] = input.value
        })

        const postKlaviyo = async () => {
          if (!klaviyoA) return;
          const { first_name, email, ...klaviyoBody } = body;
          try {
            const response = await fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${klaviyoA}`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                "revision": "2024-10-15",
              },
              body: JSON.stringify(
                {
                  "data": {
                    "type": "subscription",
                    "attributes": {
                      "profile": {
                        "data": {
                          "type": "profile",
                          "attributes": {
                            "properties": {
                              "Accepts-Marketing": "true",
                              ...klaviyoBody,
                            },
                            "email": email,
                            "first_name": first_name,
                          }
                        }
                      }
                    },
                    "relationships": {
                      "list": {
                        "data": {
                          "type": "list",
                          "id": klaviyoG,
                        }
                      }
                    }
                  }
                }
              ),
            });
            if (!response.ok) {
              throw new Error("Klaviyo Network response was not ok: " + response.statusText);
            }
            const data = await response.json();
            if (!data.success) throw new Error("Error sending to klaviyo: " + data.errors);
          } catch (e) {
            console.warn(e);
          }
        };

        const postWebhook = async () => {
          try {
            const response = await fetch(webhookEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
            const data = await response.json();
            form.appendChild(createMessage({ question: data.data, inputType: "last-response" }));
            document.getElementById("spinner")?.remove();
          } catch (error) {
            console.error('Error:', error);
            alert("Oops, something went wrong. Try our products in the meantime!")
            await delay(1000);
            window.location.href = "https://buckedup.com"
          }
        }
        Promise.all([postWebhook(), postKlaviyo()]);
      }
    }
  };

  const handleNextQuestion = async (nextStep) => {
    form.appendChild(spinner);
    await delay(waitingTime);
    handleQuestions(nextStep);
  };
  handleQuestions();

  window.onbeforeunload = function (event) {
    const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
    event.returnValue = message;
    return message;
  };
};

window.setUpChat = setUpChat;