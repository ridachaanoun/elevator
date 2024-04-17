window.addEventListener("load", () => {
  const elevator = document.querySelector(".elevator");
  const elevatorDoor = elevator.querySelector(".elevator-door");
  const elevatorDoor2 = elevator.querySelector(".elevator-door2");
  const elevatorLight = elevator.querySelector(".elevator-light");
  const floors = document.querySelectorAll(".building .floor");
  const buttons = document.querySelectorAll(".handle button");
  const display = document.querySelector(".display");

  let destinyFloors = [];
  let currentFloor = null;
  let leavingFloor = false;
  let elevatorStatus = "idle";
  let elevatorWaitingTime = 2000;
  let elevatorWaitTime = 2000;
  let previousTime = Date.now();
  let deltaTime = 0;

  elevatorDoor.style.width = "1px";
  elevatorDoor2.style.width = "1px";
  elevator.style.top = floors[0].offsetTop + "px";

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const setFloor = this.getAttribute("data-set-floor");
      const selectedFloor = Array.from(
        document.querySelectorAll(".building .floor")
      ).find((f) => f.getAttribute("data-floor") == setFloor);

      if (
        !destinyFloors.find(
          (df) =>
            df.getAttribute("data-floor") ==
            selectedFloor.getAttribute("data-floor")
        )
      ) {
        if (
          selectedFloor.getAttribute("data-floor") !=
          currentFloor.getAttribute("data-floor")
        ) {
          destinyFloors.push(selectedFloor);
        }
      }
      leavingFloor = true;
      if (elevatorStatus == "idle") {
        elevatorStatus = "closing";
      }
    });
  });

  function updateElevator() {
    deltaTime = Date.now() - previousTime;
    previousTime = Date.now();

    requestAnimationFrame(updateElevator);

    let elevatorWithinFloor = false;
    for (let i = 0; i < floors.length; i++) {
      if (
        elevator.offsetTop > floors[i].offsetTop &&
        elevator.offsetTop < floors[i].offsetTop + 10
      ) {
        elevatorWithinFloor = true;
        currentFloor = floors[i];

        if (!leavingFloor) {
          if (
            destinyFloors.some(
              (df) =>
                df.getAttribute("data-floor") ==
                currentFloor.getAttribute("data-floor")
            )
          ) {
            destinyFloors = destinyFloors.filter(
              (df) =>
                df.getAttribute("data-floor") !=
                currentFloor.getAttribute("data-floor")
            );
            elevatorStatus = "opening";
          }
        }
      }
    }

    if (!elevatorWithinFloor && leavingFloor) {
      leavingFloor = false;
    }

    if (elevatorStatus != "moving") {
      if (elevatorStatus == "opening") {
        if (elevatorDoor.offsetWidth > 1) {
          elevatorDoor.style.width = elevatorDoor.offsetWidth - 1 + "px";
        } else {
          if (destinyFloors.length == 0) {
            elevatorStatus = "idle";
          } else {
            elevatorStatus = "waiting";
            elevatorWaitingTime = elevatorWaitTime;
          }
        }
      }
      if (elevatorStatus == "waiting") {
        if (elevatorWaitingTime > 0) {
          elevatorWaitingTime -= deltaTime;
        } else {
          elevatorStatus = "closing";
        }
      }
      if (elevatorStatus == "closing") {
        if (elevatorDoor.offsetWidth < 28) {
          elevatorDoor.style.width = elevatorDoor.offsetWidth + 1 + "px";
          // elevatorDoor2.style.width = elevatorDoor2.offsetWidth + 1 + "px";
        
        } else {
          elevatorStatus = "moving";
        }
      }

    }

    if (destinyFloors[0] != null && elevatorStatus == "moving") {
      elevator.style.top =
        destinyFloors[0].offsetTop > elevator.offsetTop - 7
          ? elevator.offsetTop - 7 + 2 + "px"
          : elevator.offsetTop - 7 - 2 + "px";
    }

    updateButtons();
    updateDisplay();
  }
  updateElevator();

  function updateDisplay() {
    display.innerHTML =
      [
        "GROUND",
        "1ST Floor",
        "2ND Floor",
        "3RD Floor",
        "4TH Floor",
        "5TH Floor",
        "6TH Floor",
      ][parseInt(currentFloor.getAttribute("data-floor"))] +
      (destinyFloors[0] != null
        ? destinyFloors[0].offsetTop < currentFloor.offsetTop
          ? "<br />Up"
          : "<br />Down"
        : "");
  }

  function updateButtons() {
    buttons.forEach((button) => {
      if (
        destinyFloors.find(
          (df) =>
            df.getAttribute("data-floor") ==
            button.getAttribute("data-set-floor")
        )
      ) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }
});
