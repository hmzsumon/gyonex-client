// config/socketUrl.ts
let socketUrl = "";

if (process.env.NODE_ENV === "development") {
  socketUrl = "http://localhost:8000"; // local socket server
} else {
  socketUrl = "https://gyonex-api-8bd965ca374f.herokuapp.com"; // deployed socket server
}

export default socketUrl;
