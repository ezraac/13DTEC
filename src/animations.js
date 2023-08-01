var nav_whatsopen = "none"

$(document).ready(function() {

    $("#searchContainer").hide()



	$("#searchIcon").click(function() {
        if (nav_whatsopen == "none") {
            nav_whatsopen = "search"
            $("#searchContainer").show()
            $("#hamburgerIcon").css("grid-column", "10")
            $("#accountIcon").css("grid-column", "11")
        } else if (nav_whatsopen == "search") {
            nav_whatsopen = "none"
            $("#searchContainer").hide()
            $("#hamburgerIcon").css("grid-column", "14")
            $("#accountIcon").css("grid-column", "15")
        }
		
	});
});