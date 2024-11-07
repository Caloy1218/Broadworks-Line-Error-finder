document.getElementById('fileInput').addEventListener('change', handleFileChange);

function handleFileChange(e) {
    const files = e.target.files;
    if (files.length > 10) {
        alert("Please select up to 10 files.");
        return;
    }

    document.getElementById('filesContainer').innerHTML = ''; // Clear previous entries

    Array.from(files).forEach(file => {
        const fileReader = new FileReader();

        // Create container for each file
        const fileContainer = document.createElement('div');
        fileContainer.className = 'file-container';
        fileContainer.innerHTML = `<h3>${file.name}</h3>
                                    <p>Excess Lines: <span id="excessCount-${file.name}">0</span></p>
                                    <p>Lacking Lines: <span id="lackingCount-${file.name}">0</span></p>
                                    <div class="paper">
                                        <h4>Deleted Excess Lines:</h4>
                                        <div id="excessLines-${file.name}"></div>
                                    </div>
                                    <div class="paper">
                                        <h4>Deleted Lacking Lines:</h4>
                                        <div id="lackingLines-${file.name}"></div>
                                    </div>`;
        document.getElementById('filesContainer').appendChild(fileContainer);

        fileReader.onload = function(event) {
            processFileContent(event.target.result, file.name);
        };

        fileReader.readAsText(file);
    });
}

function processFileContent(content, fileName) {
    const linesArray = content.split('\n');
    let excessCount = 0;
    let lackingCount = 0;
    const excessLines = [];
    const lackingLines = [];

    linesArray.forEach((line, index) => {
        if (line.length > 421) {
            excessCount++;
            excessLines.push(`Line ${index + 1}: ${line}`);
        } else if (line.length < 421) {
            lackingCount++;
            lackingLines.push(`Line ${index + 1}: ${line}`);
        }
    });

    document.getElementById(`excessCount-${fileName}`).innerText = excessCount;
    document.getElementById(`lackingCount-${fileName}`).innerText = lackingCount;
    displayLines(excessLines, `excessLines-${fileName}`);
    displayLines(lackingLines, `lackingLines-${fileName}`);
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
