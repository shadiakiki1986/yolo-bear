# yolo-bear
* This is an app to organize and broadcast results of a simple tournament to other people's devices

# Installation
* Published on Google Play store <a herf="https://play.google.com/store/apps/details?id=com.akikieng.genesis.yolobear">here</a>
* Available on the web <a href="http://genesis.akikieng.com/yolo-bear/">here</a>

# Following an existing tournament 
To connect to a tournament already being broadcasted
* click on "Connect" on the main menu
* Click the "+" sign next to the ID of anyone already connected to the tournament
** If nobody is already connected, then use the ID of the tournament organizer
** The tournament organizer can check his/her ID under his/her "Connect" section on the main menu
* The dot on the top right indicates the state of the broadcast
** If it is green, then you're just waiting for the next results and are still connected
** If it is yellow, then you've just received a tournament update
** If it is red, then you're disconnected from the broadcaster
** If there is no dot, then you're not connected to any tournament yet

# Broadcasting a new tournament 
* To start entering teams, players, and stats about your tournament, use the "Teams", "Players", and "Games" sections respectively
* Games are organized by status: Waiting, Playing, Done
* New games can be added by going to "Games" and then to "Waiting"
* The Team-level stats in the "Teams" section are as follows
** The team "Win" field is the number of games in which the team has a higher score and the game has state "Done"
** The team "Lost" field and "Tied" fields follow the same logic
** Other fields are just totals of the team players' respective stats
* The microphone on the top right shows the state of your broadcast
** A microphone indicates that you're the broadcaster, and no information is being sent to your audience
** A microphone with red lines indicates that you're sending your most recent update to your audience

# Advanced broadcasting management
* The person broadcasting the tournament is assigned "Admin 1" role
* The very next person to follow the tournament is assigned the "Admin 2" role
* In case "Admin 1" loses connection, "Admin 2" takes over the broadcasting of the tournament
** "Admin 2" will see the dot in the top right disappear and a microphone appear instead
* "Admin 1" has the power to change results and broadcast them to the audience
* "Admin 1" can also assign the "Admin 2" role to any person in the "Connect" section
** Use the "> A2" button next to the desired connection for this
* "Admin 1" can also give up the "Admin 1" role to another person
** Use the "> A1" button for this

# Under the hood

## The app
* This app broadcasts results to other devices connected to the broadcaster by using peer-to-peer technology
* It mainly uses HTML5 <a href="http://www.webrtc.org/">WebRTC</a> and <a href="https://crosswalk-project.org/">Crosswalk</a>
* You can find the source code <a href="https://github.com/shadiakiki1986/yolo-bear">here</a>

## Connectivity
* Tournament results are broadcasted using peer-to-peer technology
* An internet connection is required to establish the connection to the tournament administrator
* After that, if you and the administrator are on the same network without resort to an internet connection, you don't need the internet connection to receive the broadcast
* Changing your nickname will require an internet connection because it establishes a new connection to the administrator

# Misc
* Licensed under WTFPL ( http://www.wtfpl.net/ )
