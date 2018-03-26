// Create canvas for SVG
var draw    = SVG('diagram').size(280, 280);
var rect    = draw.rect(280, 280).attr({ fill: '#fbfbfb'});

// Static elements
// Can drawStrings() and drawFrets() be condensed into one function?
function drawStrings(){
    var strings = [];
    var x = 40,
        y1 = 40,
        y2 = 240;

    for(var i = 1; i <= 6; i++){
        strings[i] = draw.line(x, y1, x, y2).stroke({width: 1});
        x += 40;
    };
    return strings;
};
function drawFrets(){
    var frets = [];
    var x1 = 40,
        x2 = 240,
        y = 40;

    for(var i = 1; i <= 5; i++){
        frets[i] = draw.line(x1, y, x2, y).stroke({width: 1});
        y += 50;
    };
    return frets;
};
function drawStringNames(){
    var stringLetters = ["E", "A", "D", "G", "B", "E"],
        stringNames   = []
    var x = 40;

    for(var i = 0; i < 6; i++){
        stringNames[i] = draw.text(stringLetters[i]).cx(x).cy(255).fill("#444444").font({family: "Times New Roman"});
        x += 40;
    };
    return stringNames;
};

// Variable elements
function drawNut(){
    var rect = draw.rect(205, 5).radius(3).cx(140).cy(40).fill("#444444");
}
function drawDots(x, y){
    if(y > 15){         // y=15 is the nut
        var circle = draw.circle(30).cx(x).cy(y).fill("#444444");
    }
}
function drawNums(i, x, y, fill, font){
    if(Number(fingers[i]) > 0){         // fingers array from chordslist.js
        var text = draw.text(fingers[i]).cx(x).cy(y).fill(fill).font(font);
    }
}
function drawOpenStrings(i, x, attr){
    if(frets[i] === "0"){
        var circle = draw.circle(15).cx(x).cy(25).attr(attr);
    }
}
function drawUnplayedStrings(i, x, fill, attr){
    if(frets[i] === "x"){
        var text = draw.text("x").cx(x).cy(25).fill(fill).font(attr);
    }
}
function drawFingering(i, x, y){
    drawUnplayedStrings(i, x, "#444444", {family: "Times New Roman", size: 18});
    drawDots(x, y);
    drawNums(i, x, y, "#fbfbfb", {family: "Times New Roman"});
    drawOpenStrings(i, x, {fill: "#fbfbfb", stroke: "#444444", "stroke-width": 1});
}

