// Login function
function login() {
  const password = document.getElementById('adminPassword').value;
  if (password === 'networke') {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    fetchBuses();
    fetchTickets();
    fetchRevenue();
  } else {
    const error = document.getElementById('loginError');
    error.textContent = 'Incorrect password. Please try again.';
    error.style.display = 'block';
  }
}

// Feedback message display
function showFeedback(message, type) {
  const feedbackMessage = document.getElementById('feedbackMessage');
  feedbackMessage.textContent = message;
  feedbackMessage.style.display = 'block';
  feedbackMessage.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
  setTimeout(() => {
    feedbackMessage.style.display = 'none';
  }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addBusBtn').addEventListener('click', () => {
    document.getElementById('addBusModal').style.display = 'flex';
  });

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('addBusModal').style.display = 'none';
  });

  document.getElementById('addBusForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newBus = {
      company: document.getElementById('company').value,
      plate: document.getElementById('plate').value,
      from_location: document.getElementById('from_location').value,
      to_location: document.getElementById('to_location').value,
      departure: document.getElementById('departure').value,
      arrival: document.getElementById('arrival').value,
      seats: document.getElementById('seats').value,
      price: document.getElementById('price').value,
      image: document.getElementById('image').value
    };

    fetch('/api/buses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBus)
    })
    .then(res => res.json())
    .then(() => {
      showFeedback('Bus added successfully!', 'success');
      fetchBuses();
      document.getElementById('addBusModal').style.display = 'none';
    })
    .catch(() => showFeedback('Error adding bus.', 'error'));
  });

  document.getElementById('refreshTicketsBtn').addEventListener('click', fetchTickets);
});

// Fetch functions
function fetchBuses() {
  fetch('/api/buses')
    .then(res => res.json())
    .then(buses => {
      const busList = document.getElementById('busList');
      busList.innerHTML = '';
      buses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.classList.add('card');
        busCard.innerHTML = `
          <h3>${bus.company}</h3>
          <p><strong>From:</strong> ${bus.from_location}</p>
          <p><strong>To:</strong> ${bus.to_location}</p>
          <p><strong>Departure:</strong> ${bus.departure}</p>
          <p><strong>Price:</strong> ₱${bus.price}</p>
          <button onclick="deleteBus(${bus.id})">Delete Bus</button>
        `;
        busList.appendChild(busCard);
      });
    });
}

function deleteBus(id) {
  fetch(`/api/buses/${id}`, { method: 'DELETE' })
    .then(() => {
      showFeedback('Bus deleted successfully!', 'success');
      fetchBuses();
    })
    .catch(() => showFeedback('Error deleting bus.', 'error'));
}

function fetchTickets() {
  fetch('/api/tickets')
    .then(res => res.json())
    .then(tickets => {
      const ticketList = document.getElementById('ticketList');
      ticketList.innerHTML = '';
      tickets.forEach(ticket => {
        const ticketCard = document.createElement('div');
        ticketCard.classList.add('card');
        ticketCard.innerHTML = `
          <h3>${ticket.bus}</h3>
          <p><strong>From:</strong> ${ticket.from_location}</p>
          <p><strong>To:</strong> ${ticket.to_location}</p>
          <p><strong>Seat:</strong> ${ticket.seat}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <button onclick="deleteTicket(${ticket.id})">Delete Ticket</button>
        `;
        ticketList.appendChild(ticketCard);
      });
    });
    fetchRevenue()
}

function deleteTicket(id) {
  fetch(`/api/tickets/${id}`, { method: 'DELETE' })
    .then(() => {
      showFeedback('Ticket deleted successfully!', 'success');
      fetchTickets();
    })
    .catch(() => showFeedback('Error deleting ticket.', 'error'));
}

function fetchRevenue() {
  fetch('/api/revenue')
    .then(res => res.json())
    .then(data => {
      document.getElementById('totalRevenue').textContent = `₱${data.totalRevenue}`;
    });
}
