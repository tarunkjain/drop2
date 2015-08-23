$(document).ready(function() {

// table query var's
var maturityData = "select cioArea, ITService, Applications, Date_Time, q2 as 'JIRA', q5 as 'Confluence', q8 as 'Sharepoint',q11 as 'GIT_Stash', q14 as 'Jenkins', q17 as 'Stash', q20 as 'NexusPro', q23 as 'Maven', q24 as 'Gradle', q27 as 'DBMaestro', q30 as 'Nolio', q31 as 'Endevor', q35 as 'CHEF', q38 as 'Evolven', q41 as 'SonarQube', q44 as 'Cucumber', q45 as 'Selenium', q46 as 'QTP', q49 as 'HP_QC', q50 as 'DEFECT_JIRA', q53 as 'PerfCenter', q54 as 'LoadRunner', q57 as 'RIT', q60 as 'Parasoft', q63 as 'Actifio', q66 as 'RTVIew', q69 as 'Azure', q72 as 'SNOW' from ProcessAssessment";
var toolsAdoptionData = "select cioArea, ITService, Applications, Date_Time, q1 as 'JIRA',q4 as 'Confluence',q7 as 'Sharepoint', q10 as 'GIT_Stash',q13 as 'Jenkins',q16 as 'STASH',q19 as 'NexusPro',q22 as 'Maven_Gradle',q26 as 'DBMaestro', q29 as 'Nolio',q34 as 'CHEF',q37 as 'Evolven',q40 as 'SonarQube',q43 as 'Cucumber_Selenium_QTP',q48 as 'HPQC_JIRA',q52 as 'HPPerfCenter_LoadRunner',q56 as 'RIT',q59 as 'Parasoft',q62 as 'Actifio',q65 as 'RTView',q68 as 'Azure',q71 as 'SNOW' from ProcessAssessment";

var dataset1 = addTable(maturityData);
$('#maturityTable').dataTable( {
data: dataset1.aaData,
columns: dataset1.aoColumns,
"scrollX": true,
"scrollY":        '50vh',
"scrollCollapse": true,
"paging":         false
});

var dataset2 = addTable(toolsAdoptionData);
$('#adoptionTable').dataTable(  {
data: dataset2.aaData,
columns: dataset2.aoColumns,
"scrollX": true,
"scrollY":        '50vh',
"scrollCollapse": true,
"paging":         false
});
});


    function addTable(query) {
        var dburi = 'http://localhost:2480/DevOpsAssessment';
            var database = new ODatabase(dburi);
            databaseInfo = database.open('root', 'admin');
            var Dbresults = [];
            //pass query as parameter - predefined - see query var's above
            queryResult1 = database.query(query);
            //queryResult1 = database.query("select ITService, cioArea, Applications, Date_Time, q1 as 'JIRA',q2 as 'JIRA_Maturity',q4 as 'Confluence',q5 as 'Confluence_Maturity',q7 as 'Sharepoint', q8 as 'Sharepoint_Maturity',q10 as 'GIT_Stash',q11 as 'GIT_Stash_Maturity',q13 as 'Jenkins',q14 as 'Jenkins_Maturity',q16 as 'STASH',q17 as 'Stash_Maturity',q19 as 'NexusPro',q20 as 'NexusPro_Maturity',q22 as 'Maven_Gradle',q23 as 'Maven_Maturity',q24 as 'Gradle_Maturity',q26 as 'DBMaestro',q27 as 'DBMaestro_Maturity', q29 as 'Nolio',q30 as 'Nolio_Maturity',q31 as 'Endevor_Maturity',q32 as 'NumberofDeployments',q34 as 'CHEF',q35 as 'CHEF_Maturity',q37 as 'Evolven',q38 as 'Evolven_Maturity',q40 as 'SonarQube',q41 as 'SonarQube_Maturity',q43 as 'Cucumber_Selenium_QTP',q44 as 'Cucumber_maturity',q45 as 'Selenium_Maturity',q46 as 'QTP_Maturity',q48 as 'HPQC_JIRA',q49 as 'HP_QC_Maturity',q50 as 'DEFECT_JIRA_Maturity',q52 as 'HPPerfCenter_LoadRunner',q53 as 'PerfCenter_Maturity',q54 as 'LoadRunner_Maturity',q56 as 'RIT',q57 as 'RIT_Maturity',q59 as 'Parasoft',q60 as 'Parasoft_Maturity',q62 as 'Actifio',q63 as 'Actifio_Maturity',q65 as 'RTView',q66 as 'RTVIew_Maturity',q68 as 'Azure',q69 as 'Azure_Maturity',q71 as 'SNOW',q72 as 'SNOW_Maturity' from ProcessAssessment");
            //queryResult1 = database.query("select cioArea, ITService, Applications, Date_Time,q2 as 'JIRA_Maturity',q5 as 'Confluence_Maturity' from ProcessAssessment");

            //console.log(queryResult1);
            Dbresults = queryResult1.result;

            for (i = 0; i < Dbresults.length; i++) {

                delete Dbresults[i]['@class'];
                delete Dbresults[i]['@rid'];
                delete Dbresults[i]['@type'];
                delete Dbresults[i]['@version'];
                delete Dbresults[i]['@fieldTypes'];

            }

            //console.log(Dbresults);
            var columns = [];
            for (var propName in Dbresults[0]) {
                columns.push(propName);
            }

            var dataTableObj = {
                aaData: [],
                aoColumns: []
            };

            // Stuff the aoColumns array
            for (var i=0; i < columns.length; i++) {
                 dataTableObj.aoColumns.push({sTitle: columns[i]})
            }

            // Stuff the aaData array
            for (var i=0; i < Dbresults.length; i++) {
             var row = Dbresults[i];
             var dataTableRow = [];
               for (var j=0; j < columns.length; j++) {
                     dataTableRow.push(row[columns[j]]);
                }
                 dataTableObj.aaData.push(dataTableRow);
                }

        console.log(dataTableObj);
        return(dataTableObj);

        }
