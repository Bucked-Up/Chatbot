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

### Will make the rest of the readme later.
