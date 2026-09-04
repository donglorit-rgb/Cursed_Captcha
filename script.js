const canvas = document.getElementById('cursor-canvas');
const context = canvas.getContext('2d');
const checkbox = document.getElementById('robot-checkbox');
const checkboxRow = checkbox.closest('.checkbox-row');
const modal = document.getElementById('challenge-modal');
const grid = document.getElementById('captcha-grid');
const cursorCountLabel = document.getElementById('cursor-count');
const clickCountLabel = document.getElementById('click-count');
const challengeStatus = document.getElementById('challenge-status');
const toast = document.getElementById('toast');
let cursorCount = 1n;
let clickCount = 0;
let pointer = { x: innerWidth / 2, y: innerHeight / 2 };
let cursors = [{ x: pointer.x, y: pointer.y, dx: 0, dy: 0, speed: 1 }];
let correctTiles = [];
let challengeIndex = -1;
let toastTimer;
const maxRenderedCursors = 5000;
const heartShapeClickThreshold = 101;
const cursorsAddedPerClick = 5n;
const discouragementMessages = {
    10: 'Ten clicks already. You can still stop and pretend this never happened.',
    20: 'Twenty clicks. The sensible choice is to give up now.',
    30: 'Thirty clicks in. Your determination is becoming concerning.',
    40: 'Forty clicks. Surely there is something better to do.',
    50: 'Halfway to one hundred. Or halfway to giving up. Choose wisely.',
    60: 'Sixty clicks. The cursors are not impressed by your persistence.',
    70: 'Seventy clicks. This is an excellent moment to abandon the mission.',
    80: 'Eighty clicks. You have proven enough. Please stop trying.',
    90: 'Ninety clicks. Ten more would be unnecessary, which is exactly why you will do them.',
    100: 'One hundred clicks. You could give up now, but the hearts are almost here.'
};
const challenges = [
    { object: 'traffic lights', target: 'trafficlight', decoy: 'street,road' },
    { object: 'crosswalks', target: 'crosswalk', decoy: 'street,car' },
    { object: 'buses', target: 'bus,city', decoy: 'road,vehicle' },
    { object: 'bicycles', target: 'bicycle,city', decoy: 'street,road' },
    { object: 'cars', target: 'car,street', decoy: 'building,street' }
];
const photoUrl = (query, lock) => `https://loremflickr.com/640/480/${query}?lock=${lock}`;
const challengeTitle = document.getElementById('challenge-title');
const challengeGrid = document.getElementById('captcha-grid');
const challengeHeading = document.querySelector('.challenge-header h2');
const challengeDescription = document.querySelector('.challenge-header p:last-child');

function nextChallenge() {
    challengeIndex = (challengeIndex + 1) % challenges.length;
    const challenge = challenges[challengeIndex];
    challengeHeading.innerHTML = `Select all squares with <strong>${challenge.object}</strong>`;
    challengeGrid.setAttribute('aria-label', `${challenge.object} image grid`);
    challengeDescription.textContent = 'If there are none, click skip.';
    return challenge;
}

