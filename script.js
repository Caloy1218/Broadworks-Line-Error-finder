document.getElementById('fileInput').addEventListener('change', handleFileChange);

let fileName = '';
let processedContent = '';

function handleFileChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    fileName = file.name;
    setUploadProgress(0);
    document.getElementById('downloadButton').disabled = true;

    reader.onloadstart = () => setUploadProgress(10);

    reader.onprogress = (event) => {
        if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
        }
    };

    reader.onloadend = (event) => {
        setUploadProgress(100);
        document.getElementById('downloadButton').disabled = false;
        const content = event.target.result;
        processFileContent(content);
    };

    reader.readAsText(file);
}

function setUploadProgress(progress) {
    document.getElementById('uploadProgressText').innerText = `Search Error Progress: ${progress}%`;
    document.getElementById('uploadProgressBar').style.width = `${progress}%`;
}

function processFileContent(content) {
    const linesArray = content.split('\n');
    let excessCount = 0;
    let lackingCount = 0;
    const excessLines = [];
    const lackingLines = [];

    const filteredLines = linesArray.filter((line, index) => {
        if (index === linesArray.length - 1) return true;
        if (line.length > 421) {
            excessCount++;
            excessLines.push(`Line ${index + 1}: ${line}`);
            return false;
        } else if (line.length < 421) {
            lackingCount++;
            lackingLines.push(`Line ${index + 1}: ${line}`);
            return false;
        }
        return true;
    });

    document.getElementById('excessCount').innerText = excessCount;
    document.getElementById('lackingCount').innerText = lackingCount;

    displayLines(excessLines, 'excessLines');
    displayLines(lackingLines, 'lackingLines');

    processedContent = filteredLines.join('\n');
}

function displayLines(lines, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    lines.forEach((line) => {
        const div = document.createElement('div');
        div.className = 'line';
        
        const boldPart = document.createElement('span');
        const remainingPart = document.createElement('span');
        
        const splitLine = line.split(':');
        boldPart.textContent = `${splitLine[0]}: `;
        remainingPart.textContent = splitLine.slice(1).join(':');
        
        boldPart.style.fontWeight = 'bold';
        
        div.appendChild(boldPart);
        div.appendChild(remainingPart);
        
        element.appendChild(div);
    });
}


document.getElementById('downloadButton').addEventListener('click', createNewFile);

function createNewFile() {
    const parts = fileName.split('.');
    if (parts.length >= 4) {
        const newFileName = `${parts[0]}.${parts[1]}.${parts[2]}.000000.txt`;
        const blob = new Blob([processedContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
