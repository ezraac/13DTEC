var nav_whatsopen = "none"
var accountOpen = false

$(document).ready(function() {

    $("#searchContainer").hide()
    $("#accountDetails").hide()


	$("#searchIcon").click(function() {
        if (nav_whatsopen == "none") {
            nav_whatsopen = "search"
            $("#searchContainer").show()
            $("#hamburgerIcon").toggleClass("search-open")
            $("#accountContainer").toggleClass("search-open")
        } else if (nav_whatsopen == "search") {
            nav_whatsopen = "none"
            $("#searchContainer").hide()
            $("#hamburgerIcon").toggleClass("search-open")
            $("#accountContainer").toggleClass("search-open")
        }
	});


    $("#accountIcon").click(function() {
        if (accountOpen == false) {
            $("#accountDetails").show()
            accountOpen = true
        } else {
            $("#accountDetails").hide()
            accountOpen = false
        }
    })
});