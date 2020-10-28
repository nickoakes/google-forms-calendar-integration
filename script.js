//script is triggered every time the Google Form is submitted

var moment = Moment.load();

var formMap = {
  fullName: "Full Name",
  eventType: "Event Type",
  date: "Date"
}

function formSubmit() {
  var formData = getFormResponse();
  var event = createCalendarEvent(formData);
}

function getFormResponse(){

  //open form and get the most recent response

  var form = FormApp.openById('GOOGLE_FORM_ID_HERE'),
      responses = form.getResponses(),
      length = responses.length,
      mostRecent = responses[length - 1],
      itemResponses = mostRecent.getItemResponses(),
      formData = {};
  
  //loop through the fields in the most recent response, and map each to a known form field

  for(var i = 0; i < itemResponses.length; i++){
    var item = itemResponses[i].getItem().getTitle(),
        response = itemResponses[i].getResponse();
    
    switch (item) {
      case formMap.fullName:
        formData.title = response;
        break;
      case formMap.eventType:
        formData.eventType = response;
        formData.title += `'s ${response}`;
        break;
      case formMap.date:
        formData.startTime = response;
        break;
    }
  }
  
  return formData;
}

function createCalendarEvent(formData){

  //open the events calendar

  var calendar = CalendarApp.getCalendarById('GOOGLE_CALENDAR_ID_HERE'),
      title = formData.title,
      date = moment(formData.startTime).toDate();

  //birthdays and work anniversaries will recur annually, whereas other events (weddings etc.) are one-offs
  
  if(formData.eventType == "Birthday" || formData.eventType == "Work Anniversary"){
    
    var eventSeries = calendar.createAllDayEventSeries(title,
                                                       date,
                                                       CalendarApp.newRecurrence().addYearlyRule());
  } else{
    var event = calendar.createAllDayEvent(title, date);
  }
}
