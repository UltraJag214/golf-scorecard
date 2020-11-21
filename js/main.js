var courses;
var courseData = {};
var players = [];
var selectedPlayerCount;
var parTotal;

const endGame = {
    YouSuck: 'Better luck next time',
    YouRock: 'On to the PGA',
    YouAverage: 'Right On Par'
}

$(document).ready(function () {
    onLoad();
});

function onLoad() {
    var jqxhr = $.ajax("https://golf-courses-api.herokuapp.com/courses")
        .done(function (data) {
            courses = data;
            console.log(courses)
            populateSelectDropdown()
            selectedPlayerCount = 1;
        })
        .fail(function () {
            alert("error");
        })
}

function populateSelectDropdown() {
    courses.courses.forEach(course => {
        $('#chooseCourse').append(`<option value="${course.id}">${course.name}</option>`);
    });
    // Load First Element
    getCourseData(courses.courses[0].id);
}

function getCourseData(id) {
    $.ajax(`https://golf-courses-api.herokuapp.com/courses/${id}`)
        .done(function (returnData) {
            courseData[id] = returnData
            console.log(courseData[id])
            populateDifficulty(returnData.data)
        })
        .fail(function () {
            alert("error");
        })
}

function populateDifficulty(data) {
    $('#difficulty').empty();
    data.holes[0].teeBoxes.forEach(box => {
        var name = box.teeType.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        $('#difficulty').append(`<option value="${box.teeTypeId}">${name}</option>`);
    })
    // populate first element
    populateCourseData(data.holes[0].teeBoxes[0].teeTypeId)
    sumParValues()
    console.log(parTotal)
}

function sumParValues() {
    var sum = 0;
    $(".parItems").each(function () {
        if ($(this).text() != null && $(this).text() != undefined && $(this).text() != '') {
            sum += parseInt($(this).text());
        }
    });
    parTotal = sum;
}

function populateCourseData(difficultyId) {
    var courseId = $('#chooseCourse').val();
    var courseHoles = courseData[courseId].data.holes
    var i = 0;
    courseHoles.forEach(hole => {
        var selectedDifficultyData;
        hole.teeBoxes.forEach(teeBox => {
            if (teeBox.teeTypeId == difficultyId) {
                selectedDifficultyData = teeBox;
            }
        })
        $(`#yards${i}`).text(selectedDifficultyData.yards)
        $(`#hcp${i}`).text(selectedDifficultyData.hcp)
        $(`#par${i}`).text(selectedDifficultyData.par)
        i++;
    })
}

function addPlayerIfPossible(name) {
    if(name == ""){
        $("#banner").text("You Must Enter A Valid Name")
        $("#banner").removeClass("hide")
        return;
    }
    else{
        $("#banner").addClass("hide")
    }
    var index = players.length;
    players[index] = name;
    $(`#playerName${index}-0`).text(name);
    $(`#playerName${index}-1`).text(name);
    $(`#playerName${index}-2`).text(name);
    $(`#player${index}-0`).removeClass("hide");
    $(`#player${index}-1`).removeClass("hide");
    $(`#player${index}-2`).removeClass("hide");
    $('#newUser').val('');
    if (index == (selectedPlayerCount - 1)) {
        $('#newUserBtn').prop('disabled', true);
        $('#newUser').prop('disabled', true);
    }
}

function sumValue(elementClass, elementTotal) {
    var sum = 0;
    $(elementClass).each(function () {
        if ($(this).val() != null && $(this).val() != undefined && $(this).val() != '') {
            console.log(parseInt($(this).val()))
            sum += parseInt($(this).val());
        }
    });
    $(elementTotal).text(sum);
}

function updateTotal(inScore, outScore, destination) {
    var inScoreValue = parseInt($(inScore).text()) || 0;
    var outScoreValue = parseInt($(outScore).text()) || 0;

    $(destination).text(inScoreValue + outScoreValue)
}

function calculateResults(playerNumber) {
    if(playerNumber != null && playerNumber != undefined && playerNumber !== ""){
        writeResults(playerNumber);
        return
    }
    for (let index = 0; index < selectedPlayerCount; index++) {
        writeResults(index);
    }
}

function writeResults(playderId){
    if ($(`#player${playderId}Score`).text() > parTotal) {
        $(`#player${playderId}Outcome`).text(endGame.YouSuck)
    }
    else if ($(`#player${playderId}Score`).text() == parTotal) {
        $(`#player${playderId}Outcome`).text(endGame.YouAverage)
    }
    else {
        $(`#player${playderId}Outcome`).text(endGame.YouRock)
    }
}

$("#chooseCourse").change(function () {
    var selectId = $(this).val()
    getCourseData(selectId);
});

$("#difficulty").change(function () {
    var difficultyId = $(this).val()
    console.log(difficultyId)
    populateCourseData(difficultyId);
});

$("#playerCount").change(function () {
    var count = $(this).val()
    var oldValue = selectedPlayerCount;
    selectedPlayerCount = count;
    if (oldValue != selectedPlayerCount) {
        $('#newUserBtn').prop('disabled', false);
        $('#newUser').prop('disabled', false);
    }
});

$("#newUserBtn").click(function () {
    addPlayerIfPossible($('#newUser').val())
});

$(".player0-0").change(function () {
    sumValue('.player0-0', "#player0Total0")
    updateTotal("#player0Total0", "#player0Total1", "#player0Score")
})

$(".player1-0").change(function () {
    sumValue('.player1-0', "#player1Total0")
    updateTotal("#player1Total0", "#player1Total1", "#player1Score")
})

$(".player2-0").change(function () {
    sumValue('.player2-0', "#player2Total0")
    updateTotal("#player2Total0", "#player2Total1", "#player2Score")
})

$(".player3-0").change(function () {
    sumValue('.player3-0', "#player3Total0")
    updateTotal("#player3Total0", "#player3Total1", "#player3Score")
})

$(".player0-1").change(function () {
    sumValue('.player0-1', "#player0Total1")
    updateTotal("#player0Total0", "#player0Total1", "#player0Score")
})

$(".player1-1").change(function () {
    sumValue('.player1-1', "#player1Total1")
    updateTotal("#player1Total0", "#player1Total1", "#player1Score")
})

$(".player2-1").change(function () {
    sumValue('.player2-1', "#player2Total1")
    updateTotal("#player2Total0", "#player2Total1", "#player2Score")
})

$(".player3-1").change(function () {
    sumValue('.player3-1', "#player3Total1")
    updateTotal("#player3Total0", "#player3Total1", "#player3Score")
})

$('#newUser').keydown(function (event) {
    var keyCode = (event.keyCode ? event.keyCode : event.which);
    if (keyCode == 13) {
        $('#newUserBtn').trigger('click');
    }
});

$("#startGame").click(function () {
    if ($("#startGame").text() == "New Game") {
        location.reload();
    }
    if ($("#startGame").text() == "End Game") {
        $("#startGame").text("New Game")
        calculateResults()
        return;
    }
    $(".thingsToLock").prop("disabled", true)
    $("#startGame").text("End Game")
});

$("#player0Score17").change(function(){
    calculateResults(0)
});

$("#player1Score17").change(function(){
    calculateResults(1)
});

$("#player2Score17").change(function(){
    calculateResults(2)
});

$("#player3Score17").change(function(){
    calculateResults(3)
});