// Generate a diagram
function drawPosition(){
    var x = 40;
    var fretsArray = [];
    var fingersArray = [];
    var posNum = $(".variants.selected").attr("id");      // Position number based on button selected in app
    var barre = chord.positions[(posNum - 1)].barres;     // Convert posNum to array number

    // Get highest and lowest frets
    for(var i = 0; i < frets.length; i++){
        var hexNum = parseInt(frets[i], 16);              // Convert hex to decimal in chordslist:frets
        var fretNum = Number(hexNum);                     // These 3 lines are repeated elsewhere... functionable?

        if(fretNum > 0){
            fretsArray.push(fretNum);
        }

        var lowestFret  = Math.min.apply(Math, fretsArray);
        var highestFret = Math.max.apply(Math, fretsArray);
    }

    var q = (1 + (1 - lowestFret));                       // q helps determine whether nut or fret number needs drawing

    if(q >= 0 && highestFret - lowestFret !== 3){         // q greater than 0 AND biggest gap isn't 3
        for(var i = 0; i < frets.length; i++){

            var hexNum = parseInt(frets[i], 16);
            var fretNum = Number(hexNum);

            var y = 15 + (fretNum * 50)
            drawFingering(i,x,y)
            drawNut()
            x+=40;

            fingersArray.push(fretNum);
        }
        if(barre){
            var adjFingArr = [];
            for(var i = 0; i < fingersArray.length; i++){
                adjFingArr.push(fingersArray[i]);
            }

            var barreArray = [];
            for(var i = 0; i < adjFingArr.length; i++){
                if(adjFingArr[i] === barre){
                    barreArray.push(i);
                }
            }
            var barreStart = barreArray[0] + 1;
            var barreEnd = barreArray[barreArray.length -1] + 1;
            var barreLength = ((barreEnd - barreStart) * 40) + 30;
            var barreY = (barre * 50) + 15;
            var barreCX = ((barreStart + barreEnd) / 2) * 40

            var rect = draw.rect(barreLength, 30).radius(15).cx(barreCX).cy(barreY).fill("#444444");

            var barreFret = chord.positions[(posNum - 1)].barres;
            for(var i = 0; i < fingersArray.length; i++){
                if(fingersArray[i] === barreFret){
                    var y = (barre * 50) + 15;
                    var x = (i + 1) * 40
                    var text = draw.text(barre.toString()).cx(x).cy(y).fill("#eeeeee").font({family: "Times New Roman"})
                }
            }

        }
    } else {
        for(var i = 0; i < frets.length; i++){

            var hexNum = parseInt(frets[i], 16);
            var fretNum = Number(hexNum);
            var adjNum = fretNum + (1 - lowestFret);

            var y = 15 + (adjNum * 50)
            drawFingering(i,x,y)
            x+=40;

            fingersArray.push(fretNum);
        }

        if(barre){
            var adjFingArr = [];
            for(var i = 0; i < fingersArray.length; i++){
                var num = fingersArray[i]
                var newNum = num + (1 - lowestFret);
                adjFingArr.push(newNum);
            }

            barre += (1 - lowestFret);
            var barreArray = [];
            for(var i = 0; i < adjFingArr.length; i++){
                if(adjFingArr[i] === barre){
                    barreArray.push(i);
                }
            }
            var barreStart = barreArray[0] + 1;
            var barreEnd = barreArray[barreArray.length -1] + 1;
            var barreLength = ((barreEnd - barreStart) * 40) + 30;
            var barreY = (barre * 50) + 15;
            var barreCX = ((barreStart + barreEnd) / 2) * 40

            var rect = draw.rect(barreLength, 30).radius(15).cx(barreCX).cy(barreY).fill("#444444");

            var barreFret = chord.positions[(posNum - 1)].barres;
            for(var i = 0; i < fingersArray.length; i++){
                if(fingersArray[i] === barreFret){
                    var y = (barre * 50) + 15;
                    var x = (i + 1) * 40
                    var text = draw.text(barre.toString()).cx(x).cy(y).fill("#eeeeee").font({family: "Times New Roman"})
                }
            }
        }

        var position = draw.text(lowestFret.toString() + ".").cx(16).cy(67).fill("#444444").font({family: "Times New Roman", size: 12});
    }
}

// Put it all together
function drawChordDiagram(){
    drawStrings();
    drawFrets();
    drawStringNames();
    drawPosition();
};

function newRandomChord(){
    chord = chords[Math.floor(Math.random()*chords.length)];         // Choose a random chord
    frets = chord.positions[0].frets;                                // Get fret dots
    fingersReversed = chord.positions[0].fingers;                    // Get finger numbers
    fingers = fingersReversed.split('').reverse().join('');          // Reverse fingers string, as it is given in high-low string order
    $("h2").html(chord.key + chord.suffix)
}

function showVariant(){
    $(".variants").on("click", function(){
        var variant = $(this).attr("id");
        $(".variants").removeClass("selected");
        $(this).addClass("selected");
        var variantNum = (variant - 1);
        frets = chord.positions[variantNum].frets;
        fingersReversed = chord.positions[variantNum].fingers;
        fingers = fingersReversed.split('').reverse().join('');
        $("svg").empty();
        drawChordDiagram();
    });
}

function revealChordDiagram(){
    $("#diagram").css("visibility","visible");
    for(var i = 0; i < chord.positions.length; i++){
        $("#" + (i+1)).css("visibility","visible");
    }
    $(".main").text("New");
}

function hideChordDiagram(){
    $("svg").empty();
    $("#diagram").css("visibility","hidden");
    $(".variants").css("visibility","hidden");
    $(".variants").removeClass("selected");
    $("#1").addClass("selected");
    $(".main").text("Reveal");
}

function buttonClick(){
    $(".main").on("click", function(event){
        if(!revealedChord){
            revealedChord = true;
            revealChordDiagram();
        } else {
            revealedChord = false;
            newRandomChord();
            hideChordDiagram();
            drawChordDiagram();
        }
    });
};

function init(){
    newRandomChord();
    drawChordDiagram();
    buttonClick();
    showVariant();
}


// Main Program
var numPositions = 5;
var revealedChord = false;

init();
