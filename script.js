$(document).ready(function () {
    let root_url = 'http://comp426.cs.unc.edu:3001/';
    let arrivalAirport;
    let departAirport;
    let airlines;
    let flights;
    let instances = [];
    let airports;

    let departLatitude;     // for google maps api - Michael
    let departLongitude;    // for google maps api - Michael
    let arrivalLatitude;       // for google maps api - Michael
    let arrivalLongitude;     // for google maps api - Michael

    let savedFlightsArray = [];

    let clicked = 0;

    let x = 0;

    $.ajax(root_url + 'sessions',
        {
            type: 'POST',
            data: {
                user: {
                    "username": "mattaber",
                    "password": "comp426"
                }
            },
            success: (response) => {
                homeLoad();
            },
            error: () => {
                alert('error');
            }
        });

    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE

    // let onLoad = () => {
    //     $.ajax(root_url + 'airports',
    //         {
    //             type: 'GET',
    //             dataType: 'json',
    //             xhrFields: {withCredentials: true},
    //             success: (response) => {
    //                 let ports = [];
    //                 response.forEach(item => {
    //                     ports.push({
    //                         full: `${item.code.toLowerCase()} - ${item.city.toLowerCase()} - ${item.name.toLowerCase()}`,
    //                         code: item.code,
    //                         city: item.city,
    //                         name: item.name
    //                     })
    //                 });
    //                 airports = ports;

    //             },
    //             error: () => {
    //                 alert('error');
    //             }
    //         });
    // };

    let homeLoad = () => {

        clicked = 0;

        let body = $('body');
        body.empty();

        let navigationBox = $("<div class='navBox'>");
        navigationBox.append($("<div class='navItem' id='home' style='text-decoration: underline'>Home</div>"));
        navigationBox.append($("<div class='navItem' id='yourFlights' >Your Flights</div>"));
        navigationBox.append($("<div class='navItem' id='Admin' style='text-decoration: none'>Admin</div>"));

        body.append(navigationBox);

        let searchBox = $("<div class='searchBox'>");

        // searchBox.append($("<div class='aboveSearch'>"))
        let aboveSearch = $("<div class='aboveSearch'>");
        aboveSearch.append($("<div class='searchPrompt'>Search for a flight</div>"));
        aboveSearch.append($("<img class='siteLogo' src='flightLogo.svg'>"));
        searchBox.append(aboveSearch);

        let search = $("<div class='search'>");
        let box1 = $("<div class='box'>");
        let box2 = $("<div class='box2'>");
        box2.append($("<img class='searchPic' src='planeTakeoffPic.svg'>"));
        box2.append($("<input class='departSearch' type='text' placeholder='From'>"));
        box1.append(box2);
        box1.append($("<div class='box2 suggestions' id='departSuggestions' style='visibility:hidden'>"));
        search.append(box1);

        abox1 = $("<div class='box'>");
        abox2 = $("<div class='box2'>");
        abox2.append($("<img class='searchPic' src='planeLandPic.svg'>"));
        abox2.append($("<input class='arriveSearch' type='text' placeholder='To'>"));
        abox1.append(abox2);
        abox1.append($("<div class='box2 suggestions' id='arrivalSuggestions' style='visibility:hidden'>"));
        search.append(abox1);

        datebox = $("<div class='box2'>");
        datebox.append($("<img class='searchPic' src='calendarSearch.png'>"));
        datebox.append($("<input class='dateSearch' type='date' placeholder='Date'>"));
        search.append(datebox);

        submit = $("<div class='searchSubmit' id='firstSearch'>");
        submit.append($("<img class='searchPic' src='magnifierPic.png'>"));
        search.append(submit);

        searchBox.append(search);
        body.append(searchBox);

        // Old condition to stop airports from getting re-loaded!
        // if(!airports){
        $.ajax(root_url + 'airports',
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    let ports = [];
                    response.forEach(item => {
                        ports.push({
                            full: `${item.code.toLowerCase()} - ${item.city.toLowerCase()} - ${item.name.toLowerCase()}`,
                            code: item.code,
                            city: item.city,
                            name: item.name,
                            latitude: item.latitude,        // for google maps api - Michael
                            longitude: item.longitude       // for google maps api - Michael
                        })
                    });
                    airports = ports;

                },
                error: () => {
                    alert('error');
                }
            });
        console.log("Loaded airports!");
        // }else{
        //     console.log("Airports were already loaded!");
        // }
    };

    //UNCHANGED* DONT FORGET TO KEEP


    $(document).on('click', '#createAirportButton', function (e) {
        let airportName = $('#airportName').val();
        let airportCode = $('#airportCode').val();
        let airportLat = $('#airportLat').val();
        let airportLong = $('#airportLong').val();
        let airportCity = $('#airportCity').val();
        let airportState = $('#airportState').val();
        let airportCityURL = $('#airportCityURL').val();
        let airportInfo = $('#airportInfo').val();

        let airport = {
            "name": airportName,
            "code": airportCode,
            "latitude": airportLat,
            "longitude": airportLong,
            "city": airportCity,
            "state": airportState,
            "city_url": airportCityURL,
            "info": airportInfo
        };

        // console.log(airport);

        if (airportName && airportCode) {
            $.ajax(root_url + 'airports',
                {
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    data: {
                        airport
                    },
                    success: (response) => {
                        console.log("Succeeded");
                        console.log(response);
                        $('#createMessage').text("Created airport " + airportName + " (ID: " + response.id + ")");
                    },
                    error: (response) => {
                        console.log("Failed");
                        console.log(response);
                        $('#createMessage').text("Failed to create airport.");
                    }
                });
        } else {
            console.log("Need required fields.");
            $('#createMessage').text("Airport name and code required.");
        }
    });

    $(document).on('click', '#createAirlineButton', function (e) {
        let airlineName = $('#airlineName').val();
        let airlineLogoURL = $('#airlineLogoURL').val();
        let airlineInfo = $('#airlineInfo').val();

        let airline = {
            "name": airlineName,
            "logo_url": airlineLogoURL,
            "info": airlineInfo
        };

        console.log(airline);

        if (airlineName) {
            $.ajax(root_url + 'airlines',
                {
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    data: {
                        airline
                    },
                    success: (response) => {
                        console.log("Succeeded");
                        console.log(response);
                        $('#createMessage').text("Created airline " + airlineName + " (ID: " + response.id + ")");
                    },
                    error: (response) => {
                        console.log("Failed");
                        console.log(response);
                        $('#createMessage').text("Failed to create airline.");
                    }
                });
        } else {
            console.log("Need required fields.");
            $('#createMessage').text("Airline name required.");
        }
    });

    $(document).on('click', '#createFlightButton', function (e) {
        let flightDeparts = $('#flightDeparts').val();

        let flightArrives = $('#flightArrives').val();
        let flightNumber = $('#flightNumber').val();
        let flightPlaneID = $('#flightPlaneID').val();
        let flightDepartureID = $('#flightDepartureID').val();
        let flightArrivalID = $('#flightArrivalID').val();
        let flightNextFlightID = $('#flightNextFlightID').val();
        let flightAirlineID = $('#flightAirlineID').val();
        let flightInfo = $('#flightInfo').val();

        let flight = {
            "departs_at": flightDeparts,
            "arrives_at": flightArrives,
            "number": flightNumber,
            "plane_id": flightPlaneID,
            "departure_id": Number(flightDepartureID),
            "arrival_id": Number(flightArrivalID),
            "next_flight_id": flightNextFlightID,
            "airline_id": flightAirlineID,
            "info": flightInfo
        };

        console.log(flight);

        if (flightDeparts && flightArrives && flightDepartureID && flightArrivalID && flightNumber) {
            $.ajax(root_url + 'flights',
                {
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    data: {
                        flight
                    },
                    success: (response) => {
                        console.log("Succeeded");
                        console.log(response);
                        $('#createMessage').text("Created flight " + flightNumber + " (ID: " + response.id + ")");
                    },
                    error: (response) => {
                        console.log("Failed");
                        console.log(response);
                        $('#createMessage').text("Failed to create flight.");
                    }
                });
        } else {
            console.log("Need required fields.");
            $('#createMessage').text("Flight departure/arrival info and number required.");
        }
    });

    $(document).on('click', '#createInstanceButton', function (e) {
        let instanceFlightID = $('#instanceFlightID').val();
        let instanceDate = $('#instanceDate').val();
        let instanceCancelled = $('#instanceCancelled').val();
        let instanceInfo = $('#instanceInfo').val();

        let instance = {
            "flight_id": Number(instanceFlightID),
            "date": instanceDate,
            "is_cancelled": instanceCancelled,
            "info": instanceInfo
        };

        console.log(instance);

        if (instanceFlightID && instanceDate) {
            $.ajax(root_url + 'instances',
                {
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    data: {
                        instance
                    },
                    success: (response) => {
                        console.log("Succeeded");
                        console.log(response);
                        $('#createMessage').text("Created flight instance for " + instanceFlightID);
                    },
                    error: (response) => {
                        console.log("Failed");
                        console.log(response);
                        $('#createMessage').text("Failed to create instance of flight.");
                    }
                });
        } else {
            console.log("Need required fields.");
            $('#createMessage').text("Flight ID and date required.");
        }
    });

    $(document).on('click', '#createAirport', function (e) {
        let body = $('body');

        let createBox = $("<div class='createBox'>");
        createBox.append($("<div class='createTitle'>Create Airport</div>"));

        let createAirportForm = $("<div class='createForm'>");
        createBox.append(createAirportForm);

        createAirportForm.append($("<span class='spanInput'>Airport Name: (required) <input id='airportName' class='createInput' type='text' required='true'><br></span>"));
        createAirportForm.append($("<span class='spanInput'>Airport Code: (required) <input id='airportCode' class='createInput' type='text' required='true'><br></span>"));
        createAirportForm.append($("<span class='spanInput'>Latitude: <input id='airportLat' class='createInput' type='text'><br></span>"));
        createAirportForm.append($("<span class='spanInput'>Longitude: <input id='airportLong' class='createInput' type='text'><br></span>"));
        createAirportForm.append($("<span class='spanInput'>City: <input id='airportCity' class='createInput' type='text'><br></span>"));
        createAirportForm.append($("<span class='spanInput'>State: <input id='airportState' class='createInput' type='text'><br></span>"));
        createAirportForm.append($("<span class='spanInput'>City URL: <input id='airportCityURL' class='createInput' type='text'><br></span>"));
        createAirportForm.append($("<span class='spanInput'>Additional Info: <input id='airportInfo' class='createInput' type='text'><br></span>"));
        createBox.append($("<input id='createAirportButton' class='createButton' type='button' value='Create Airport'>"));
        createBox.append($("<div class='backButton'><img class='backImg' src='left-arrow.svg'><div>Back</div></div></div>"));

        let message = $("<div id='createMessage'>");


        body.append(createBox);
        createBox.append(message);
    });

    $(document).on('click', '#createAirline', function (e) {
        let body = $('body');

        let createBox = $("<div class='createBox'>");
        createBox.append($("<div class='createTitle'>Create Airline</div>"));

        let createAirlineForm = $("<div class='createForm'>");
        createBox.append(createAirlineForm);

        createAirlineForm.append($("<span class='spanInput'>Name: (required) <input id='airlineName' class='createInput' type='text'><br></span>"));
        createAirlineForm.append($("<span class='spanInput'>Logo URL: <input id='airlineLogoURL' class='createInput' type='text'><br></span>"));
        createAirlineForm.append($("<span class='spanInput'>Additional Info: <input id='airlineInfo' class='createInput' type='text'><br></span>"));
        createBox.append($("<input id='createAirlineButton' class='createButton' type='button' value='Create Airline'>"));
        createBox.append($("<div class='backButton'><img class='backImg' src='left-arrow.svg'><div>Back</div></div></div>"));

        let message = $("<div id='createMessage'>");


        body.append(createBox);
        createBox.append(message);
    });

    $(document).on('click', '#createFlight', function (e) {
        let body = $('body');

        let createBox = $("<div class='createBox'>");
        createBox.append($("<div class='createTitle'>Create Airport</div>"));

        let createFlightForm = $("<div class='createForm'>");
        createBox.append(createFlightForm);

        createFlightForm.append($("<span class='spanInput'>Departs: (required) <input id='flightDeparts' class='createInput' type='time' value='12:00'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Arrives: (required) <input id='flightArrives' class='createInput' type='time' value='12:00'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Number: (required) <input id='flightNumber' class='createInput' type='text'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Plane ID: <input id='flightPlaneID' class='createInput' type='number'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Departure ID:  (required) <input id='flightDepartureID' class='createInput' min='0' type='number'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Arrival ID: (required) <input id='flightArrivalID' class='createInput' min='0' type='number'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Next-flight ID: <input id='flightNextFlightID' class='createInput' type='number'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Airline ID: <input id='flightAirlineID' class='createInput' type='number'><br></span>"));
        createFlightForm.append($("<span class='spanInput'>Additional Info: <input id='flightInfo' class='createInput' type='text'><br></span>"));
        createBox.append($("<input id='createFlightButton' class='createButton' type='button' value='Create Flight'>"));
        createBox.append($("<div class='backButton'><img class='backImg' src='left-arrow.svg'><div>Back</div></div></div>"));

        let message = $("<div id='createMessage'>");


        body.append(createBox);
        createBox.append(message);
    });

    $(document).on('click', '#createInstance', function (e) {
        let body = $('body');

        let createBox = $("<div class='createBox'>");
        createBox.append($("<div class='createTitle'>Create Instance of Flight</div>"));

        let createInstanceForm = $("<div class='createForm'>");
        createBox.append(createInstanceForm);

        createInstanceForm.append($("<span class='spanInput'>Flight ID: (required) <input id='instanceFlightID' class='createInput' min='0' type='number'><br></span>"));
        createInstanceForm.append($("<span class='spanInput'>Date: (required) <input id='instanceDate' class='createInput' type='date'><br></span>"));
        createInstanceForm.append($("<span class='spanInput'>Cancelled: <select id='instanceCancelled' class='createInput'><option value='true'>Cancelled</option><option value='false'>Not cancelled</option></select><br></span>"));
        createInstanceForm.append($("<span class='spanInput'>Additional Info: <input id='instanceInfo' class='createInput' type='text'><br></span>"));
        createBox.append($("<input id='createInstanceButton' class='createButton' type='button' value='Create Instance'>"));
        createBox.append($("<div class='backButton'><img class='backImg' src='left-arrow.svg'><div>Back</div></div></div>"));

        let message = $("<div id='createMessage'>");


        body.append(createBox);
        createBox.append(message);
    });

    let adminLoad = () => {
        console.log("Admin load.");
        let body = $('body');
        body.empty();

        let navigationBox = $("<div class='navBox'>");
        navigationBox.append($("<div class='navItem' id='home' style='text-decoration: none'>Home</div>"));
        navigationBox.append($("<div class='navItem' id='yourFlights'>Your Flights</div>"));
        navigationBox.append($("<div class='navItem' id='Admin' style='text-decoration: underline'>Admin</div>"));

        body.append(navigationBox);

        let createOptions = $("<div class='createOptions'>");
        createOptions.append($("<button id='createAirport' class='createOption' type='button'>Create Airport</button>"));
        createOptions.append($("<button id='createAirline' class='createOption' type='button'>Create Airline</button>"));
        createOptions.append($("<button id='createFlight' class='createOption' type='button'>Create Flight</button>"));
        createOptions.append($("<button id='createInstance' class='createOption' type='button'>Create Instance of Flight</button>"));

        body.append(createOptions);

        $(document).on('click', '#createAirport', function (e) {
            createOptions.detach();
        });

        $(document).on('click', '#createAirline', function (e) {
            createOptions.detach();
        });

        $(document).on('click', '#createFlight', function (e) {
            createOptions.detach();
        });

        $(document).on('click', '#createInstance', function (e) {
            createOptions.detach();
        });
    };

    $(document).on('click', "#home", function (e) {
        homeLoad();
    });

    $(document).on('click', "#yourFlights", function (e) {
        flierLoad();
    });

    $(document).on('click', "#Admin, .backButton", function (e) {
        adminLoad();
    });


    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE
    //NEW CODE FROM ALEC ENDS HERE

    $(document).on('keyup', '.departSearch', (e) => {
        $("#departSuggestions").empty();

        if ($(".departSearch").val() !== "") {
            let text = $('.departSearch').val().toLowerCase();
            let filtered = airports.filter(airport => {
                return airport.full.indexOf(text) !== -1;
            });

            filtered.sort((item1, item2) => {
                return item1.full.indexOf(text) - item2.full.indexOf(text);
            });

            for (let i = 0; i < filtered.length; i++) {
                $("#departSuggestions").append(
                    $(`<div class='suggestion' id=${filtered[i].code}>${filtered[i].name}</div>`)
                        .click(function () {
                            let code = $(this).attr('id');

                            // console.log(code);
                            $(this).parent().parent().find(".box2").find("input").val(code);
                            $("#departSuggestions").css("visibility", "hidden");
                        })
                );

                if (i === 6) {
                    break;
                }
            }
            $("#departSuggestions").css("visibility", "visible");

        } else {
            $("#departSuggestions").css("visibility", "hidden");
        }
    });

    $(document).on('keyup', '.arriveSearch', (e) => {
        $("#arrivalSuggestions").empty();

        if ($(".arriveSearch").val() !== "") {

            let text = $('.arriveSearch').val().toLowerCase();
            let filtered = airports.filter(airport => {
                return airport.full.indexOf(text) !== -1;
            });

            filtered.sort((item1, item2) => {
                return item1.full.indexOf(text) - item2.full.indexOf(text);
            });

            for (let i = 0; i < filtered.length; i++) {
                $("#arrivalSuggestions").append(
                    $(`<div class='suggestion' id=${filtered[i].code}>${filtered[i].name}</div>`)
                        .click(function () {
                            let code = $(this).attr('id');

                            console.log($(this).parent().parent().find(".box2").find("input"));
                            $(this).parent().parent().find(".box2").find("input").val(code);
                            $("#arrivalSuggestions").css("visibility", "hidden");
                        })
                );
                console.log($(".suggestion").attr('id'));

                if (i === 6) {
                    break;
                }
            }

            $("#arrivalSuggestions").css("visibility", "visible");
            // console.log(filtered);
        } else {
            $("#arrivalSuggestions").css("visibility", "hidden");
        }
    });

    $(document).on("focusout", ".departSearch, .arriveSearch", () => {
        if (idIsHovered("departSuggestions") || idIsHovered("arrivalSuggestions")) {
            return;
        }

        $("#departSuggestions").css("visibility", "hidden");
        $("#arrivalSuggestions").css("visibility", "hidden");
    });

    function idIsHovered(id) {
        return $("#" + id + ":hover").length > 0;
    }

    $(document).on('click', '#firstSearch', function () {
        console.log("clicked:" + clicked);
        if (clicked === 0) {
            clicked = 1;
            firstSearch();
        }

    });

    let firstSearch = function () {
        $(".errorMsg").remove();

        let dPlace = $(".departSearch").val();
        let aPlace = $(".arriveSearch").val();
        let currentDate = $(".dateSearch").val();

        if (dPlace.length === 0 || aPlace.length === 0 || currentDate.length === 0) {
            $(".searchBox").append('<div class="errorMsg">Please enter in valid information!</div>');
            $(".flightsBox").find(".loader").remove();
            clicked = 0;
            return;
        }

        $("body").append('<div class="contentBox"></div>');
        $(".contentBox").append('<div class="flightsBox"></div>');
        $(".flightsBox").append("<div class='loader'></div>");

        airlinesCall();

        $('<div class="filterBox" style="visibility: hidden"></div>').insertBefore(".flightsBox");
        $(".searchSubmit").attr("id", "otherSearch");

        x = 1;
    };

    $(document).on('click', '#otherSearch', function () {
        console.log("clicked:" + clicked);
        if (clicked === 0) {
            clicked = 1;
            secondSearch();
        }
    });

    let secondSearch = function () {
        arrivalAirport = "";
        departAirport = "";
        airlines = "";
        flights = "";
        instances = [];


        $(".errorMsg").remove();
        $(".flightsBox").empty();
        $(".filterBox").empty();

        $("#map").remove();
        $("#weather").remove();

        let dPlace = $(".departSearch").val();
        let aPlace = $(".arriveSearch").val();
        let currentDate = $(".dateSearch").val();

        if (dPlace.length === 0 || aPlace.length === 0 || currentDate.length === 0) {
            $(".flightsBox").append('<div class="errorMsg">Please enter in valid information!</div>');
            $(".flightsBox").find(".loader").remove();
            clicked = 0;
            return;
        }

        $(".flightsBox").append("<div class='loader'></div>");
        airlinesCall();
        $(".filterBox").css("visibility", "hidden");
    };

    let airlinesCall = () => {
        $.ajax(root_url + 'airlines',
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    airlines = response;
                    departAirportsCall();

                },
                error: () => {
                    alert('error');
                }
            });
    };

    let departAirportsCall = () => {
        $.ajax(root_url + 'airports',
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                data: {
                    'filter[code]': $('.departSearch').val(),
                },
                success: (response) => {
                    departAirport = response[0];
                    if (response[0] !== undefined) {
                        arrivalAirportsCall();
                    } else {
                        $(".flightsBox").find(".loader").remove();
                        $(".flightsBox").append('<div class="errorMsg" style="margin-left: 280px">No Flights Found!</div>');
                        clicked = 0;
                    }

                },
                error: () => {
                    alert('error');
                }
            });
    };

    let arrivalAirportsCall = () => {
        $.ajax(root_url + 'airports',
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                data: {
                    'filter[code]': $('.arriveSearch').val(),
                },
                success: (response) => {
                    arrivalAirport = response[0];
                    if (response[0] !== undefined) {
                        flightsCall()
                    } else {
                        $(".flightsBox").find(".loader").remove();
                        $(".flightsBox").append('<div class="errorMsg" style="margin-left: 280px">No Flights Found!</div>');
                        clicked = 0;
                    }
                },
                error: () => {
                    alert('error');
                }
            });
    };

    let flightsCall = () => {
        $.ajax(root_url + 'flights',
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                data: {
                    'filter[departure_id]': departAirport.id,
                    'filter[arrival_id]': arrivalAirport.id,
                },
                success: (response) => {
                    flights = response;
                    if (response[0] !== undefined) {
                        instancesCall();
                    } else {
                        $(".flightsBox").find(".loader").remove();
                        $(".flightsBox").append('<div class="errorMsg" style="margin-left: 280px">No Flights Found!</div>');
                        clicked = 0;
                    }
                },
                error: () => {
                    alert('error');
                }
            });
    };

    let instancesCall = () => {
        for (let i = 0; i < flights.length; i++) {
            $.ajax(root_url + 'instances',
                {
                    type: 'GET',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    data: {
                        'filter[flight_id]': flights[i].id,
                        'filter[date]': $(".dateSearch").val(),
                    },
                    success: (response) => {
                        if (response[0] !== undefined) {
                            $(".errorMsg").remove();
                            instances.push(response[0]);
                            buildContent(response[0]);
                        }
                    },
                    error: () => {
                        alert('error');
                    }
                }).done(function () {


                $(".filterBox").empty();

                buildFilters();


                if (instances.length === 0) {
                    $(".errorMsg").remove();
                    $(".flightsBox").find(".loader").remove();
                    $(".flightsBox").append('<div class="errorMsg" style="margin-left: 280px">No Flights Found!</div>');
                    clicked = 0;
                }
            });
        }

        buildMap();     // for google maps api - Michael
        buildWeather();     // for weather api - Michael


        $(".flightsBox").find(".loader").remove();
        $(".filterBox").css("visibility", "visible");

        clicked = 0;
    };

    let buildContent = (instance) => {
        let flightDiv = buildInstanceDiv(instance);
        $('.flightsBox').append(flightDiv);
    };

    let buildInstanceDiv = (instance) => {
        let flightDiv = $('<div class="flight"></div>');
        let flight = findFlight(instance);

        let airlineID = flight.airline_id;

        let departTime = flight.departs_at;
        let arrivalTime = flight.arrives_at;
        let instanceTime = instance.date;

        departTime = new Date(departTime);

        let departH = departTime.getHours();
        let departM = departTime.getMinutes();

        arrivalTime = new Date(arrivalTime);

        let arrivalH = arrivalTime.getHours();
        let arrivalM = arrivalTime.getMinutes();

        if (departH > arrivalH || (departH > 12 && arrivalH === 12)) {
            arrivalH = arrivalH + 24;
        }

        instanceTime = new Date(instanceTime);

        let realDepart = getTotalTime(departTime, instanceTime);
        let realArrive = getTotalTime(arrivalTime, instanceTime);

        if (realArrive < realDepart) {
            realArrive = realArrive + (1000 * 60 * 60 * 24)
        }

        let difference = realArrive - realDepart;
        difference = msToTime(difference);


        departTime = getTime1(departTime);
        arrivalTime = getTime1(arrivalTime);

        let airlinePic = findAirlinePic(airlineID, airlines);

        if (airlinePic === null) {
            flightDiv.append('<div class="picContainer"></div>');
        } else {
            flightDiv.append('<div class="picContainer"><img class="flightPic" src=' + airlinePic + '></div>');
        }

        let airlineName = findAirlineName(airlineID, airlines);
        let departureName = departAirport.code;
        let arrivalName = arrivalAirport.code;


        let info1 = $('<div class="info1"></div>');
        let info2 = $('<div class="info2"></div>');

        info1.append(`<div class="flightTime" data-departH=${departH} data-departM=${departM} data-arrivalH=${arrivalH} data-arrivalM=${arrivalM}>${departTime}-${arrivalTime}</div>`);
        info1.append('<div class="flightAirline">' + airlineName + '</div>');

        flightDiv.append(info1);

        info2.append('<div class="flightDur">' + difference + '</div>');
        info2.append(`<div class="flightCodes">${departureName} - ${arrivalName}</div>`);

        flightDiv.append(info2);

        flightDiv.append(
            $('<div class="bookButton" data-clicked="no">Save Ticket</div>')
                .click(function () {
                    let ticket = $(this);

                    if (ticket.attr("data-clicked") === "no") {
                        ticket.html("Ticket Saved");
                        savedFlightsArray.push($(this).parent());
                        ticket.attr("data-clicked", "yes");
                    }

                })
        );


        return flightDiv;
    };

    /* $(document).on("click", ".bookButton", function(){
         console.log("Clicked on book ticket!");
         console.log($(this).prev());
     });*/

    let buildFilters = () => {
        $(".filterBox").append('<div id="applyFilters"><div class="insideApplyFilters">Filters</div></div>');
        $(".filterBox").append('<div class="timeBox"></div>');
        $(".timeBox").append('<div class="timeHeading">Earliest Departure Time:</div>');
        $(".timeBox").append('<div class="timeOutput" id="departOutput">12 AM Today</div>');
        $(".timeBox").append('<input type="range" min="0" max="23" value="0" class="slider" id="departRange">');
        $(".timeBox").append('<div class="timeHeading">Latest Arrival Time:</div>');
        $(".timeBox").append('<div class="timeOutput" id="arriveOutput">12 AM Tomorrow </div>');
        $(".timeBox").append('<input type="range" min="1" max="36" value="36" class="slider" id="arriveRange">');
        $(".filterBox").append('<div class="airlineBox"></div>');
        $(".airlineBox").append('<div class="airHeading">Airlines</div>');
        airlineFilters();
    };

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: "Europe/London"
    };

    let getTime1 = (date) => {
        return date.toLocaleString('en-US', options);
    };

    let getTotalTime = (time, day) => {
        let timeMili = time.getHours() * 3600 * 1000 + time.getMinutes() * 60 * 1000;
        let dayMili = day.getTime();
        let totalMili = timeMili + dayMili;
        return totalMili;
    };

    let msToTime = (duration) => {
        let minutes = parseInt((duration / (1000 * 60)) % 60)
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 5) ? "" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;

        return hours + "hr " + minutes + "m"
    };

    let findFlight = (instance) => {
        for (let i = 0; i < flights.length; i++) {
            if (flights[i].id === instance.flight_id) {
                return flights[i];
            }
        }
    };

    let findAirlineName = (flight, x) => {
        for (let i = 0; i < x.length; i++) {
            if (flight === x[i].id) {
                return x[i].name;
            }
        }
    };

    let findAirlinePic = (flight, x) => {
        for (let i = 0; i < x.length; i++) {
            if (flight === x[i].id) {
                return x[i].logo_url;
            }
        }
    };

    let airlineFilters = () => {
        let airlineArray = [];

        $(".flightAirline").each(function () {

            let a = $(this).html();

            if (!airlineArray.includes(a)) {
                airlineArray.push(a);
            }
        });

        $(".airlineBox").append(`<form class="airlineChecks" ></form>`);

        for (let i = 0; i < airlineArray.length; i++) {
            $(".airlineChecks").append(`<div class="specificAirline" id=${i}></div>`);
            $(`#${i}`).append(`<input type="checkbox" class="checkBox" checked="checked" id=${airlineArray[i]}> <label class='airlineName' for=${airlineArray[i]}>${airlineArray[i]}</label></br>`)
        }
    };

    $(document).on('input', '#departRange', function () {
        let time = $("#departRange").val();

        if (time == 0) {
            time = '12 AM Today';
        } else if (time < 12) {
            time = time + ' AM Today';
        } else if (time == 12) {
            time = time + ' PM Today ';
        } else if (time < 24) {
            time = time - 12;
            time = time + ' PM Today';
        }

        $('#departOutput').html(time);
    });

    $(document).on('input', '#arriveRange', function () {
        let time = $("#arriveRange").val();

        if (time < 12) {
            time = time + ' AM Today';
        } else if (time == 12) {
            time = time + ' PM Today';
        } else if (time < 24) {
            time = time - 12;
            time = time + ' PM Today';
        } else if (time == 24) {
            time = '12 AM Tomorrow';
        } else if (time < 36) {
            time = time - 24;
            time = time + ' AM Tomorrow';
        } else {
            time = '12 PM Tomorrow';
        }

        $('#arriveOutput').html(time);
    });

    $(document).on('mouseup', "#arriveRange", function () {
        filterFlights();
    });

    $(document).on('mouseup', "#departRange", function () {
        filterFlights();
    });

    $(document).on('input', ".checkBox", function () {
        filterFlights();
    });


    let filterFlights = () => {
        $(".errorMsg").remove();

        let dTime = $('#departRange').val();
        dTime = dTime - 5;

        let aTime = $('#arriveRange').val();
        aTime = aTime - 5;

        let airlineArray = [];

        $(".specificAirline").each(function () {
            if ($(this).find(".checkBox").prop('checked')) {
                airlineArray.push($(this).find(".airlineName").html());
            }
        });

        $(".flight").each(function () {
            let d = parseInt($(this).find(".flightTime").attr("data-departH")) + (parseInt($(this).find(".flightTime").attr("data-departM")) / 100);
            let a = parseInt($(this).find(".flightTime").attr("data-arrivalH")) + (parseInt($(this).find(".flightTime").attr("data-arrivalM")) / 100);
            let airline = $(this).find(".flightAirline").html();

            if (d < dTime || a > aTime || !airlineArray.includes(airline)) {
                $(this).css("display", "none");
            } else {
                $(this).css("display", "");
            }
        });

        isEmpty();
    };

    let isEmpty = () => {
        let x = 0;

        $(".flight").each(function () {
            if ($(this).css("display") !== "none") {
                x = 1;
            }
        });

        if (x === 0) {
            $(".flightsBox").append('<div class="errorMsg">Nothing Found!</div>');
            return 0;
        }

        return 1;
    };

    let flierLoad = function () {

        console.log(savedFlightsArray);

        let body = $('body');

        body.empty();

        let navigationBox = $("<div class='navBox'>");
        navigationBox.append($("<div class='navItem' id='home' style='text-decoration: none'>Home</div>"));
        navigationBox.append($("<div class='navItem' id='yourFlights' style='text-decoration: underline' >Your Flights</div>"));
        navigationBox.append($("<div class='navItem' id='Admin' style='text-decoration: none'>Admin</div>"));

        body.append(navigationBox);

        let savedBox = $("<div class='savedBox'></div>");

        savedBox.append("<div class='savedTitle'>Saved Flights</div>");

        if (savedFlightsArray.length === 0) {
            savedBox.append("<div class='errorMsg' style='margin-left: 290px'>No Flights Saved!</div>");
        } else {
            for (let i = 0; i < savedFlightsArray.length; i++) {
                console.log(savedFlightsArray[i]);
                savedBox.append(savedFlightsArray[i]);
            }
        }

        body.append(savedBox);
    };


    $(document).on('keydown', '.arriveSearch, .departSearch, .dateSearch ', function (e) {
        console.log(clicked);
        if (e.keyCode === 13 && x === 0 && clicked === 0) {
            console.log("enter1");
            firstSearch();
        } else if (e.keyCode === 13 && clicked === 0) {
            console.log("enter2");
            secondSearch();
        }
    });

    let buildWeather = () => {      // for weather api - Michael
        let weather_api_url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + departLatitude + '&lon=' + departLongitude + '&units=imperial&appid=72c9b1c4e095aaf2d5229b53b97ecc05'

        $.ajax({
            url: weather_api_url,
            method: 'GET',
            success: (response) => {
                let weather = $('<div id="weather"></div>');



                let tempr = response.main.temp;
                let cloud = response.clouds.all;
                let humid = response.main.humidity;

                let weatherBox = $("<div class='weatherBox'></div>");
                weatherBox.append('<h3>' + departAirport.city + '</h3>');
                weatherBox.append('<h4>' + tempr + ' &#8457;</h4>');
                weatherBox.append('<h4>' + cloud + '% Cloudy</h4>');
                weatherBox.append('<h4>' + humid + '% Humidity</h4><br>');

                weather.append(weatherBox);


                $.ajax({
                    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + arrivalLatitude + '&lon=' + arrivalLongitude + '&units=imperial&appid=72c9b1c4e095aaf2d5229b53b97ecc05',
                    method: 'GET',
                    success: (response) => {
                        let tempr2 = response.main.temp;
                        let cloud2 = response.clouds.all;
                        let humid2 = response.main.humidity;

                        let weatherBox = $("<div class='weatherBox'></div>");

                        weatherBox.append('<h3>' + arrivalAirport.city + '</h3>');
                        weatherBox.append('<h4>' + tempr2 + ' &#8457;</h4>');
                        weatherBox.append('<h4>' + cloud2 + '% Cloudy</h4>');
                        weatherBox.append('<h4>' + humid2 + '% Humidity</h4>');

                        weather.append(weatherBox);

                        $("body").append(weather);
                    },
                    error: () => {
                        alert('error');
                    }
                });
            },
            error: () => {
                alert('error');
            }
        });
    };


    let buildMap = () => {          // for google maps api - Michael
        $(".contentBox").append('<div id="map"></div>');

        departLatitude = parseFloat(departAirport.latitude);      // for google maps api - Michael
        departLongitude = parseFloat(departAirport.longitude);    // for google maps api - Michael
        console.log(departLatitude + " " + departLongitude);

        arrivalLatitude = parseFloat(arrivalAirport.latitude);       // for google maps api - Michael
        arrivalLongitude = parseFloat(arrivalAirport.longitude);     // for google maps api - Michael
        console.log(arrivalLatitude + " " + arrivalLongitude);

        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: (departLatitude + arrivalLatitude) / 2, lng: (departLongitude + arrivalLongitude) / 2},
            zoom: 3
        });

        let departMarker = new google.maps.Marker({
            position: {lat: departLatitude, lng: departLongitude},
            label: 'A',
            map: map
        });

        let arrivalMarker = new google.maps.Marker({
            position: {lat: arrivalLatitude, lng: arrivalLongitude},
            label: 'B',
            map: map
        });

        let lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 4,
        };

        let line = new google.maps.Polyline({
            path: [{lat: departLatitude, lng: departLongitude}, {lat: arrivalLatitude, lng: arrivalLongitude}],
            strokeOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
            }],
            map: map
        });
    };

});