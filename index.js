window.addEventListener("load", () => {
	document.getElementById("wrapper").style.display = "block";
	document.getElementById("loader").style.display = "none";
});

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");
//index for songs
let index;
//initially loop=true(loop the playlist)
let loop = true;
const songsList = [
	{
		name: "Perfect",
		link: "https://www.dropbox.com/s/3mjzj73400sxovk/perfect.mp3?raw=1",
		artists: "Ed Sheeran",
		image: "https://www.dropbox.com/s/crlthbozdznb13g/perfect.jpeg?raw=1"
	},
	{
		name: "7 Rings",
		link: "https://www.dropbox.com/s/yo5tcfdjoz95ozf/7-rings.mp3?raw=1",
		artists: "Ariana Grande",
		image: "https://www.dropbox.com/s/gobvfxj4r0t053v/7-rings.jpg?raw=1"
	},
	{
		name: "Happier",
		link: "https://www.dropbox.com/s/zp1xfir101y4sc3/happier.mp3?raw=1",
		artists: "Marshmello",
		image: "https://www.dropbox.com/s/xxmwcz14hkn7iwl/happier.png?raw=1"
	},
	{
		name: "Stay",
		link: "https://www.dropbox.com/s/umam9olakop001d/stay.mp3?raw=1",
		artists: "Justin Bieber",
		image: "https://www.dropbox.com/s/kierj5lzst1yx9n/stay.jpg?raw=1"
	},
	{
		name: "Girls Like You",
		link: "https://www.dropbox.com/s/yi1cpg16snrl3fc/girls-like-you.mp3?raw=1",
		artists: "Maroon 5",
		image: "https://www.dropbox.com/s/ouq5zzgbqsk9zx0/girls-like-you.png?raw=1"
	}
];
//events object
let events = {
	mouse: {
		click: "click"
	},
	touch: {
		click: "touchstart"
	}
};
let deviceType = "";

//Detect touch device
const is_touch_device = () => {
	try {
		//We try to create TouchEvent (it would fail for desktops and throw error)
		document.createEvent("TouchEvent");
		deviceType = "touch";
		return true;
	} catch (e) {
		deviceType = "mouse";
		return false;
	}
};
//Format time(convert ms to seconds, minutes and add 0 if less than 10)
const timeFormatter = (timeInput) => {
	let minute = Math.floor(timeInput / 60);
	minute = minute < 10 ? "0" + minute : minute;
	let second = Math.floor(timeInput % 60);
	second = second < 10 ? "0" + second : second;
	return `${minute}:${second}`;
};
//pause song
const pauseAudio = () => {
	audio.pause();
	pauseButton.classList.add("hide");
	playButton.classList.remove("hide");
};
//play song
const playAudio = () => {
	audio.play();
	pauseButton.classList.remove("hide");
	playButton.classList.add("hide");
};
//repeat button
repeatButton.addEventListener("click", () => {
	if (repeatButton.classList.contains("active")) {
		repeatButton.classList.remove("active");
		audio.loop = false;
		console.log("Repeat Off");
	} else {
		repeatButton.classList.add("active");
		audio.loop = true;
		console.log("Repeat On");
	}
});
//set song
const setSong = (arrayIndex) => {
	//this extracts all the variables from the object
	let { name, link, artists, image } = songsList[arrayIndex];
	audio.src = link;
	songName.innerHTML = name;
	songArtist.innerHTML = artists;
	songImage.src = image;
	//display duration when metadata loads
	audio.onloadedmetadata = () => {
		maxDuration.innerText = timeFormatter(audio.duration);
	};
};
//next song
const nextSong = () => {
	//if loop is true then continue in normal order
	if (loop) {
		if (index == songsList.length - 1) {
			//if last song is being played
			index = 0;
		} else {
			index += 1;
		}
		setSong(index);
		playAudio();
	} else {
		//else find a random index and play that song
		let randIndex = Math.floor(Math.random() * songsList.length);
		console.log(randIndex);
		setSong(randIndex);
		playAudio();
	}
};
//previous song(you can't go back to a randomly played song)
const previousSong = () => {
	if (index > 0) {
		pauseAudio();
		index -= 1;
	} else {
		//if first song is being played
		index = songsList.length - 1;
	}
	setSong(index);
};

//next song when current song ends
audio.onended = () => {
	nextSong();
};

shuffleButton.addEventListener("click", () => {
	if (shuffleButton.classList.contains("active")) {
		shuffleButton.classList.remove("active");
		loop = true;
		console.log("shuffle Off");
	} else {
		shuffleButton.classList.add("active");
		loop = false;
		console.log("Shuffle On");
	}
});
//previous button
prevButton.addEventListener("click", previousSong);
//next button
nextButton.addEventListener("click", nextSong);
//pause button
pauseButton.addEventListener("click", pauseAudio);
//play button
playButton.addEventListener("click", playAudio);

//if user clicks on progress bar
is_touch_device();
progressBar.addEventListener(events[deviceType].click, (event) => {
	//start of progressBar
	let coordStart = progressBar.getBoundingClientRect().left;
	//mouse click position
	let coordEnd = !is_touch_device() ? event.clientX : event.touches[0].clientX;
	let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
	//set width to progress
	currentProgress.style.width = progress * 100 + "%";
	//set time
	audio.currentTime = progress * audio.duration;
	//play
	audio.play();
	pauseButton.classList.remove("hide");
	playButton.classList.add("hide");
});
//update progress every second
setInterval(() => {
	currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
	currentProgress.style.width =
		(audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);
//update timer
audio.addEventListener("timeupdate", () => {
	currentTimeRef.innerText = timeFormatter(audio.currentTime);
});
//display playlist
playlistButton.addEventListener("click", () => {
	playlistContainer.classList.remove("hide");
});
//hide playlist
closeButton.addEventListener("click", () => {
	playlistContainer.classList.add("hide");
});
//creates playlist
const initializePlaylist = () => {
	for (let i in songsList) {
		playlistSongs.innerHTML += `
      <li class='playlistSong' onclick='setSong(${i})'>
      <div class="playlist-image-container">
      <img src="${songsList[i].image}"/>
      </div>
      <div class="playlist-song-details">
      <span id="playlist-song-name">${songsList[i].name}</span>
      <span id="playlist-song-artist-album">${songsList[i].artists} </span>
      </div>
      </li>
      `;
	}
};

window.onload = () => {
	//initally first song
	index = 0;
	setSong(index);
	//create the playlist
	initializePlaylist();
};
