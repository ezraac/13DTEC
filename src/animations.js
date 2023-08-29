var nav_whatsopen = "none"
var accountOpen = false
var hamburgerOpen = false

$(document).ready(function () {

    $("#searchContainer").hide()
    $("#accountDetails").hide()
    $("#hamburgerMenu").hide()


    $("#searchIcon").click(function () {
        if (nav_whatsopen == "none") {
            nav_whatsopen = "search"
            $("#searchContainer").show()
            $("#hamburgerContainer").toggleClass("search-open")
            $("#accountContainer").toggleClass("search-open")
        } else if (nav_whatsopen == "search") {
            nav_whatsopen = "none"
            $("#searchContainer").hide()
            $("#hamburgerContainer").toggleClass("search-open")
            $("#accountContainer").toggleClass("search-open")
        }
    });


    $("#accountIcon").click(function () {
        if (accountOpen == false) {
            $("#accountDetails").show()
            accountOpen = true
            if (hamburgerOpen == true) {
                $("#hamburgerMenu").hide()
                hamburgerOpen = false
            }
        } else {
            $("#accountDetails").hide()
            accountOpen = false
        }
    })

    $("#hamburgerIcon").click(function () {
        if (hamburgerOpen == false) {
            $("#hamburgerMenu").show()
            hamburgerOpen = true
            if (accountOpen == true) {
                $("#accountDetails").hide()
                accountOpen = false
            }
        } else {
            $("#hamburgerMenu").hide()
            hamburgerOpen = false
        }
    })
});

window.onscroll = function() {stickToTop()};

var navbar = document.getElementById("navigation")

var sticky = navbar.offsetTop + 25;

function stickToTop() {
    if (window.scrollY >= sticky) {
        navbar.classList.add("sticky")
      } else {
        navbar.classList.remove("sticky");
      }
}