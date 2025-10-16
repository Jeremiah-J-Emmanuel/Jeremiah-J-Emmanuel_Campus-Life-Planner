document.addEventListener("DOMContentLoaded", function() {
    const timeTracker = document.getElementById('bar-time-tracker');

    var XValues = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    var yValues = [7, 5, 8, 7, 5, 8, 2];
    var barColors =  ["#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff"];

    new Chart(timeTracker, {
        type: 'bar',

        data: {
            labels: XValues,
            datasets : [{
                label: 'Hours Spent on Events Daily', // Add a label for the dataset
                backgroundColor: barColors,
                data: yValues
            }]
        },

        options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },

                title: {
                    display: true,
                    text: 'Hours Spent on Events Daily', 
                    font: {size: 16, weight: 'bold'},
                    padding: {bottom: 15}
                },
                
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    displayColors: false, 
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' Hrs';
                        } 
                    } 
                }
            },
            
            scales: {
                x: {
                    grid: {
                        display: false  // This is to make sure that only horizontal lines are shown
                    },
                    title: {
                        display: true,
                        text: 'Day of Week'
                    }
                },

                y: {
                    beginAtZero: true, 
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5] 
                    }, 

                    title: {
                        display: true,
                        text: 'Hours'
                    },
                    
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value % 1 === 0 ? value : ''; 
                        }  
                    }
                }
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const timePerTag = document.getElementById('bar-time-per-tag');
    var yValues = ['AI', 'Ethics', 'Seminar', 'Club'];
    var xValues = [7, 5, 8, 7];
    var barColors =  ["#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff"];

    new Chart(timePerTag, {
        type: "bar",
        data: {
            labels: yValues,
            datasets: [{
                label: "Top four tags and thier hours",
                data: xValues,
                backgroundColor: barColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', //This is to make the bar horizontal
            plugins: {
                legend: {display: false},

                title: {
                    display: true,
                    text: "Hours spent by Tag",
                    font: {size: 16, weight: 'bold'},
                    padding: {bottom: 15}
                },

                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    displayColors: false, 
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' Hrs';
                        } 
                    } 
                }
            },
              
            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    title: {
                        display:true,
                        text: "tag"
                    },

                    beginAtZero: true
                },

                y: {
                    beginAtZero: true, 
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5] 
                    }, 

                    title: {
                        display: true,
                        text: 'Hours'
                    },
                    
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value % 1 === 0 ? value : ''; 
                        }
                    }
                }

                
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const timeTracker = document.getElementById('donot-time-percentage');

    var XValues = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    var yValues = [7, 5, 8, 7, 5, 8, 2];
    var barColors =  ["#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff", "#3c4f6bff"];

    new Chart(timeTracker, {
        type: 'bar',

        data: {
            labels: XValues,
            datasets : [{
                label: 'Hours Spent on Events Daily', // Add a label for the dataset
                backgroundColor: barColors,
                data: yValues
            }]
        },

        options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },

                title: {
                    display: true,
                    text: 'Hours Spent on Events Daily', 
                    font: {size: 16, weight: 'bold'},
                    padding: {bottom: 15}
                },
                
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    displayColors: false, 
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' Hrs';
                        } 
                    } 
                }
            },
            
            scales: {
                x: {
                    grid: {
                        display: false  // This is to make sure that only horizontal lines are shown
                    },
                    title: {
                        display: true,
                        text: 'Day of Week'
                    }
                },

                y: {
                    beginAtZero: true, 
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5] 
                    }, 

                    title: {
                        display: true,
                        text: 'Hours'
                    },
                    
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value % 1 === 0 ? value : ''; 
                        }  
                    }
                }
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const donutTimePercentage = document.getElementById('donut-time-percentage').getContext('2d');

    new Chart(donutTimePercentage, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Remaining'],
            datasets: [{
                label: '# of Votes',
                data: [81, 19],
                backgroundColor: [
                    '#3c4f6bff',
                    '#55b1bdff'
                ],
                borderColor: [
                    '#aec4e6ff',
                    '#c5d8daff'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Percentage of Time used up'
                }
            },
            cutout: '70%' 
        }
    });
});