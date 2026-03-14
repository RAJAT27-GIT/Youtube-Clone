const videoCardContainer = document.querySelector('.video-container');

let api_key = "AIzaSyDdOuXDS-I1qhbyeLy2oYAscNHFYwc_uh0";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

// Add loading state
videoCardContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Loading videos...</div>';

fetch(video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 20, // Reduced for better performance
    regionCode: 'IN'
}))
.then(res => {
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
})
.then(data => {
    if (data.error) {
        throw new Error(data.error.message);
    }
    videoCardContainer.innerHTML = ''; // Clear loading message
    data.items.forEach(item => {
        getChannelIcon(item);
    });
})
.catch(err => {
    console.error('Error fetching videos:', err);
    videoCardContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #666;">
            <h3>Failed to load videos</h3>
            <p>${err.message}</p>
            <button onclick="location.reload()" style="padding: 10px 20px; background: #ff0000; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
        </div>
    `;
});

const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        if (data.items && data.items.length > 0) {
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        } else {
            video_data.channelThumbnail = 'images/profile-pic.png'; // Fallback image
        }
        makeVideoCard(video_data);
    })
    .catch(err => {
        console.error('Error fetching channel icon:', err);
        video_data.channelThumbnail = 'images/profile-pic.png'; // Fallback image
        makeVideoCard(video_data);
    });
}

const makeVideoCard = (data) => {
    videoCardContainer.innerHTML += `
    <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    </div>
    `;
}

const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
let searchLink = "https://www.youtube.com/results?search_query=";

searchBtn.addEventListener('click', () => {
    if(searchInput.value.length){
        location.href = searchLink + searchInput.value;
    }
})

// Sidebar toggle functionality
const toggleBtn = document.querySelector('.toggle-btn');
const sideBar = document.querySelector('.side-bar');
const filters = document.querySelector('.filters');
const videoContainer = document.querySelector('.video-container');

toggleBtn.addEventListener('click', () => {
    sideBar.classList.toggle('small-sidebar');
    filters.classList.toggle('small-sidebar');
    videoContainer.classList.toggle('large-container');
});

// Filter buttons functionality
const filterOptions = document.querySelectorAll('.filter-options');
filterOptions.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterOptions.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
    });
});