const buses = [
];

const tickets = [
 
];

async function fetchAndRenderTickets() {
  try {
    const response = await fetch("http://localhost:3000/api/tickets");
    const ticketList = await response.json();
    document.getElementById("ticket-container").innerHTML = "";
    console.log(ticketList);
    renderTickets(ticketList);
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
}

fetchAndRenderTickets(); // call on page load

const ticketContainer = document.getElementById("ticket-container");
const noTicketsMsg = document.getElementById("no-tickets-msg");

function renderTickets(tickets) {
  if (!tickets.length) {
    noTicketsMsg.classList.remove("hidden");
    return;
  }

  tickets.forEach((ticket) => {
    const card = document.createElement("div");
    card.className = "ticket-card";

    card.innerHTML = `
          <h3>${ticket.bus}</h3>
          <p class="ticket-info"><strong>From:</strong> ${ticket.from_location}</p>
          <p class="ticket-info"><strong>To:</strong> ${ticket.from_location}</p>
          <p class="ticket-info"><strong>Date:</strong> ${ticket.date}</p>
          <p class="ticket-info"><strong>Seat:</strong> ${ticket.seat}</p>
          <span class="badge ${ticket.status}">${capitalize(
      ticket.status
    )}</span>
          <br>
          <button onclick="alert('Feature coming soon')">View Ticket</button>
        `;
    ticketContainer.appendChild(card);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// renderTickets(tickets);

function renderBusCards(busList) {
  const container = document.getElementById("bus-listings");
  container.innerHTML = ""; // clear previous cards

  busList.forEach((bus) => {
    const card = document.createElement("div");
    card.className = "bus-card dark";
    //
    card.innerHTML = `
            <img src="${bus.image}" alt="${bus.company}" class="bus-image">
            <h3>${bus.company}</h3>
            <div class="tags">
                <span class="tag">${bus.departure}</span>
                <span class="tag">${bus.from_location} → ${bus.to_location}</span>
            </div>
            <div class="info">
                <p><strong>Plate:</strong> ${bus.plate}</p>
                <p><strong>Arrival:</strong> ${bus.arrival}</p>
                <p><strong>Seats:</strong> ${bus.seats}</p>
                <p><strong>Price:</strong> P${bus.price}</p>
            </div>
            <button class="book-btn" data-id="${bus.id}">Book Now</button>
        `;

    container.appendChild(card);
  });

  // Add event listeners to book buttons
  document.querySelectorAll(".book-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const busId = e.target.getAttribute("data-id");
      const selectedBus = busList.find((b) => b.id == busId);
      bookNow(selectedBus);
    });
  });
}
function filterBuses() {
  const from = document.getElementById("from-input").value.toLowerCase();
  const to = document.getElementById("to-input").value.toLowerCase();
  const date = document.getElementById("date-input")?.value;
  const timeOfDay = document.getElementById("time-filter")?.value;

  let filteredBuses = buses;

  if (from) {
    filteredBuses = filteredBuses.filter((bus) =>
      bus.from_location.toLowerCase().includes(from)
    );
  }
  if (to) {
    filteredBuses = filteredBuses.filter((bus) =>
      bus.to_location.toLowerCase().includes(to)
    );
  }
  if (date) {
    filteredBuses = filteredBuses.filter((bus) =>
      bus.departure.includes(date)
    );
  }
  if (timeOfDay) {
    filteredBuses = filteredBuses.filter((bus) =>
      bus.departure.includes(timeOfDay)
    );
  }

  renderBusCards(filteredBuses);
}


async function fetchAndRenderBuses() {
  try {
    const response = await fetch("http://localhost:3000/api/buses");
    const busList = await response.json();

    buses.splice(0, buses.length, ...busList); // Update the global array

    renderBusCards(busList);
  } catch (error) {
    console.error("Error fetching buses:", error);
  }
}

// Initial render using backend data
fetchAndRenderBuses();

// Add event listener to search button
document.getElementById("search-btn").addEventListener("click", filterBuses);

// Initial render
renderBusCards(buses);
const bookedSeats = {
  1: [3, 5, 12],
  2: [1, 8, 19],
  3: [7, 10, 25],
};

let selectedBusId = null;
let selectedSeat = null;

// Open seat selection
function bookNow(bus) {
  selectedBusId = bus.id;
  selectedSeat = null;

  // Reset modal steps
  showStep("seat");
  renderSeats(bus.id);

  document.getElementById("seat-modal").classList.remove("hidden");
}

// Render seats
function renderSeats(busId) {
  const grid = document.getElementById("seat-grid");
  grid.innerHTML = "";
  const booked = bookedSeats[busId] || [];

  for (let i = 1; i <= 48; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.textContent = i;

    if (booked.includes(i)) {
      seat.classList.add("booked");
    } else {
      seat.addEventListener("click", () => {
        document
          .querySelectorAll(".seat")
          .forEach((s) => s.classList.remove("selected"));
        seat.classList.add("selected");
        selectedSeat = i;
      });
    }

    grid.appendChild(seat);
  }
}
document.getElementById("confirm-seat").addEventListener("click", () => {
  if (!selectedSeat) {
    alert("Please select a seat first.");
    return;
  }
  showStep("payment");
});

function showStep(step) {
  const steps = [
    "seat-step",
    "payment-step",
    "booking-progress",
    "booking-confirmation",
  ];
  steps.forEach((id) => document.getElementById(id).classList.add("hidden")); // Hide all steps

  switch (step) {
    case "seat":
      document.getElementById("seat-step").classList.remove("hidden");
      break;
    case "payment":
      document.getElementById("payment-step").classList.remove("hidden");
      break;
    case "progress":
      document.getElementById("booking-progress").classList.remove("hidden");
      break;
    case "confirmation":
      document
        .getElementById("booking-confirmation")
        .classList.remove("hidden");
      break;
  }
}

// Seat confirmation
document.getElementById("confirm-seat").addEventListener("click", () => {
  if (!selectedSeat) return alert("Select a seat!");

  // Clear seat grid
  document.getElementById("seat-grid").innerHTML = "";

  showStep("payment");
});

// Payment
document.getElementById("pay-btn").addEventListener("click", () => {
  const cardNumber = document.getElementById("card-number").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (!cardNumber || !cvv) {
    alert("Enter card number and CVV!");
    return;
  }

  // Show loading spinner
  showStep("progress");

  setTimeout(() => {
    // Show confirmation message
    showStep("confirmation");

    // Save booked seat
    if (!bookedSeats[selectedBusId]) bookedSeats[selectedBusId] = [];
    bookedSeats[selectedBusId].push(selectedSeat);

    // Add ticket to ticket list
    const bus = buses.find((b) => b.id === selectedBusId);
    if (bus) {
      const newTicket = {
        id: Date.now(),
        bus: bus.company,
        from_location: bus.from_location,
        to_location: bus.to_location,
        date: new Date().toISOString().split("T")[0],
        seat: selectedSeat,
        status: "confirmed",
      };
      document.getElementById("ticket-container").innerHTML = "";
      // Add ticket to database
      fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
        
      }).then(() => {
        // Refresh ticket view after saving
        fetchAndRenderTickets();
      });
    } else{
      console.log("error is win")
    }

    // Close modal after 2.5 seconds
    setTimeout(() => {
      document.getElementById("seat-modal").classList.add("hidden");
      showStep("seat");
      selectedSeat = null;
      selectedBusId = null;
    }, 2500);
  }, 2000);
});

// Close modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("seat-modal").classList.add("hidden");
  showStep("seat");
  selectedSeat = null;
  selectedBusId = null;
});

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  // Set the "Home" tab as active on page load
  const homeTab = document.querySelector("#home-tab");
  if (homeTab) {
    homeTab.classList.add("active");
    const homeTabContent = document.getElementById(
      homeTab.getAttribute("data-tab")
    );
    if (homeTabContent) {
      homeTabContent.classList.add("active");
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      // Hide all tab content
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");
      // Show corresponding tab content
      const activeTab = document.getElementById(tab.getAttribute("data-tab"));
      if (activeTab) {
        activeTab.classList.add("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {});
// Profile Form
document
  .getElementById("profile-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    // Simulate saving profile data
    document.getElementById("profile-success").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("profile-success").classList.add("hidden");
    }, 2000);
  });

// Settings Form
document
  .getElementById("settings-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    // Simulate saving settings
    document.getElementById("settings-success").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("settings-success").classList.add("hidden");
    }, 2000);
  });
