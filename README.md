### 1. Place a div in your website with the id "chat-wrapper"

### 2. Place this code into html/css head, change primary and secondary as needed.

```
<script>
  document.head.appendChild(Object.assign(document.createElement("link"), {
    rel: "stylesheet",
    href: `https://cdn.jsdelivr.net/gh/Bucked-Up/Chatbot@0/style/style.css?cb=${Math.floor(Date.now() / 600000)}`
  }));
</script>
```

## 2. Place this code and change as necessary into html/css footer

```
<script>
  document.head.appendChild(Object.assign(document.createElement("script"), {
    src: `https://cdn.jsdelivr.net/gh/Bucked-Up/Chatbot@0/scripts.min.js?cb=${Math.floor(Date.now() / 600000)}`,
    onload: () => setUpChat({
      webhookEndpoint: "https://lorem.ipsun",
      klaviyoA: "",
      klaviyoG: "",
      waitingTime: 1000,
      items: [
        
      ]
    })
  }));
</script>
```

## Parameters

### `webhookEndpoint` (string, required)
- **Description**: The URL where the collected data should be sent.
- **Example**: `"https://lorem.ipsun`

### `klaviyoA` (string, optional)
- **Description**: An optional key or identifier for Klaviyo integration (for email marketing or analytics).
- **Example**: `""` (Empty string if not used)

### `klaviyoG` (string, optional)
- **Description**: An optional key or identifier for Klaviyo group segmentation.
- **Example**: `""` (Empty string if not used)

### `waitingTime` (number, optional)
- **Description**: Time in milliseconds to wait before displaying the next question or response. This adds a delay between interactions, making the chatbot feel more natural.
- **Example**: `1000` (1000 milliseconds = 1 second)

### `items` (array, required)
- **Description**: A list of questions to ask the user in sequence. Each item in the array is an object with the following properties:
  - **question** (string, required): The question to ask the user.
  - **inputType** (string, required): The type of input expected from the user. Possible values:
    - `"no-input"`: A question that requires no input (like a greeting).
    - `"text"`: A question where the user is expected to input text.
    - `"number"`: A question where the user is expected to input a number.
    - `"options"`: A multiple-choice question where the user selects from predefined options.
    - `"submit"`: A button to submit the form.

  - **inputId** (string, optional): A unique identifier for the input field (used with `"text"`, `"number"`, or `"submit"` inputs).
  - **optionsName** (string, optional): A unique identifier for the options group (used with `"options"` inputs).
  - **options** (array, optional): A list of options for the user to select from (used with `"options"` input). Each option is an object containing:
    - **text** (string, required): The display text for the option.
    - **id** (string, required): A unique identifier for the option.

### Example of `items` array:

```javascript
items: [
  {
    question: "Hello!! Welcome to the Bucked Up Diet Generator. In order to receive a comprehensive diet plan please answer the following questions:",
    inputType: "no-input",
  },
  {
    question: "What is your name?",
    inputType: "text",
    inputId: "first_name",
  },
  {
    question: "What is your year of birth?",
    inputType: "number",
    inputId: "year_of_birth",
  },
  {
    question: "What is your main objective?",
    inputType: "text",
    inputId: "main_objective",
  },
  {
    question: "How often do you exercise?",
    inputType: "options",
    optionsName: "how_often_exercise",
    options: [
      { text: "1x a Week", id: "1x-week" },
      { text: "2x a Week", id: "2x-week" },
      { text: "3x a Week", id: "3x-week" },
      { text: "4x a Week", id: "4x-week" },
      { text: "5x or more a Week", id: "5x-week" },
    ],
  },
  {
    question: "What type of exercise do you do the most?",
    inputType: "options",
    optionsName: "exercise_type",
    options: [
      { text: "CARDIO", id: "cardio" },
      { text: "WEIGHT TRAINING", id: "weight-training" },
      { text: "HIIT/CROSSFIT", id: "hiit-crossfit" },
      { text: "OTHER ACTIVITIES", id: "other" },
    ],
  },
  {
    question: "How tall are you?",
    inputType: "text",
    inputId: "height",
  },
  {
    question: "What is your weight?",
    inputType: "text",
    inputId: "weight",
  },
  {
    question: "What is your country?",
    inputType: "text",
    inputId: "country",
  },
  {
    question: "Wait a minute, we are creating your diet plan",
    inputType: "submit",
  },
]
