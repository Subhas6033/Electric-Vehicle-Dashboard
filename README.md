# Electric Vehicle Dashboard

This is a frontend dashboard built with **React** and **Tailwind CSS**, designed to visualize electric vehicle (EV) data. The dashboard allows users to explore various metrics, charts, and tables related to electric vehicles, such as VIN, County, Make, Model Year, Electric Range, and more. It includes a search feature to filter data based on City, Country, Company, Model, and Year.

The project uses **Papa Parse** to convert CSV files into JSON format for easier data processing and visualization.


## 🔗 Live Demo

Check out the live site here: [https://ev-eosin.vercel.app/](https://ev-eosin.vercel.app/)


## Features

- **Interactive Dashboard:** Visualize EV data in an easy-to-understand layout.
- **CSV Parsing:** Uses Papa Parse to convert CSV data into JSON for display and interaction.
- **Search and Filter:** Search and filter EV data by City, Country, Company, Model, and Year.
- **Data Tables:** Display EV information in a structured table format.
- **Charts and Graphs:** Visualize data trends using interactive charts (e.g., electric range vs. model year).
- **Responsive Design:** Fully responsive and mobile-friendly UI using Tailwind CSS.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **CSV to JSON:** [Papa Parse](https://www.papaparse.com/)
- **Charts:** Recharts
- **Data Source:** CSV dataset of electric vehicles (converted to JSON via Papa Parse)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/your-username/EV.git
    ```

2. Navigate to the project folder:

    ```bash
    cd EV
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm start
    ```

5. Open your browser and go to `http://localhost:3000` to view the dashboard.

## Usage

- Upload or load a CSV file with EV data.
- The data will be parsed into JSON using Papa Parse.
- Use the search and filter options to explore and narrow down the dataset.
- View the results in dynamic charts and structured tables.



