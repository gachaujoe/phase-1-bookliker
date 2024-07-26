document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");

    const currentUser = { id: 1, username: "pouros" };

    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => {
            books.forEach(book => {
                const li = document.createElement("li");
                li.className = "book-item";
                li.textContent = book.title;
                li.addEventListener("click", () => displayBookDetails(book));
                bookList.appendChild(li);
            });
        });

    function displayBookDetails(book) {
        showPanel.innerHTML = `
            <img src="${book.img_url}" alt="Book Thumbnail">
            <h2>${book.title}</h2>
            <p>${book.description}</p>
            <ul id="users">${book.users.map(user => `<li>${user.username}</li>`).join('')}</ul>
            <button id="like-button">${book.users.find(user => user.id === currentUser.id) ? 'Unlike' : 'Like'}</button>
        `;
        document.getElementById("like-button").addEventListener("click", () => toggleLike(book));
    }

    function toggleLike(book) {
        const userIndex = book.users.findIndex(user => user.id === currentUser.id);
        if (userIndex === -1) {
            book.users.push(currentUser);
        } else {
            book.users.splice(userIndex, 1);
        }
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ users: book.users })
        })
        .then(response => response.json())
        .then(updatedBook => {
            displayBookDetails(updatedBook);
        });
    }
});
