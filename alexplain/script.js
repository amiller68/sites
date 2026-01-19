/* ============================================
   Alex Plain Music - JavaScript
   90s AOL Portal Aesthetic
   ============================================ */

// Configuration
const BUCKET_ID = 'f5a969c4-a3e2-43bc-9ab2-0e6343006d00';
const GATEWAY_URL = `https://jax.krondor.org/gw/${BUCKET_ID}`;

// Music directories
const directories = [
    { id: 'roughs', path: 'roughs' },
    { id: 'jams', path: 'jams' },
    { id: 'at-home', path: 'at-home' }
];

/* ============================================
   Partial Loading
   ============================================ */

async function loadPartial(elementId, partialPath) {
    try {
        const response = await fetch(partialPath);
        if (response.ok) {
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            }
        }
    } catch (error) {
        console.error(`Failed to load partial ${partialPath}:`, error);
    }
}

// Load all partials on page load
function loadPartials() {
    loadPartial('header-partial', 'partials/header.html');
}

/* ============================================
   Tab Switching
   ============================================ */

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-content`).classList.add('active');
}

/* ============================================
   Audio Player Utilities
   ============================================ */

// Format time in mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format track name for display
function formatTrackName(filename) {
    // Remove file extension
    let name = filename.replace(/\.(mp3|m4a)$/i, '');

    // Remove timestamp patterns like "10!25!25, 7.31 PM"
    name = name.replace(/\s*-\s*\d+!\d+!\d+,\s*\d+\.\d+\s*(AM|PM)/gi, '');

    return name;
}

/* ============================================
   Custom Audio Player
   ============================================ */

function createCustomPlayer(audioSrc) {
    const audio = document.createElement('audio');
    audio.preload = 'auto';
    audio.src = audioSrc;

    const player = document.createElement('div');
    player.className = 'custom-player';

    const controls = document.createElement('div');
    controls.className = 'player-controls';

    // Play/Pause button
    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
    playBtn.onclick = () => togglePlay(audio, playBtn);

    // Seek container
    const seekContainer = document.createElement('div');
    seekContainer.className = 'seek-container';

    const currentTime = document.createElement('div');
    currentTime.className = 'time';
    currentTime.textContent = '0:00';

    const seekBar = document.createElement('div');
    seekBar.className = 'seek-bar';

    const seekBarProgress = document.createElement('div');
    seekBarProgress.className = 'seek-bar-progress';
    seekBar.appendChild(seekBarProgress);

    // Click to seek
    seekBar.onclick = (e) => {
        const rect = seekBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    };

    const duration = document.createElement('div');
    duration.className = 'time';
    duration.textContent = '0:00';

    seekContainer.appendChild(currentTime);
    seekContainer.appendChild(seekBar);
    seekContainer.appendChild(duration);

    controls.appendChild(playBtn);
    controls.appendChild(seekContainer);

    player.appendChild(controls);
    player.appendChild(audio);

    audio.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        currentTime.textContent = formatTime(audio.currentTime);
        const progress = (audio.currentTime / audio.duration) * 100;
        seekBarProgress.style.width = `${progress}%`;
    });

    audio.addEventListener('ended', () => {
        playBtn.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
    });

    return player;
}

// Toggle play/pause
function togglePlay(audio, button) {
    // Pause all other audio elements
    document.querySelectorAll('audio').forEach(a => {
        if (a !== audio && !a.paused) {
            a.pause();
            // Reset other play buttons
            const otherBtn = a.parentElement.querySelector('.play-btn');
            if (otherBtn) {
                otherBtn.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
            }
        }
    });

    if (audio.paused) {
        audio.play();
        button.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M4 3h3v10H4zm5 0h3v10H9z"/></svg>`;
    } else {
        audio.pause();
        button.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
    }
}


/* ============================================
   Track Loading
   ============================================ */

// Create track element
function createTrackElement(entry) {
    const track = document.createElement('div');
    track.className = 'track panel-raised';

    const trackName = document.createElement('div');
    trackName.className = 'track-name';
    trackName.textContent = formatTrackName(entry.name);

    const player = createCustomPlayer(`${GATEWAY_URL}${entry.path}`);

    track.appendChild(trackName);
    track.appendChild(player);

    return track;
}

