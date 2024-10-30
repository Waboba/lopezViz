// Sample addresses (you can replace these with your own)

async function geocodeAddress(address) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.length > 0) {
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
        };
    } else {
        throw new Error("Geocoding failed for address: " + address);
    }
}





const addresses = [
    "Santiago, Chile",
    "Valparaíso, Chile",
    "Concepción, Chile",
    "La Serena, Chile"
];

// Function to geocode addresses and plot them on the map
async function plotAddresses() {
    const geocodedAddresses = [];

    for (const address of addresses) {
        try {
            const coordinates = await geocodeAddress(address);
            geocodedAddresses.push(coordinates);
        } catch (error) {
            console.error(error);
        }
    }

    drawMap(geocodedAddresses);
}

// Draw the map with D3.js
function drawMap(locations) {
    const svg = d3.select("#map");

    // Set up a projection for the map
    const projection = d3.geoMercator()
        .center([-71.3, -33]) // Center of Chile
        .scale(100000)
        .translate([400, 300]); // Translate to fit the SVG

    const path = d3.geoPath().projection(projection);

    // Draw points for each location
    svg.selectAll("circle")
        .data(locations)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", 5);
}

// Start the plotting process
plotAddresses();
