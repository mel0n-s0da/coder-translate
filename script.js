var inputLanguage = "Ruby";
var outputLanguage = "Ruby"; 

// input language buttons 
var inRubyButton = document.getElementById("inRuby");
var inPythonButton = document.getElementById("inPython");
var inJavaButton = document.getElementById("inJava");

// output language buttons 
var outRubyButton = document.getElementById("outRuby");
var outPythonButton = document.getElementById("outPython");
var outJavaButton = document.getElementById("outJava");
 
// get input langugae and change image 
var inImage = document.getElementById("inImage"); 
var inButtons = [document.getElementById("inRuby"), document.getElementById("inPython"), document.getElementById("inJava")]; 
inButtons.map( block => {
  block.addEventListener("click", (e) => {
    inputLanguage = e.target.innerText; 
    inImage.src = "images/" + inputLanguage + '.png'; 
  });
}); 

// get output langugae and change image 
var outButtons = [document.getElementById("outRuby"), document.getElementById("outPython"), document.getElementById("outJava")]; 
outButtons.map( block => {
  block.addEventListener("click", (e) => {
    outputLanguage = e.target.innerText; 
    outImage.src = "images/" + outputLanguage + '.png';  
  });
}); 

// get the textareas
var inputCodeBox = document.getElementById("inputCode");
var outputCodeBox = document.getElementById("outputCode");

var inputCode = ""; 
var outputCode = "";  

// translate! 
var translateButton = document.getElementById("translateButton"); 
translateButton.addEventListener("click", (e) => {
  console.log("input:" + inputLanguage); 
  console.log("output:" + outputLanguage);
  console.log("\n");
  // get the input code 
  inputCode = inputCodeBox.value; 
  // display it in output code 
  outputCode = translateCode(inputLanguage, outputLanguage, inputCode); 
  console.log(outputCode); 
  outputCodeBox.value = outputCode;  
});

function translateCode(inputLanguage, outputLanguage, inputCode) {
  console.log(inputLanguage); 
  console.log(outputLanguage);
  if ((inputLanguage == "Ruby") && (outputLanguage == "Ruby")) {
    return inputCode; 
  } else if ((inputLanguage == "Ruby") && (outputLanguage == "Python")) {
    return rubyToPython(inputCode); 
  } else if ((inputLanguage == "Ruby") && (outputLanguage == "Java")) {
    return rubyToJava(inputCode); 
  } else if ((inputLanguage == "Python") && (outputLanguage == "Python")) {
    return inputCode; 
  } else if ((inputLanguage == "Python") && (outputLanguage == "Ruby")) {
    return pythonToRuby(inputCode); 
  } else if ((inputLanguage == "Python") && (outputLanguage == "Java")) {
    return pythonToJava(inputCode);
  } else if ((inputLanguage == "Java") && (outputLanguage == "Java")) {
    return inputCode; 
  } else if ((inputLanguage == "Java") && (outputLanguage == "Ruby")) {
    return javaToRuby(inputCode); 
  } else if ((inputLanguage == "Java") && (outputLanguage == "Python")) {
    return javaToPython(inputCode);
  } else {
    return "could not translate \n" + inputCode; 
  }
}

// ruby to python 
function rubyToPython(inputCode) {
  /* PRINT STATEMENTS */
  // change all the "puts" to "print" (you can't use puts anywhere else :(( ))
  inputCode = inputCode.split("puts").join("print");

  /* IF STATEMENTS proper versions */
  // replace every "end" with nothing 
  inputCode = inputCode.split("end").join("");
  // replace every "elsif" with "elif"
  inputCode = inputCode.split("elsif").join("elif");
  // add a colon after every if and elif and else 
  codeLines = inputCode.split("\n");
  for (let i = 0; i < codeLines.length; i++) {
    if ((codeLines[i].includes("if")) || (codeLines[i].includes("elif")) || (codeLines[i].includes("else"))) {
      codeLines[i] = codeLines[i].concat(":"); 
      console.log(codeLines[i].concat(":")); 
    }
  }

  /* FOR LOOPS with numbers */
  inputCode = codeLines.join("\n"); 
  // remove "do" with nothing
  inputCode = inputCode.split("do").join("");
  // x…y to range(x, y + 1)
  // add a clon after every for statement
  codeLines = inputCode.split("\n");
  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].includes("for")) {
      var words = codeLines[i].split(" "); // 3rd element is x...y
      var changeWord = words[3].split("."); // getting numbers 
      words[3] = "range(" + changeWord[0] + ", " + changeWord[changeWord.length - 1] + "):"; // adding colon here
      codeLines[i] = words.join(" ");
    }
  }
  return codeLines.join("\n"); 
}

// python to ruby 
function pythonToRuby(inputCode) {
  /* PRINT STATEMENTS */
  inputCode = inputCode.split("print").join("puts");

  /* IF STATEMENTS proper versions */
  // replace every ":" with nothing 
  inputCode = inputCode.split(":").join("");
  // replace every "elif" with "elsif"
  inputCode = inputCode.split("elif").join("elsif");
  // add "end" to the end of the if statement 
  codeLines = inputCode.split("\n");
  var insideElse = false; 
  for (let i = 0; i < codeLines.length; i++) {
    if (insideElse == true) {
      // else then add a line right before wiht an "end"
      if (i == codeLines.length - 1) {
        codeLines[i + 1] = "end"
      }
      // else then add an end between the lines 
      else if (!(codeLines[i + 1][0] == " ")) {
        codeLines.splice(i + 1, 0, "end");
      }
      insideElse = false; 
    } 
    if (codeLines[i].includes("else")) {
      insideElse = true; 
    }
  }

  /* FOR LOOPS with numbers */
  // changes the range to ... form 
  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].includes("for")) {
      var words = codeLines[i].split(" "); // 3rd element is range(x, y)
      // extract the start and end numbers 
      var start = ((words[3].split("("))[1].split(","))[0];  
      var end = (words[4].split(")"))[0]; 

      // combine the numbers 
      words[3] = start + "..." + end; 
      words[4] = ""; 

      codeLines[i] = words.join(" ") + "do"; 
    }
  }  

  // adds an end to the end of the for loop 
  var insideFor = false; 
  for (let i = 0; i < codeLines.length; i++) {
    if (insideFor == true) {
      // else then add a line right before wiht an "end"
      if (i == codeLines.length - 1) {
        codeLines[i + 1] = "end"
      }
      // else then add an end between the lines 
      else if (!(codeLines[i + 1][0] == " ")) {
        codeLines.splice(i + 1, 0, "end");
      }
      insideFor = false; 
    } 
    if (codeLines[i].includes("for")) {
      insideFor = true; 
    }
  }

  return codeLines.join("\n"); 
}