function resizeCanvas() { const ratio = devicePixelRatio || 1; canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); }
function movePointer(event) { pointer.x = event.clientX; pointer.y = event.clientY; }
function addDecoyCursor() {
    const cursorsToAdd = cursorsAddedPerClick;
    clickCount += 1;
    cursorCount += cursorsToAdd;
    const remainingRenderSlots = Math.max(0, maxRenderedCursors - cursors.length);
    const renderedCursorsToAdd = Number(cursorsToAdd > BigInt(remainingRenderSlots) ? BigInt(remainingRenderSlots) : cursorsToAdd);
    for (let index = 0; index < renderedCursorsToAdd; index += 1) {
        cursors.push({ x: pointer.x, y: pointer.y, dx: (Math.random() - .5) * 600, dy: (Math.random() - .5) * 600 });
    }
    cursorCountLabel.textContent = cursorCount.toLocaleString();
    clickCountLabel.textContent = clickCount;
    if (discouragementMessages[clickCount]) showToast(discouragementMessages[clickCount]);
}
function drawCursor(x, y) {
    context.save(); context.globalAlpha = 1; context.translate(x, y);
    if (clickCount >= heartShapeClickThreshold) {
        context.beginPath();
        context.moveTo(0, 6);
        context.bezierCurveTo(-18, -7, -14, -20, -6, -14);
        context.bezierCurveTo(-2, -11, 0, -7, 0, -4);
        context.bezierCurveTo(0, -7, 2, -11, 6, -14);
        context.bezierCurveTo(14, -20, 18, -7, 0, 6);
        context.closePath();
        context.fillStyle = '#ef5b72'; context.strokeStyle = '#151b23'; context.lineWidth = 2; context.lineJoin = 'round'; context.fill(); context.stroke(); context.restore();
        return;
    }
    context.beginPath(); context.moveTo(0, 0); context.lineTo(0, 23); context.lineTo(6, 17); context.lineTo(11, 28); context.lineTo(15, 26); context.lineTo(10, 15); context.lineTo(18, 15); context.closePath();
    context.fillStyle = '#fff'; context.strokeStyle = '#151b23'; context.lineWidth = 2; context.lineJoin = 'round'; context.fill(); context.stroke(); context.restore();
}
function animate() {
    context.clearRect(0, 0, innerWidth, innerHeight);
    cursors[0].x = pointer.x; cursors[0].y = pointer.y;
    drawCursor(pointer.x, pointer.y);
    for (let index = 1; index < cursors.length; index += 1) {
        const cursor = cursors[index]; cursor.x = pointer.x + cursor.dx; cursor.y = pointer.y + cursor.dy;
        drawCursor(cursor.x, cursor.y);
    }
    requestAnimationFrame(animate);
}
function showToast(message) { toast.textContent = message; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 3600); }
function buildChallenge() {
    grid.innerHTML = '';
    const challenge = nextChallenge();
    const correctCount = 3 + Math.floor(Math.random() * 3);
    const shuffledTiles = [...Array(9).keys()].sort(() => Math.random() - .5);
    correctTiles = shuffledTiles.slice(0, correctCount);
    for (let index = 0; index < 9; index += 1) {
        const tile = document.createElement('button');
        const isTrafficLight = correctTiles.includes(index);
        tile.type = 'button'; tile.className = 'captcha-tile'; tile.dataset.light = isTrafficLight;
        tile.style.backgroundImage = `url("${photoUrl(isTrafficLight ? challenge.target : challenge.decoy, 100 + challengeIndex * 20 + index)}")`;
        tile.setAttribute('aria-label', `Image tile ${index + 1}`); tile.setAttribute('aria-pressed', 'false');
        tile.addEventListener('click', () => { tile.classList.toggle('selected'); tile.setAttribute('aria-pressed', tile.classList.contains('selected')); });
        grid.appendChild(tile);
    }
}
function openChallenge() { checkboxRow.classList.add('is-checked'); setTimeout(() => { modal.hidden = false; buildChallenge(); }, 550); }
function closeChallenge() { modal.hidden = true; }
function verifyChallenge() { const selected = [...grid.children].map((tile, index) => tile.classList.contains('selected') ? index : -1).filter(index => index >= 0); const passed = selected.length === correctTiles.length && selected.every(index => correctTiles.includes(index)); if (passed) { showToast('Correct. Unfortunately, there is another one.'); challengeStatus.style.color = '#1a9b55'; challengeStatus.textContent = 'Success. Generating another profoundly necessary check...'; setTimeout(() => { buildChallenge(); challengeStatus.style.color = ''; challengeStatus.textContent = 'Make your best guess. We will pretend to be impressed.'; }, 650); } else { challengeStatus.textContent = 'Verification failed. The cursor swarm wins this round.'; challengeStatus.style.color = '#d14b2c'; setTimeout(() => { closeChallenge(); checkboxRow.classList.remove('is-checked'); showToast('Humanity rejected (finally). Refresh to suffer again.'); }, 500); } }
document.addEventListener('mousemove', movePointer, { passive: true });
document.addEventListener('mousedown', addDecoyCursor);
window.addEventListener('resize', resizeCanvas);
checkbox.addEventListener('click', openChallenge);
document.getElementById('close-modal').addEventListener('click', closeChallenge);
document.getElementById('verify-button').addEventListener('click', verifyChallenge);
document.getElementById('skip-button').addEventListener('click', () => { closeChallenge(); showToast('Skipped. The machines are unconvinced, but intrigued.'); });
document.getElementById('reload-button').addEventListener('click', buildChallenge);
document.getElementById('audio-button').addEventListener('click', () => showToast('Audio challenge unavailable: the cursors are screaming already.'));
resizeCanvas(); buildChallenge(); animate();