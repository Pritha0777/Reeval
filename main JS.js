// Converting integer rating to stars

function convertRatingToStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}
function formatExperience(years, months) {
    if (years > 0 && months > 0) {
        return `${years}Y ${months}M`; // Both years and months are non-zero
    } else if (years > 0 && months === 0) {
        return `${years}Y`; // Only years are non-zero, ignore 0M
    } else if (years === 0 && months > 0) {
        return `0Y ${months}M`; // No years but months exist, show both 0Y and xM
    } else if (years === 0 && months === 0) {
        return `0M`; // Both years and months are 0, display 0M
    }
}

$(document).ready(function() {

    function getIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    const id = getIdFromURL();
    if (id) {
        fetchProfileData(id);
    } else {
        console.error("No ID provided in the URL.");
    }

    function fetchProfileData(id) {
        // Fetching data from data.html
        $.get(`https://reevaltech.com/scripts/getUserRProfileService.php?userId=${id}&selectedUserId=${id}`, function(response) {
            // filters data with id profile-data
            // const dataScript = $(data).filter('#profile-data').text();
            try {
                if(response.status){
                const profiles = JSON.parse(response.data);
                // finding profile where the profile id = id given by user
                const profile = profiles.find(p => p.UserID === id.toString());
                if (profile) {
                    $('#profile-pic').attr('src', "https://reevaltech.com/scripts/uploads/" + profile.ProfilePhoto);
                    // Set the total experience in years and months
                    const totalYears = parseInt(profile.TotalExpInYear);
                    const totalMonths = parseInt(profile.TotalExpInMonth);
                    $('#total-experience').text(`${formatExperience(totalYears, totalMonths)}`);
                    $('#header-line').text(profile.HeaderLine);
                    $('#name').text(`${profile.GenderPrefix} ${profile.FirstName} ${profile.LastName}`);
                    
                    $('#location').text(profile.Location);
                    $('#evaluation-count').html(`Evaluation count: ${profile.UserEvalCount}`);
                    $('#about-me').text(profile.About);
                    $('#education').text(`Education: ${profile.HighestEducation}`);
                    $('#company').html(`Company: ${profile.CompanyName}`);
                    $('#domain').text(`Domain: ${profile.DomainName}`);
                    $('#ratings').text(convertRatingToStars(parseFloat(profile.UserRating)));
                    
                    // Parse skills
                    const skills = profile.SkillName.split('|');
                    const skillYears = profile.SkillExpInYear.split('|');
                    const skillMonths = profile.SkillExpInMonth.split('|');
                    const skillRatings = profile.SkillsSelfRating.split('|');
                    const skillEvalRatings = profile.FeedbackSkillRating.split('|');
                    const isPrimarySkill = profile.IsPrimarySkill.split('|');

                    // Populate Primary Skills Table
                    //<td>${skill.name} <span class="date-info">(${skill.years}Y ${skill.months}M)</span></td>
                    const primarySkillsRows = skills.map((skill, index) => {
                        if (isPrimarySkill[index] === '1') {
                            const years = skillYears[index];
                            const months = skillMonths[index];
                            return `
                                <tr>
                                    <td>
                                    ${skill}
                                    <span class='skill-experience'>(${years}Y ${months}M)</span>
                                    </td>
                                    <td class='prime-star'>${convertRatingToStars(parseFloat(skillRatings[index]))}</td>
                                    <td class='prime-star'>${convertRatingToStars(parseFloat(skillEvalRatings[index]))}</td>
                                </tr>
                            `;
                        }
                        return '';
                    }).filter(row => row !== '').join('');
                    $('#primary-skills-table tbody').html(primarySkillsRows);

                    // Display Secondary Skills
                    const secondarySkillsHTML = skills.map((skill, index) => {
                        if (isPrimarySkill[index] === '0') {
                            return `
                                <div class="skill-box">
                                    <div class='skill-name'>${skill}</div>
                                    <div class="skill-column">
                                        <div class="skill-years">${skillYears[index]} Y</div>
                                        <hr class="skill-divider" />
                                        <div class="skill-months">${skillMonths[index]} M</div>
                                    </div>
                                </div>
                            `;
                        }
                        return '';
                    }).filter(box => box !== '').join('');
                    $('#secondary-skills-container').html(secondarySkillsHTML);
                } else {
                    console.error("Profile not found for ID:", id);
                }
            }} catch (e) {
                console.error("Error parsing JSON:", e);
            }
        }).fail(function() {
            console.error("Failed to load data.html");
        });
    }

});