// python to java 
function pythonToJava(inputCode) {
  /* PRINT STATEMENTS */
  codeLines = inputCode.split("\n");
  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].includes("print")) {
      codeLines[i] = codeLines[i].split("print").join("System.out.println") + ";";
    }
  }

  /* VARIABLE DECLARATIONS */
  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].includes(" = ")) {
      if (codeLines[i].includes('"')) { // String 
        codeLines[i] = "String " + codeLines[i] + ";"
      } else { // int 
        codeLines[i] = "int " + codeLines[i] + ";"
      } 
    }
  }

  /* IF STATEMENTS */ 
  for (let i = 0; i < codeLines.length; i++) {
    // wrap all the boolean expressions
    if (codeLines[i].includes("elif") || codeLines[i].includes("if")) {
      words = codeLines[i].split(" ");
      words.splice(1, 0, "("); 
      codeLines[i] = words.join(" "); 

      characters = codeLines[i].split(""); 
      characters.splice(characters.length - 1, 0, " )"); 
      codeLines[i] = characters.join("");
    }
    // replace and and or with && and ||, respectively 
    words = codeLines[i].split(" "); 
    if (words.includes("or") || words.includes("and")) {
      words[words.indexOf("or")] = "||"
      words[words.indexOf("and")] = "&&"
    }
    codeLines[i] = words.join(" "); 

    // replace elif with else if 
    codeLines[i] = codeLines[i].split("elif").join("else if"); 
  }
  // the brackets!!
  var openBracket = false;  
  for (let i = 0; i < codeLines.length; i++) {
    if (openBracket == true) {
      if (i == codeLines.length - 1) {
        codeLines[i + 1] = "}"
      } else if (!(codeLines[i + 1][0] == " ")) {
        codeLines.splice(i + 1, 0, "}");
      }
      openBracket = false; 
    }
    if (codeLines[i].includes(":")) {
      // replace : with {
      codeLines[i] = codeLines[i].split(":").join(" {");
      // 
      openBracket = true;
    }
  } 

  /* FOR LOOPS with numbers */
  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].includes("for")) {
      var words = codeLines[i].split(" "); // 3rd element is range(x, y)
      // extract the start and end numbers 
      var start = ((words[3].split("("))[1].split(","))[0];  
      var end = (words[4].split(")"))[0]; 
      var variable = words[1]; 
      
      console.log("start, end, var"); 
      console.log(start, end, variable); 

      codeLines[i] = "for (int " + variable + " = " + start + "; " + variable + " < " + end + "; " + variable + "++) {" 
    }
  } 

  /* ADDING MAIN CLASS */
  for (let i = 0; i < codeLines.length; i++) {
    codeLines[i] = "    " + codeLines[i]; 
  }
  codeLines.splice(0, 0, "class Main {"); 
  codeLines.splice(1, 0, "  public static void main(String[] args) {"); 
  codeLines[codeLines.length] = "  }\n}"; 

  console.log("translating the secnd best to the worst");
  return codeLines.join("\n"); 
}

// java to python 
function javaToPython(inputCode) {

  /*  PRINT STATEMENTS  */
  inputCode = inputCode.split("System.out.println").join("print");

  // delete 
  inputCode = inputCode.split("}").join("");
  inputCode = inputCode.split(" {").join(":");
  inputCode = inputCode.split(" else if").join("elif");
  inputCode = inputCode.split(" else").join("else");
  inputCode = inputCode.split("int ").join("");
  inputCode = inputCode.split("String ").join("");
  inputCode = inputCode.split("&&").join("and");
  inputCode = inputCode.split("||").join("or");

  /* DELETE MAIN CLASS */
  // delete class declarations
  codeLines = inputCode.split("\n");
  codeLines.splice(0, 2); 
  codeLines.splice(codeLines.length - 2, 2);
  // delete spaces at the front 
  for (let i = 0; i < codeLines.length; i++) {
    codeLines[i] = codeLines[i].slice(4);
  }

  /* FOR LOOPS */
  for (let i = 0; i < codeLines.length; i++) {
    if (codeLines[i].includes("for")) {
      words = codeLines[i].split(" "); 

      start = words[3].slice(0, words[6].length - 1);
      end = words[6].slice(0, words[6].length - 1); 
      variable = words[1].slice(1); 

      codeLines[i] = "for " + variable + " in range(" + start + ", " + end + "):"; 
    }
  }

  inputCode = codeLines.join("\n"); 

  /* DELETE COLONS */
  inputCode = inputCode.split(";").join("");

  return inputCode; 
}

// java to ruby 
function javaToRuby(inputCode) {
  return pythonToRuby(javaToPython(inputCode)); 
}

// ruby to java 
function rubyToJava(inputCode) {
  return pythonToJava(rubyToPython(inputCode)); 
}

