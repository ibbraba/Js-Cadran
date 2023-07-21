document.addEventListener("DOMContentLoaded", (event) => {

    //DOM elements
    let box = document.getElementById("box")
    let cadran = document.getElementById("cadran")
    let tries = document.getElementById("tries")
    let userInput = "";
    let gameResult = document.getElementById("gameResult")
    let afterGameActionButton = document.getElementById("afterGameActionButton")
    let playerNameInput = document.getElementById("playerNameInput")
    let leaderboards = document.getElementById("leaderboard")
    let leaderboardData = document.getElementById("leaderboard-data")
    let gameOutputTitle = document.getElementById("gameOutputTitle")
    let playAgainButton = document.getElementById("playAgainButton")
    let mainTitle = document.getElementById("mainTitle")
    let timer = document.getElementById("timer")

    //GAME elements
    let bestScores = []
    let tryNumber = 0
    let code = getRandomIntInclusive(0, 999)
    console.log("Genrated code :" + code)


    //Dummy fixtures 

    loadDummyFixtures()



    //Create 1-9 buttons 
    for (i = 1; i <= 9; i++) {
        let button = document.createElement("button")
        button.value = i;
        box.appendChild(button)
        button.innerText = i;
        button.classList.add("digit")


    }

    //Create 0 button
    let buttonZero = document.createElement("button")
    buttonZero.value = 0
    buttonZero.id = "zero"
    buttonZero.innerText = 0
    buttonZero.classList.add("digit")
    box.appendChild(buttonZero)





    //CoDE GENERATION
    let generatedCodeArray = Array.from(String(code), Number)
    if (code < 10) {
        generatedCodeArray.unshift(0)
        generatedCodeArray.unshift(0)
    }
    else if (code < 100) {
        generatedCodeArray.unshift(0)
    }

    //CHRONO BAR 
    for(let i=1; i<=90; i++){
        let timeUnitDiv = document.createElement("div")
        timeUnitDiv.style.backgroundColor = "white"
        timeUnitDiv.style.width = "8px"
        timeUnitDiv.style.height = "5px"
        timeUnitDiv.id=`timeunitdiv-${i}`
        timer.appendChild(timeUnitDiv)



    }

    //GAME LOOP
    var buttons = document.querySelectorAll(".digit");
    let userTime = 0
    let chrono = setInterval(() => {
        userTime++
      
        if (userTime > 90) {
            loseScenario()
        }else{
            let currentDiv = document.getElementById("timeunitdiv-" + userTime) 
            currentDiv.style.visibility = "hidden"
        }
    }, "100000")




    buttons.forEach(button => {


        button.addEventListener("click", event => {
            userInput += button.innerText
            cadran.innerText = userInput


            if (userInput.length > 2) {
                tryNumber++;
                let codeCombinaison = document.createElement("p")

                // Coloring each digit
                for (i = 0; i < 3; i++) {
                    let digit = parseInt(userInput.charAt(i))
                    let digitSpan = document.createElement("span")
                    digitSpan.innerText = digit
                    console.log(generatedCodeArray);
                    console.log("Digit= " + digit + " Array[i]= " + generatedCodeArray[i]);


                    if (digit == generatedCodeArray[i]) {

                        digitSpan.style.backgroundColor = "green"


                    } else if (digit != generatedCodeArray[i] && generatedCodeArray.includes(digit)) {

                        digitSpan.style.backgroundColor = "yellow"

                    } else {
                        digitSpan.style.backgroundColor = "red"

                    }

                    codeCombinaison.appendChild(digitSpan)
                }
                tries.appendChild(codeCombinaison)



                //Checking code
                let result = checkCode(userInput, code)


                //WIN SCENARIO 
                if (result == true) {
                    clearInterval(chrono)
                    console.log(("Made in  " + userTime + " seconds"));
                    box.style.visibility = "hidden"
                    cadran.style.visibility = "hidden"
                    gameResult.style.visibility = "visible"

                    afterGameActionButton.addEventListener("click", (event) => {
                        let username = playerNameInput.value
                        console.log(username);

                        if (username.length > 1) {
                            let result = `{"username": "${username}", "score": ${tryNumber}, "time": "${userTime}"}`
                            localStorage.setItem("cadran-lastscore", result)
                            console.log("Stored last record: " + result);


                            updateLeaderboard(username, tryNumber, userTime)
                            fetchBestScores()

                            gameResult.style.visibility = "hidden"
                            leaderboards.style.visibility = "visible"
                            playAgainButton.style.visibility = "visible"
                            timer.style.visibility = "hidden"
                        }

                    })


                }

                //LOSE SCENARIO
                if (tryNumber == 6 && result == false) {
                    loseScenario()
                }

                userInput = ""
                cadran.innerText = userInput

            }
        })
    })


    //Reload window to play again
    playAgainButton.addEventListener("click", (event) => {

        location.reload()

    })


    function timeLeft() {
        console.log(timer);
        timer.style.width = (timer.style.width - "4px")
    }

    function loseScenario() {
        clearInterval(chrono)
        console.log("Perdu");
        box.style.visibility = "hidden"
        cadran.style.visibility = "hidden"

        fetchBestScores()
        mainTitle.innerText = "Perdu"
        leaderboards.style.visibility = "visible"

        playAgainButton.style.visibility = "visible"
        timer.style.visibility = "hidden"
    }

    //Load some fixture for leaderbord if empty
    function loadDummyFixtures() {

        let count = 0
        if (localStorage.length > 0) {
            console.log("Storage legth: " + localStorage.length);

            for (i = 1; i < localStorage.length++; i++) {
                let key = localStorage.key(i);
                console.log("key: " + key);



                if (key.includes("cadran-leaderboard")) {
                    console.log("Fixture : " + localStorage.getItem(key));
                    bestScores.push(JSON.parse(localStorage.getItem(key)))
                    count++
                    console.log("Bestcores on init :" + bestScores.length);
                };


            }

        }

        //Dummy fixtures if empty leaderboard
        if (count == 0) {
            localStorage.setItem("cadran-leaderboard-1", `{"username": "Ibra", "score": "3", "time": "40"}`)
            localStorage.setItem("cadran-leaderboard-2", `{"username": "John", "score": "4", "time": "25"}`)
            localStorage.setItem("cadran-leaderboard-3", `{"username": "Amar Jr", "score": "4", "time": "40"}`)
            localStorage.setItem("cadran-leaderboard-4", `{"username": "Sara", "score": "5", "time": "21"}`)
            localStorage.setItem("cadran-leaderboard-5", `{"username": "Cisco", "score": "5", "time": "40"}`)
            localStorage.setItem("cadran-leaderboard-6", `{"username": "Ness", "score": "5", "time": "55"}`)
            localStorage.setItem("cadran-leaderboard-7", `{"username": "Laure", "score": "6", "time": "30"}`)
            localStorage.setItem("cadran-leaderboard-8", `{"username": "Eldorado", "score": "6", "time": "35"}`)
            localStorage.setItem("cadran-leaderboard-9", `{"username": "Future", "score": "6", "time": "40"}`)
            localStorage.setItem("cadran-leaderboard-10", `{"username": "Simmons", "score": "6", "time": "49"}`)

            for (i = 1; i < localStorage.length++; i++) {
                let key = localStorage.key(i);
                console.log("key: " + key);



                if (key.includes("cadran-leaderboard")) {

                    bestScores.push(JSON.parse(localStorage.getItem(key)))
                    count++
                    console.log("Bestcores on init :" + bestScores.length);
                };


            }


        } else {
            console.log("Leaderboard already exists");
        }
    }

    function checkCode(userInput, generatedCode) {

        let inputNumber = parseInt(userInput)
        if (userInput == generatedCode) {
            console.log("Code OK");

            return true;

        } else {
            console.log(userInput + ": Invalid Code")
            return false;
        }
    }


    function fetchBestScores() {


        bestScores.sort(function (a, b) {
            if (a.score === b.score) {
                return a.time - b.time
            }
            return a.score - b.score

        });
        console.log("Bestscores");
        bestScores.forEach(bestscore => {

            let scorediv = document.createElement("div")
            let username = document.createElement("p")
            let score = document.createElement("p")
            let time = document.createElement("p")

            username.innerText = bestscore.username
            score.innerText = bestscore.score
            time.innerText = bestscore.time

            leaderboardData.appendChild(scorediv)
            scorediv.appendChild(username)
            scorediv.appendChild(score)
            scorediv.appendChild(time)
        });


    }


    function updateLeaderboard(username, score, time) {

        //sort array 
        bestScores.sort(function (a, b) {
            if (a.score === b.score) {
                return a.time - b.time
            }
            return a.score - b.score

        });

      
        let result = `{"username": "${username}", "score": "${score}", "time": "${time}"}`;


        let lastLeaderboardscore = bestScores[bestScores.length - 1].score;
        let lastLeaderboardtime = bestScores[bestScores.length - 1].time;

        if (score <= lastLeaderboardscore) {
            //No new entry if score too low
            if(score == lastLeaderboardscore && lastLeaderboardtime <= time ){
                return
            }

            //Remove worst score in leaderboard
            if (bestScores.length > 9) {
                console.log("Removing last on leaderboard");
                bestScores.pop();

            }


            //Add score to bestscore array

            bestScores.push(JSON.parse(result));


            //sort array with new values
            bestScores.sort(function (a, b) {
                if (a.score === b.score) {
                    return a.time - b.time
                }
                return a.score - b.score

            });

            //Rewrite records in localstorage 
            for (let i = 0; i < bestScores.length; i++) {


                console.log("Rewrite in memory: " + `{"username": "${bestScores[i].username}", "score": ${bestScores[i].score}}, `);
                localStorage.setItem("cadran-leaderboard-" + i, `{"username": "${bestScores[i].username}", "score": "${bestScores[i].score}", "time": "${bestScores[i].time}"}`)


            }



        }

    }





    // On renvoie un entier aléatoire entre une valeur min (incluse)
    // et une valeur max (incluse).
    // Attention : si on utilisait Math.round(), on aurait une distribution
    // non uniforme !
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }







})