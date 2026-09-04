# Cursor CAPTCHA

## Overview
Cursor CAPTCHA is a humorous web application designed to simulate a CAPTCHA verification process while introducing a chaotic mechanic where every mouse click adds five visual mouse cursors to the screen. The goal is to create a funny and challenging experience that contrasts a normal CAPTCHA interface with increasingly chaotic cursor behavior.

## Project Structure
The project consists of the following files:

- **index.html**: Contains the main structure of the web application, including the CAPTCHA interface with a security verification heading, CAPTCHA challenge, image grid, and buttons.
  
- **style.css**: Defines the styles for the web application, including layout, colors, typography, and visual effects to create a clean and modern design for the CAPTCHA interface.
  
- **script.js**: Implements the JavaScript logic for the application, handling the cursor duplication mechanic, click detection, CAPTCHA logic, rendering of fake cursors, and updating the user interface with click and cursor statistics.
  
- **README.md**: Provides documentation for the project, including setup instructions, features, and how to run the application locally.

## Features
- Realistic CAPTCHA-style interface with a humorous twist.
- Cursor duplication mechanic that adds five cursors with each click.
- After the 101st click, every rendered cursor changes into a heart.
- Every ten clicks through click 100 displays a different discouraging message, but never blocks progress.
- Milestone messages appear as transparent thought-like text that drifts upward from the bottom of the screen.
- Multiple CAPTCHA challenges to verify user interaction.
- Dynamic updates to cursor and click statistics.
- Responsive design that maintains usability despite increasing chaos.

## Setup Instructions
1. Clone the repository or download the project files.
2. Open the `index.html` file in a web browser to run the application locally.
3. Optionally, use a local server (like VS Code Live Server) for a better experience.

## How to Play
1. Click on the squares in the CAPTCHA challenge to select the correct images based on the prompt.
2. Watch as five visual cursors are added with each click, making the task progressively more challenging. Every ten clicks through 100 displays a different message encouraging you to give up, but you can continue. After click 101, the cursor swarm becomes hearts.
3. Press the "Verify" button to check your selections.
4. If successful, you will be presented with a humorous message. If not, a new challenge will be generated.

## Notes
- The application is designed to be a fun and lighthearted take on traditional CAPTCHA systems.
- Performance considerations have been made to ensure the application remains responsive even with a high number of visual cursors.