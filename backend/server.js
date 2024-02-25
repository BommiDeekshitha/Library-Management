const path = require("path");
const mysql = require("mysql");
const bodyparser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = require("fastify")({
  logger: false,
});


app.register(require('fastify-cors'), { 
  origin: ["https://glitch.com", "http://localhost:3000", "https://example.com","https://library-master.vercel.app","https://api.resend.com/emails"]
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log("Connection Failed!");
  } else {
  }
});

function createTables() {
  const query1 = `CREATE TABLE IF NOT EXISTS USERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    borrowed_book VARCHAR(255),
    return_date varchar(100)
  )`;
  db.query(query1, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const query2 = `CREATE TABLE IF NOT EXISTS BOOKS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    published_year INT NOT NULL,
    available_copies VARCHAR(100) NOT NULL 
    )`;
      db.query(query2, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("All Tables Created Successfully!");
        }
      });
    }
  });
}

createTables();

const transporter = nodemailer.createTransport({
  service: 'gmail',
     
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

//ADMIN ROUTES
let is_admin = true;
app.post("/admin_login", (req, res) => {
  const username = req.body.user_name;
  const pass = req.body.pass;
  if (username == "Admin" && pass == "admin123") {
    is_admin = true;
    res.status(200).send("WELCOME ADMIN");
  } else {
    res.status(400).send("Wrong Credentials");
  }
});



app.get('/admin',(req,res)=>{
  if(is_admin == false){
    res.status(500).send("Not Admin");
  }else{
    const query = "select * from BOOKS";
    db.query(query,(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error: ${err}`);
      }else{
        res.status(200).send(results);
      }
    })
  }
})

// Admin Add Books
app.post("/add_book", (req, res) => {
  if (is_admin == false) {
    res.status(500).send("Not an Admin!");
  } else {
    const query = "insert into BOOKS(title,author,genre,published_year,available_copies) values(?,?,?,?,?)";
    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    const published_year = req.body.published_year;
    const available_copies = req.body.available_copies;
    db.query(query,[title,author,genre,published_year,available_copies],(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error:${err}`)
      }else{
        res.status(200).send('Added Successfully!');
      }
    })
  }
});


app.get('/book/:id',(req,res)=>{
  if(is_admin == false){
    res.status(500).send("Not Admin")
  }else{
    const id = req.params.id;
    const query = "select title,author,genre,published_year,available_copies from BOOKS where id = ?";
    db.query(query,[id],(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error:${err}`);
      }else{
        res.status(200).send(results)
      }
    })
  }
})

app.put('/update_book/:id',(req,res)=>{
  if(is_admin == false){
    res.status(500).send("Not Admin");
  }else{
    const query = "update BOOKS set title= ? , author = ? , genre = ? , published_year = ? , available_copies = ? where id = ?";
    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    const published_year = req.body.published_year;
    const available_copies = req.body.available_copies;
    const id = req.params.id;
    db.query(query,[title,author,genre,published_year,available_copies,id],(err,results)=>{
      if(err){
        res.status(500).send("Not Admin");
      }else{
        res.status(200).send("Updated Successfully!");
      }
    })
  }
})


app.delete('/delete_book/:id',(req,res)=>{
  if(is_admin == false){
    res.status(500).send("Not Admin");
  }else{
    const query = "delete from BOOKS where id = ?";
    const id = req.params.id;
    db.query(query,[id],(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error: ${err}`);
      }else{
        res.status(200).send("Deleted Successfully!");
      }
    })
  }
})


//USER ROUTES
let is_user = false; 
app.post('/signup', (req, res) => {
    const details = req.body;
    const name = details.name;
    const email = details.email;
    const pass = details.password;
    bcrypt.hash(pass, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send(`Internal Server Error : ${err}`);
        } else {
            const q = "select name from USERS where email = ?";
            db.query(q,[email],(e,r)=>{
                if(e){
                    res.status(500).send(`Internal Server Error :${err}`);
                }else{
                    if(r.length > 0){
                        res.status(401).send("Email is already in use!");
                    }else{

                        const query = "INSERT INTO USERS(name, email, password) VALUES (?, ?, ?)";
                        db.query(query, [name, email, hashedPassword], (err, results) => {
                            if (err) {
                                res.status(500).send(`Internal Server Error : ${err}`);
                            } else {
                                res.status(200).send('Registered Successfully!');
                            }
                        });
                    }
                }
            })
        }
    });
});


