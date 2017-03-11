//Create an Alexa Simulator with the ability to Detect specific users by Phone ID and play a specific Theme song unique to each user. Have your own theme song whenever you enter a room and have Simlexa greet you!

//process to make this happen:
set up:
user and pi connect to same wifi, web client form has post request to create user id: 'string', password: hash 'string', and song: 'string' as a youtube hyperlink.
req.user.username is cache'd in redis server as a cookie!

set up complete!

user leaves house after set up to buy groceries
.
.
.
-user comes back with delicious foods
-phone connects to wifi
-once phone connects to wifi it does an auto get request to get welcome page so redis can identify cookie/username

If username is found in redis database it will return username.song to curl in raspberryPi which is aux connected to stereo of choice.

Essentially when your phone connects to your home wifi it will match cookie data and return the song stored in your user object to a script (curl request -> "curl --data") in the raspberry pi that plays automatically.

