// 1. Song Catalog (Direct MP3 stream URLs for testing)
const songs = [
    {
        id: 1,
        title: "Acoustic Breeze",
        artist: "Bensound",
        art: "https://picsum.photos/200?random=1",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        title: "Creative Minds",
        artist: "Bensound",
        art: "https://picsum.photos/200?random=2",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        title: "Ukulele Joy",
        artist: "Bensound",
        art: "https://picsum.photos/200?random=3",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
];

// 2. App State
let currentTrackIndex = 0;
let isPlaying = false;
let currentTab = 'all';

// Load saved IDs from LocalStorage or initialize an empty list
let savedSongIds = JSON.parse(localStorage.getItem('savedSongs')) || [];

// 3. DOM Elements
const audio = document.getElementById('audio-engine');
const songListContainer = document.getElementById('song-list');
const playBtn = document.getElementById('play-btn');

// Render the grid based on active tab ('all' or 'saved')
function renderSongs() {
    songListContainer.innerHTML = '';
    
    // Filter list if viewing Saved tab
    const displayList = currentTab === 'saved' 
        ? songs.filter(song => savedSongIds.includes(song.id))
        : songs;

    if (displayList.length === 0) {
        songListContainer.innerHTML = '<p>No saved songs yet!</p>';
        return;
    }

    displayList.forEach((song) => {
        const isSaved = savedSongIds.includes(song.id);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${song.art}" alt="${song.title}">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
            <button onclick="playSongById(${song.id})">▶ Play</button>
            <button onclick="toggleSave(${song.id})">${isSaved ? '❤️ Saved' : '🤍 Save'}</button>
        `;
        songListContainer.appendChild(card);
    });

    document.getElementById('saved-count').innerText = savedSongIds.length;
}

// 4. Playback Logic
function loadSong(index) {
    currentTrackIndex = index;
    const song = songs[currentTrackIndex];
    
    audio.src = song.src;
    document.getElementById('player-title').innerText = song.title;
    document.getElementById('player-artist').innerText = song.artist;
    document.getElementById('player-art').src = song.art;
}

function playSongById(id) {
    const index = songs.findIndex(s => s.id === id);
    if (index !== -1) {
        loadSong(index);
        playAudio();
    }
}

function togglePlay() {
    if (!audio.src) {
        loadSong(0); // Default to first track if none loaded
    }
    
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶ Play';
        isPlaying = false;
    } else {
        playAudio();
    }
}

function playAudio() {
    audio.play();
    playBtn.innerText = '⏸ Pause';
    isPlaying = true;
}

function nextSong() {
    currentTrackIndex = (currentTrackIndex + 1) % songs.length;
    loadSong(currentTrackIndex);
    playAudio();
}

function prevSong() {
    currentTrackIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
    loadSong(currentTrackIndex);
    playAudio();
}

// 5. Saved Songs (LocalStorage) Logic
function toggleSave(id) {
    if (savedSongIds.includes(id)) {
        savedSongIds = savedSongIds.filter(savedId => savedId !== id);
    } else {
        savedSongIds.push(id);
    }
    
    // Persist array in local storage
    localStorage.setItem('savedSongs', JSON.stringify(savedSongIds));
    renderSongs();
}

// 6. Tab Navigation
function switchTab(tab) {
    currentTab = tab;
    document.getElementById('nav-all').classList.toggle('active', tab === 'all');
    document.getElementById('nav-saved').classList.toggle('active', tab === 'saved');
    renderSongs();
}

// Initial Run
renderSongs();