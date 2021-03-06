require('dotenv').config()
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const serviceAccount = {
  private_key: process.env.private_key.replace(/\\n/g, '\n'),
  client_email: `${process.env.client_email}`
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://envoy-carwash.firebaseio.com'
})

app = express()
app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 4000

app.post('/setCustomClaims', (req, res) => {
  const data = req.body

  admin
    .auth()
    .setCustomUserClaims(data.uid, { admin: true })
    .then(() => {
      // The new custom claims will propagate to the user's ID token the
      // next time a new one is issued.
      res.json({
        success: true
      })
    })
    .catch(error => {
      console.error(error)
      res.json({
        success: false
      })
    })
})

app.listen(port, function(err) {
  if (err) {
    console.log(err)
  }

  console.log('listening in on port: ' + port)
})
