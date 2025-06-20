# 🚀 AI Function Pipeline Project

---

## ✨ Introduction

This project is an **AI-powered automation platform** that interprets your natural language queries, breaks them down into a sequence of function calls, and executes them using a modular set of tools. It leverages an open-source large language model (via OpenRouter) to reason about your requests and plan the correct sequence of actions.

**Key Features:**
- 🧠 Natural language to function pipeline
- 🔗 Chain multiple actions in one query
- 🛠️ Modular, easily extensible tool system
- ⚡ Rapid prototyping for AI agents and automation

---

## 🏁 Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the chat pipeline:**
   ```sh
   node index.js
   ```
3. **Interact:**
   - Type your queries in natural language (e.g., "Add a user with user id 101 and name Alice, then send her an email").
   - Type `exit` to quit.

---

## 🧩 Tools & Functions

### 👤 User/Todo Tool (`tools/userTodoFunctions.js`)
- `addUser(userId, name)` — Add a new user
- `updateUser(userId, fieldsToUpdate)` — Update user info
- `deleteUser(userId)` — Delete a user
- `addTodoForUser(userId, todo, time)` — Add a todo for a user
- `deleteTodo(userId)` — Delete all todos for a user

### 📁 File System Tool (`tools/fileSystemFunctions.js`)
- `listFiles(directory)` — List files in a directory
- `readFile(filePath)` — Read file contents
- `writeFile(filePath, content)` — Write content to a file

### ⬇️ Download Tool (`tools/downloadFunctions.js`)
- `downloadFile(url, destPath)` — Download a file from a URL (defaults to `./downloads/` if needed)

### 🔔 Notification Tool (`tools/notificationFunctions.js`)
- `sendEmail(to, subject, body)` — Simulate sending an email
- `sendSMS(phoneNumber, message)` — Simulate sending an SMS
- `sendPushNotification(userId, title, message)` — Simulate sending a push notification

### 🖥️ System Info Tool (`tools/systemInfoFunctions.js`)
- `getSystemInfo()` — Get OS, CPU, memory, and network info
- `getFreeStorage()` — Get free storage info for all drives
- `getCpuUsage()` — Get CPU usage over a 1-second interval
- `monitorCpuUsage(seconds)` — Monitor CPU usage for a number of seconds

### 🌐 Web Tool (`tools/webFunctions.js`)
- `checkUrlStatus(url)` — Check HTTP status of a URL
- `checkMultipleUrlsStatus(urls)` — Check status of multiple URLs
- `getRequest(url)` — Make a GET request and return the response body

---

## 💡 Example Queries
- `Add a user with user id 101 and name Alice, create a todo for her to "submit report" at 5pm, then send her an email reminder about the todo, and check if https://example.com is up.`
- `List all files in the ./tools directory and download the file from https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf.`
- `Get system info and CPU usage.`

---

## 🛠️ Adding New Tools

1. **Create your tool file:**
   - Add a new file in the `tools/` directory (e.g., `tools/myNewTool.js`).
   - Export your functions using ES module syntax (`export default { ... }`).
2. **Implement your functions:**
   - Each function should be clear about its inputs and outputs.
   - Example:
     ```js
     // tools/myNewTool.js
     function myFunction(param1, param2) {
       // ...logic...
       return { result: ... };
     }
     export default { myFunction };
     ```
3. **Register your tool in the pipeline:**
   - Open `functionLibrary.js`.
   - Import your tool:
     ```js
     import myNewTool from './tools/myNewTool.js';
     ```
   - Add each function to the `functionLibrary` array with a name, description, inputs, outputs, and implementation:
     ```js
     {
       name: "myFunction",
       description: "Describe what your function does.",
       inputs: ["param1", "param2"],
       outputs: ["result"],
       implementation: myNewTool.myFunction
     }
     ```
4. **Restart the chat:**
   - Stop and restart `node index.js` to load your new tool.
5. **Test your tool:**
   - Use a natural language query that should trigger your new function.

---

## 🧠 More Tool Ideas

You can expand your pipeline with many more tools! Here are some ideas:

- **PDF Tool:**
  - `extractTextFromPDF(filePath)` — Extract text from a PDF file
  - `getPDFPageCount(filePath)` — Get the number of pages in a PDF
- **Image Tool:**
  - `resizeImage(imagePath, width, height)` — Resize an image
  - `convertImageFormat(imagePath, format)` — Convert image format (e.g., PNG to JPG)
  - `getImageInfo(imagePath)` — Get image metadata
- **Text Analysis Tool:**
  - `summarizeText(text)` — Summarize a block of text
  - `extractKeywords(text)` — Extract keywords from text
  - `countWords(text)` — Count words in text
- **Database Tool:**
  - `queryDatabase(queryString)` — Run a SQL query
  - `insertRecord(table, data)` — Insert a record
  - `deleteRecord(table, id)` — Delete a record
- **Math/Statistics Tool:**
  - `calculate(expression)` — Evaluate a math expression
  - `mean(numbersArray)` — Calculate mean
  - `median(numbersArray)` — Calculate median
  - `standardDeviation(numbersArray)` — Calculate standard deviation
- **Translation Tool:**
  - `translate(text, targetLanguage)` — Translate text
  - `detectLanguage(text)` — Detect language of text
- **Scheduler Tool:**
  - `scheduleTask(taskName, time)` — Schedule a task
  - `cancelTask(taskId)` — Cancel a scheduled task
  - `listScheduledTasks()` — List all scheduled tasks
- **Zip/Unzip Tool:**
  - `zipFiles(filePaths, outputZipPath)` — Zip files
  - `unzipFile(zipPath, outputDir)` — Unzip files
- **Audio Tool:**
  - `getAudioDuration(audioPath)` — Get audio duration
  - `convertAudioFormat(audioPath, format)` — Convert audio format
- **Random/Utility Tool:**
  - `generateRandomNumber(min, max)` — Generate a random number
  - `generateUUID()` — Generate a unique ID

You can add any of these as new tools by following the steps in the "Adding New Tools" section above!

---

## 📝 Notes
- All tool actions are logged in the terminal with a clear, color-coded summary.
- The project is modular: add new tools in the `tools/` directory and register them in `functionLibrary.js`.
- For LLM and tool-calling, you need a valid OpenRouter API key in `config.js`.



