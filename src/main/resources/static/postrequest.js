const toMilliseconds = (hrs, min) => (hrs * 60 * 60 + min * 60) * 1000;
//Brasilia Standard Time in millisecods
const GMT = 10800000;
const serviceId = "service_0gesks7";
const templateIdFive = "template_4irgs44";
const templateIdEnd = "template_kktuucm";
var timeNow = new Date();
var count = 0;
let yyyy = timeNow.getFullYear();
let mm = timeNow.getMonth() + 1; // Months start at 0!
let dd = timeNow.getDate();
let hh = timeNow.getHours();
let min = timeNow.getMinutes();

//triggers on clicking the start countdown button
$(".start").on('click', function(event) {
	// Prevent the form from submitting via the browser.
	event.preventDefault();
	//getting the current time for validations so the time wont be in the past
	timeNow = new Date();
	yyyy = timeNow.getFullYear();
	mm = timeNow.getMonth() + 1; // Months start at 0!
	dd = timeNow.getDate();
	hh = timeNow.getHours();
	min = timeNow.getMinutes();

	let timeChosen = $("#time").val();
	timeChosen = timeChosen.split(":");

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;
	//format dat to compare
	const formattedToday = yyyy + '-' + mm + '-' + dd;
	
	//if fields empty show error messages
	if ($("#name").val() === "" || $("#date").val() === "") {

		mandatoryFields();
	//if time in the past show error message
	} else if ($("#date").val() == formattedToday && hh >= timeChosen[0] && min >= timeChosen[1]) {
		$("#errorTime").show();
	//if everything is alright call the methods for countdown and painting api
	} else {
		$("#errorTime").hide();
		$("#EventCreation").hide();
		if (count == 0) {
			getAPIresult();
		}
		startCountdown(new Date($("#date").val()).getTime(), count, $("#name").val(), $("#time").val());
	}
});
//if checkbox is checked show email input box, else hide it
$(".checkbox").on("change", function(event) {
	if ($("#checkbox").is(":checked")) {
		$("#email").show();
	} else {
		$("#email").hide();
	}

});

//Ends all events and goes back to the main page by refreshing the page
$(".EndButton").on('click', function(event) {
	event.preventDefault();
	location.reload(true);
});

//adds counter to add another countdown
$(".AddButton").on('click', function(event) {
	event.preventDefault();
	$("#EventCreation").show();
	count = count + 1;
});

//validation for mandatory fields
function mandatoryFields() {
	if ($("#name").val() === "" && $("#date").val() === "") {
		$("#errorName").show();
		$("#errorDate").show();
	} else if ($("#date").val() === "") {
		$("#errorDate").show();
		$("#errorName").hide();
	} else {
		$("#errorName").show();
		$("#errorDate").hide();
	}
}

//main fucntion functionality, responsible for countdown between dates
function startCountdown(endValue, count, name, time) {
	timeNow = new Date().getTime();
	var Endtime = endValue;
	var plusTime = time;
	var addHours;
	//if time is filled it will add to the current time diff else it will go into midnight
	if (time === "") {
		addHours = 86341000;
	} else {
		plusTime = plusTime.split(":");
		addHours = toMilliseconds(plusTime[0], plusTime[1]);
	}
	//time calcualtions taking into account date time and GMT timezone
	var countdown = Endtime - timeNow + addHours + GMT;
	var months = Math.floor(countdown / 2592000000);
	var days = Math.floor((countdown % 2592000000) / (1000 * 60 * 60 * 24));
	var hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((countdown % (1000 * 60)) / 1000);
	
	//if email as chosen send a five minute warning
	if (days === 0 && hours === 0 && minutes === 5 && seconds === 0 && $("#checkbox").is(":checked")) {
		var params = {
			name: name,
			email: $("#email").val(),
			timeExpire: 5,
		}
		emailjs.send(serviceId, templateIdFive, params)
			.then(
				res => {
					console.log(res);
				}
			).catch(err => console.log(err));
	}
	
	//responsible for the separate countdown timers
	if (count == 1) {
		$('#countTime2').text(name + " : " + months + "m " + days + "d " + hours + "h " + minutes + "m " + seconds + "s");
		$('#countTime2').show();
	} else if (count == 2) {
		$('#countTime3').text(name + " : " + months + "m " + days + "d " + hours + "h " + minutes + "m " + seconds + "s");
		$('#countTime3').show();
		$("#add").hide();
	} else {
		$('#countTime').text(name + " : " + months + "m " + days + "d " + hours + "h " + minutes + "m " + seconds + "s");
		$('#countTime').show();
	}

	var end;
	
	//if time is reached alert will show and cancel the timer 
	if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
		clearTimeout(end);
		alert("Your event has been completed!");
		//if email was chosen it will send a  warning
		if ($("#checkbox").is(":checked")) {
			var params = {
				name: name,
				email: $("#email").val()
			}
			emailjs.send(serviceId, templateIdEnd, params)
				.then(
					res => {
						console.log(res);
					}
				).catch(err => console.log(err));
		}
	//if time hasnt reached 0 it will be recalling the function until it does
	} else {
		end = setTimeout(function() { startCountdown(endValue, count, name, time) }, 1000);
	}

}

//function to get random painting from the API archive 
function getAPIresult() {
	//hide the fields and buttons of creation
	$("#EventCreation").hide();
	$("#Logo").hide();
	$("#finished").show();
	$("#add").show();
	//random number from the options on the archive
	var id = Math.round(Math.random() * (119050 - 1) + 1);

	$.ajax({
		type: "GET",
		url: "https://api.artic.edu/api/v1/artworks?limit=1&page=" + id /*+ "&fields=api_link"*/,
		success: function(result) {
			//add info to info box in html
			$("#title").text("Title:  " + result.data[0].title);
			$("#artist").text("Artist: " + result.data[0].artist_title);
			//send api link to get the image
			getArt(result.data[0].api_link);
			//show the previously hidden img tag and info div
			$("#painting").show();
			$("#info").show();

		},
		error: function(result) {
			console.log("Failed to get Image from API Message: " + result);
		}

	})
};

//Function that calls ajax to send a get request to the API to get the image link that will be displayed, it receives as attributes the api link from the main call to the painting method = getAPIresult()
function getArt(artUrl) {
	$.ajax({
		type: "GET",
		url: artUrl,
		success: function(result) {
			//success then build the path to the image and add it as a src to an img in html
			var url = result.config.iiif_url + "/" + result.data.image_id + "/full/200,/0/default.jpg";
			$("#painting").attr('src', url);
		},
		error: function(result) {
			console.log("Failed to get Image from API Message: " + result);
		}

	})
}



