var express = require('express');
var cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const bodyParser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(process.cwd() + '/public'));

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.originalname;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Set file size limit to 5MB
  }
});


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.array("upfile"), (req, res) => {
  const data = {
    name: req.files[0].filename,
    type: req.files[0].mimetype,
    size: req.files[0].size
  };
  console.log(data);
  fs.unlink(`public/${req.files[0].originalname}`, err => {
    if (err) res.json(err);
    else res.json(data);
  });
  
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