// Load tracks for a directory
async function loadTracks(dirId, dirPath) {
    const container = document.getElementById(`${dirId}-tracks`);

    try {
        const response = await fetch(`${GATEWAY_URL}/${dirPath}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter audio files and sort by name
        const audioFiles = data.entries
            .filter(entry => !entry.is_dir &&
                   (entry.mime_type.startsWith('audio/') ||
                    entry.name.match(/\.(mp3|m4a|wav|ogg)$/i)))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Clear loading message
        container.innerHTML = '';

        if (audioFiles.length === 0) {
            container.innerHTML = '<div class="loading">no tracks found</div>';
            return;
        }

        // Create track elements
        audioFiles.forEach(entry => {
            const trackElement = createTrackElement(entry);
            container.appendChild(trackElement);
        });

    } catch (error) {
        console.error(`Error loading ${dirPath}:`, error);
        container.innerHTML = `<div class="error">failed to load tracks. please try again later.</div>`;
    }
}

/* ============================================
   Releases Loading
   ============================================ */

// Format release name for display (convert folder-name to "Folder Name")
function formatReleaseName(folderName) {
    return folderName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Create release element with jewel case UI
function createReleaseElement(name, artFile, tracks) {
    const release = document.createElement('div');
    release.className = 'release panel-raised';

    // Album art with play button overlay
    const artContainer = document.createElement('div');
    artContainer.className = 'release-art';

    if (artFile) {
        const artImg = document.createElement('img');
        artImg.src = `${GATEWAY_URL}${artFile.path}`;
        artImg.alt = `${name} cover art`;
        artImg.loading = 'lazy';
        artContainer.appendChild(artImg);
    } else {
        artContainer.innerHTML = '<div class="release-art-placeholder">no art</div>';
    }

    // Big play button overlay
    const playOverlay = document.createElement('button');
    playOverlay.className = 'release-play-btn';
    playOverlay.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
    artContainer.appendChild(playOverlay);

    // Hidden audio element for album playback
    const audio = document.createElement('audio');
    audio.preload = 'none';
    let currentTrackIndex = 0;

    // Set up audio source
    if (tracks.length > 0) {
        audio.src = `${GATEWAY_URL}${tracks[0].path}`;
    }

    // Play next track when current ends
    audio.addEventListener('ended', () => {
        currentTrackIndex++;
        if (currentTrackIndex < tracks.length) {
            audio.src = `${GATEWAY_URL}${tracks[currentTrackIndex].path}`;
            audio.play();
            // Update active track highlight
            updateActiveTrack(release, currentTrackIndex);
        } else {
            // Reset to beginning
            currentTrackIndex = 0;
            audio.src = `${GATEWAY_URL}${tracks[0].path}`;
            playOverlay.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
            playOverlay.classList.remove('playing');
            updateActiveTrack(release, -1);
        }
    });

    // Update progress bar during playback
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        updateTrackProgress(release, currentTrackIndex, progress, audio.currentTime, audio.duration);
    });

    playOverlay.onclick = () => {
        // Pause all other audio elements
        document.querySelectorAll('audio').forEach(a => {
            if (a !== audio && !a.paused) {
                a.pause();
                // Reset other play buttons
                const otherBtn = a.closest('.release')?.querySelector('.release-play-btn');
                if (otherBtn) {
                    otherBtn.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
                    otherBtn.classList.remove('playing');
                }
            }
        });

        if (audio.paused) {
            audio.play();
            playOverlay.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M4 3h3v10H4zm5 0h3v10H9z"/></svg>`;
            playOverlay.classList.add('playing');
            updateActiveTrack(release, currentTrackIndex);
        } else {
            audio.pause();
            playOverlay.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>`;
            playOverlay.classList.remove('playing');
        }
    };

    // Add audio to artContainer (keeps it out of flex flow)
    artContainer.appendChild(audio);

    // Release info
    const info = document.createElement('div');
    info.className = 'release-info';

    const title = document.createElement('h3');
    title.textContent = formatReleaseName(name);
    info.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'release-meta';
    meta.textContent = `${tracks.length} track${tracks.length !== 1 ? 's' : ''}`;
    info.appendChild(meta);

    // Track list (clickable to jump to track)
    const trackList = document.createElement('div');
    trackList.className = 'release-tracks';

    tracks.forEach((track, index) => {
        const trackEl = document.createElement('div');
        trackEl.className = 'release-track';
        trackEl.dataset.trackIndex = index;

        const trackNumber = document.createElement('span');
        trackNumber.className = 'release-track-number';
        trackNumber.textContent = `${index + 1}.`;

        const trackName = document.createElement('span');
        trackName.className = 'release-track-name';
        // Remove leading numbers and format
        const cleanName = track.name
            .replace(/^\d+[-_.\s]*/, '')
            .replace(/\.(mp3|m4a|wav|ogg)$/i, '');
        trackName.textContent = cleanName;

        // Click to play this track
        trackEl.onclick = () => {
            currentTrackIndex = index;
            audio.src = `${GATEWAY_URL}${tracks[index].path}`;
            audio.play();
            playOverlay.innerHTML = `<svg fill="currentColor" viewBox="0 0 16 16"><path d="M4 3h3v10H4zm5 0h3v10H9z"/></svg>`;
            playOverlay.classList.add('playing');
            updateActiveTrack(release, index);
        };

        // Progress bar (hidden until active)
        const progressContainer = document.createElement('div');
        progressContainer.className = 'release-track-progress';

        const progressBar = document.createElement('div');
        progressBar.className = 'release-track-progress-bar';
        progressContainer.appendChild(progressBar);

        const timeDisplay = document.createElement('span');
        timeDisplay.className = 'release-track-time';
        timeDisplay.textContent = '';

        trackEl.appendChild(trackNumber);
        trackEl.appendChild(trackName);
        trackEl.appendChild(timeDisplay);
        trackEl.appendChild(progressContainer);

        trackList.appendChild(trackEl);
    });

    info.appendChild(trackList);

    release.appendChild(artContainer);
    release.appendChild(info);

    return release;
}

// Update which track is highlighted as active
function updateActiveTrack(releaseEl, activeIndex) {
    const tracks = releaseEl.querySelectorAll('.release-track');
    tracks.forEach((track, index) => {
        if (index === activeIndex) {
            track.classList.add('active');
        } else {
            track.classList.remove('active');
            // Reset progress bar when not active
            const progressBar = track.querySelector('.release-track-progress-bar');
            const timeDisplay = track.querySelector('.release-track-time');
            if (progressBar) progressBar.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '';
        }
    });
}

// Update progress bar for active track
function updateTrackProgress(releaseEl, trackIndex, progress, currentTime, duration) {
    const tracks = releaseEl.querySelectorAll('.release-track');
    const activeTrack = tracks[trackIndex];
    if (activeTrack) {
        const progressBar = activeTrack.querySelector('.release-track-progress-bar');
        const timeDisplay = activeTrack.querySelector('.release-track-time');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (timeDisplay && !isNaN(duration)) {
            timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
    }
}

// Load releases from JAX gateway
async function loadReleases() {
    const container = document.getElementById('releases-container');

    try {
        const response = await fetch(`${GATEWAY_URL}/releases`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Get subdirectories (each is a release)
        const releasesDirs = data.entries.filter(e => e.is_dir);

        container.innerHTML = '';

        if (releasesDirs.length === 0) {
            container.innerHTML = '<div class="loading">no releases found</div>';
            return;
        }

        for (const releaseDir of releasesDirs) {
            // Fetch release contents
            const releaseResponse = await fetch(`${GATEWAY_URL}${releaseDir.path}`);
            const releaseData = await releaseResponse.json();

            // Find art.png and audio files
            const artFile = releaseData.entries.find(e =>
                e.name.toLowerCase() === 'art.png' ||
                e.name.toLowerCase() === 'art.jpg' ||
                e.name.toLowerCase() === 'art.jpeg'
            );
            const audioFiles = releaseData.entries
                .filter(e => !e.is_dir && e.name.match(/\.(mp3|m4a|wav|ogg)$/i))
                .sort((a, b) => a.name.localeCompare(b.name));

            // Create release element
            const releaseEl = createReleaseElement(releaseDir.name, artFile, audioFiles);
            container.appendChild(releaseEl);
        }

    } catch (error) {
        console.error('Error loading releases:', error);
        container.innerHTML = '<div class="error">failed to load releases. please try again later.</div>';
    }
}

/* ============================================
   Initialization
   ============================================ */

// Load partials and tracks when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load HTML partials
    loadPartials();

    // Load all music directories
    directories.forEach(dir => {
        loadTracks(dir.id, dir.path);
    });

    // Load releases
    loadReleases();
});

// Make switchTab available globally for onclick handlers
window.switchTab = switchTab;
