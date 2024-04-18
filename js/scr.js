let elevatorDoor = document.querySelector(".elevator-door");
let elevatorDoor2 = document.querySelector(".elevator-door2");
let elevator = document.querySelector(".elevator-container .elevator");
let start = document.querySelector(".start") ;

function opening(){
    elevatorDoor.style.transform = "translateX(-28px)";
    elevatorDoor2.style.transform = "translateX(28px)";
}
start.addEventListener("click",opening);


