// ------------------------------
// QUEUEFLOW - JAVASCRIPT
// ------------------------------

const state = {
  joined: false,
  currentNumber: 103,
  userNumber: 108,
  peopleAhead: 5,
  averageServiceTime: 5,
  institution: "University Administration",
  service: "Document Verification",
};

// A short way to select an HTML element by its ID
function getElement(id) {
  return document.getElementById(id);
}

// ------------------------------
// SHOW NOTIFICATION
// ------------------------------

function showToast(title, message) {
  const container = getElement("toastContainer");

  const toast = document.createElement("div");

  toast.className = "toast";

  toast.innerHTML = `
        <strong>${title}</strong>
        <p>${message}</p>
    `;

  container.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = "0";

    toast.style.transform = "translateY(8px)";

    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 4000);
}

// ------------------------------
// SCROLL TO DEMO
// ------------------------------

function scrollToDemo() {
  document.querySelector("#demo").scrollIntoView({
    behavior: "smooth",
  });
}

// ------------------------------
// JOIN QUEUE
// ------------------------------

function joinQueue() {
  // Get the selected institution
  state.institution = getElement("institutionSelect").value;

  // Get the selected service
  state.service = getElement("serviceSelect").value;

  // The student has now joined the queue
  state.joined = true;

  // Starting numbers for our demo
  state.currentNumber = 103;
  state.userNumber = 108;

  // Calculate people ahead
  state.peopleAhead = state.userNumber - state.currentNumber - 1;

  // Show information on the page
  getElement("statusInstitution").innerText = state.institution;

  getElement("statusService").innerText = state.service;

  getElement("userToken").innerText = "A-" + state.userNumber;

  getElement("userStatusText").innerText =
    "You're in the queue. We'll keep you updated.";

  // Update all queue information
  updateQueue();

  // Show notification
  showToast(
    "You're in the queue",
    "Your token is A-" +
      state.userNumber +
      ". There are " +
      state.peopleAhead +
      " people ahead of you.",
  );
}

// ------------------------------
// UPDATE QUEUE
// ------------------------------

function updateQueue() {
  // Calculate how many people are still ahead
  const peopleAhead = Math.max(0, state.userNumber - state.currentNumber - 1);

  state.peopleAhead = peopleAhead;

  // Calculate estimated waiting time
  const estimatedWait = peopleAhead * state.averageServiceTime;

  // Calculate progress
  const totalPeople = state.userNumber - 103;

  const peopleCompleted = state.currentNumber - 103;

  let progress = 0;

  if (totalPeople > 0) {
    progress = (peopleCompleted / totalPeople) * 100;
  }

  // Update the page
  getElement("userToken").innerText = "A-" + state.userNumber;

  getElement("currentServing").innerText = "A-" + state.currentNumber;

  getElement("peopleAhead").innerText = peopleAhead;

  // Estimated wait
  if (peopleAhead === 0) {
    getElement("estimatedWait").innerText = "Now";
  } else {
    getElement("estimatedWait").innerText = "~" + estimatedWait + " min";
  }

  // Progress percentage
  getElement("progressPercent").innerText = Math.round(progress) + "%";

  // Progress bar width
  getElement("progressBar").style.width = progress + "%";

  // --------------------------
  // STATUS MESSAGE
  // --------------------------

  const statusPill = getElement("statusPill");

  const statusText = getElement("userStatusText");

  if (state.currentNumber >= state.userNumber) {
    statusPill.innerText = "Your turn";

    statusPill.className = "status-pill arrived";

    statusText.innerText =
      "Your turn has arrived. Please proceed to the service counter.";
  } else if (peopleAhead <= 1) {
    statusPill.innerText = "Almost up";

    statusPill.className = "status-pill near";

    statusText.innerText =
      "You're almost up. Please make your way to the office.";
  } else {
    statusPill.innerText = "Waiting";

    statusPill.className = "status-pill waiting";

    statusText.innerText = "You're in the queue. We'll keep you updated.";
  }

  // Update the visual queue
  createQueueVisual();

  // Update staff dashboard
  updateStaffDashboard();
}

// ------------------------------
// CREATE QUEUE VISUAL
// ------------------------------

function createQueueVisual() {
  const queueVisual = getElement("queueVisual");

  // Clear old queue
  queueVisual.innerHTML = "";

  const start = Math.max(103, state.currentNumber - 1);

  const end = Math.min(state.userNumber, start + 7);

  for (let number = start; number <= end; number++) {
    const item = document.createElement("span");

    item.className = "qv-item";

    // Currently being served
    if (number === state.currentNumber) {
      item.classList.add("current");
    }

    // This is the student
    if (number === state.userNumber) {
      item.classList.add("you");
    }

    item.innerText = "A-" + number;

    queueVisual.appendChild(item);

    // Add line between tokens
    if (number < end) {
      const line = document.createElement("span");

      line.className = "qv-line";

      queueVisual.appendChild(line);
    }
  }
}

// ------------------------------
// SERVE NEXT PERSON
// ------------------------------

function serveNext() {
  // If nobody has joined
  if (!state.joined) {
    showToast(
      "Join a queue first",
      "Switch to Student View and join a queue to start the demo.",
    );

    return;
  }

  // If it is already the student's turn
  if (state.currentNumber >= state.userNumber) {
    showToast("Your turn has arrived", "The queue has reached your token.");

    return;
  }

  // Move queue forward by one
  state.currentNumber++;

  // Update everything
  updateQueue();

  const peopleAhead = state.userNumber - state.currentNumber - 1;

  // Different notifications
  if (state.currentNumber === state.userNumber) {
    showToast(
      "Your turn has arrived",
      "Token A-" + state.userNumber + " is now being served.",
    );
  } else if (peopleAhead === 1) {
    showToast("You're almost up!", "Only one person is ahead of you.");
  } else {
    showToast(
      "Queue updated",
      "A-" +
        state.currentNumber +
        " is now being served. " +
        peopleAhead +
        " people are ahead of you.",
    );
  }
}

