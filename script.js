const recordBtn = document.getElementById('record-btn');
const textOutput = document.getElementById('text-output');
const status = document.getElementById('status');
const languageSelect = document.getElementById('language-select');

let recognition;
let isRecording = false; // Track recording state

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value; // Set default language

    recognition.onresult = function (event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                interimTranscript += transcript;
            }
        }
        textOutput.value += interimTranscript;
    };

    recognition.onerror = function (event) {
        status.textContent = 'Error occurred in recognition: ' + event.error;
    };

    recognition.onend = function () {
        if (isRecording) {
            toggleRecording(); // Stop recording if it ends unexpectedly
        }
    };
}

// Toggle recording state
function toggleRecording() {
    if (isRecording) {
        recognition.stop();
        recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
        status.textContent = 'Recording stopped.';
        recordBtn.classList.remove("stop");
    } else {
        recognition.start();
        recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
        recordBtn.classList.add("stop");
        status.textContent = 'Recording started...';
    }
    isRecording = !isRecording; // Toggle state
}

// Event listener for the record button
recordBtn.addEventListener('click', toggleRecording);

// Update language when dropdown changes
languageSelect.addEventListener('change', () => {
    recognition.lang = languageSelect.value;
    
    if(recognition.lang=='ar-SA')
        textOutput.style.textAlign = "right";
    else
        textOutput.style.textAlign = "left";

    status.textContent = `Language changed to: ${languageSelect.options[languageSelect.selectedIndex].text}`;
});