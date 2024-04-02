const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const csurf = require('csurf');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth/auth');
const adminRoutes = require('./routes/admin/admin');
const userRoutes = require('./routes/user/user');

const MONGO_URI =
  'mongodb+srv://teamcode:teamcode@code.1gxvbjo.mongodb.net/nft_game';

const User = require('./models/user');

const limiter = rateLimit({
  // Limit requests (100 req / 3 mins) per user.
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: 'Too many requests. Please try again in a few minutes.',
});

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions',
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Generate a random nonce
const nonce = crypto.randomBytes(16).toString('base64');

// Use Helmet middleware to set various HTTP headers for security
app.use(helmet());

// Set Content Security Policy (CSP) using Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", '*'],
      mediaSrc: ["'self'", '*'],
      scriptSrc: ["'self'", 'https://apis.google.com'],
      scriptSrcElem: ["'self'", `'unsafe-inline'`, `'nonce-${nonce}'`],
      frameSrc: ["'self'", '*'],
    },
  })
);

// Middleware to check if the user is logged into Google
const checkGoogleLogin = (req, res, next) => {
  // Check if the request contains the Google user session cookie or any other indication
  // of being logged in to Google.
  // You might need to check for specific cookies or other indicators depending on your setup.
  const isLoggedIn = req.cookies['GOOGLE_SESSION_COOKIE'] !== undefined; // Example check, replace with your actual check

  if (isLoggedIn) {
    // If the user is logged in to Google, continue to the next middleware/route
    next();
  } else {
    // If not logged in to Google, redirect to Google sign-in page
    res.redirect('https://accounts.google.com/');
  }
};

// Protected route that requires Google login
app.get(checkGoogleLogin);

app.use(cors());
app.use(compression());
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Check the user is logging in or not
const checkLoggedIn = async function (req, res, next) {
  if (new Date(req.session.expires) > new Date()) {
    await req.session.destroy();
  }
  const userId = req.session.userId;
  try {
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        await req.session.destroy();
      } else {
        req.user = user;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

app.use(checkLoggedIn);

// Route for Authentication
app.use(authRoutes);

// Route for user
app.use(userRoutes);

// Route for admin
app.use('/admin', adminRoutes);

// 404 Error Middleware
app.use((req, res, next) => {
  return res.render('error/404', {
    title: '404 not found',
  });
});

// 500 Server Error middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.render('error/500', {
    title: '500 Server Error',
    errorMessage: error.message,
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    let user = await User.findOne();
    if (!user) {
      const hashPassword = await bcrypt.hash(process.env.PASS, 12);
      user = new User({
        email: process.env.USER,
        password: hashPassword,
      });
    }
    await user.save();
    console.log('Database Connect Successfully!');
    app.listen(process.env.PORT || 3000);
  } catch (err) {
    console.log(err);
  }
}

startServer();
