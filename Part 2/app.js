document.addEventListener('DOMContentLoaded', () => {
  // Reference to various DOM elements
  const usersListDiv = document.querySelector('#usersList'); // Element to display the list of users
  const addUserForm = document.querySelector('#addUserForm'); // Form element to add a new user
  const userNameInput = document.querySelector('#userNameInput'); // Input field for new user's name
  const searchInput = document.querySelector('#searchInput'); // Input field for searching users
  const paginationDiv = document.createElement('div'); // Div to hold pagination buttons
  let currentPage = 1; // Variable to keep track of the current page number

  // Initialize local storage for users if it's not already done
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }

  // Function to save the current list of users to local storage
  function saveUsersToLocalStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Function to get the current list of users from local storage
  function getUsersFromLocalStorage() {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  // Initialize the list of users from local storage
  let users = getUsersFromLocalStorage();

  // Function to display the list of users
  function displayUsers(users, page, searchQuery = '') {
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    usersListDiv.innerHTML = '';
    const itemsPerPage = 5;
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    paginatedUsers.forEach((user) => {
      const userDiv = document.createElement('div');
      userDiv.classList.add('userItem');
      userDiv.textContent = user.name;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('deleteButton');
      deleteButton.dataset.id = user.id;

      userDiv.appendChild(deleteButton);
      usersListDiv.appendChild(userDiv);
    });

    paginationDiv.innerHTML = '';
    if (currentPage > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.addEventListener('click', () => {
        currentPage--;
        displayUsers(users, currentPage, searchQuery);
      });
      paginationDiv.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.addEventListener('click', () => {
        currentPage++;
        displayUsers(users, currentPage, searchQuery);
      });
      paginationDiv.appendChild(nextButton);
    }
    
    usersListDiv.appendChild(paginationDiv);
  }

  // Display the list of users when the page loads
  displayUsers(users, currentPage);

  // Event listener for the "Add User" form
  addUserForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      const userName = userNameInput.value.trim();
      if (userName !== '') {
        const newUser = { id: Date.now(), name: userName };
        users.push(newUser);
        displayUsers(users, currentPage);
        saveUsersToLocalStorage(users);
        userNameInput.value = '';
      }
  });

  // Event listener for the user list to handle delete button clicks
  usersListDiv.addEventListener('click', (event) => {
      if (event.target.classList.contains('deleteButton')) { // Check if the clicked element is a delete button
        const userId = parseInt(event.target.dataset.id);
        users = users.filter((user) => user.id !== userId);
        if (searchInput.value !== '') {
          searchInput.value = '';
          displayUsers(users, 1, '');
        }
        displayUsers(users, currentPage);
        saveUsersToLocalStorage(users);
      }
  });

  // Event listener for the search input field
  searchInput.addEventListener('input', (event) => {
      const searchQuery = event.target.value; // Get the current value of the search input field
      displayUsers(users, 1, searchQuery); // Update the display based on the search query
  });
});
