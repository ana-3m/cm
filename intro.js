const intro = document.querySelector('#introCanvas');

const hall = new Image();
hall.src = "img/entrada.png";
intro.width = innerWidth;
intro.height = innerHeight;

const canvas = intro.getContext("2d");

// Define the aspect ratio of the video
const videoAspectRatio = 16 / 9; // Assuming the video has a 16:9 aspect ratio

export async function drawIntro() {
    // Calculate the new dimensions for the canvas based on the video aspect ratio
    const windowAspectRatio = innerWidth / innerHeight;

    if (windowAspectRatio > videoAspectRatio) {
        // Window is wider than the video aspect ratio
        intro.height = innerHeight;
        intro.width = innerHeight * videoAspectRatio;
    } else {
        // Window is taller than the video aspect ratio
        intro.width = innerWidth;
        intro.height = innerWidth / videoAspectRatio;
    }

    // Clear and draw the hall image
    canvas.clearRect(0, 0, intro.width, intro.height);
    await canvas.drawImage(hall, 0, 0, intro.width, intro.height);
}

// Wait for the image to load before drawing
hall.onload = () => {
    drawIntro();
};