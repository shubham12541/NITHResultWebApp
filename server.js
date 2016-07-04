var express = require('express'),
	bodyParser = require('body-parser'),
	mysql = require('mysql');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/'));


// you can find the database at https://github.com/Nithmr/NithResultAppBackend
var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'hostname',
	user: 'username',
	password: 'password',
	database: 'results',
	debug: false
});



app.post('/ranklist', function(req, res){
	var year = req.body.year;
	var branch = req.body.branch;
	var order = req.body.order;

	if(order==="Roll No"){
		order="roll";
	} else if(order === "Rank"){
		order="rank";
	}

	// if(branch==="CED"){
	// 	branch="1";
	// } else if(branch==="EED"){
	// 	branch="2";
	// } else if(branch==="MED"){
	// 	branch="3";
	// } else if(branch=="ECED"){
	// 	branch="4";
	// } else if(branch=="CSED"){
	// 	branch="5";
	// }


	switch(branch){
		case "Civil": branch="1"; break;
		case "Electrical": branch="2"; break;
		case "Mechanical": branch="3"; break;
		case "Electronics": branch="4"; break;
		case "Computer Science": branch="5"; break;
		case "Architecture": branch="6"; break;
		case "Chemical": branch="7"; break;
	}


	if(year==='First Year'){
			year='5';
		} else if(year==='Second Year'){
			year='4';
		} else if(year==='Third Year'){
			year='3';
		} else if(year==='Final Year'){
			year='2';
		}

		var iiitu='0';
		if(branch=='5'){
			iiitu = '1';
		}
		if(branch=='4'){
			iiitu='2';
		}

	pool.getConnection(function(err, connection){
		if(err){
			errConnecting(err, connection);
			return;
		}
		console.log('connected as id ' + connection.threadId);

		var query=null;

		if(order==="rank"){
			query = "SELECT * FROM students WHERE (roll_no like '__" + branch + "%' or roll_no like '__MI" + branch + "%' or roll_no like 'IIITU__" + iiitu + "%')AND (roll_no LIKE '_" + year + "%' or roll_no like 'IIITU1" + year + "%')ORDER BY cgpi desc";
		} else if(order == "roll"){
			query = "SELECT * FROM students WHERE (roll_no like '__" + branch + "%' or roll_no like '__MI" + branch + "%' or roll_no like 'IIITU__" + iiitu + "%')AND (roll_no LIKE '_" + year + "%' or roll_no like 'IIITU1" + year + "%')ORDER BY roll_no asc";

		}
		executeQuery(query, connection ,res);

		connection.on('error', function(err){
			res.json({"code": 100, "status": "Error connecting with database"});
			return ;
		});
	});
});

app.get('/search/:name', function(req, res){
	var name = req.params.name;

	pool.getConnection(function(err, connection){
		if(err){
			errConnecting(err, connection);
			return;
		}
		console.log('connected as id ' + connection.threadId);

		var query = "select * from students where name like '" + name + "%' or name like '%" + name + "%' or name like '%" + name + "'";
		executeQuery(query, connection ,res);

		connection.on('error', function(err){
			res.json({"code": 100, "status": "Error connecting with database"});
			return ;
		});
	});
});

//result for all semester
app.get('/result/:roll', function(req, res){
	var roll = req.params.roll;

	pool.getConnection(function(err, connection){
		if(err){
			errConnecting(err, connection);
			return;
		}
		console.log('connected as id ' + connection.threadId);

		var query = "select * from students, semesters where students.roll_no='" + roll + "' and semesters.roll_no='"+ roll + "'";
		executeQuery(query, connection ,res);

		connection.on('error', function(err){
			res.json({"code": 100, "status": "Error connecting with database"});
			return ;
		});
	});

});

// 1.php
// result for a semester for roll no.
app.post('/semester', function(req, res){
	var roll = req.body.roll;
	var sem = req.body.semester;
	sem = roll+sem;

	pool.getConnection(function(err, connection){
		if(err){
			errConnecting(err, connection);
			return;
		}
		console.log('connected as id ' + connection.threadId);

		var query = "select * from subjects where roll_no='" + roll + "' and semester_no='"+ sem + "'";
		executeQuery(query, connection, res);

		connection.on('error', function(err){
			res.json({"code": 100, "status": "Error connecting with database"});
			return ;
		});
	});

});

// search by name
// 4.php
app.get('/student/:name', function(req, res){
	var name = req.params.name;

	pool.getConnection(function(err, connection){
		if(err){
			errConnecting(err, connection);
			return;
		}

		console.log('connected as id ' + connection.threadId);

		var query = "select * from students where name like '"+ name +"%' or name like '%" + name + "%' or name like '%" + name +"'";
		executeQuery(query, connection ,res);

		connection.on('error', function(err){
			res.json({"code": 100, "status": "Error connecting with database"});
			return ;
		});
	});
});

// just current cgpi
app.get('/student/:rollno', function(req, res){
	var rollno = req.params.rollno;
	pool.getConnection(function(err, connection){
		if(err){
			errConnecting(err, connection);
			return;
		}

		console.log('connected as id ' + connection.threadId);

		var query = "select * from students where roll_no='" + rollno + "'"; 
		executeQuery(query, connection, res);

		connection.on('error', function(err){
			res.json({"code": 100, "status": "Error disconnected from database"});
			return ;
		});
	});
});

function errConnecting(err, connection){
	connection.release();
	res.json({"code": 100, "status": "Error connecting with database"});
}

function executeQuery(query, connection ,res){
	connection.query(query, function(err, rows){
		connection.release();
		if(err){
			console.log(err);
		} else{
			res.json(rows);
			
		}
	});
}

var port = process.env.PORT || 8080;
app.listen(port);
console.log("server at port " + port);

