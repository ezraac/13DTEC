/*****************************************************/
// fb_io.js
// Written by Mr Bob 2020
// Edited and tailored by Ezra 2022
/*****************************************************/

/*****************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/*****************************************************/
function fb_initialise() {
  console.log('fb_initialise: ');

var firebaseConfig = {
	apiKey: "AIzaSyB_7NlTteTju303ogHgJ7wonvQsAqPHsy0",
	authDomain: "school-game-a9c5d.firebaseapp.com",
	databaseURL: "https://school-game-a9c5d-default-rtdb.firebaseio.com",
	projectId: "school-game-a9c5d",
	storageBucket: "school-game-a9c5d.appspot.com",
	messagingSenderId: "72283854922",
	appId: "1:72283854922:web:e636104a8d951a83522eb3",
	measurementId: "G-BYLNK1X8ZQ"
};
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);	
		
  database = firebase.database();
}

/*****************************************************/
// fb_login(_dataRec, permissions)
// Called by setup
// Login to Firebase
// Input:  where to save the google data
// Return: n/a
/*****************************************************/
function fb_login(_dataRec, permissions) {
  console.log('fb_login: ');
  firebase.auth().onAuthStateChanged(newLogin);

  function newLogin(user) {
    if (user) {
		// user is signed in, so save Google login details
		_dataRec.uid      = user.uid;
		_dataRec.email    = user.email;
		_dataRec.name     = user.displayName;
		_dataRec.photoURL = user.photoURL;

		fb_readRec(DBPATH, _dataRec.uid, userDetails, fb_processUserDetails); //reads user details
		fb_readOn(DBPATH, _dataRec.uid, userDetails, fb_processReadOn)
		fb_readRec(AUTHPATH, _dataRec.uid, permissions, fb_processAuthRole); //reads user auth role
		loginStatus = 'logged in';
		console.log('fb_login: status = ' + loginStatus);
    }
    else {
      // user NOT logged in, so redirect to Google login
      loginStatus = 'logged out';
      console.log('fb_login: status = ' + loginStatus);

      var provider = new firebase.auth.GoogleAuthProvider();
      //firebase.auth().signInWithRedirect(provider); // Another method
      firebase.auth().signInWithPopup(provider).then(function(result) {
        _dataRec.uid      = user.uid;
        _dataRec.email    = user.email;
        _dataRec.name     = user.displayName;
        _dataRec.photoURL = user.photoURL;
        loginStatus = 'logged in via popup';
        console.log('fb_login: status = ' + loginStatus);
        db_readRec();
		fb_writeRec(AUTHPATH, _dataRec.uid, 1);
		reg_popUp(userDetails);
      })
      // Catch errors
      .catch(function(error) {
        if(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          loginStatus = 'error: ' + error.code;
          console.log('fb_login: error code = ' + errorCode + '    ' + errorMessage);

		  document.getElementById("loadingText").innerHTML = error;
        }
      });
    }
  }
}

/*****************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/*****************************************************/
function fb_writeRec(_path, _key, _data) { 
  console.log(`fb_WriteRec: path= ${_path} key= ${_key} data= ${_data.name}`);
	writeStatus = "waiting"
  firebase.database().ref(_path + "/" + _key).set(_data, function(error) {
	if (error) {
		writeStatus = "failure"
		console.log(error)
	}
	else {
		writeStatus = "ok"
	}
  });
	console.log("fb_writerec exit")
}

/*****************************************************/
// fb_readAll(_path, _data)
// Read all DB records for the path
// Input:  path to read from and where to save it
// Return:
/*****************************************************/
function fb_readAll(_path, _data, _processAll) {
  console.log('fb_readAll: path= ' + _path);

	readStatus = "waiting"
	firebase.database().ref(_path).once("value", gotRecord, readErr)

	function gotRecord(snapshot) {
		if (snapshot.val == null) {
			readStatus = "no record"
		}
		else {
			readStatus = "ok"
			var dbData = snapshot.val()
			console.log(dbData)
			var dbKeys = Object.keys(dbData)

			//_processall in parameter
			_processAll(readStatus, snapshot, _data, dbKeys)
		}
	}

	function readErr(error) {
		readData = "fail"
		console.log(error)
		_processAll(readStatus, _data, dbData, dbKeys)
	}
}

