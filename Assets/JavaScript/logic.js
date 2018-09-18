// Ceate Jumbotron with current time in it
// Create table with train schedule information you input 
// Create form to input train infomration

// Global Variables
var trainName ; 
var destination ; 
var time ;
var frequency ; 
var nextArrival ;
var minutesAway ; 
var keyArray = []; 

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAt6Ef1SxtuKM2VYnb1a83ye3jOoCtIf6E",
    authDomain: "train-scheduler-hw-d50f0.firebaseapp.com",
    databaseURL: "https://train-scheduler-hw-d50f0.firebaseio.com",
    projectId: "train-scheduler-hw-d50f0",
    storageBucket: "train-scheduler-hw-d50f0.appspot.com",
    messagingSenderId: "419281387753"
  };
  firebase.initializeApp(config);


// Assign the reference to the database to a veriable - 'database'
  var database = firebase.database();

// Display 'eal-time' in Jumbotron
  function timeDisplay() {
      var timeNow = moment().format("HH:mm:ss"); 
      $(".timeNow").html(timeNow)
  }; 

  setInterval(timeDisplay, 1000); 



// Add train form
$("#click-button").on("click", function(event) {
      event.preventDefault();

  
   trainName = $("#name").val().trim();
       console.log("trainName " + trainName); 
   destination = $("#destination").val().trim();
       console.log("destination " + destination); 
   time = $("#time").val().trim();
       console.log("first train " + time); 
   frequency = $("#frequency").val().trim();
       console.log("frequency " + frequency);


    currentTime = moment().format("HH:mm"); 
        console.log("currentTime " + currentTime); 
    // Compute the diffeernce in time from 'now' and the first train using UNIX timestamp
      var timeConvert = moment(time, "HH:mm").subtract(1, "years");  
          console.log(timeConvert); 
      var timeDiff = moment().diff(moment(timeConvert), 'minutes'); 
          console.log("timeDiff " + timeDiff); 
      var remainder = timeDiff % frequency; 
          console.log("remainder " + remainder); 
    
      minutesAway = frequency - remainder; 
          console.log("minutes away " + minutesAway); 
    // Add mintuesAway to now, to find the next train & conver to standard time
      nextArrival = moment().add(minutesAway, "m").format("hh:mm A"); 
          console.log("nextArrival " + nextArrival); 
      
    // Add entries to the train schedule table 
    database.ref().child("trains").push({
      trainName : trainName,
      destination : destination,
      time : time,
      frequency : frequency,
      nextArrival: nextArrival,
      minutesAway: minutesAway
    });


    //  alert that train was added after submit button is clicked
    alert("Train successuflly added!");

  $("#name").val(""); 
  $("#destination").val(""); 
  $("#time").val(""); 
  $("#frequency").val(""); 


}); 

// Train Schedule table
database.ref().child("trains").on("child_added", function(snapshot) {
      console.log("this is the snapshot: " + snapshot)
      console.log(snapshot.val())

    var key = snapshot.key; 
        keyArray.push(key); 
        console.log(keyArray); 

    
        console.log("key" + key); 

    // Button to remove train from schedule
    var button = $("<button>"); 
    button.append("Trash"); 
    button.attr("removeBtn", key); 
    button.addClass("buttons glyphicon glyphicon-trash"); 
        console.log(button)

    var row = $("<tr>");
    row.attr("id", key); 
        console.log(row); 
    row.append("<td>" +  snapshot.val().trainName + "</td>"); 
    row.append("<td>" +  snapshot.val().destination + "</td>");
    row.append("<td>" +  snapshot.val().time + "</td>");
    row.append("<td>" +  snapshot.val().frequency + "</td>");
    row.append("<td>" +  snapshot.val().nextArrival + "</td>");
    row.append("<td>" +  snapshot.val().minutesAway + "</td>");

    // Empty fomr once submitted
    var emptyTd = $("<td>"); 
    var buttonTd = emptyTd.append(button); 
    row.append(buttonTd); 


    $("#trains").prepend(row);

   
});

// Remove train button
$(document.body).on("click", ".buttons", function() {
    var trainRemove = $(this).attr("removeBtn");
        console.log("trainRemove" + trainRemove); 
    database.ref().child("trains").child(trainRemove).remove(); 
    location.reload(); 
});





