# csv-viewer
Flexible Parsing of CSV Data

A simple, lightweight web-based viewer for CSV and TSV files. It allows you to load data from remote URLs, local files, or by pasting directly into the browser. Putting the See back in CSV

## Features

* **Load data from multiple sources:**
    * Remote URLs (supports CORS).
    * Local files (using the FileReader API).
    * Directly pasted data.
* **Flexible delimiter support:** Specify the delimiter (comma, tab, etc.) for parsing.
* **Clean and responsive table display:**
    * Full-screen table view.
    * Styled to resemble the Chromium team's table styling.
    * Alternating row colors for readability.
    * Hover highlighting.
* **Options panel:** A slide-in panel for easy access to data loading options.
* **URL parameter loading:** Load data directly from a URL passed as a parameter.


## Usage

1.  **Open the viewer:** Open the `index.html` file in your web browser.
2.  **Load data:**
    * **Remote URL:** Enter the URL of your CSV/TSV file in the "URL" input field and click "Load URL."
    * **Local File:** Click "Choose File" and select a file from your computer.
    * **Paste Data:** Paste your CSV/TSV data into the text area and click "Load Pasted Data."
3.  **Specify delimiter:** Adjust the delimiter in the "Delimiter" input field if needed.
4.  **View data:** The data will be displayed in a full-screen table.
5.  **Options panel:** Click the hamburger icon in the top right corner to open/close the options panel.
6.  **URL parameter loading:** Add `?url=YOUR_URL_HERE` to the end of the HTML file's URL to load a remote file automatically.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    ```
2.  **Open `index.html`:** Open the `index.html` file in your web browser.

## Technologies Used

* HTML (Pug)
* CSS
* JavaScript
* Jquery
* 
## Example URL Parameter

To load a file directly from a url, just add the url as a parameter ``?url=[csv file]``


Project is based on a chromebook releases page circa 2012. What an exciting time.  HTML5, CSS3, WebGL, Chrome Extensions, ChromeOS. I loved the Chromium team's simple but wonderfully readable coloring scheme on that particular page. So I thought I'd breathe a little life back into as a nod to them. But I think it's legit useful too. Just need to finish styling the panel. 

