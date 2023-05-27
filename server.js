const express = require('express');
const bodyParser= require('body-parser')
const bcrypt= require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl:{rejectUnauthorized: false},
      host: process.env.DATABASE_HOST,
      port: 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });


  // db.select('*').from('users').then(data=>console.log(data))

const app = express();
app.use(bodyParser.json())
app.use(cors())


app.get('/', (req,res)=>{
 // db.select('*').from('users').then(data=>{
   // res.json(data)
  //})

  res.json('App has been deployed, live')
})


app.post('/signin', (req,res)=>{signin.handleSignIn(req,res,db,bcrypt)})

app.post('/register', register.handleRegister(db,bcrypt)) //dependency ejection

app.get('/profile/:id', (req,res)=>{profile.handleProfileGet(req,res,db)})

app.put('/image', image.handleImage(db))

app.post('/imageurl', (req,res)=>{image.handleApiCall(req,res)})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("App is running smoothly on ${process.env.PORT}")
})

