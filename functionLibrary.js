// functionLibrary.js
import userTodo from './tools/userTodoFunctions.js';
import systemInfo from './tools/systemInfoFunctions.js';
import fileSystem from './tools/fileSystemFunctions.js';
import download from './tools/downloadFunctions.js';
import notification from './tools/notificationFunctions.js';
import web from './tools/webFunctions.js';

const functionLibrary = [
  {
    name: "addUser",
    description: "Add a new user with userId and name.",
    inputs: ["userId", "name"],
    outputs: ["userObject"],
    implementation: userTodo.addUser
  },
  {
    name: "updateUser",
    description: "Update an existing user's information.",
    inputs: ["userId", "fieldsToUpdate"],
    outputs: ["userObject"],
    implementation: userTodo.updateUser
  },
  {
    name: "deleteUser",
    description: "Delete a user by userId.",
    inputs: ["userId"],
    outputs: ["success"],
    implementation: userTodo.deleteUser
  },
  {
    name: "addTodoForUser",
    description: "Add a todo for a user at a specific time.",
    inputs: ["userId", "todo", "time"],
    outputs: ["todoObject"],
    implementation: userTodo.addTodoForUser
  },
  {
    name: "deleteTodo",
    description: "Delete a todo by userId.",
    inputs: ["userId"],
    outputs: ["success"],
    implementation: userTodo.deleteTodo
  },
  {
    name: "getSystemInfo",
    description: "Get general information about the system (OS, CPU, memory, etc).",
    inputs: [],
    outputs: ["systemInfoObject"],
    implementation: systemInfo.getSystemInfo
  },
  {
    name: "getFreeStorage",
    description: "Get free storage information for all drives.",
    inputs: [],
    outputs: ["freeStorageInfo"],
    implementation: async () => await systemInfo.getFreeStorage()
  },
  {
    name: "getCpuUsage",
    description: "Get CPU usage over a 1 second interval.",
    inputs: [],
    outputs: ["cpuUsageInfo"],
    implementation: async () => await systemInfo.getCpuUsage()
  },
  {
    name: "monitorCpuUsage",
    description: "Monitor CPU usage for a given number of seconds (default 5).",
    inputs: ["seconds"],
    outputs: ["log"],
    implementation: async (seconds) => await systemInfo.monitorCpuUsage(seconds)
  },
  {
    name: "listFiles",
    description: "List all files in a directory.",
    inputs: ["directory"],
    outputs: ["filesArray"],
    implementation: fileSystem.listFiles
  },
  {
    name: "readFile",
    description: "Read the contents of a file.",
    inputs: ["filePath"],
    outputs: ["fileContent"],
    implementation: fileSystem.readFile
  },
  {
    name: "writeFile",
    description: "Write content to a file.",
    inputs: ["filePath", "content"],
    outputs: ["success"],
    implementation: fileSystem.writeFile
  },
  {
    name: "downloadFile",
    description: "Download a file from a URL to a destination path.",
    inputs: ["url", "destPath"],
    outputs: ["success", "path"],
    implementation: download.downloadFile
  },
  {
    name: "sendEmail",
    description: "Send an email to a recipient.",
    inputs: ["to", "subject", "body"],
    outputs: ["success", "message"],
    implementation: notification.sendEmail
  },
  {
    name: "sendSMS",
    description: "Send an SMS to a phone number.",
    inputs: ["phoneNumber", "message"],
    outputs: ["success", "message"],
    implementation: notification.sendSMS
  },
  {
    name: "sendPushNotification",
    description: "Send a push notification to a user.",
    inputs: ["userId", "title", "message"],
    outputs: ["success", "message"],
    implementation: notification.sendPushNotification
  },
  {
    name: "checkUrlStatus",
    description: "Check the HTTP status of a single URL.",
    inputs: ["url"],
    outputs: ["statusCode", "statusMessage", "error"],
    implementation: web.checkUrlStatus
  },
  {
    name: "checkMultipleUrlsStatus",
    description: "Check the HTTP status of multiple URLs.",
    inputs: ["urls"],
    outputs: ["resultsArray"],
    implementation: web.checkMultipleUrlsStatus
  },
  {
    name: "getRequest",
    description: "Make a GET request to a URL and return the response body.",
    inputs: ["url"],
    outputs: ["statusCode", "body", "error"],
    implementation: web.getRequest
  }
];

export default functionLibrary;
