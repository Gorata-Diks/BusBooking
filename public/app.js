let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;
  const title = document.getElementById("form-title");
  const form = document.getElementById("auth-form");
  const toggleLink = document.getElementById("toggle-link");
 
  title.textContent = isLogin ? "Login" : "Register";
  form.innerHTML = isLogin
    ? `<input type="email" id="email" placeholder="Email" required>
       <input type="password" id="password" placeholder="Password" required>
       <button type="submit">Login</button>`
    : `<input type="text" id="name" placeholder="Name" required>
       <input type="email" id="email" placeholder="Email" required>
       <input type="password" id="password" placeholder="Password" required>
       <div id="message" class="feedback-message"></div>
       <button type="submit" onclick="todash()">Register</button>
`;

  toggleLink.innerHTML = isLogin
    ? `Don't have an account? <a href="#" onclick="toggleForm()">Register</a>`
    : `Already have an account? <a href="#" onclick="toggleForm()">Login</a>`;
}

function todash() {
  document.getElementById('auth-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nameInput = document.getElementById('name'); // optional
    const name = nameInput ? nameInput.value : null;

    const url = document.getElementById('form-title').textContent === "Login" ? '/login' : '/register';
    const messageDiv = document.getElementById('message');
    messageDiv.style.color = 'black';
    messageDiv.textContent = 'Processing...';

    try {
      const body = name ? { name, email, password } : { email, password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = data.message;
        if (url === '/login') {
          setTimeout(() => {
            window.location.href = 'dashboard.html'; // Replace as needed
          }, 1000); // Small delay to show the success message
        }
      } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = data.message;
      }
    } catch (err) {
      console.error('Error:', err);
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Server error, please try again.';
    }
  });
}

