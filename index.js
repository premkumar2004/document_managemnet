// to fetch from database 

const express = require('express');
const mongoose=require("mongoose");
const app = express();

// const Toastify =require('toastify-js')

const PORT = 5001;
const multer = require('multer');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1:27017/myDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const conn = mongoose.connection;
const itemSchema = new mongoose.Schema({
  authorName: { type: String },
  publishedDate: { type: Date},
  patentTitle:{type:String},
  patentStatus:{type:String},
  Department:{type:String},
  iprApplicationNumber:{type:String},
  data: Buffer,
  contentType: String
 
  
 
});

const loginSchema= new mongoose.Schema({
  Username:{type:String},
  Email:{type:String},
  Password:{type:String},
 
  
  
})
app.use(express.static('views'));
const Item = mongoose.model('items', itemSchema,

);
const Login = mongoose.model('login', loginSchema

);
app.set('view engine', 'ejs');


app.get('/admin', async (req, res) => {
  
  try {
    const totalCount = await Item.countDocuments({});
    const items = await Item.find();
    let i=1;
  
   
    await res.render('index', {items,totalCount,i});
   
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
app.get('/cards', async (req, res) => {
  
  try {
    
    items=''
    await res.render('cards', {items});
   
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
app.get('/cardsAdmin', async (req, res) => {
  
  try {
    
    items=''
    await res.render('cardsAdmin', {items});
   
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  
  try {
    const textToDisplay = "";
    await res.render('login' ,{textToDisplay});
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.post('/', async (req, res) => {


  try {
    
    const Email = req.body.Email;
    const Password=req.body.Password;
    const use=req.body.userType;
    const secretkey=req.body.secretKey;
    
    const user = await Login.findOne({Email:Email}) ;
    const user_pass = await Login.findOne({Password:Password}) ;
    console.log(user)
    
   
    if (secretkey==="vitpatents" && user && user_pass) {
      return res.redirect('/cardsAdmin');
      // Redirect to a page for valid email
      
    } 
    if (user && user_pass && secretkey!=="vitpatents" && use==='Admin'){
      const textToDisplay = "SecretKey Entered Wrong";
       await res.render('login', {textToDisplay});
      
      
      
    }
    if(user && user_pass && use==='User'){
      return res.redirect('/cards')
    }
    else{
      const textToDisplay = "You are Not registred";
      await res.render('login', {textToDisplay});

     
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
}
  )


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(bodyParser.urlencoded({ extended: false }));




app.get('/store', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/submit', (req, res) => {
  res.sendFile(__dirname + '/submit.html');
});
app.post('/submit',upload.single('patentFile') ,async (req, res) => {
  if (!req.file) {
                 return res.status(400).send('No file uploaded.');
             }
    const  authorName  = req.body.authorName;
    const  publishedDate  = req.body.publishedDate;
    const  patentTitle  = req.body.patentTitle;
    const  iprApplicationNumber  = req.body.iprApplicationNumber;
   const patentStatus=req.body.patentStatus;
   const Department=req.body.Department;

    try {
       //await Items.insertMany({ authorName,publishedDate ,});

        const newFormData = new Item({
            authorName:authorName,
            publishedDate:publishedDate,
            patentTitle:patentTitle,
            patentStatus:patentStatus,
            iprApplicationNumber:iprApplicationNumber,
            Department:Department,
            data: req.file.buffer,
            contentType: req.file.mimetype
            
        });
        await newFormData.save();
        res.sendFile(__dirname + '/views/submit.html');
        
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/register', async (req, res) => {
  
  try {
    const textToDisplay = "";
   await res.render('reg', {textToDisplay});
    
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/register', async (req, res) => {
  try{
 const username=req.body.Username
 const email=req.body.Email
 const password=req.body.Password

 const newLogin = new Login({
  Username:username,
  Email:email,
  Password:password
  
});
await newLogin.save();


const textToDisplay = "You are registred";
await res.render('reg', {textToDisplay});



  }
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
}
});


app.get('/view/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  
  try {
      const patent = await Item.findById(fileId);
      
      if (!patent) {
          return res.status(404).send('File not found');
      }
      
      const pdfData = patent.data; // Assuming 'patentFile' is the field name where the PDF data is stored
      const pdfBuffer = Buffer.from(pdfData.buffer, 'base64');
      
      res.set('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred.');
  }
});

app.get('/reg', async (req, res) => {
  
  try {
    const textToDisplay = "";
   await res.render('details', {textToDisplay});
    
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



//to have aa table
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/table', async (req, res) => {
  try {
    const totalCount = await Item.countDocuments({});
    let j=1;
    const items = await Item.find();

    await res.render('table', {totalCount,items,j});
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }

  
});

app.post('/table',async (req, res) => {
  try {
    
    const FilterDepartment=req.body.Department
    const totalCount = await Item.countDocuments({Department:req.body.Department});
    console.log(FilterDepartment)
    const items = await Item.find({Department:FilterDepartment});
   let j=1
    await res.render('table', {totalCount,items,j});
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }

  
});


const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { array } = require('mongoose/lib/utils');






const canvasRenderService = new ChartJSNodeCanvas({ width: 800, height: 400});

app.get('/chart', async (req, res) => {
  try {
    // Fetch data from MongoDB using Mongoose
    const data = await Item.find().exec();
   let arr=[]
    // Process the data if necessary
    const labels =['IT','CSE','MECH','MTS','EEE','ECE']
    for (var i=0;i<6;i++){
      const totalCount = await Item.countDocuments({Department:labels[i]});
      arr.push(totalCount)
       

    }
    


    const values =arr
    console.log(values)

    // Create a bar chart using Chart.js Node Canvas
    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data from MongoDB',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',   // Red
            'rgba(54, 162, 235, 0.5)',  // Blue
            'rgba(255, 206, 86, 0.5)',  // Yellow
            'rgba(75, 192, 192, 0.5)',  // Teal
            'rgba(204, 255, 204, 0.7)',  // Pastel Green
            'rgba(255, 204, 255, 0.7)',  // Pastel Purple
            
          ],
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };

    // Render the chart
    const image = await canvasRenderService.renderToBuffer(configuration);
    res.contentType('image/png').send(image);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving data from MongoDB.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://patent.onrender.com`);
});
