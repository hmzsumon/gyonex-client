// config/socketUrl.ts
let socketUrl = "";

if (process.env.NODE_ENV === "development") {
  socketUrl = "http://localhost:8000"; // local socket server
} else {
  socketUrl = "https://gyonex-38be329903dc.herokuapp.com"; // deployed socket server
}

export default socketUrl;
