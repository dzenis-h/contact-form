const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const {
  user,
  password,
  type,
  clientId,
  clientSecret,
  refreshToken,
  accessToken,
} = require("./config/keys_prod");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(cors());
// app.use(express.static(__dirname + "/"));
app.use(express.static("public"));

app.set("trust proxy", true);

app.set("view engine", "hbs");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  // Allow multiple predefined origins
  const allowedOrigins = [
    "https://reactive-portfolio.web.app",
    "https://dzenis-h-contact.appspot.com/form-data",
    "https://denis.tech",
    "https://dzens-h.com/form-data",
  ];

  const origin = req.headers.origin; // extract the origin from the header
  if (allowedOrigins.indexOf(origin) > -1) {
    // if the origin is present
    res.setHeader("Access-Control-Allow-Origin", origin); // set the CORS header to it
  }

  // Alternatively, you can accept all requests simply by uncommenting the following line of code:
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
  res.status(200).json("success");
});

// Getting the form-data from React
app.post("/form-data", (req, res) => {
  const { name, company, email, phone, message } = req.body.formData;
  let output = `
  <p>You have a new contact request</p>
  <h3>Contact Details:</h3>
  <ul>  
      <li>Name: ${name}</li>
      <li>Company: ${company}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
  </ul>
    <h3>Message:</h3>
    <p>${message}</p>
  `;
  res.status(200).json({ msg: "Successful request has been made." });

  // Setup email data with unicode symbols
  let mailOptions = {
    from: `Contact Form - ${req.body.formData.email}`, // sender address
    to: "contact.dzenis.h@gmail.com", // list of receivers
    subject: "Website Contact Request", // Subject line
    text: "", // plain text body
    html: output, // html body
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // We're able to it like this because key && value have the same name (ES6+)
    auth: {
      user: process.env.email, // Email you want to use in this SMTP server
      password: process.password, // Your e-mail password
      type: process.env.type, // defining the authentication type
      // Go to --> https://console.cloud.google.com and create a new project, then credentials
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      // Go to --> https://developers.google.com/oauthplayground then enter your creds and create the following tokens.
      refreshToken: process.env.refreshToken,
      accessToken: process.env.accessToken,
    },
  });

  // verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ msg: "Email has been sent" });
  });
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log("Server started ..."));
