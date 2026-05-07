/* ─────────────────────────────────────────────────────────────
   script.js  —  Quranic Verse SPA
   API: https://api.alquran.cloud/v1
   Reciter: ar.alafasy (Mishary Rashid Alafasy)
───────────────────────────────────────────────────────────── */

'use strict';

// ── DOM refs ────────────────────────────────────────────────────
const skeleton        = document.getElementById('skeleton');
const verseContent    = document.getElementById('verse-content');
const errorState      = document.getElementById('error-state');
const errorMsg        = document.getElementById('error-msg');

const surahInfo       = document.getElementById('surah-info');
const arabicText      = document.getElementById('arabic-text');
const translationText = document.getElementById('translation-text');

const playBtn         = document.getElementById('play-btn');
const playIcon        = document.getElementById('play-icon');
const pauseIcon       = document.getElementById('pause-icon');
const playLabel       = document.getElementById('play-label');
const progressCont    = document.getElementById('progress-container');
const progressBar     = document.getElementById('progress-bar');
const audioEl         = document.getElementById('audio-el');
const newVerseBtn     = document.getElementById('new-verse-btn');

// ── Constants ────────────────────────────────────────────────────
const TOTAL_AYAHS  = 6236;
const API_BASE     = 'https://api.alquran.cloud/v1';
const EDITIONS     = 'quran-uthmani,en.sahih,ar.alafasy';

// ── State ────────────────────────────────────────────────────────
let isPlaying = false;

// ── Helpers ──────────────────────────────────────────────────────
const randomAyah = () => Math.floor(Math.random() * TOTAL_AYAHS) + 1;

function showSkeleton() {
  skeleton.classList.remove('hidden');
  verseContent.classList.add('hidden');
  errorState.classList.add('hidden');
  newVerseBtn.disabled = true;
  newVerseBtn.classList.add('opacity-60', 'cursor-not-allowed');
  stopAudio();
}

function showContent() {
  skeleton.classList.add('hidden');
  verseContent.classList.remove('hidden');
  // Re-trigger animation
  verseContent.classList.remove('animate-fade-in');
  void verseContent.offsetWidth; // reflow
  verseContent.classList.add('animate-fade-in');
  newVerseBtn.disabled = false;
  newVerseBtn.classList.remove('opacity-60', 'cursor-not-allowed');
}

function showError(msg) {
  skeleton.classList.add('hidden');
  verseContent.classList.add('hidden');
  errorState.classList.remove('hidden');
  errorMsg.textContent = msg || 'Something went wrong. Please try again.';
  newVerseBtn.disabled = false;
  newVerseBtn.classList.remove('opacity-60', 'cursor-not-allowed');
}

// ── Audio control ────────────────────────────────────────────────
function stopAudio() {
  audioEl.pause();
  audioEl.currentTime = 0;
  isPlaying = false;
  setPlayUI(false);
  progressCont.classList.add('hidden');
  progressBar.style.width = '0%';
}

function setPlayUI(playing) {
  if (playing) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playLabel.textContent = 'Pause';
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Pause recitation');
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playLabel.textContent = 'Play Recitation';
    playBtn.classList.remove('playing');
    playBtn.setAttribute('aria-label', 'Play recitation');
  }
}

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    audioEl.pause();
    isPlaying = false;
    setPlayUI(false);
  } else {
    audioEl.play().catch(() => {
      showError('Audio playback failed. The recitation may not be available for this verse.');
    });
    isPlaying = true;
    setPlayUI(true);
    progressCont.classList.remove('hidden');
  }
});

audioEl.addEventListener('timeupdate', () => {
  if (audioEl.duration) {
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    progressBar.style.width = pct + '%';
  }
});

audioEl.addEventListener('ended', () => {
  isPlaying = false;
  setPlayUI(false);
  progressBar.style.width = '100%';
  setTimeout(() => {
    progressBar.style.width = '0%';
    progressCont.classList.add('hidden');
  }, 600);
});

audioEl.addEventListener('error', () => {
  isPlaying = false;
  setPlayUI(false);
  progressCont.classList.add('hidden');
});

// ── Core fetch ───────────────────────────────────────────────────
async function loadVerse() {
  showSkeleton();

  const ayahNum = randomAyah();
  const url     = `${API_BASE}/ayah/${ayahNum}/editions/${EDITIONS}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const json = await res.json();

    if (json.status !== 'OK' || !json.data || json.data.length < 3) {
      throw new Error('Unexpected API response structure.');
    }

    const [arabicEdition, englishEdition, audioEdition] = json.data;

    // Populate text
    arabicText.textContent      = arabicEdition.text;
    translationText.textContent = englishEdition.text;

    // Surah badge
    const surahName  = arabicEdition.surah?.englishName ?? 'Unknown';
    const surahLocal = arabicEdition.surah?.name         ?? '';
    const ayahNo     = arabicEdition.numberInSurah       ?? '?';
    const surahNo    = arabicEdition.surah?.number       ?? '?';

    surahInfo.textContent = `${surahName} (${surahLocal}) • ${surahNo}:${ayahNo}`;

    // Audio
    const audioUrl = audioEdition.audio ?? audioEdition.audioSecondary?.[0];
    if (audioUrl) {
      audioEl.src = audioUrl;
      audioEl.load();
      playBtn.classList.remove('hidden');
    } else {
      playBtn.classList.add('hidden');
    }

    showContent();

  } catch (err) {
    console.error('[loadVerse]', err);

    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      showError('Request timed out. Please check your internet connection.');
    } else if (!navigator.onLine) {
      showError('You appear to be offline. Please check your connection.');
    } else {
      showError('Could not load verse. The API may be temporarily unavailable.');
    }
  }
}

// ── Init ─────────────────────────────────────────────────────────
loadVerse();
