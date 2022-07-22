// payoffs here are not tied to the table displayed, must be edited separately
//var payoffs = [
//	[ [ 20 , 20 ] , [ 0 , 30 ] ],
//	[ [ 30 , 0 ] , [ 10 , 10 ] ],
//];

var payoffs = [
[[0,0], [-1,1]],
[[-1,1],[0,0]],
]
//payoffs[0,0] = eval(document.getElementById("cc1").value)
//alert(payoffs[0,0])
;

// results display requires TOTALROUNDS >= TOTALOPPONENTS+2
// Easy to fix later
var TOTALROUNDS=20;  
var TOTALOPPONENTS=5;


var opponent=0;
var round;
var state; // 2 is cooperative, 0 is not, 1 is TF2T
var strategy;
var oppstrategy;
var totalpay;
var opptotalpay;
var roundpay=[];
var opproundpay=[];
var finalpay=0;
var oppfinalpay=0;

resetopponent();

function cooperate(){
	strategy=1;
	finishround();
}
function defect(){
	strategy=0;
	finishround();
}

function showscores(){
	var mytable = document.getElementById('PDresult');
	for (r=1;r<mytable.rows.length;r++){
		var myrow=mytable.rows[r];
		myrow.cells[0].innerHTML="";
		myrow.cells[1].innerHTML="";
	   myrow.cells[2].innerHTML="";
	}
	mytable.rows[0].cells[0].innerHTML="Trial";

	for (var i=0; i<roundpay.length; i++) {
		finalpay += roundpay[i];
		oppfinalpay += opproundpay[i];
	}

	finalpay=Math.round(10*finalpay)/10;
	oppfinalpay=Math.round(10*oppfinalpay)/10;


	for (r=1;r<=TOTALOPPONENTS;r++){
		var myrow=mytable.rows[r];
		myrow.cells[0].innerHTML=r;
		myrow.cells[1].innerHTML=roundpay[r-1];
		myrow.cells[2].innerHTML=opproundpay[r-1];
		myrow.cells[0].style.fontWeight="bold";
		myrow.cells[1].style.fontWeight="bold";
		myrow.cells[2].style.fontWeight="bold";
	}
	
	var myrow=mytable.rows[TOTALOPPONENTS+1];
	myrow.cells[0].innerHTML="&nbsp;";

	var myrow=mytable.rows[TOTALOPPONENTS+2];
	myrow.cells[0].innerHTML="TOTAL";
	myrow.cells[1].innerHTML=finalpay;
	myrow.cells[2].innerHTML=oppfinalpay;
	myrow.cells[0].style.fontWeight="bold";
	myrow.cells[1].style.fontWeight="bold";
	myrow.cells[2].style.fontWeight="bold";
	myrow.cells[0].style.color="red";
	myrow.cells[1].style.color="red";
	myrow.cells[2].style.color="red";
}
function submitgame(){
	var resultstring=roundpay.toString()+ "X" + opproundpay.toString();
	resultstring += "XXXX" + finalpay + "X" + oppfinalpay;
	document.myForm.answer.value = resultstring;
	document.myForm.submit();
}

function resetopponent() {
	round=1;
	state=0;
	totalpay=0;
	opptotalpay=0;
	opponent++;
	
	if (opponent>1) {
		var opponentname = document.getElementById('opponentname');
		opponentname.innerHTML="Competitor " + opponent;
		var status = document.getElementById('status');
		status.innerHTML="";
		status = document.getElementById('status2');
		status.innerHTML="";
		resethighlight();
		var mytable = document.getElementById('PDresult');
		for (r=1;r<mytable.rows.length;r++){
			var myrow=mytable.rows[r];
			myrow.cells[1].innerHTML="";
			myrow.cells[2].innerHTML="";
			document.getElementById('bConventional').disabled=false;
			document.getElementById('bSolar').disabled=false;
		}
	}
}

function finishround(){
	// calculate opp strategy from previous state, then update state

 switch (opponent) {
	case 1: // TFT
		oppstrategy = (state>0) ? 1 : 0;
		state = 2*strategy;
		break;
	case 2: // TF2T
		oppstrategy = (state>0) ? 1 : 0;
		state = strategy ? 2 : Math.max(0,state-1); 
		break;
	case 3: // GTS
		oppstrategy = (state>0) ? 1 : 0;
		state = state*strategy; 
		break;
	case 4: // rand
		oppstrategy = (Math.random() > .5)? 1 : 0;
		break;
	case 5: // cheat
		oppstrategy = 0;
		break;
	default: // TFT
		oppstrategy = (state>0) ? 1 : 0;
		state = 2*strategy;
		break;
  }
   //oppstrategy = (Math.random() > .8)? 1 : 0;
	strategyname    =    strategy ? "Left" : "Right" ;
	oppstrategyname = oppstrategy ? "Left" : "Right" ;
	//oppstrategyname = (Math.random() > .5)? 1 : 0 ? "Conventional" : "Solar" ;
	pay = payoffs[1-strategy][1-oppstrategy][0];
	opppay = payoffs[1-strategy][1-oppstrategy][1];
	totalpay += pay;
	opptotalpay += opppay;

	// highlight game outcome
	highlightoutcome('o'+strategy+oppstrategy);

	// update result table 
	var mytable = document.getElementById('PDresult');
	var myrow=mytable.rows[round];
	myrow.cells[1].innerHTML=pay;
	myrow.cells[2].innerHTML=opppay;
	myrow=mytable.rows[mytable.rows.length-1];
	myrow.cells[1].innerHTML=""+Math.round(10*totalpay/round)/10;
	myrow.cells[2].innerHTML=""+Math.round(10*opptotalpay/round)/10;


	// update status
	var status = document.getElementById('status');
	status.innerHTML="You chose " + strategyname + "<br />Your competitor chose " + oppstrategyname;
	round++;
	if (round>TOTALROUNDS) {
		round--;
		roundpay.push(Math.round(10*totalpay/round)/10);
		opproundpay.push(Math.round(10*opptotalpay/round)/10);
		if (opponent==TOTALOPPONENTS) {
			status.innerHTML += "<br /><br />Done. <br />A summary of your performance appears to the right.";
			showscores();
		} else {
			status = document.getElementById('status2');
			status.innerHTML += "<br /><br />When you are ready for your next competitor,<br />click below";
			status.innerHTML += "<br /><input type=\"button\" value=\"NEXT COMPETITOR\" onclick=\"resetopponent();\" \\>";
		}
		document.getElementById('bConventional').disabled=true;
		document.getElementById('bSolar').disabled=true;
	}
	
}


function highlightoutcome(o){
	resethighlight();
	var myoutcome = document.getElementById(o);
	myoutcome.style.backgroundColor="orange";
}

function resethighlight(){
	document.getElementById('o11').style.backgroundColor="";
	document.getElementById('o10').style.backgroundColor="";
	document.getElementById('o01').style.backgroundColor="";
	document.getElementById('o00').style.backgroundColor="";
}