/*****************************************************/
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/*****************************************************/
function fb_readRec(_path, _key, _data, _processData) {	
    console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

	readStatus = "waiting"
	firebase.database().ref(`${_path}/${_key}`).once("value", gotRecord, readErr)

	function gotRecord(snapshot) {
		let dbData = snapshot.val()
		//console.log(dbData)
		if (dbData == null) {
			readStatus = "no record"
			_processData(dbData)
		}
		else {
			readStatus = "ok"
			_processData(dbData, _data)
		}
	}

	function readErr(error) {
		readStatus = "fail"
		console.log(error)
	}
}

/*
fb_processUserDetails(_dbData, _data)
called by fb_login and in fb_readRec
checks if there is data in the database
if none shows reg page
if data exists put in variable userDetails
*/
function fb_processUserDetails(_dbData, _data) {
	console.log("processing data")
	console.log(_dbData)
	//if no data in db
	//shows reg page and fills name + email in form
	if (_dbData == null) {
		reg_showPage();
		reg_popUp(userDetails);
		document.getElementById("loadingText").style.display = "none";
	} else {
		userDetails.uid = _dbData.uid
		userDetails.name = _dbData.name
		userDetails.email = _dbData.email
		userDetails.photoURL = _dbData.photoURL
		userDetails.sex = _dbData.sex

		fb_readRec(GAMEPATH, _dbData.uid, userDetails, fb_processGameData); //reads user game data
	}
}

/*
fb_processAuthRole(_dbData, _data)
called in fb_login and fb_readRec
processes user's auth role
if no data exists makes data for user
if data exists update permissions variable (data.js)
calls function to check perms for admin button
*/
function fb_processAuthRole(_dbData, _data) {
	if (_dbData == null) {
		fb_writeRec(AUTHPATH, userDetails.uid, 1);
	} else {
		_data.userAuthRole = _dbData;
		HTML_updateHTMLFromPerms();
	}
}

/*
fb_processGameData(_dbData, _data)
called after processing user details
if userdetails exists then game data has to exist
puts data in userGameData variable (data.js)
calls function to load page
*/
function fb_processGameData(_dbData, _data) {
	userGameData.gameName = _dbData.gameName
	userGameData.PTB_timeRec = _dbData.PTB_timeRec
	userGameData.PTB_avgScore = _dbData.PTB_avgScore
	userGameData.TTT_Wins = _dbData.TTT_Wins
	userGameData.TTT_Losses = _dbData.TTT_Losses
	
	HTML_loadPage();
	console.log("finished processing data")
}

/*
fb_processAll(_result, _dbData, _data, dbKeys)
processes all data
iterates through dbkeys and adds data in _data
data is a whole persons data depending on path read
*/
function fb_processAll(_result, _dbData, _data, dbKeys) {
	console.log(_data)
	for (i=0; i < dbKeys.length; i++) {
		let key = dbKeys[i]
		_data.push({
			name: _dbData[key].name,
			highscore: _dbData[key].highscore
		})
	}
}

function fb_processReadOn(_dbData, _data) {
	//console.log("processing data")
	//console.log(_dbData)
	//if no data in db
	//shows reg page and fills name + email in form
	if (_dbData == null) {
		//reg_showPage();
		//reg_popUp(userDetails);
		//document.getElementById("loadingText").style.display = "none";
	} else {
		userDetails.uid = _dbData.uid
		userDetails.name = _dbData.name
		userDetails.email = _dbData.email
		userDetails.photoURL = _dbData.photoURL
		userDetails.sex = _dbData.sex

		//fb_readRec(GAMEPATH, _dbData.uid, userDetails, fb_processGameData); //reads user game data
	}
}

function fb_readOn(_path, _key, _data, _processData) {
		//console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

	readStatus = "waiting"
	firebase.database().ref(`${_path}/${_key}`).on("value", gotRecord, readErr)

	function gotRecord(snapshot) {
		let dbData = snapshot.val()
		//console.log(dbData)
		if (dbData == null) {
			readStatus = "no record"
			_processData(dbData)
		}
		else {
			readStatus = "ok"
			_processData(dbData, _data)
		}
	}

	function readErr(error) {
		readStatus = "fail"
		//console.log(error)
	}
}
/*****************************************************/
//    END OF MODULE
/*****************************************************/