app.post('/login', (req, res) => {
    const creds = req.body;
    const email = creds.email;
    const password = creds.password;

    const query = "SELECT * FROM USERS WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            res.status(500).send(`Internal Server Error: ${err}`);
        } else {
            if (results.length > 0) {
                const hashedPassword = results[0].password;
                bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    if (err) {
                        res.status(500).send(`Internal Server Error: ${err}`);
                    } else if (isMatch) {
                        is_user = true;
                        res.status(200).send({"userId":results[0].id});
                    } else {
                        res.status(401).send('Invalid email or password');
                    }
                });
            } else {
                res.status(401).send('Invalid email or password');
            }
        }
    });
});


app.get('/' , (req,res) => {
    if(is_user == true){
        const query = "select * from BOOKS";
        db.query(query,(err,results) => {
            if(err){
                res.status(500).send(`Internal Server Error: ${err}`);
            }else{
                res.status(200).send(results);
            }
        })
    }else{
        res.status(500).send("LOGIN FIRST!");
    }
})


app.post('/book/:id/:book_id/:book_name/:date',(req,res)=>{
  if(is_user == true){
    const main_query = "select borrowed_book from USERS where id = ?";
    const query1 = "update BOOKS set available_copies = available_copies - 1 where id = ?";
    const query2 = "update USERS set borrowed_book = ? , return_date = ? where id = ?";
    const query3 = "select email from USERS where id = ?";
    const id = req.params.id;
    const book_id = req.params.book_id;
    const date = req.params.date;
    const book_name = req.params.book_name;
    db.query(main_query,[id],(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error : ${err}`);
      }else{
        if(results[0].borrowed_book != null){
          res.status(200).send("Already Borrowed a Book!");
        }else{
          db.query(query1,[book_id],(err,results)=>{
            if(err){
              res.status(500).send(`Internal Server Error : ${err}`);
            }else{
              db.query(query2,[book_name,date,id],(err,results)=>{
                if(err){
                  res.status(500).send(`Internal Server Error : ${err}`);
                }else{
                  db.query(query3,[id],(err,results)=>{
                    if(err){
                      res.status(500).send(`Internal Server Error :${err}`);
                    }else{
                      if(results[0].email != null){
                        const email = results[0].email;
                        var mail = {
                          from : `${process.env.EMAIL}`,
                          to : `${email}`,
                          subject: `You have successfully borrowed a book!`,
                          text: `Congratulations! You have successfully borrowed the Book ${book_name}! \n The Return Date is ${date} \n Make sure to return the book on or before the return date!`
                            
                        };
                        transporter.sendMail(mail, function(error, info) {
                          if (error) {
                            res.status(200).send("Invalid Email!");
                          } else {
                            console.log('Email sent: ' + info.response);
                            res.status(200).send("Booked Successfully!");
                          }
                        });
                        
                      }else{
                        res.status(500).send("Email Not Found!");
                      }
                    }
                  })
                }
              })
            }
          })
        }
        
      }
    })
    
  }
})


app.get("/profile/:id",(req,res)=>{
  if(is_user == false){
    res.status(500).send("LOGIN FIRST");
  }else{
    const id = req.params.id;
    const query = "select name,email,borrowed_book,return_date from USERS where id = ?";
    db.query(query,[id],(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error : ${err}`);
      }else{
        res.status(200).send(results);
      }
    })
  }
})

app.get("/search/:name",(req,res)=>{
  if(is_user == false){
    res.status(500).send("Login!");
  }else{
    const name = req.params.name;
    const query = "select * from BOOKS where title like ?";
    db.query(query,[`%${name}%`],(err,result)=>{
      if(err){
        res.status(500).send(`Internal Server Error : ${err}`);
      }else{
        res.status(200).send(result);
      }
    })
  }
})

app.get("/available_copies/:id",(req,res)=>{
  if(is_user == false){
    res.status(500).send('Login First!');
  }else{
    const query = "select available_copies from BOOKS where id = ?";
    const id = req.params.id;
    db.query(query,[id],(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error :${err}`);
      }else{
        res.status(200).send(results);
      }
    })
  }
})

app.get("/email/:id",(req,res)=>{
  if(is_user == false){
    res.status(500).send("Login First!");
  }else{
    const query = "select email from USERS where id = ?";
    const id = req.params.id;
    db.query(query,[id],(err,results)=>{
      if(err){
        res.status(500).send(`Internal Server Error :${err}`);
      }else{
        res.status(200).send({"email":results[0].email});
      }
    })
  }
})

app.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);


// resend.emails.send({
//                     from:"onboarding@resend.dev",
//                     to: email,
//                     subject:"Return Date Notification!",
//                     html: `<h1>You have successfully borrowed the Book: ${bookName}</h1> <hr/> <h2>Return Date : ${final_date}</h2> <hr/> <h2>Make sure to return the book on or before return date!</h2>`

//                 });