// ------------------------------
// LEAVE QUEUE
// ------------------------------

function leaveQueue() {
  if (!state.joined) {
    return;
  }

  state.joined = false;

  getElement("userToken").innerText = "—";

  getElement("estimatedWait").innerText = "—";

  getElement("peopleAhead").innerText = "—";

  getElement("progressPercent").innerText = "0%";

  getElement("progressBar").style.width = "0%";

  getElement("statusPill").innerText = "Left queue";

  getElement("statusPill").className = "status-pill waiting";

  getElement("userStatusText").innerText = "You have left the queue.";

  getElement("userServeDemoBtn").disabled = true;

  getElement("queueVisual").innerHTML = "";

  showToast("Queue left", "You have left the demo queue.");
}

// ------------------------------
// STAFF DASHBOARD
// ------------------------------

function updateStaffDashboard() {
  getElement("staffCurrent").innerText = "A-" + state.currentNumber;

  if (state.currentNumber < state.userNumber) {
    getElement("staffNext").innerText = "A-" + (state.currentNumber + 1);
  } else {
    getElement("staffNext").innerText = "—";
  }

  // Example number for people waiting
  let waitingPeople = 12;

  if (state.joined) {
    waitingPeople = Math.max(0, state.userNumber - state.currentNumber - 1) + 7;
  }

  getElement("staffWaiting").innerText = waitingPeople;

  createStaffRows();
}

// ------------------------------
// CREATE STAFF QUEUE ROWS
// ------------------------------

function createStaffRows() {
  const rows = getElement("staffQueueRows");

  rows.innerHTML = "";

  const start = state.currentNumber + 1;

  const end = Math.min(start + 3, state.userNumber + 2);

  for (let number = start; number <= end; number++) {
    const row = document.createElement("div");

    row.className = "table-row";

    let service = "Document Verification";

    if (number === state.userNumber) {
      service = state.service;
    }

    let status = "Waiting";

    if (number === state.currentNumber + 1) {
      status = "Next";
    }

    row.innerHTML = `
            <span>
                <strong>A-${number}</strong>
            </span>

            <span>${service}</span>

            <span class="row-status">
                ${status}
            </span>

            <button
                class="row-action"
                data-token="${number}">
                Serve
            </button>
        `;

    rows.appendChild(row);
  }

  // Add click event to Serve buttons
  const buttons = rows.querySelectorAll("[data-token]");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const token = Number(button.dataset.token);

      if (!state.joined) {
        showToast("Demo only", "Join a queue from Student View first.");

        return;
      }

      if (token <= state.currentNumber) {
        return;
      }

      // Move directly to selected token
      state.currentNumber = Math.min(token, state.userNumber);

      updateQueue();

      showToast(
        "Queue updated",
        "Staff is now serving A-" + state.currentNumber,
      );
    });
  });
}

// ------------------------------
// NAVIGATION
// ------------------------------

function setupNavigation() {
  // How It Works / Institutions links
  const scrollLinks = document.querySelectorAll("[data-scroll-link]");

  scrollLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const section = document.getElementById(link.dataset.scrollLink);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Demo navigation
  const viewLinks = document.querySelectorAll("[data-view-link]");

  viewLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      if (link.dataset.viewLink === "demo") {
        scrollToDemo();
      } else {
        document.getElementById("home").scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Join Queue buttons
  getElement("navJoinBtn").addEventListener("click", scrollToDemo);

  getElement("heroJoinBtn").addEventListener("click", scrollToDemo);

  // Mobile menu
  getElement("mobileMenuBtn").addEventListener("click", function () {
    showToast(
      "Navigation",
      "Scroll through the page to explore the prototype.",
    );
  });
}

// ------------------------------
// STUDENT / STAFF SWITCH
// ------------------------------

function setupDemoTabs() {
  const buttons = document.querySelectorAll("[data-demo-tab]");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Remove active from buttons
      buttons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      // Remove active from panels
      document.querySelectorAll(".demo-panel").forEach(function (panel) {
        panel.classList.remove("active");
      });

      // Activate selected button
      button.classList.add("active");

      // Activate selected panel
      const panel = getElement(button.dataset.demoTab + "Panel");

      if (panel) {
        panel.classList.add("active");
      }

      // Update staff information
      if (button.dataset.demoTab === "staff") {
        updateStaffDashboard();
      }
    });
  });
}

// ------------------------------
// SCROLL ANIMATION
// ------------------------------

function setupScrollAnimation() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  elements.forEach(function (element) {
    observer.observe(element);
  });
}

// ------------------------------
// BUTTON EVENTS
// ------------------------------

getElement("joinQueueBtn").addEventListener("click", joinQueue);

getElement("leaveQueueBtn").addEventListener("click", leaveQueue);

getElement("userServeDemoBtn").addEventListener("click", serveNext);

getElement("staffServeBtn").addEventListener("click", serveNext);

// ------------------------------
// START WEBSITE
// ------------------------------

setupNavigation();

setupDemoTabs();

setupScrollAnimation();

createQueueVisual();

updateStaffDashboard();
