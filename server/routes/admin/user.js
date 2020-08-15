const router = require('express').Router();
const {getAllUsers, addUser, deleteUser}  = require('../../database/userInterface')
const bcrypt = require('bcryptjs');


router.get('/list', (req, res) =>{
  getAllUsers()
  .then( (data) => {
    res.send(data)
  })
  .catch((err) =>{
    res.sendStatus(500)
    console.log(err);
  })
})

router.post('/add', async (req, res) =>{

  let username = req.body.username
  let email =req.body.email

  // THIS IS UNHANDLED. GO READ ABOUT ERROR HANDLEING
  let pw_hash = await generateHash(req.body.password)

  addUser({username, email, pw_hash})
  .then((result) => {
    res.sendStatus(200)
  })
  .catch((err) =>{
    res.sendStatus(500)
    console.log(err);
  })
})

router.post('/delete', async (req, res) =>{
  let user_id = req.body.user_id;

  deleteUser(user_id).then((result) =>{
    res.sendStatus(200)
  })
  .catch((err) =>{
    res.sendStatus(500)
    console.log(err);
  })
})

router.post('/edit', (res, req) =>{
  res.setEncoding("edit")
})


function generateHash(password){
  return new Promise((resolve, reject) =>{
    bcrypt.hash(password, 10, (err, hash) =>{
      if(err){reject(err)}
      resolve(hash)
    })
  })
}

module.exports = router;