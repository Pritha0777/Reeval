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
        console.log(data); // Log the raw data to see its structure

        // Parse the stringified data inside 'data' field
        let parsedData;
        try {
            parsedData = JSON.parse(data.data);
        } catch (error) {
            console.error('Error parsing data field:', error);
            return;
        }

        if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
            // Populate request details
            document.getElementById('header-line').innerText = `${parsedData[0].HeaderLine}`;
            document.getElementById('request-id').innerText = `: ${parsedData[0].RequestID}`;
            document.getElementById('name').innerText = `: ${parsedData[0].FirstName} ${parsedData[0].LastName}`;
            document.getElementById('total-exp').innerText = `: ${parsedData[0].TotalExpInYear}Y ${parsedData[0].TotalExpInMonth}M`;
            document.getElementById('request-date').innerText = `: ${parsedData[0].RequestDate}`;
            document.getElementById('request-type').innerText = `: ${parsedData[0].RequestType}`;
            document.getElementById('start-time').innerText = `: ${parsedData[0].SlotStartDateTime}`;
            document.getElementById('end-time').innerText = `: ${parsedData[0].SlotEndDateTime}`;

            // Update Status
            const statusElem = document.getElementById('status');
            const reqCurrStatus = parsedData[0].RequestCurrentStatus;  // Get current request status
            const reqIsNotApproved = parsedData[0].IsNotApproved; // Assuming this is part of your data
            const reqIsUserJoinTimeExpired = parsedData[0].IsUserJoinTimeExpired; // Assuming this is part of your data
            const reqIsEvaluatorJoinTimeExpired = parsedData[0].IsEvaluatorJoinTimeExpired; // Assuming this is part of your data
            const reqIsRequestor = parsedData[0].IsRequestor; // Assuming this is part of your data
            const reqIsEvaluator = parsedData[0].IsEvaluator; // Assuming this is part of your data
            const reqIsCancelable = parsedData[0].IsCancelable; // Assuming this is part of your data
            const reqIsMapped = parsedData[0].IsMapped; // Assuming this is part of your data

            let statusText = '';

            // Status Logic Based on Old Code
            if (reqIsNotApproved == 1) {
                statusText = 'Processing...';
            } else if (reqIsUserJoinTimeExpired == 1 || reqIsEvaluatorJoinTimeExpired == 1) {
                statusText = 'Joining time expired';
            } else if (reqCurrStatus === "Active") {
                if (reqIsRequestor == 1) {
                    if (reqIsCancelable == 1) {
                        statusText = 'Active';
                    } else {
                        statusText = 'Request is Expired';
                    }
                } else if (reqIsEvaluator == 0) {
                    if (reqIsMapped == 1) {
                        if (reqIsCancelable == 1) {
                            statusText = 'Accepted';
                        } else {
                            statusText = 'Active';
                        }
                    } else {
                        if (reqIsCancelable == 1) {
                            // this use case will never arise
                        } else {
                            statusText = 'Active';
                        }
                    }
                }
            } else if (reqCurrStatus === "Accepted") {
                if (reqIsRequestor == 1 || reqIsEvaluator == 1) {
                    if (reqIsCancelable == 1) {
                        statusText = 'Accepted';
                    } else {
                        statusText = 'Join Now';
                    }
                }
            } else if (reqCurrStatus === "Expired") {
                statusText = 'Request is Expired';
            } else if (reqCurrStatus === "CancelledByCandidate") {
                statusText = 'Cancelled by Candidate';
            } else if (reqCurrStatus === "CancelledByEvaluator") {
                // this case is handled elsewhere and will be updated from the backend
            } else if (reqCurrStatus === "CandidateNonAttendance") {
                statusText = 'Candidate did not show up in time';
            } else if (reqCurrStatus === "EvaluatorNonAttendance") {
                statusText = 'Panel did not show up in time';
            } else if (reqCurrStatus === "NoShow") {
                statusText = 'Both Candidate & Panel did not show up in time';
            } else if (reqCurrStatus === "AwaitingFeedback") {
                statusText = 'Awaiting Feedback';
            } else if (reqCurrStatus === "FeedbackNotRecieved") {
                statusText = 'Panel failed to submit feedback';
            } else if (reqCurrStatus === "FeedbackSubmitted") {
                statusText = 'Feedback Submitted';
            } else if (reqCurrStatus === "Initiated" || reqCurrStatus === "Failed") {
                statusText = 'Error in creating request, Try Again';
            }

            // Set the status text and color
            statusElem.innerText = statusText;
            statusElem.style.color = getStatusColor(statusText);

            // Populate skills section
            const skillsContainer = document.getElementById('skills');
            skillsContainer.innerHTML = '';  // Clear previous content
            parsedData.forEach(item => {
                const skillBox = document.createElement('div');
                skillBox.classList.add('skill-box');

                const skillName = document.createElement('div');
                skillName.classList.add('skill-name');
                skillName.innerText = item.SkillName; // Assuming SkillName is part of your data

                const skillExp = document.createElement('div');
                skillExp.classList.add('skill-column');
                skillExp.innerHTML = `
                    <div class="skill-years">${item.SkillExpInYear}Y</div>
                    <div class="skill-months">${item.SkillExpInMonth}M</div>
                `;

                skillBox.appendChild(skillName);
                skillBox.appendChild(skillExp);
                skillsContainer.appendChild(skillBox);
            });
        } else {
            console.error('Error: Data is not in expected format');
        }
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to get color based on status
function getStatusColor(status) {
    if (status === 'Active' || status === 'Accepted' || status === 'Feedback Submitted' || status === 'Join Now') {
        return '#039011';
    } else if (status === 'Request is Expired' || status === 'Cancelled by Evaluator' || status === 'Cancelled by Candidate' || status === 'Joining time expired' || status === 'Error in creating request, Try Again') {
        return '#DE3434';
    } else if (status === 'Panel did not show up in time' || status === 'Candidate did not show up in time' || status === 'Both Candidate & Panel did not show up in time' || status === 'Awaiting Feedback' || status === 'Panel failed to submit feedback') {
        return '#F2994A';
    } else {
        return '#000000'; // Default color
    }
}
