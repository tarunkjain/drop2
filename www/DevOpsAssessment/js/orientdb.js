var dburi = 'http://' + window.location.host + '/DevOpsAssessment';
var currentdate = new Date();
var datetime = currentdate.getDate() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();

function insertProcessAssessmentData(questionMap, onboarding, maturity, appName, serviceType, cioArea, userName, userRole) {

  var database = new ODatabase(dburi);
  databaseInfo = database.open('root', 'admin');

  var values = "";
  var columnNames = "";

  $.each(questionMap, function(index, question) {
    columnNames += "q" + question.id + ",";
    values += question.score + ",";
  });

  $.each(_.keys(onboarding), function(index, category) {
    var categoryCleaned = category.replace(/[^a-z0-9\.]+/gi, "");
    columnNames += "onboarding_" + categoryCleaned + ",";
    values += onboarding[category] + ",";
    columnNames += "maturity_" + categoryCleaned + ",";
    values += maturity[category] + ",";
  });

  columnNames += "Date_Time, Applications, ITService, cioArea, Username, UserRole";
  values += "'" + datetime + "', '" + appName + "', '"+ serviceType + "', '" + cioArea + "', '" + userName + "', '" + userRole + "'";

  commandResult = database.executeCommand("insert into ProcessAssessment(" + columnNames + ") values (" + values + ")");

}

function UpdateResultsProcessAssessment(appName, serviceType, cioArea, userName, userRole) {

  var assessmentType = localStorage.assessment;

  var database = new ODatabase(dburi);
  databaseInfo = database.open('root', 'admin');

  queryMaxRow = database.query("select max(@rid) from ProcessAssessment");
  var RowID = queryMaxRow.result[0].max;

  queryResultUpdate = database.executeCommand("update ProcessAssessment set Date_Time ='" + datetime + "', Applications='" + appName + "', ITService='"
      + serviceType + "', cioArea='" + cioArea + "', Username='" + userName + "', UserRole='" + userRole + "' UPSERT WHERE @rid= " + RowID + "");

}

function UpdateResultsToolsAssessment(appName, serviceType, cioArea, userName, userRole) {

  var assessmentType = localStorage.assessment;

  var database = new ODatabase(dburi);
  databaseInfo = database.open('root', 'admin');

  queryMaxRow = database.query("select max(@rid) from ToolsAssessment");
  var RowID = queryMaxRow.result[0].max;

  queryResultUpdate = database.executeCommand("update ToolsAssessment set Date_Time ='" + datetime + "', Applications='" + appName + "', ITService='"
      + serviceType + "', cioArea='" + cioArea + "', Username='" + userName + "', UserRole='" + userRole + "' UPSERT WHERE @rid= " + RowID + "");

}
