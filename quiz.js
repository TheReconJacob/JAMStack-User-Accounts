const db = firebase.firestore();
var $progressValue = 0;



/** Render quiz :: Question and option **/
function renderQuiz(){
    var quizzes = document.getElementById("quizzes");
    db.collection("Quizzes").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            var quiz = document.createElement('div');
            quiz.className = 'row';
            quiz.insertAdjacentHTML('afterbegin',`<button onclick="openQuiz(this.parentElement.children)" class="openQuiz">Open ${doc.data().Name}</button>
            <button onclick="closeQuiz(this.parentElement.children)" class="closeQuiz" style="display: none;">Close ${doc.data().Name}</button>
            <div class="multipleChoiceQues" style="display: none;">
                <h2 class="mc_quiz">
                ${doc.data().Name}
                </h2>
                <div class="quizBox">
                    <div class="question"></div>
                    <div class="answerOptions${doc.id}"></div>
                    <div class="buttonArea">
                        <button id="submit" class="hidden">Submit</button>
                    </div>
                </div>
            </div>
            <div class="resultArea" style="display: none;">
                <div class="resultPage1">
                    <div class="briefchart" style="display: none;">
                    <h2>Your Result</h2>
                        <svg height="300" width="300" class="_cir_progress">
                            <g>
                                <rect x="0" y="1" width="30" height="15" fill="#858585" />
                                <text x="32" y="14" font-size="14" class="_text_incor">Incorrect : 0</text>
                            </g>
                            <g>
                                <rect x="160" y="1" width="30" height="15" fill="#ffffff" />
                                <text x="192" y="14" font-size="14" class="_text_cor">Correct : 0</text>
                            </g>
                            <circle
                                class="_cir_P_x"
                                cx="150"
                                cy="150"
                                r="120"
                                stroke="#858585"
                                stroke-width="20"
                                fill="none"
                                onmouseout="evt.target.setAttribute('stroke','#858585');"
                            ></circle>
        
                            <circle
                                class="_cir_P_y"
                                cx="150"
                                cy="150"
                                r="120"
                                stroke="#ffffff"
                                stroke-width="20"
                                stroke-dasharray="0,1000"
                                fill="none"
                                onmouseover="evt.target.setAttribute('stroke', 'rgba(150, 128, 137,0.7)');"
                                onmouseout="evt.target.setAttribute('stroke','#ffffff');"
                            ></circle>
                            <text x="50%" y="50%" text-anchor="middle" stroke="none" stroke-width="1px" dy=".3em" class="_cir_Per">0%</text>
                        </svg>
                    </div>
                </div>
            </div>
            <p class="quizUser">Made by ${doc.data().User_Email}</p>`);
            doc.ref.collection(`Questions`).get().then((subSnapshot) => {
              subSnapshot.docs.forEach(subDoc => {
                var quizdataclone=document.createElement("form");
                quizdataclone.className = "options"
                var quizdatatitle=document.createElement("h3");
                quizdatatitle.innerHTML = subDoc.data().Question_Text
                quizdataclone.appendChild(quizdatatitle);
                subDoc.ref.collection("Answers").get().then((subSubSnapshot) => {
                  var i = 0;
                  subSubSnapshot.docs.forEach(subSubDoc => {
                    quizdatatitle.insertAdjacentHTML(`afterend`,
                    `<li class="myoptions">
                        <input value="${subSubDoc.data().Answer_Text}" name="optRdBtn" type="radio" id="rd_${i}" data-Correct=${subSubDoc.data().Correct}>
                        <label for="rd_${i}">${subSubDoc.data().Answer_Text}</label>
                      </li>`
                    )
                    i++;
                  })
                  document.getElementsByClassName(`answerOptions${doc.id}`)[0].appendChild(quizdataclone);
                })
              })
            })


            quizzes.appendChild(quiz);
        })
    })
}
function openQuiz(quiz){
    for (i = 0; i < quiz.length; i++) {
        if (quiz[i].tagName == "BUTTON" && quiz[i].className == "openQuiz") {
            quiz[i].style.display = "none";
        }
        else {
            quiz[i].style.display = "";
        }
    }
}

var scorepercentage=0;
var correct=0;
var incorrect=0;

