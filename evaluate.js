MAIN='/home/deptraisatthu/lamviec/adcoffee/01-wordcloudProject'
DATAFOLDER='/data'
var express = require('express');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var router = express.Router();
var multer = require('multer');
// var upload = multer({dest: MAIN + DATAFOLDER})

var bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.post('/CAForm', function(req, res) {
  res.send(req.body.optradio);
});



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, MAIN + DATAFOLDER)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

// var express = require('express');
// var app = express();
var path = require('path');
var formidable = require('formidable');
// var fs = require('fs');


// const csv=require('csvtojson')
// csv().on('data',(data)=>{
//     //data is a buffer object 
//     const jsonStr= data.toString('utf8')
// })

// mongoose.connect('mongodb://localhost/rest_test');

app.set('view engine', 'ejs');
app.use('/data', express.static('data'));



app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


app.get('/evaluateInput', function(req, res){
	res.render('form', {qs: req.query});
});

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res){
//   res.sendFile(path.join(__dirname, 'views/index.html'));
// });

app.get('/', function(req, res, next){
	res.render('upload', {title: 'Express'});
});

app.post('/', upload.any(), function(req, res, next){
	res.send(req.files);
});

app.post('/evaluateInput', urlencodedParser, function(req, res){
	// req.params.name = '|age min:18 max:65 |pos feed instant_article |platform facebook audience_network |message mưa gió khỏi lo vì đã có ô gấp ngược thông number với thiết kế đóng dù sáng tạo đồng thời chất liệu dù không thấm nước chia làm number lớp thông minh bạn sẽ không còn phải lo lắng bị ướt mỗi khi trời mưa nữa click xem number |description  |call_to_action WATCH_MORE';
	// var string1 = '|age min:18 max:65 |pos feed instant_article |platform facebook audience_network |message mưa gió khỏi lo vì đã có ô gấp ngược thông number với thiết kế đóng dù sáng tạo đồng thời chất liệu dù không thấm nước chia làm number lớp thông minh bạn sẽ không còn phải lo lắng bị ướt mỗi khi trời mưa nữa click xem number |description  |call_to_action WATCH_MORE';
	var value_sot 		= 2;
	var value_metmoi 	= 3;
	var value_buonnon 	= 4;
	var value_nonmua 	= 5;
	var value_miengdau	= 4;
	var value_tieuchay	= 3;
	var value_taobon	= 2;
	var value_anmatngon	= 3;
	var medcalc = req.body.sot * value_sot 
				+ req.body.metmoi * value_metmoi
				+ req.body.buonnon * value_buonnon
				+ req.body.nonmua * value_nonmua
				+ req.body.miengdau * value_miengdau
				+ req.body.tieuchay * value_tieuchay
				+ req.body.taobon * value_taobon
				+ req.body.anmatngon * value_anmatngon;


	var result;
	if (medcalc > 20){
		result = "Alert!";
	} else {
		result = "Normal";
	}

	// res.send(req.body.sot);
	// res.send(req.body.metmoi);
	// res.send(req.body.buonnon);
	res.send(result + " medcalc = " + medcalc);

	var sum1 = req.body.sot;
	var sum2 = req.body.metmoi;


	var string1 = "|age min:" + req.body.agemin;
	string1 = string1 + " max:" + req.body.agemax;
	string1 = string1 + " |pos " + req.body.position;
	string1 = string1 + " |platform " + req.body.platform;
	string1 = string1 + " |message " + req.body.message;
	string1 = string1 + " |description " + req.body.description;
	string1 = string1 + " |call_to_action " + req.body.call_to_action;
	

	// var string2 = "test7-2.vw";
	// var string3 = "vw -t " + string2 + " -i train7.model -p test7-2.predict"
	// var string4 = "echo \"" + string1 + "\" | netcat localhost 26543"
	// var string4 = "echo \"" + string1 + "\" | netcat 45.252.248.169 8069"
	
	// var string5 = "vw -t /dev/stdin -i train7.model -p /dev/stdout --quiet"
	// var string4 =  "echo \"" + string1 + "\" | vw -d /dev/stdin -i train7.model -p /dev/stdout --quiet"
	function puts(error, stdout, stderr) {}

	//create daemon of vw in port 26542
	
	var out;
	var out1 = parseInt(sum1) + parseInt(sum2);

	// var child2;
	// child2 = exec(string4, function (error, stdout, stderr) {
	//   sys.print('stdout: ' + stdout);
	//   sys.print('stderr: ' + stderr);
	//   if (error !== null) {
	//     console.log('exec error: ' + error);
	//   }
	//   out = parseFloat(stdout);
	  
	//   // sys.print('out: ' + out);
	//   sys.print('out: ' + out1);

	//   // res.render('request-success', {data: req.body, result: out});
	//   var result = []
	//   // result.push({'evaluation': out});
	//   result.push({'evaluation': out1});
	//   res.send(result);
	  
	//   console.log(req.body);

	// });
	
	
});



app.listen(3000);
console.log('API isrunning on prt 3000');