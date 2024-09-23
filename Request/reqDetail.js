// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        requestId: params.get('requestId')
    };
}

// Fetch the request ID from the URL
const { requestId } = getQueryParams();

// Fetch the data from the PHP service
fetch(`https://reevaltech.com/scripts/getRequestDetailsService.php?requestId=${requestId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Log the raw data to see its structure

        // Parse the stringified data inside 'data' field
        let parsedData;
        try {
            parsedData = JSON.parse(data.data);
        } catch (error) {
            console.error('Error parsing data field:', error);
            return;
        }

        if (parsedData && Array.isArray(parsedData)&& parsedData.length > 0) {
            // Update Header Section
            document.getElementById('header').innerText = parsedData[0].HeaderLine;
            document.getElementById('request-id').innerText = parsedData[0].RequestID;
            document.getElementById('name').innerText = `${parsedData[0].FirstName} ${parsedData[0].LastName}`;
            document.getElementById('total-exp').innerText = `${parsedData[0].TotalExpInYear}Y ${parsedData[0].TotalExpInMonth}M`;
            document.getElementById('request-date').innerText = parsedData[0].RequestDate;
            document.getElementById('request-type').innerText = parsedData[0].RequestType;
            document.getElementById('start-time').innerText = parsedData[0].SlotStartDateTime;
            document.getElementById('end-time').innerText = parsedData[0].SlotEndDateTime;

            // Update Status
            const statusElem = document.getElementById('status');
            statusElem.innerText = parsedData[0].RequestCurrentStatus;
            if (parsedData[0].RequestCurrentStatus.toLowerCase() === 'active') {
                statusElem.classList.add('active');
            }

            // Update Skills Section
            const skillsContainer = document.getElementById('skills');
            // Clear existing skill boxes if any
            skillsContainer.innerHTML = ''; // Clear previous content
            parsedData.forEach(item => {
                const skillBox = document.createElement('div');
                skillBox.classList.add('skill-box');
                skillBox.innerHTML = `
                    <span>${item.SkillName}</span>
                    <span>${item.SkillExpInYear}Y ${item.SkillExpInMonth}M</span>
                `;
                skillsContainer.appendChild(skillBox);
            });
        } else {
            console.error('Error: Data is not in expected format');
        }
    })
    .catch(error => console.error('Error fetching data:', error));
