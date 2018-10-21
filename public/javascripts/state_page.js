$(document).ready(function() {});

function S(id){

    //to get element by id
    return document.getElementById(id)
}


var n = localStorage.getItem("n");          //variable to hold the number of states/districts, value obtained from local storage
var i;                                      //loop variable
var state_dis = [];                         //variable to hold the states/districts chosen by user through the search bar or map

//enable add button
S("add").disabled = false;

//if n is 0, disable done button
if(n==0)
    S("done").disabled = true;
else
    S("done").disabled = false;

//hide links in the beginning

 
for(i=0 ; i<n ; ++i){

    //to obtain the state/district names stored in local storage
    state_dis[i] = localStorage.getItem("local_state_dis"+i.toString());
}

if(n == 0){

    //No states chosen
    S("para_chosen_list").innerHTML = "No State/District chosen";
    S("chosen_list").innerHTML = "";
}
else{

    //states chosen
    S("para_chosen_list").innerHTML = "The states chosen are: ";
    S("chosen_list").innerHTML = "";

    for(i=0;i<n;++i){

        S("chosen_list").innerHTML += "<li>" + state_dis[i] + "</li>";
    }
}

function add_click(){

    //when the add button is clicked
    //the links will be shown


}






