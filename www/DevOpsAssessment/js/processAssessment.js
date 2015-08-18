var QUESTION_ID_PREFIX = "ID_Q_";

$(document).ready(function () {


    var newURL = window.location.protocol + "//" + window.location.host;
    window.location.assign(newURL + "/DevOpsAssessment/ProcessAssessment.html#secondPage");

    $("#demosMenu").change(function () {
        window.location.href = $(this).find("option:selected").attr("id") + '.html';
    });

    var assessmentType = localStorage.assessment;

    if (localStorage.assessment == 'first') {
        $('#list1').show();
    }

    $("#section1").show();

    var questions = {};
    var questionMap = {};
    var categories = [];
    var questionIndex = 0;
    var questionObject;

    /*
     * Get the questions and descriptions from the json file
     * 
     * Keep the data object in memory - add id's to the questions and get the lsit of categories
     * 
     */
    $.getJSON('./js/ProcessAssessmentQuestions.json', function (data) {
        questionObject = data;
        var questionIndex = 0;
        $.each(data.AssessmentQuestions, function (index, question) {

            if ($.inArray(question.Category, categories) === -1) {
                categories.push(question.Category);
            }
            questionIndex = addIds(question, questionIndex);

        });

        // now need to build html
        buildCategoryLinks();
        buildQuestionSlides();
        setUpActions();

        // setup the slides
        $('#fullpage').fullpage({
            anchors: ['secondPage'],
            sectionsColor: ['rgb(240, 242, 244)'],
            css3: true
        });



    });

    var x = 0;
    var ratings;
    var  arr  =  Array();
    var arrQuestions;
    var AnswerOptions;
    var arrCategories;
    var DevCat = new Array();
    var DepCat = new Array();
    var QualityCat = new Array() ;

    function buildCategoryLinks() {

        $.each(categories, function (index, category) {

            var li;
            $.each(getQuestionsForCategories(category), function (index, question) {
                if (index == 0) {
                    li = $('<li onclick="location.href = \'#secondPage/' + question.id + '\';" class="quiz-intro-item">"');
                    var a = $('<a class="quiz-intro-link " style="padding-top: 3px;color: white;">' + category + '</a>');
                    $('#FunctionalMenu1').append(li);
                    li.append(a);
                }

                var div = $('<div id="bar' + question.id + '" class="quiz-progress" style="width: 11.1%;"><a href="#secondPage/' + question.id + '"><span class="link-spanner"></span></a></div>');
                li.append(div);
                if (question.id == 0) {
                    div.addClass("select");
                }

            });

        });

        var li = $('<li id="results" onclick="location.href = \'#secondPage/500\';" class="quiz-intro-item ">');
        var a = $('<a class="quiz-intro-link " style="padding-top: 3px;color: white;">Assessment Results</a>');
        $('#FunctionalMenu1').append(li);
        li.append(a);
        var div = $('<div class="quiz-progress" style="width: 100%;"><a id="results1" href="#secondPage/500"><span class="link-spanner"></span></a></div>');
        li.append(div);
    }

    Array.prototype.pushArray = function (arr) {
        this.push.apply(this, arr);
    };


    function buildQuestionSlides() {
        var slideArray = [];

        $.each(categories, function (index, category) {
            var questions = getQuestionsForCategories(category);

            $.each(questions, function (index, question) {
                slideArray.pushArray(buildQuestionDiv(question));
            });
        });

        ratings = new Array(x + 1);
        arrQuestions = new Array(x + 1);
        arrCategories = new Array();
        AnswerOptions = new Array(x+1);
        setAll(ratings, 0);

        $.each(categories, function (index, category) {
            var questions = getQuestionsForCategories(category);
            //             console.log(questions.length);
            arrCategories.push((questions.length * 2));
            console.log(arrCategories);

        });


        for (i = 0; i < arrQuestions.length; i++) {
            arrQuestions[i] = "Q" + (i + 1);
        }
        
        for (i = 0; i < AnswerOptions.length; i++) {
            AnswerOptions[i] = "N/A";
        }
        //        console.log(arrQuestions);

        //        alert(ratings.length);
        $('#section1').prepend(slideArray);

    }

    function setAll(ratings, v) {
        var i, n = ratings.length;
        for (i = 0; i < n; ++i) {
            ratings[i] = v;
        }
    }



    function buildQuestionDiv(question) {
        var slideArray = [];
        // TODO change to a template
        var div = $('<div class="slide" id="slide' + question.id + '">');
        slideArray.push(div);

        x = question.id;


        var divIntro = $('<div class="intro">');
        div.append(divIntro);

        divIntro.append('<img src="./Pictures/Build/picture1.png" height="150" width="135" style="padding-bottom: 20px;">');
        divIntro.append('<h3>' + question.Question + '</h3>');
        divIntro.append('<button class="toggle"></button>');
        divIntro.append('<span class="more myfont">' + question.Description + '</span>');
        var divCont = $('<div class="container">');
        divIntro.append(divCont);
        divIntro.append('<div id="queans' + question.id + '" style="display:none"><h3 id="ans' + question.id + '"></h3><div>');
        divIntro.append('<img src="./Pictures/Barclays_logo.png" width="200" style="margin-top:30px">');

        // TODO if no options then it should be flagged as an error
        if (typeof question.Options !== 'undefined') {
            $.each(question.Options, function (index, option) {

                var value = getKey(option);
                var obj = option[value];
                //				console.log(obj.Rating);
                //                var keyVal = Object.(option);
                //                console.log(keyVal);
                
                    divCont.append('<div class="option" data-category="'+question.Category+'" data-Option="'+value+'" data-Rating="' + obj.Rating + '" data-QuestionID="' + question.id + '" style="font-size: 20px">' + value + '</div>');
                

                if (typeof option[value].SubQuestion !== 'undefined') {
                    slideArray.pushArray(buildQuestionDiv(option[value].SubQuestion));
                }
            });
        }
        return slideArray;

    }


    function setUpActions() {

        $(".toggle").click(function (event) {
            $(this).toggleClass('read-less');
            $(this).next('.more').toggleClass('show');
            event.preventDefault();
        });

        $('div.option').click(function () {
            var slideNo = parseInt($(this).closest(".slide").attr("id").replace(/[^\d]/g, ''));
            var optionSelected = this.innerHTML;
            var QuestionNo = this.getAttribute("data-QuestionID");
            var RatingValue = this.getAttribute("data-Rating");
            var AnsOption = this.getAttribute("data-Option");
            var OtherOption = $(this).text();
            var catType = this.getAttribute("data-category");
            var OtherOpText = "";
//            alert(AnsOption);
            //            alert((ratings.length-1));
            //            alert("QuestionRating : " + RatingValue);
            
            if(catType == "Development"){            
                DevCat.push(RatingValue);
            }else if(catType == "Deployment"){
                DepCat.push(RatingValue);
            }else {
                QualityCat.push(RatingValue);
            }
            
           
            if(OtherOption == "Others"){
             $("#OptionText").val('');   
                
             window.location.href ="#openModal";
              $('#btnModal').off('click');
              $('#btnModal').click(function () {
                 
//              alert(Option);
              $('#slide' + slideNo + ' *> div.option').removeClass('selected');
              $(this).addClass('selected');
                
              AnswerOptions[QuestionNo] = $("#OptionText").val();
//             alert(QuestionNo);
//                  alert($("#OptionText").val());
              $('#ans' + slideNo).text('Your answer: ' + optionSelected);
                  
//              console.log(AnswerOptions);
                  
              ratings[QuestionNo] = "" + RatingValue;
//              AnswerOptions[QuestionNo] = AnsOption;
            //TODO fix ratings
            //            assesment[slideNo] = 1;
            //            ratings.push(1);
            //            ratings.splice(QuestionNo, 0, 1);
            //            console.log(ratings.length);
            console.log(AnswerOptions);
            $('#ans' + slideNo).text('Your answer: ' + optionSelected);

            var currentQuestion = questionMap[slideNo];
            var currentOption = getOption(currentQuestion, optionSelected);

            if (currentOption && attrExists(currentOption.SubQuestion)) {
                $.fn.fullpage.moveTo(1, currentOption.SubQuestion.id);
            } else {
                if (currentQuestion.next == ratings.length) {

                    checkResultsAssesment1();
                    
//                    alert(currentQuestion.next);
                }

                $.fn.fullpage.moveTo(1, currentQuestion.next);
                moveBars(currentQuestion.next);
            }


            // to delay showing answered text. slide no is passed as an argument
            timeout(slideNo);
                  
                  
             });
                
                
            }else{
            
            $('#slide' + slideNo + ' *> div.option').removeClass('selected');

            $(this).addClass('selected');

            ratings[QuestionNo] = "" + RatingValue;
            AnswerOptions[QuestionNo] = AnsOption;
            //TODO fix ratings
            //            assesment[slideNo] = 1;
            //            ratings.push(1);
            //            ratings.splice(QuestionNo, 0, 1);
            //            console.log(ratings.length);
            console.log(ratings);
            $('#ans' + slideNo).text('Your answer: ' + optionSelected);

            var currentQuestion = questionMap[slideNo];
            var currentOption = getOption(currentQuestion, optionSelected);

            if (currentOption && attrExists(currentOption.SubQuestion)) {
                $.fn.fullpage.moveTo(1, currentOption.SubQuestion.id);
            } else {
                if (currentQuestion.next == ratings.length) {

                    checkResultsAssesment1();
                    
//                    alert(currentQuestion.next);
                }

                $.fn.fullpage.moveTo(1, currentQuestion.next);
                moveBars(currentQuestion.next);
            }


            // to delay showing answered text. slide no is passed as an argument
            timeout(slideNo);

            //a place to get redirected to the results page || slideNo == 30 
            //            if (slideNo == 3) {
            //                // calls the results calculating method
            //                checkResultsAssesment1();
            //                updateAssesmentResults();
            //            }
            
            }


        });

        $('div.quiz-progress').click(function (event) {
            $('div.quiz-progress').removeClass("select");
            $('div.quiz-progress').removeClass("activeselect");
            event.stopPropagation();

            var cls = $(this).attr('class');
            var subcls = cls.split(" ").pop();

            if (subcls == 'active') {
                $(this).addClass("activeselect");
            } else if (subcls == 'quiz-progress') {
                $(this).addClass("select");
            }

        });

        /* select the first question bar of a section when clicked on a section
         */
        $('li.quiz-intro-item').click(function () {

            var selectDiv = $(this).find("div:first").attr('id');

            var cls = $('#' + selectDiv).attr('class');
            var subcls = cls.split(" ").pop();

            $('div.quiz-progress').removeClass("select");
            $('div.quiz-progress').removeClass("activeselect");
            if (subcls == 'active') {
                $('#' + selectDiv).addClass("activeselect");
            } else if (subcls == 'activeselect') {
                $('#' + selectDiv).addClass("activeselect");
            } else {
                $('#' + selectDiv).addClass("select");
            }

        });


    }

    function getQuestionCount(category) {
        var count = 0;
        $.each(questionObject.AssessmentQuestions, function (index, question) {
            if (question.Category == category) {
                count++;
            }
        });

        return count;
    }

    function getQuestionsForCategories(category) {
        var questions = [];
        $.each(questionObject.AssessmentQuestions, function (index, question) {
            if (question.Category == category) {
                questions.push(question);
            }
        });

        return questions;
    }

    /*
     * add simple ids to each question - these will be used a the slides index
     */
    function addIds(question, questionIndex) {
        question.id = questionIndex;
        questionMap[questionIndex] = question;
        questionIndex++;
        if (typeof question.Options !== 'undefined') {
            $.each(question.Options, function (index, option) {
                var optionValue = getKey(option);
                if (typeof option[optionValue].SubQuestion !== 'undefined') {
                    questionIndex = addIds(option[optionValue].SubQuestion, questionIndex);
                }
            });
        }
        question.next = questionIndex;
        return questionIndex;

    }


    function getKey(obj) {
        return Object.keys(obj)[0];

    }

    function attrExists(attr) {
        return typeof attr !== 'undefined'
    }

    function getOption(question, optionValue) {
        var options = question.Options.filter(function (option) {
            return typeof option[optionValue] !== 'undefined'
        });
        if (options.length > 0) {
            return options[0][optionValue];
        }
    }

    function moveBars(nextSlide) {
        $("#FunctionalMenu1 > li > div.select, #FunctionalMenu1 > li > div.activeselect").addClass("active")
        $("#FunctionalMenu1 > li > div").removeClass("select activeselect")

        var nxtbar = '#bar' + nextSlide;

        if (($.inArray(-1, assesment)) == -1) {
            $('#bar31').addClass("active");
        }
        
        if ($(nxtbar).hasClass('active')) {
            $(nxtbar).addClass("activeselect");
        } else {
            $(nxtbar).addClass("select");
        }

    }

    // to delay showing answered text. slide no is passed as an argument
    function timeout(slide) {
        window.setTimeout(function () {
            $("#queans" + slide).show();
        }, 1000);
    }




    var assesment = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

    var precentageVal = [];
    var a1 = 0; // result for part 1
    var a2 = 0; // result for part 2
    var a3 = 0; // result for part 3
    var a4 = 0; // result for part 4
    var a5 = 0;
    var a6 = 0; // result for part 5
    var status = 1;
    var assResultsInt = [];
    // db session count handle replicating same data
    var SessionCount = 0;



    //send data to database if all the questions are answered
    function SendAssessmentData() {
        //if process assessment is selected.
        // set count as one . same record will not be added again
        SessionCount = 1;
        insertProcessAssessmentData(AnswerOptions);
        UpdateResultsProcessAssessment(localStorage.getItem('appName'), localStorage.getItem('serviceType'), localStorage.getItem('yourName'), localStorage.getItem('designation'), localStorage.getItem('cioArea'));
        localStorage.setItem("ProcessAssessment", "Completed");

        alert("Successfully saved in the Database");
        window.location.href = 'index.html';

    }

    function checkResultsAssesment1() {
        //        alert("check assessment Results");
        a1 = 0;
        a2 = 0;
        a3 = 0;
        //        a4 = 0;
        //        a6 = 0;
//        alert(ratings);
        
        for(i=0; i< DevCat.length; i++){
            a1 += parseFloat(DevCat[i]);        
        }
        for(i=0; i< DepCat.length; i++){
            a2 += parseFloat(DepCat[i]);        
        }
        for(i=0; i< QualityCat.length; i++){
            a3 += parseFloat(QualityCat[i]);        
        }
      
//        for (i = 0; i < ratings.length; i++) {
//            if (i < arrCategories[0]) {
//                a1 += parseFloat(ratings[i]);
//                //                alert("a1 :" + a1 +" i is:"+i);
//            } else if (i < (arrCategories[0] + arrCategories[1])) {
//                a2 += parseFloat(ratings[i]);
//                //                alert("a2 :" + a2 +" i is:"+i);
//            } else {
//                a3 += parseFloat(ratings[i]);
//                //                alert("a3 :" + a3 +" i is:"+i);
//            }
//        }
        updateAssesmentResults();

    }

    //update assesment results here
    function updateAssesmentResults() {
        //build n continuous integration

        //
        var progressbar1 = $('#progressbar1'),
            max1 = Math.round(a1 * (100 / DevCat.length)),
            time1 = (500 / max1) * 5,
            value1 = 0;
        progressbar1.val(value1);
        if (max1 < 0) {
            max1 = 0;
            $('#text10').html('Pending Results');
            $('#text11').html('Please answer all the questions and come back');

        } else if (max1 < 20) {
            $('#text10').html('Regressive');
            $('#text11').html('Manual process for deploying software. Environment specific binaries, Environments provisioned manually');

        } else if (max1 < 40) {
            $('#text10').html('Repeatable');
            $('#text11').html('Automated deployments to some environments. Creation of new environments is cheap/fast. All configuration is externalized');

        } else if (max1 < 60) {
            $('#text10').html('Consistent');
            $('#text11').html('Fully automated, self service process for deployments to test environments. Repeatable process to deploy to every environment');

        } else if (max1 < 80) {
            $('#text10').html('Quantitatively Managed');
            $('#text11').html('Orchestrated deployments. Release and rollback processes are fully tested');

        } else {
            $('#text10').html('Optimized');
            $('#text11').html('All environments managed effectively. Provisioning fully automated, with Virtualization where applicable');
        }

        var loading1 = function () {

            addValue = progressbar1.val(value1);

            $('#progressvalue1').html((value1) + '%');

            if (value1 == max1) {
                clearInterval(animate1);
            }
            value1 += 1;
        };

        var animate1 = setInterval(function () {
            loading1();
        }, time1);

        var progressbar2 = $('#progressbar2'),
            max2 = Math.round(a2 * (100 / DepCat.length)),
            time2 = (500 / max2) * 5,
            value2 = 0;
        progressbar2.val(value2);
        if (max2 < 0) {
            max2 = 0;

            $('#text20').html('Pending Results');
            $('#text21').html('Please answer all the questions and come back');

        } else if (max2 < 20) {
            $('#text20').html('Regressive');
            $('#text21').html('Manual processes are being used to configure environments, check code quality and manage artifacts which makes the code un reliable and less in maintainability');

        } else if (max2 < 40) {
            $('#text20').html('Repeatable');
            $('#text21').html('Environment provisioning is not reliable and also error prone rate is considerably high also the artifacts are partially managed which will reduce the maintainability');

        } else if (max2 < 60) {
            $('#text20').html('Consistent');
            $('#text21').html('Development teams follow basic level of code coverage and also the development environments are manages up to a good level which makes the code to have good quality ');

        } else if (max2 < 80) {
            $('#text20').html('Quantitatively Managed');
            $('#text21').html('Code quality matrices are tracked well and artifacts are proactively managed');

        } else {
            $('#text20').html('Optimized');
            $('#text21').html('Code is being tested automatically and the artifacts are well published in a central repository which makes the error prone rate low as the environment configuration is too fully automated');
        }

        var loading2 = function () {

            addValue = progressbar2.val(value2);

            $('#progressvalue2').html((value2) + '%');

            if (value2 == max2) {
                clearInterval(animate2);
            }
            value2 += 1;
        };

        var animate2 = setInterval(function () {
            loading2();
        }, time2);
        //3

        //4
        var progressbar3 = $('#progressbar3'),
            max3 = Math.round(a3 * (100 / QualityCat.length)),
            time3 = (500 / max3) * 5,
            value3 = 0;
//        alert("A3 is :  " + a3);
        progressbar3.val(value3);
        if (max3 < 0) {
            max3 = 0;

            $('#text30').html('Pending Results');
            $('#text31').html('Please answer all the questions and come back');

        } else if (max3 < 20) {
            $('#text30').html('Regressive');
            $('#text31').html('Manual testing after development');

        } else if (max3 < 40) {
            $('#text30').html('Repeatable');
            $('#text31').html('Automated tests written as part of requirement development');

        } else if (max3 < 60) {
            $('#text30').html('Consistent');
            $('#text31').html('Automated unit and acceptance tests, written along with tests. Testing is part of the development process');

        } else if (max3 < 80) {
            $('#text30').html('Quantitatively Managed');
            $('#text31').html('Quality metrics and trends tracked, nonfunctional requirements defined and measured');

        } else {
            $('#text30').html('Optimized');
            $('#text31').html('Production rollbacks are rare, defects are found and fixed immediately');
        }

        var loading3 = function () {

            addValue = progressbar3.val(value3);

            $('#progressvalue3').html((value3) + '%');

            if (value3 == max3) {
                clearInterval(animate3);
            }
            value3 += 1;
        };

        var animate3 = setInterval(function () {
            loading3();
        }, time3);
        //4

    }


    // this method called when result is clicked
    $('#list3,#results1,#results').click(function () {
        // calls the results calcualting method
        checkResultsAssesment1();
        updateAssesmentResults();
    });


    $("li.quiz-intro-item").mouseover(function () {
        $(this).css("background-color", "#6094EA");
    });

    $("li.quiz-intro-item").mouseout(function () {
        $(this).css("background-color", "#4F81BD");
    });

    // used to fill a table which is rendered to a PDF. IN PROGRESS....
    function fillTable() {

        var cell1 = Math.round(a1 * (100 / 6)) + '%';
        document.getElementById("perc01").innerHTML = cell1;

        var cell2 = $('#text00').text();

        document.getElementById("rec01").innerHTML = cell2;

        var cell3 = $('#text01').text();

        document.getElementById("desc01").innerHTML = cell3;

        var cell4 = Math.round(a2 * (100 / 6)) + '%';

        document.getElementById("perc02").innerHTML = cell4;

        var cell5 = $('#text10').text();
        document.getElementById("rec02").innerHTML = cell5;

        var cell6 = $('#text11').text();
        document.getElementById("desc02").innerHTML = cell6;

        var cell7 = Math.round(a3 * (100 / 6)) + '%';
        document.getElementById("perc03").innerHTML = cell7;

        var cell8 = $('#text20').text();
        document.getElementById("rec03").innerHTML = cell8;

        var cell9 = $('#text21').text();
        document.getElementById("desc03").innerHTML = cell9;

        var cell10 = Math.round(a4 * (100 / 6)) + '%';
        document.getElementById("perc04").innerHTML = cell10;

        var cell11 = $('#text30').text();
        document.getElementById("rec04").innerHTML = cell11;

        var cell12 = $('#text31').text();
        document.getElementById("desc04").innerHTML = cell12;

        var cell13 = Math.round(a6 * (100 / 6)) + '%';
        document.getElementById("perc05").innerHTML = cell13;

        var cell14 = $('#text40').text();
        document.getElementById("rec05").innerHTML = cell14;

        var cell15 = $('#text41').text();
        document.getElementById("desc05").innerHTML = cell15;
        //        for (i = 0; i < assResultsInt.length; i++) {
        //            precentageVal[i] = getPrecentageAss(assResultsInt[i], i);
        //        }
        //
        //
        //        document.getElementById("Other01").innerHTML = Math.round(precentageVal[0]) + "%";
        //        document.getElementById("Other02").innerHTML = Math.round(precentageVal[1]) + "%";
        //        document.getElementById("Other03").innerHTML = Math.round(precentageVal[2]) + "%";
        //        document.getElementById("Other04").innerHTML = Math.round(precentageVal[3]) + "%";
        //        document.getElementById("Other05").innerHTML = Math.round(precentageVal[4]) + "%";

    }

    // Print PDF button when this clicked a PDF is Downloded and send data to DB
    $('#printID').click(function () {
        //        fillTable();

        if (SessionCount == 0) {
            SendAssessmentData();
            //generatePDF();
            //            window.location.href = 'ToolsAssessment.html';
        }
        if (localStorage.getItem('ProcessAssessment') == "Completed" && localStorage.getItem('ToolsAssessment') == "Completed") {
            window.location.href = 'index.html';
        }

    });

});
