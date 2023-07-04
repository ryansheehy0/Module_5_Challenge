var saveMessageTimer
function showThenHideSaveMessage(){
	// show
	$("#saveMessage").css("visibility", "visible")
	// clear previous timer
	clearTimeout( saveMessageTimer )
	// new timer
	saveMessageTimer = setTimeout(function() {
		$("#saveMessage").css("visibility", "hidden")
	}, 1.5 * 1000)
}

function saveButtonClickedEvent(hour){
	let saveButton = $(`#hour-${hour} > button`)
	let textArea = $(`#hour-${hour} > textarea`)
	saveButton.click(function () {
		localStorage.setItem(`${hour}`, textArea.val())
		showThenHideSaveMessage()
	})
}

function loadLocalStorage(hour) {
	let textArea = $(`#hour-${hour} > textarea`)
	let localStorageValue = localStorage.getItem(`${hour}`)
	if(localStorageValue !== null){
		textArea.val(localStorageValue)
	}
}

function forEachTimeSlot(func){ // function takes in the hour
	for(let i = 9; i !== 6; i++){
		if( i % 13 === 0){
			i = 1
		}
		func(i)
	}
}

function appendTimeSlot(hour){
	let slotContainer = $(".container-fluid")
	let militaryHour = hour < 6 ? hour + 12 : hour
	let currentMilitaryHour = parseInt(dayjs().format("HH"))
	let pastPresentFuture
	if(militaryHour < currentMilitaryHour) {
		pastPresentFuture = "past"
	}else if( militaryHour === currentMilitaryHour){
		pastPresentFuture = "present"
	}else{
		pastPresentFuture = "future"
	}
	let newTimeSlot = $(`
		<div id="hour-${hour}" class="row time-block ${pastPresentFuture}">
			<div class="col-2 col-md-1 hour text-center py-3">${(hour > 6 && hour !== 12) ? hour+"AM" : hour+"PM"}</div>
			<textarea class="col-8 col-md-10 description" rows="3"> </textarea>
			<button class="btn saveBtn col-2 col-md-1" aria-label="save">
				<i class="fas fa-save" aria-hidden="true"></i>
			</button>
		</div>
	`)
	slotContainer.append(newTimeSlot)
}

$(function () { // Makes sure html elements are loaded before referencing them
	// Add all the time slots
	forEachTimeSlot( appendTimeSlot )
	// Load the local storage for all time slots
	forEachTimeSlot( loadLocalStorage )
	// Add save button click event listener to all the time slots
	forEachTimeSlot( saveButtonClickedEvent )

	// Add day of the week
	let weekday = dayjs().format('dddd');
	let month = dayjs().format('MMMM');
	let dayOfMonth = dayjs().format('D');
	if(dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31){
		dayOfMonth += "st"
	}else if(dayOfMonth == 2 || dayOfMonth == 22){
		dayOfMonth += "nd"
	}else if(dayOfMonth == 3 || dayOfMonth == 23){
		dayOfMonth += "rd"
	}else{
		dayOfMonth += "th"
	}
	$("#currentDay").text(`${weekday}, ${month} ${dayOfMonth}`)
});
