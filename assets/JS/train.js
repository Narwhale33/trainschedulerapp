// 1) Initialize Firebase
// 2) Create button for adding new train - then update html & update database
// 3) Create a way to retrieve 
// 4) Create a way to determine train arrival time
// 5) Determine the frequency of arrivals
// 
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAQxHod7POk-oFtwDzNyr2U-dlQfDEQdc4",
  authDomain: "trainscheduler604.firebaseapp.com",
  databaseURL: "https://trainscheduler604.firebaseio.com",
  projectId: "trainscheduler604",
  storageBucket: "",
  messagingSenderId: "786958518023",
  appId: "1:786958518023:web:b9c53fd6d1d50e1f"
};
// Intialize App
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
// Button for adding train
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();
// Takes user input
  // Logs train name
  var trainName = $("#train-name-input").val().trim();
  // Logs train destination
  var trainDestination = $("#destination-input").val().trim();
  // First train time
  var firstTrain = moment($("#train-time-input").val().trim(), "HH:mm").format("HH:mm");
  // Frequency of train
  var frequency = $("#frequency-input").val().trim();
// create local temporary obj to hold the train data
var newTrain = {
  name: trainName,
  destination: trainDestination,
  ftrain: firstTrain,
  freq: frequency
};
// Upload new train data to database
database.ref().push(newTrain);
// Logs to console for testing
console.log(newTrain.name);
console.log(newTrain.destination);
console.log(newTrain.ftrain);
console.log(newTrain.freq);
alert("Train successfully added");
// Clear text boxes
$("#train-name-input").val("");
$("#destination-input").val("");
$("#train-time-input").val("");
$("#frequency-input").val("");
});
// Create firebase event listener to add trains to database and a row in the html when the user adds an entry - stores data inside the variable of childSnapshot
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());
  // Store childSnapshot values into variables
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().ftrain;
  var frequency = childSnapshot.val().freq;
  // First time (pushed back 1 year to make sure it comes before the current time)
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  // Current time
  var currentTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("CURRENT TIME: " + currentTime);
  // Store difference in in time between currentTime and first train converted in a variable
  var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
  console.log(firstTrain);
  console.log("Diffrence in Time: " + timeDiff);
  // Find the remainder of the time left and store in a variable
  var timeRemainder = timeDiff % frequency;
  console.log(timeRemainder);
  // Calculate minutes till train and store in variable
  var minToTrain = frequency - timeRemainder;
  // next train
  var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(frequency),
      $("<td>").text(firstTrain),
      $("<td>").text(minToTrain)
  );
  // Append new row to the table
  $("#train-table > tbody").append(newRow);
});