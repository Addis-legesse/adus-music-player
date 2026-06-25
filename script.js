const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const volumeSlider = document.getElementById("volumeSlider");

const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");

const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const songs = [
  { title: "Fairytale", file: "song1.mp3", artist: "Adu" },
  
  { title: "Bounce", file: "song2.mp3", artist: "Rema" },
  { title: "skool Luv Affair", file: "song3.mp3", artist: "BTS" },
  { title: "Be-Gude-Ewetana", file: "song4.mp3", artist: "Tewodeross Tadese" },
  { title: "Dimple", file: "song5.mp3", artist: "BTS" },
  { title: "Nedaw", file: "song6.mp3", artist: "Fekre addis" }
];

let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0;

/* LOAD */
function loadSong(song) {
  trackTitle.textContent  = song.title;           // ← matches new structure
  trackArtist.textContent = song.artist;
  audio.src = `assets/${song.file}`;              // ← file field has full filename
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent   = "0:00";
}
function playSong() {
  audio.play();
  isPlaying = true;
  playIcon.className = "fa-solid fa-pause";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playIcon.className = "fa-solid fa-play";
}

function nextSong() {
  songIndex = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (songIndex + 1) % songs.length;

  loadSong(songs[songIndex]);
  if (isPlaying) playSong();
}

function prevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  if (isPlaying) playSong();
}

/* EVENTS */
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active");
});

repeatBtn.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.classList.toggle("active", repeatMode > 0);
});

/* PROGRESS */
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;

  currentTimeEl.textContent = format(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = format(audio.duration);
});

function format(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/* SEEK */
progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  audio.currentTime = (e.offsetX / width) * audio.duration;
});

/* VOLUME */
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

/* END */
audio.addEventListener("ended", () => {
  if (repeatMode === 1) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

/* INIT */
loadSong(songs[songIndex]);