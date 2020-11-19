var courses;
var courseData = {} ;
$(document).ready(function () {
    onLoad();
});
function onLoad() {
    var jqxhr = $.ajax("https://golf-courses-api.herokuapp.com/courses")
        .done(function (data) {
            courses = data;
            console.log(courses)
            populateSelectDropdown()
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
function getCourseData(id){
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
function populateDifficulty(data){
    $('#difficulty').empty();
    data.holes[0].teeBoxes.forEach(box => {
        var name = box.teeType.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        $('#difficulty').append(`<option value="${box.teeTypeId}">${name}</option>`);
    })
    // populate first element
    populateCourseData(data.holes[0].teeBoxes[0].teeTypeId)
}
function populateCourseData(difficultyId){
    var courseId = $('#chooseCourse').val();
    var courseHoles = courseData[courseId].data.holes
    var i = 0;
    courseHoles.forEach(hole => {
        var selectedDifficultyData;
        hole.teeBoxes.forEach(teeBox => {
            if(teeBox.teeTypeId == difficultyId){
                selectedDifficultyData = teeBox;
            }
        })
        $(`#yards${i}`).text(selectedDifficultyData.yards)
        $(`#hdcp${i}`).text(selectedDifficultyData.hcp)
        $(`#par${i}`).text(selectedDifficultyData.par)
        i++;
        console.log(i)
        console.log(selectedDifficultyData)
    })
}
$("#chooseCourse").change(function () {
    var selectId = $( this ).val()
    getCourseData(selectId);
});
$("#difficulty").change(function () {
    var difficultyId = $( this ).val()
    console.log(difficultyId)
    populateCourseData(difficultyId);
});