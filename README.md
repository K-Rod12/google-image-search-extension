# Google Image Search

This Raycast extension uses the Google Custom Search API to quickly search for images and display them in a grid view. From there, you can open the original source or copy the image URL.

## Setup

### Prerequisites

1. **Google Custom Search API Key**
   - Visit the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use an existing one
   - Enable the "Custom Search API"
   - Create an API key in the "Credentials" section

2. **Custom Search Engine ID**
   - Go to [Google Programmable Search Engine](https://programmablesearch.google.com/)
   - Create a new search engine
   - Set it to search the entire web
   - Enable "Image search" option
   - Get your Search Engine ID (cx)

### Installation

1. Clone this repository or download it to your local machine
2. Open a terminal and navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the extension in development mode
5. Configure your API Key and Search Engine ID in the extension preferences

## Usage

1. Open Raycast and search for "Google Search Images"
2. Type your search query in the search bar
3. View the results in the grid
4. Click on an image to open the source in your browser or use the action menu to copy the image URL

## Features

- Fast image search directly from Raycast
- Grid view for easy browsing
- Open source in browser
- Copy image URL to clipboard
- Debounced search to avoid excessive API calls