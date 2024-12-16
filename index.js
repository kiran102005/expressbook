const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(token, "secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        req.user = decoded; // Add decoded user to the request object
        next();
    });
});

 
//const PORT =5000;

//app.use("/customer", customer_routes);
//app.use("/", genl_routes);

//app.listen(PORT,()=>console.log("Server is running"));
app.use("/", general_routes.general);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