function closeQuiz(quiz){
    for (i = 0; i < quiz.length; i++) {
        if (quiz[i].tagName == "BUTTON" && quiz[i].className == "openQuiz") {
            quiz[i].style.display = "";
            quiz[2].style.display = "none";
            correct -= correct;
            incorrect -= incorrect;
            scorepercentage -= scorepercentage;
        }
        else {
            quiz[i].style.display = "none";
            quiz[3].getElementsByClassName("briefchart")[0].style.display = "none";
            var radio = document.getElementsByName("optRdBtn");
            for (var i = 0; i < radio.length; i++) {
              radio[i].checked = false;
            }
        }
    }
}
  

  /*** Get percentage for chart **/
  
  /** count right and wrong answer number **/
  function countAnswers(results){
  
    var countCorrect=0, countWrong=0;
  
    for(var i=0;i<results.length;i++){
      if(results[i].iscorrect==true)  
          countCorrect++;
      else countWrong++;
    }
  
    return [countCorrect, countWrong];
  }
  
  
  /** Total score pie chart**/
  function totalPieChart(_upto, _correct, _incorrect) {
  
     $("._cir_progress").find("._text_incor").html("Incorrect : "+_incorrect);
     $("._cir_progress").find("._text_cor").html("Correct : "+_correct);
  
     var unchnagedPer=_upto;
     
      _upto = (_upto > 100) ? 100 : ((_upto < 0) ? 0 : _upto);
      var _progress = 0;
  
      var _cir_progress = $("._cir_progress").find("._cir_P_y");
      var _text_percentage = $("._cir_progress").find("._cir_Per");
  
      var _input_percentage;
      var _percentage;
  
      var _sleep = setInterval(_animateCircle, 25);
  
      function _animateCircle() {
        //2*pi*r == 753.6 +xxx=764
          _input_percentage = (_upto / 100) * 764;
          _percentage = (_progress / 100) * 764;
  
          _text_percentage.html(_progress + '%');
  
          if (_percentage >= _input_percentage) {
              _cir_progress.attr("stroke-dasharray",_percentage + ',764');
              _text_percentage.html('<tspan x="50%" dy="0em">'+unchnagedPer + '% </tspan><tspan  x="50%" dy="1.9em">Your Score</tspan>');
              clearInterval(_sleep);
          } else {
  
              _progress++;
  
              _cir_progress.attr("stroke-dasharray",_percentage + ',764');
          }
      }
  }
   
  
  function openQuiz(quiz){
      for (i = 0; i < quiz.length; i++) {
          if (quiz[i].tagName == "BUTTON" && quiz[i].className == "openQuiz") {
              quiz[i].style.display = "none";
          }
          else {
              quiz[i].style.display = "";
          }
      }
  }
 
  $(document).ready(function() {
  
    renderQuiz();
  
    $(document).on('click','#submit',function(e){
      e.target.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("briefchart")[0].style.display = "";``
      var radio = e.target.parentElement.parentElement.querySelectorAll("[data-correct='true']")
      for (var i = 0; i < radio.length; i++) {
        console.log(radio[i].checked)
        if(radio[i].checked) {
          correct += 1;
        }
      }
      scorepercentage=(correct / e.target.parentElement.parentElement.getElementsByClassName("options").length) * 100;
      scorepercentage=Math.round(scorepercentage);
      incorrect += e.target.parentElement.parentElement.getElementsByClassName("options").length - (incorrect + correct);
      e.target.parentElement.parentElement.parentElement.style.display = "none";
      e.target.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("resultArea")[0].style.display = "";
      totalPieChart(scorepercentage, correct, incorrect);
    });
  });

  var question_number = 1;
  $(document).on('click','.add-question',function(e){
    e.preventDefault();
    let questionSets = document.querySelectorAll("div[id^='questionSet']");
    if(questionSets.length >= 9) {
      alert("You can only have up to 9 questions per quiz");
    }
    else {
      e.stopPropagation();
      e.target.insertAdjacentHTML("beforebegin",
      `<br />
      <div id="questionSet${question_number}">
      <input type="text" placeholder="Question ${question_number}" class="question" required />
      <input type="text" placeholder="Correct Answer" class="CorrectAnswer" required />
      <input type="text" placeholder="Wrong Answer 1" class="Answer1" required />
      <input type="text" placeholder="Wrong Answer 2" class="Answer2" required />
      <input type="text" placeholder="Wrong Answer 3" class="Answer3" required />
      </div>
      `)
      question_number++;
    }
  });
  $(document).on('click','.submit-quiz',function(e){
    e.preventDefault();
    setTimeout(function(){window.location.reload();},1000);
    var quizName = document.getElementById("quiz-name").value;
    db.collection("Increment").get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        db.collection("Quizzes").doc(`${doc.data().Number}`).set({
          Name: quizName,
          User_Email: firebase.auth().currentUser.email,
          User_Id: firebase.auth().currentUser.uid
        })
        db.collection("Quizzes").doc(`${doc.data().Number}`).get().then(function(subDoc) {
          for (var i = 1; i < question_number; i++) {
              var questionText = document.getElementById(`questionSet${i}`).getElementsByClassName(`question`)[0];
              subDoc.ref.collection(`Questions`).doc(`${i}`).set({
                Question_Text: questionText.value
              })
          }
            subDoc.ref.collection("Questions").get().then((subSnapshot) => {
              var i = 1;
                subSnapshot.docs.forEach(subSubDoc => {
                    for (var n = 1; n < 4; n++) {   
                  console.log(`questionSet${i}`)
                  console.log(subSubDoc);
                      var wrongAnswer = document.getElementById(`questionSet${i}`).getElementsByClassName(`Answer${n}`)[0];
                      subSubDoc.ref.collection(`Answers`).doc().set({
                          Answer_Text: wrongAnswer.value,
                          Correct: false
                      })
                    }           
                  var rightAnswer = document.getElementById(`questionSet${i}`).getElementsByClassName(`CorrectAnswer`)[0];
                  subSubDoc.ref.collection(`Answers`).doc().set({
                    Answer_Text: rightAnswer.value,
                    Correct: true
                }) 
                i++;
              })
            })
          
        })
        var newNumber = doc.data().Number + 1;
        db.collection("Increment").doc("0IAzDVUg9wmWxPxBQopp").update({Number: newNumber});
  })
})
  });