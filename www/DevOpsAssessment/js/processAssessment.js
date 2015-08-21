$(document)
    .ready(
        function() {

          var newURL = window.location.protocol + "//" + window.location.host;
          window.location.assign(newURL + "/DevOpsAssessment/ProcessAssessment.html#secondPage");

          $("#demosMenu").change(function() {
            window.location.href = $(this).find("option:selected").attr("id") + '.html';
          });

          var assessmentType = localStorage.assessment;

          if (localStorage.assessment == 'first') {
            $('#list1').show();
          }

          $("#section1").show();

          var questionMap = {};
          var categories = [];
          var onboarding = [];
          var maturity = [];
          var questionIndex = 0;
          var questionObject;
          var assementSlideID;

          /*
           * Get the questions and descriptions from the json file
           * 
           * Keep the data object in memory - add id's to the questions and get
           * the list of categories
           * 
           */
          $.getJSON('./js/ProcessAssessmentQuestions.json', function(data) {
            questionObject = data;
            var questionIndex = 0;
            $.each(data.AssessmentQuestions, function(index, question) {

              if ($.inArray(question.Category, categories) === -1) {
                categories.push(question.Category);
              }
              questionIndex = addIds(question, questionIndex, -1);

            });

            assementSlideID = _.keys(questionMap).length;
            $("div.section >  div.slide").attr("id", "slide" + assementSlideID)

            // now need to build html
            buildCategoryLinks();
            buildQuestionSlides();
            setUpActions();

            // setup the slides
            $('#fullpage').fullpage({
              anchors : [ 'secondPage' ],
              sectionsColor : [ 'rgb(240, 242, 244)' ],
              css3 : true,
              afterSlideLoad : function(anchorLink, index, slideAnchor, slideIndex) {
                var loadedSlide = $(this);
                if (slideIndex == assementSlideID) {
                  displayResults();
                }
              }
            });

          });

          function buildCategoryLinks() {

            $.each(categories, function(index, category) {

              var li;

              var questions = getQuestionsForCategories(category);

              var barWidth = 100 / _.keys(questions).length;
              $.each(questions, function(index, question) {
                if (index == 0) {
                  li = $('<li onclick="location.href = \'#secondPage/' + question.id + '\';" class="quiz-intro-item">"');
                  var a = $('<a class="quiz-intro-link wordwrap" style="padding-top: 3px;color: white;">' + category + '</a>');
                  $('#FunctionalMenu1').append(li);
                  li.append(a);
                }

                var div = $('<div id="bar' + question.id + '" class="quiz-progress" style="width: ' + barWidth + '%;"><a href="#secondPage/' + question.id
                    + '"><span class="link-spanner"></span></a></div>');
                li.append(div);
                if (question.id == 0) {
                  div.addClass("select");
                }

              });

            });

            var li = $('<li id="results" onclick="location.href = \'#secondPage/' + assementSlideID + '\';" class="quiz-intro-item ">');
            var a = $('<a class="quiz-intro-link wordwrap" style="padding-top: 3px;color: white;">Assessment Results</a>');
            $('#FunctionalMenu1').append(li);
            li.append(a);
            var div = $('<div id="bar'
                + assementSlideID
                + '" class="quiz-progress" style="width: 100%;"><a id="results1" href="#secondPage/assementSlideID"><span class="link-spanner"></span></a></div>');
            li.append(div);

          }

          Array.prototype.pushArray = function(arr) {
            this.push.apply(this, arr);
          };

          function buildQuestionSlides() {
            var slideArray = [];

            $.each(categories, function(index, category) {
              var questions = getQuestionsForCategories(category);

              $.each(questions, function(index, question) {
                slideArray.pushArray(buildQuestionDiv(question));
              });
            });

            $('#section1').prepend(slideArray);
            if (window.PIE) {
              $('.option').each(function() {
                PIE.attach(this);
              });
            }

          }

          function buildQuestionDiv(question) {
            var slideArray = [];
            // TODO change to a template
            var div = $('<div class="slide" id="slide' + question.id + '">');
            slideArray.push(div);

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

            // TODO if no options then it should be flagged as an
            // error
            if (typeof question.Options !== 'undefined') {
              $.each(question.Options, function(index, option) {

                var value = getKey(option);
                var rating = (attrExists(option[value].Rating) ? option[value].Rating : 0)
                divCont.append('<div class="option"><div>' + value + '</div><input style="display:none" value="' + rating + '"/></div>');

                if (typeof option[value].SubQuestion !== 'undefined') {
                  slideArray.pushArray(buildQuestionDiv(option[value].SubQuestion));

                }
              });
            }
            return slideArray;

          }

          function setUpActions() {

            $(".toggle").click(function(event) {
              $(this).toggleClass('read-less');
              $(this).next('.more').toggleClass('show');
              event.preventDefault();
            });

            $('#section1 div.controlArrowGoBack').click(function() {

              var slideNo = $('div.slide.active').index();

              var nextSlide = -1;
              for (j = slideNo - 1; j >= 0; j--) {
                if (questionMap[j].parent == -1) {
                  nextSlide = questionMap[j].id;
                  break;
                }
              }

              if (nextSlide > -1) {
                $.fn.fullpage.moveTo(1, nextSlide);
                moveBars(nextSlide);
              }

            });

            $('div.option').click(function() {
              // TODO very messy - need to tidy it
              // up
              var slideNo = parseInt($(this).closest(".slide").attr("id").replace(/[^\d]/g, ''));
              var optionSelected = $('> div', this)[0].innerHTML

              $('#slide' + slideNo + ' *> div.option').removeClass('selected');

              $(this).addClass('selected');

              $('#ans' + slideNo).text('Your answer: ' + optionSelected);

              var currentQuestion = questionMap[slideNo];
              var currentOption = getOption(currentQuestion, optionSelected);

              currentQuestion.answered = 1;
              currentQuestion.score = parseFloat($(this).find("input").val());

              // need to reset all sub question
              // answers
              resetAllSubQuestions(currentQuestion);

              var nextSlide = assementSlideID;
              if (currentOption && attrExists(currentOption.SubQuestion)) {
                nextSlide = currentOption.SubQuestion.id
              } else {
                // next top level question
                for (j = currentQuestion.id + 1; j < _.keys(questionMap).length; j++) {
                  if (questionMap[j].parent == -1) {
                    nextSlide = questionMap[j].id;
                    break;
                  }
                }
              }

              $.fn.fullpage.moveTo(1, nextSlide);
              moveBars(nextSlide);

              $("#queans" + slideNo).delay(1000).show(0);

            });

            $('div.quiz-progress').click(function(event) {
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

            /*
             * select the first question bar of a section when clicked on a
             * section
             */
            $('li.quiz-intro-item').click(function() {

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

          function resetAllSubQuestions(question) {

            if (typeof question.Options !== 'undefined') {
              $.each(question.Options, function(index, option) {
                var optionValue = getKey(option);
                if (typeof option[optionValue].SubQuestion !== 'undefined') {

                  var subQuestion = option[optionValue].SubQuestion;

                  subQuestion.answered = 0;
                  subQuestion.score = 0;

                  $('#slide' + subQuestion.id + ' div.option').removeClass("selected");
                  $("#queans" + subQuestion.id).hide();
                  resetAllSubQuestions(subQuestion);
                }
              });
            }
          }

          function getQuestionCount(category) {
            var count = 0;
            $.each(questionObject.AssessmentQuestions, function(index, question) {
              if (question.Category == category) {
                count++;
              }
            });

            return count;
          }

          function getQuestionsForCategories(category) {
            var questions = [];
            $.each(questionObject.AssessmentQuestions, function(index, question) {
              if (question.Category == category) {
                questions.push(question);
              }
            });

            return questions;
          }

          /*
           * add simple ids to each question - these will be used a the slides
           * index a parentQuestionIdx of -1 means its a top level question
           */
          function addIds(question, questionIndex, parentQuestionIdx) {
            question.id = questionIndex;
            question.score = 0;
            question.parent = parentQuestionIdx;

            if (!attrExists(question.Rating)) {
              question.Rating = 0;
            } else {
              question.Rating = parseFloat(question.Rating);
            }

            questionMap[questionIndex] = question;
            questionIndex++;

            if (attrExists(question.Options)) {
              $.each(question.Options, function(index, option) {
                var optionValue = getKey(option);

                if (attrExists(option[optionValue].SubQuestion)) {
                  questionIndex = addIds(option[optionValue].SubQuestion, questionIndex, question.id);
                }
              });
            }

            return questionIndex;

          }

          function getKey(obj) {
            return _.keys(obj)[0];

          }

          function attrExists(attr) {
            return typeof attr !== 'undefined'
          }

          function getOption(question, optionValue) {
            var options = _.filter(question.Options, function(option) {
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

            if ($(nxtbar).hasClass('active')) {
              $(nxtbar).addClass("activeselect");
            } else {
              $(nxtbar).addClass("select");
            }

            if (nextSlide > 0) {
              $('#section1 div.controlArrowGoBack').show();
            } else {
              $('#section1 div.controlArrowGoBack').hide();
            }

          }

          // db session count handle replicating same data
          var SessionCount = 0;

          // send data to database
          function SendAssessmentData() {

            // set count as one . same record will not be added
            // again
            SessionCount = 1;

            insertProcessAssessmentData(questionMap, onboarding, maturity, localStorage.getItem('appName'), localStorage.getItem('serviceType'), localStorage
                .getItem('cioArea'), localStorage.getItem('yourName'), localStorage.getItem('designation'));

            localStorage.setItem("ProcessAssessment", "Completed");

            alert("Successfully saved in the Database");
            // window.location.href = 'ToolsAssessment.html';

          }

          function calculateResults() {

            $.each(categories, function(index, category) {
              onboarding[category] = 0;
              maturity[category] = 0;
              var questions = getQuestionsForCategories(category);
              $.each(questions, function(index, question) {
                // have to
                // assume that
                // questions
                // only go down
                // 2 levels or
                // this
                // won't work!!

                // 1st - ignore
                // top level
                // question,
                // value doesn't
                // mean
                // anything, its
                // just used to
                // get to next
                // level

                // ok - so they
                // are using the
                // recommended
                // tool
                var subQuestionL1 = findQuestionQithScore(question);
                if (attrExists(subQuestionL1)) {
                  // using a
                  // strategic
                  // tool so
                  // increase
                  // on
                  // boarding
                  onboarding[category] += Math.round((1 / questions.length * 100));
                  // now get
                  // maturity
                  var subQuestionL2 = findQuestionQithScore(subQuestionL1);
                  if (attrExists(subQuestionL2)) {
                    maturity[category] += Math.round((1 / questions.length * 100) * ((subQuestionL2.score + 1) / 5));
                  }
                }

              });
            });

          }

          function findQuestionQithScore(question) {
            var subQuestion;
            $.each(question.Options, function(index, option) {
              var key = getKey(option);
              if (attrExists(option[key].SubQuestion) && attrExists(option[key].SubQuestion.score) && option[key].SubQuestion.score > 0) {
                subQuestion = option[key].SubQuestion
              }
            });

            return subQuestion;
          }

          var messages = [ {
            "min" : 0,
            "max" : 20,
            "level" : "Initial/AdHoc"
          }, {
            "min" : 21,
            "max" : 40,
            "level" : "Managed"
          }, {
            "min" : 41,
            "max" : 60,
            "level" : "Defined"
          }, {
            "min" : 61,
            "max" : 80,
            "level" : "Measured"
          }, {
            "min" : 81,
            "max" : 100,
            "level" : "Optimised"
          }

          ];

          function findLevelMessage(value) {
            var levelMessage = "Pending Results";
            $.each(messages, function(index, message) {
              if (message.min < value) {
                levelMessage = message.level;
              }
            });

            return levelMessage;
          }
          // update assessment results here
          function displayResults() {

            calculateResults();
            var shortMessage = "";
            var longMessge = "";

            $('#showResults').empty();

            var progressbars = [];
            var progressbarsId = 0;
            $.each(categories, function(index, category) {
              var divCol = $('<div class="col"></div>');
              var divHeader = $('<div class="header">' + category + '</div>');
              var divBody = $('<div class="body"><div>Onboarding - ' + onboarding[category] + '%</div></div>')
              var divProg = $('<div class="demo-wrapper html5-progress-bar">' + '  <div class="progress-bar-wrapper"> ' + '    <div id="progressbar'
                  + progressbarsId + '" style="height: 2em;"></div>' + '  </div>' + '</div>');
              progressbars[progressbarsId] = {
                "id" : "progressbar" + progressbarsId,
                "value" : onboarding[category]
              };
              progressbarsId++;
              divBody.append(divProg);
              divBody.append($('<div>Maturity - ' + maturity[category] + '%</div>'));
              divProg = $('<div class="demo-wrapper html5-progress-bar">' + '  <div class="progress-bar-wrapper"> ' + '   <div id="progressbar'
                  + progressbarsId + '"  style="height: 2em;"></div></progress>' + '  </div>' + '</div>');
              progressbars[progressbarsId] = {
                "id" : "progressbar" + progressbarsId,
                "value" : maturity[category]
              };
              progressbarsId++;
              divBody.append(divProg);

              var levelMessage = findLevelMessage(maturity[category]);
              divBody.append($('<div>' + levelMessage + '</div>'));

              divCol.append(divHeader);
              divCol.append(divBody);
              $('#showResults').append(divCol);

            });

            $.each(progressbars, function(index, progressbar) {
              $("#" + progressbar.id).progressbar({
                value : progressbar.value
              });
            });
            $('#showResults').append($('<div class="savewrapper"><input type="button" id="btnSave" class="btn" value="Save" style="width: 10%"></div>'));

            $('#btnSave').click(function() {
              if (SessionCount == 0) {
                SendAssessmentData();
              }
            });

            if (window.PIE) {
              $('#btnSave').each(function() {
                PIE.attach(this);
              });

              // $('.ui-progressbar-value').each(function() {
              // PIE.attach(this);
              // });
              //							
              // $('.ui-progressbar').each(function() {
              // PIE.attach(this);
              // });
            }

            return;

          }

//          function generatePDF() {
//            var imgData = 'data:image/jpeg;base64,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';
//
//            var pdf = new jsPDF('p', 'pt', 'letter');
//
//            pdf.addImage(imgData, 'JPEG', 255, 300, 100, 60); // Cache
//            // the
//            // image
//
//            pdf.setFont("helvetica");
//            pdf.setFontType("bold");
//            pdf.setFontSize(24);
//            pdf.setTextColor(100);
//            pdf.text(200, 300, 'DevOps Assessment');
//
//            pdf.addPage(); // starts a new pdf page
//
//            pdf.addImage(imgData, 'JPEG', 40, 20, 100, 60); // Cache
//            // the
//            // image
//
//            pdf.setFont("courier");
//            pdf.setFontSize(16);
//            pdf.setTextColor(0, 0, 0);
//            pdf.text(200, 60, 'Process Assessment Results');
//            pdf.setDrawColor(23, 46, 113);
//            pdf.setLineWidth(0.5);
//            pdf.line(45, 70, 580, 70);
//
//            pdf.setDrawColor(0, 0, 0);
//            source = $('#TablePDF')[0];
//
//            // we support special element handlers. Register them
//            // with
//            // jQuery-style
//            // ID selector for either ID or node name. ("#iAmID",
//            // "div", "span"
//            // etc.)
//            // There is no support for any other type of selectors
//            // (class, of compound) at this time.
//            specialElementHandlers = {
//
//              // element with id of "bypass" - jQuery style
//              // selector
//              '#bypassme' : function(element, renderer) {
//                // true = "handled elsewhere, bypass text
//                // extraction"
//                return true
//              }
//            };
//            margins = {
//              top : 100,
//              bottom : 60,
//              left : 40,
//              width : 522
//            };
//            // all coords and widths are in jsPDF instance's
//            // declared units
//            // 'inches' in this case
//            pdf.fromHTML(source, // HTML string or DOM elem ref.
//            margins.left, // x coord
//            margins.top, { // y coord
//              'width' : margins.width, // max width of content
//              // on PDF
//              'elementHandlers' : specialElementHandlers
//            },
//
//            function(dispose) {
//              // dispose: object with X, Y of the last line add to
//              // the PDF
//              // this allow the insertion of new lines after html
//              pdf.save('DevOpsAssesmentResults.pdf');
//            }, margins);
//          }

        });
if (!window.btoa)
  window.btoa = $.base64.btoa
if (!window.atob)
  window.atob = $.base64.atob