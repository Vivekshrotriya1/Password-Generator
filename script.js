// console.log('vivekm');

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateButton");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initially
let password="";
let passwordLength=10;
let checkCount=0;//ye bata raha hai ki kitne check box include hai
handleSlider();

// set strength circle color to grey
// console.log('vivek');
setIndicator("#ccc");

// set passwordlength
// iska kaam itna password ko ui per dalna 
 function handleSlider(){
  inputSlider.value=passwordLength;
  lengthDisplay.innerText=passwordLength;
//   or kuch bhimkrna chahiye kya isme? H.W
   const min=inputSlider.min;
   const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";


 }

//  input parameter wala color set kr deta hai
 function setIndicator(color){
    // console.log('vivek');
    indicator.style.backgroundColor= color;
    // shadow dalni hai H.W
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
 }
 
//  min-max ki range me ek nymber dega
function getRndInteger(min,max){
  return  Math.floor(Math.random() *(max-min))+min; 
}

// 0-9 ki range me ek number dega
function generateRandomNumber(){
    return getRndInteger(0,9);
}

// 97-123 ke range me ek character dega
function generateLowerCase(){
   return String.fromCharCode(getRndInteger(97,123));
}

// 65-91 ke range me ek character dega
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91 ));
 }

function generateSymbol(){
  const randNum = getRndInteger(0,symbols.length);
  return symbols.charAt(randNum);
}

// dekhta hai ki konse se checked hai ya konse se checked nhi unke basis per strength ka color dega
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// mera jo bhi content hai input password display ke andar hai usko clipboard ke copy krta hai using navigator.clipboard.writeText
 async function copyContent(){
   try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
   }
   catch(e){
     copyMsg.innerText="Failed";
   }

//    to make copy wala span visible
   copyMsg.classList.add("active");

   setTimeout( () =>{
       copyMsg.classList.remove("active");
   },2000);
    
}

//Password ko shuffle karne ke liye
// ye algo hoti hai --Fisher yates algorithm
function shufflePassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        // random j find out kr rahe hai
        const j = Math.floor(Math.random() * (i + 1));
        // Swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// count karega kitne checkbox tick hai
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    // special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
// checkBox per event laga do 
allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// // inputslider ke uupar eventListener laga do
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

// copy button per eventListener laga do
copyBtn.addEventListener('click',()=> {
    if(passwordDisplay.value)
        copyContent();
})

// generate password per event laga do
generateBtn.addEventListener('click',()=>{
//    none of the checkbox are selected
   if(checkCount<=0)return ;
    //  passwordLength < checkCount
    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // let's start the journey to find new password
      console.log("starting the journey");
    // remove old password
    password="";

    // let's put the stuff mentioned by checkbox

 
    let funcArr = [];
     

    if (uppercaseCheck.checked) 
        funcArr.push(generateUpperCase);
    
    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if (numbersCheck.checked) 
        funcArr.push(generateRandomNumber);
    
    if (symbolsCheck.checked) 
        funcArr.push(generateSymbol);
    

    // compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    
      console.log("compulsory addition done");

    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length ;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        console.log("randIndex"+ randIndex)
        password+= funcArr[randIndex]();
    }

    console.log("Remaining addition done");


    // shuffle the password
    password=shufflePassword(Array.from(password));
   console.log("Shuffking done");

    // show in UI
    passwordDisplay.value=password;
    console.log("UI addition done");
    // claculate strength
    calcStrength(); 
})