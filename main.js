// Initialize Firebase (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyBfdMTHy9fbXxjscWTOBHEgrSzu9qQ7adU",
  authDomain: "hentairoom-e3851.firebaseapp.com",
  projectId: "hentairoom-e3851",
  storageBucket: "hentairoom-e3851.firebasestorage.app",
  messagingSenderId: "292041624195",
  appId: "1:292041624195:web:e41e1a5b5f9baec41469b6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Search Data
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchCode = document.getElementById('searchCode').value;
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');
    const adultImg = document.getElementById("img-adult");

    try {
        const querySnapshot = await db.collection('data').where('code', '==', searchCode).get();

        if (querySnapshot.empty) {
            resultContent.textContent = `No results found for code: ${searchCode}`;
        } else {
            const doc = querySnapshot.docs[0].data();
            resultContent.innerHTML = `
    <div class="card1">
        <div class="img-box">
            <img src="${doc.image}" alt="Post Image">
        </div>
        <div class="detail-box">
            <p><strong>Post Number :</strong> ${doc.code}</p>
            <P><strong>Title :</strong>  ${doc.name}</P>
            <P><strong>Actress :</strong>  ${doc.actress}</P>
            <p><a href="${doc.download}" target="_blank">Download Link 1</a></p>
            <p><a href="${doc.download}" target="_blank">Download Link 2</a></p>
        </div>
    </div>`;
        }

        resultCard.classList.remove('hidden');  // Show result card
        adultImg.classList.add('adult-img-hidden');  // Hide the adult image
    } catch (error) {
        console.error("Error searching for document: ", error);
        alert('Error searching data. Please try again.');
    }
});

// Close Result Card and show img-adult
document.getElementById('closeButton').addEventListener('click', () => {
    const resultCard = document.getElementById('resultCard');
    const adultImg = document.getElementById("img-adult");

    resultCard.classList.add('hidden');  // Hide result card
    document.getElementById('searchForm').reset();  // Reset form
    adultImg.classList.remove('adult-img-hidden');  // Show adult image
});


// Function to get 4 random data entries
async function getRandomEntries() {
    const snapshot = await db.collection('data').get();
    const docs = snapshot.docs.map(doc => doc.data());
    // Shuffle and pick 3 random entries
    const randomDocs = docs.sort(() => 0.5 - Math.random()).slice(0, 4);
    return randomDocs;
}

// Create cards and inject them into the DOM
async function createCards() {
    const cardBox = document.querySelector('.card-box');
    const randomData = await getRandomEntries();

    randomData.forEach((doc, index) => {
        // Create the flip card
        const cardHTML = `
        <div class="card" id="card-${index}">
            <div class="card-face card-front">
                <img src="${doc.image}" alt="Image of ${doc.name}">
            </div>
            <div class="card-face card-back">
                <p><strong>Post Number :</strong> ${doc.code}</p>
                <p><strong>Title :</strong> ${doc.name}</p>
                <p><strong>Actress :</strong> ${doc.actress}</p>
            </div>
        </div>`;

        cardBox.innerHTML += cardHTML;
    });

    // Add event listeners to flip cards on image click
    randomData.forEach((_, index) => {
        const card = document.getElementById(`card-${index}`);
        card.addEventListener('click', () => {
            card.classList.toggle('flip');
        });
    });
}

// Call the function to create cards when the page loads
createCards();


// views 