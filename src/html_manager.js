/*****************************************************/
// html_manager.js
// written by Ezra 2022
/*****************************************************/

/*****************************************************/
// HTML_updateHTMLFromPerms();
// called by firebase.js in fb_processAuthRole();
// shows or destroys the admin button and admin page section according to userAuthRole
// makes ad_admin null -> cannot call ad_admin in console to show admin page
/*****************************************************/
var HTML_isAdmin = false;
function HTML_updateHTMLFromPerms() {
    console.log(permissions.userAuthRole)
    if (permissions.userAuthRole >= 2) {
        document.getElementById("hamburger_admin").style.display = "block";
        document.getElementById("hamburgerMenu").style.height = "23vw";
		HTML_isAdmin = true;
    } else {
    	document.getElementById("hamburger_admin").remove();
      	document.getElementById("s_adminPage").remove();
		window.ad_admin = null; //sets function to null
    }
}

/*****************************************************/
// HTML_updateAdminPage(page);
// called by admin_manager.js in ad_user(), ad_home(), and ad_PTB()
// updates admin page tabs
/*****************************************************/
function HTML_updateAdminPage(page) {
    switch(page) {
        case "ad_user":
            document.getElementById("b_adUser").style.backgroundColor = "cyan";
            document.getElementById("b_adHome").style.backgroundColor = "grey";
            document.getElementById("b_adPTB").style.backgroundColor   = "grey";
            break;
        
        case "ad_home":
            document.getElementById('gamePage').style.display    = "none";
            document.getElementById("landingPage").style.display   = "block";
            document.getElementById('s_adminPage').style.display = "none";
            break;
        case "ad_Game":
            document.getElementById("b_adPTB").style.backgroundColor   = "cyan";
            document.getElementById("b_adUser").style.backgroundColor = "grey";
            document.getElementById("b_adHome").style.backgroundColor = "grey";
            break;
    }
}

/*****************************************************/
// HTML_editGameInfo(game);
// called by game_manager.js in setup()
// updates user info on side of game page
/*****************************************************/
function HTML_editGameInfo(game) {
   // document.getElementById("username").innerHTML = `Username: ${userGameData.gameName}`;
    //document.getElementById("hellouser").innerHTML = `Hello ${userDetails.name}`

	//ptb details
    if (game == "PTB") {
		document.getElementById("highavgscore").style.display = "block"
        document.getElementById("misses").innerHTML = "0";
        document.getElementById("hitscore").innerHTML = "0";
        document.getElementById("highavgscore").innerHTML = `${userGameData.PTB_avgScore}`;
        document.getElementById("highscore").innerHTML = `${userGameData.PTB_timeRec}s`;
        document.getElementById("game_timeDiv").style.display = "block";

	//tic tac toe details	
    } else if (game == "TTT") {
		document.getElementById("highavgscore").style.display = "none"
        document.getElementById("hitscore").innerHTML = `${userGameData.TTT_Wins}`;
        document.getElementById("highscore").innerHTML = `${userGameData.TTT_Losses}`;
        document.getElementById("misses").innerHTML = "0";
        document.getElementById("game_timeDiv").style.display = "none";
    }
}

/*****************************************************/
// HTML_loadPage();
// called in firease.js in fb_processUserDetails
// removes loading text and shows landing page
/*****************************************************/
function HTML_loadPage() {
    document.getElementById("landingPage").style.display = "block";
    document.getElementById("navigation").style.display = "grid";
    document.getElementById("loadingText_BG").style.display = "none";
    document.getElementById("accountIcon").src = userDetails.photoURL;
    document.getElementById("accDet_name").innerHTML = userDetails.name;
    document.getElementById("accDet_user").innerHTML = userGameData.gameName;
}

/*****************************************************/
// HTML_returnPage();
// called when user presses return button (in gamePage)
// shows landing page and hides gamepage
/*****************************************************/
function HTML_returnPage() {
    document.getElementById("landingPage").style.display = "block";
    document.getElementById("gamePage").style.display = "none";
}


function HTML_changeTheme(theme) {
    switch(theme) {
        case "dark":
            $(".container").css("background-color", "#959595");
            $(".button").css("background-color", "#2b2b2b");
            $("p").css("color", "#ffffff")
            break;
    }
}

function HTML_scrollGames()  {
    let cards = document.getElementById("cardsContainer");
    cards.scrollIntoView({behavior: "smooth", block: "center"})
}

function HTML_navScroll() {
    let navbar = document.getElementById("navigation");
    
    if (window.scrollY >= 25) {
        navbar.classList.add("sticky")
      } else {
        navbar.classList.remove("sticky");
      }
}
window.onscroll = function() {HTML_navScroll()};

function HTML_openModal(modal) {
    switch(modal) {
        case "nA":
            $("#nA_modal").toggleClass("nA-open");
            break;
        case "accountDet":
            $("#accountDet_modal").toggleClass("account-open");
            break;
    }
   
    document.getElementById("modal_background").style.top = "0";
}

function HTML_closeModal(modal) {
    switch(modal) {
        case "nA":
            $("#nA_modal").toggleClass("nA-open");
            break;
        
        case "accountDet":
            $("#accountDet_modal").toggleClass("account-open");
            break;
    }
    document.getElementById("modal_background").style.top = "-100%";
}

var whatFunction = "change"
function HTML_changeUsername() {
    if (whatFunction == "change") {
        document.getElementById("accDet_user").removeAttribute("disabled");
        document.getElementById("accDet_user").focus();
        document.getElementById("accDet_editUser").innerHTML = "Confirm Username";
        whatFunction = "confirm"
    } else if (whatFunction == "confirm") {
        document.getElementById("accDet_user").setAttribute("disabled", true);
        document.getElementById("accDet_editUser").innerHTML = "Edit Username";
        whatFunction = "change";
        userGameData.gameName = document.getElementById("accDet_user").value;
        fb_writeRec(GAMEPATH, userDetails.uid, userGameData)
    }
}
