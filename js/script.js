if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

document.addEventListener("DOMContentLoaded", () => {

    // local storage for typed data cus why not
    var boxdata = document.getElementById('pasteData');
    if (localStorage.getItem('csv-viewer-1')) {
        boxdata.value = localStorage.getItem('csv-viewer-1');
    } else {
        boxdata.placeholder = "paste or type raw csv here like:\nname,company,email;\nlucille johnston,big melons,lucy@bigmelon.com;\n";
    }

    const togglePanelButton = document.getElementById("togglePanelButton");
    const optionsPanel = document.getElementById("optionsPanel");
    const closePanelButton = document.querySelector(".menu-close-icon");

    togglePanelButton.addEventListener("click", () => {
        if (optionsPanel.classList.contains("open")) {
            optionsPanel.style.transform = "translate(-1000px, -1000px)";
            optionsPanel.classList.remove("open");
        } else {
            optionsPanel.style.transform = "translate(0, 0)";
            optionsPanel.classList.add("open");
        }
    });

    closePanelButton.addEventListener("click", () => {
        optionsPanel.style.transform = "translate(-1000px, -1000px)";
        optionsPanel.classList.remove("open");
    });

    function parseData(data, delimiter) {
        const lines = data.split("\n");
        const headers = lines[0].split(delimiter);
        const rows = lines
            .slice(1)
            .filter((line) => line.trim() !== "")
            .map((line) => line.split(delimiter));
        return { headers, rows };
    }

    function displayTable(data) {
        const table = document.getElementById("dataTable");
        table.innerHTML = "";

        const headerRow = table.createTHead().insertRow();
        data.headers.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        data.rows.forEach((row) => {
            const tr = tbody.insertRow();
            row.forEach((cell) => {
                const td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            });
        });
    }
//added data parameter for the parsed
    function loadData(data, delimiter, sharedFilename) {
        try {
            const parsedData = parseData(data, delimiter);
            displayTable(parsedData);
              // Display filename if it's from a share
        } catch (error) {
            alert("Error parsing data: " + error.message);
        }
    }

    document.getElementById("loadUrlButton").addEventListener("click", () => {
        const url = document.getElementById("urlInput").value;
        if (!url || url.trim() === '') {
            alert("Please enter a valid URL");
            return;
        }
           const delimiter = document.getElementById("delimiter").value;
        fetch(url, { mode: "cors" })
            .then((response) => response.text())
            .then((data) => loadData(data, delimiter))
            .catch((error) => alert("Error loading URL: " + error.message));
    });

    document.getElementById('fileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            const delimiter = document.getElementById('delimiter').value;
            reader.onload = (e) => loadData(e.target.result, delimiter);
            reader.readAsText(file);
        } else {
            console.warn("No file selected.");
            alert("Please select a file.");
        }
    });

    document.getElementById("loadPasteButton").addEventListener("click", () => {
        const data = document.getElementById("pasteData").value;
        const delimiter = document.getElementById("delimiter").value;
        window.localStorage.setItem("csv-viewer-1", data);
        loadData(data, delimiter);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const urlParam = urlParams.get("url");
    const delimiter = document.getElementById("delimiter").value;
    const defaultURL =
        "https://raw.githubusercontent.com/18F/analytics.usa.gov/refs/heads/develop/ga4-data/defense/os-browsers.csv";

// Handle shared data + query params
    async function handleSharedData() {
        if (urlParams.get('shared') === 'true') {
            try {
                const cache = await caches.open('shared-csv-data');
                const sharedResponse = await cache.match('shared.csv');

                if (sharedResponse) {
                    const sharedText = await sharedResponse.text();
                    //const sharedName = (await sharedResponse.blob()).name || "shared_data"; //extract file
                    loadData(sharedText, delimiter);
                    await cache.delete('shared.csv'); // Clean up after
                } else {
                    console.warn('No shared data found in cache.');
                    //maybe do default fetch();
                }
            } catch (error) {
                console.error('Error handling shared data:', error);
                  alert('An error occurred while loading shared data.');
            }
            //history.replaceState(null, '', window.location.pathname);          
        } else if (urlParam) {
            fetch(urlParam, { mode: "cors" })
                .then((response) => response.text())
                .then((data) => loadData(data, delimiter))
                .catch((error) => alert("Error loading URL parameter: " + error.message));
        } else {
            fetch(defaultURL, { mode: "cors" })
                .then((response) => response.text())
                .then((data) => loadData(data, delimiter))
                .catch((error) => alert("Error loading default URL: " + error.message));
        }
    }

    handleSharedData(); //call on load.


    function shareData() {
        const table = document.getElementById('dataTable');
        const csvData = tableToCSV(table); // Convert table to CSV string

        if (navigator.share) {
            navigator.share({
                title: 'Shared CSV Data',
                text: 'Here is the CSV data:',
                files: [new File([csvData], 'data.csv', { type: 'text/csv' })]
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            alert('Web Share API not supported in this browser.');
        }
    }

    function tableToCSV(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        const csv = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map(cell => `"${cell.textContent.replace(/"/g, '""')}"`).join(',');
        }).join('\n');
        return csv;
    }

    // todo share button activate in html and css on androids
    /* document.getElementById('shareButton').addEventListener('click', shareData);
    }); */

});
