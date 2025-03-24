// Your code here
const baseURL = "http://localhost:3000/characters";

document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();
});

function fetchCharacters() {
    fetch(baseURL)
        .then(res => res.json())
        .then(data => {
            const charBar = document.getElementById("character-bar");
            charBar.innerHTML = ""; // Clear previous data

            data.forEach(character => {
                let span = document.createElement("span");
                span.textContent = character.name;
                span.addEventListener("click", () => displayCharacter(character));
                charBar.appendChild(span);
            });
        });
}

function displayCharacter(character) {
    const charInfo = document.getElementById("detailed-info");
    charInfo.innerHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p>Votes: <span id="vote-count">${character.votes}</span></p>
        <form id="votes-form">
            <input type="number" id="vote-input" min="1" required>
            <button type="submit">Add Votes</button>
        </form>
        <button id="reset-votes">Reset Votes</button>
    `;

    document.getElementById("votes-form").addEventListener("submit", (e) => {
        e.preventDefault();
        addVotes(character);
    });

    document.getElementById("reset-votes").addEventListener("click", () => resetVotes(character));
}

function addVotes(character) {
    const voteInput = document.getElementById("vote-input");
    const voteCount = document.getElementById("vote-count");

    let newVotes = character.votes + parseInt(voteInput.value);
    voteCount.textContent = newVotes;
    character.votes = newVotes; // Update local object

    // Optionally update server with PATCH request
    fetch(`${baseURL}/${character.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: newVotes })
    });
}

function resetVotes(character) {
    character.votes = 0;
    document.getElementById("vote-count").textContent = 0;

    fetch(`${baseURL}/${character.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: 0 })
    });
}
