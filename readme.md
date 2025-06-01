GO GO GO!

_GOGOGO_ is a 13x13 online game of _go_ I made as a part of a job application.


# The assignment

Design and implement [Go game](https://en.wikipedia.org/wiki/Go_\(game\))

- Board size: 13x13

- The first two players can start the game.

- After the game has started, others can watch it.

- The first two players can chat with each other during the game.

Deliverables:

- Link to the source code (either GitHub or GitLab)

- The source code must contain a docker-compose file to run two containers (os: Linux)

  - The webserver

  - The database (should be PostgreSQL)

- The source code must contain a report (.pdf) explaining the design and implementation.

Based on your skill set and time:

- In addition to the frontend, you can decide what to focus on in this project (user experience, backend, game engine, or ...). Please note that the evaluation will be based solely on your resume. There's no need to worry if you don't have a particular skill set.

- You can choose your preferred technology stack.

- You are allowed and encouraged to use AI, except [vibecoding](https://en.wikipedia.org/wiki/Vibe_coding) (remember to explicitly mention any use of AI in the report: LLMs, Copilot, APIs, ...)


# Research

Before I even started writing anything, the first thing I did was to look up the game. I had never heard of it before and as such had to familiarize myself with it and its rules. This was done by simply watching a youtube series for beginners.

Once I felt I had some basic understanding of the game, my next step involved looking up other implementations of the game that I could test out, especially open source ones also written in javascript. I found a few excellent examples, the main ones being [_WGo.js_](https://github.com/waltheri/wgo.js) as well as [_tenuki_](https://github.com/aprescott/tenuki) which I referenced quite often throughout development. I considered using their code directly as they should be easy to slot in, and depending on the time it would take to implement the entire game from scratch I would decide if I was going to do it from scratch or use some already existing implementation. Ultimately, due to a time constraint as well as my very shallow understanding of the game, I decided to use a premade solution that I then tweaked to better fit my use.

I followed this by asking GPT how it would go about doing the project in broad strokes, hoping to get some guidance without necessarily going too in depth. What GPT recommended was using React in the frontend with Express and NodeJS in the backend. This should go very well with PostgreSQL and has the benefit (for me atleast) of using most of the elements of the MERN stack (which is my goto). 

My next step was researching examples of games with websocket solutions, taking primarily inspiration from a game like _Jackbox_ games that use _Socket.io_. This is because websocket is extremely suitable for games where you need live interaction, additionally the two players should be able to chat, making websocket a no-brainer solution due to its fast responses.


# Pre-planning

Once I had figured out a basic idea of what I wanted to do, I started working on a small figma project to figure out how i wanted the layout to be and the look of the project: This in itself is not necessarily the most important step when you’re on a time crunch and still trying to figure out how things will work, however a good GUI is an important part of the end product, and I wanted to make sure it looks polished.

I did some brainstorming regarding what I wanted to do aesthetically and since we were not given any directions on style, and there was no specific market this project would cater to, I took the liberty of just making something that I personally would enjoy. My main inspiration then came from my usual pool of slightly futuristic, sleek UIs primarily inspired by video games. Given the time crunch (and the fact I did not know how long it would actually take to implement the core functionality) I chose to not go all out on this, while still keeping the general vibe I was going for.

_Screenshots from the figma project_![Screenshots from the figma project]()

One of my goals for this was to hopefully stand out by not doing the same skeuomorphic UI most implementations of the game use and my goal for the design was to look like something you’d see in a cool cyber cafe in 2050.

I also decided that one of the things I would do for this project is try out tailwind. I have wanted to try a CSS framework for a long time since I usually write my CSS myself and this is the first project I’ve done in a while where I could test it out.


# Development

## Frontend

After determining which technologies would be suitable for the project I began implementing the frontend by setting up the core UI components in react and tailwindCSS. I had not yet decided exactly how I would implement the game board, but I had a general idea of how I wanted the layout to be which was enough to start. I hardcoded the components I knew would be necessary as a start. This is what I usually do for react projects as it allows me to test things, and then later I add the functionality needed.

After the backend was up and running I connected the chat component to the socket system, and added rooms so that chats sent in one room are only shared with that room. Here I realized I’d need a way to show not only the room code, but also game information such as a score (represented by amount of captures). I then altered the UI somewhat to support this.


## Backend

Once I had a good start on the front-end I started introducing elements of the backend, by just setting up basic express and cors things I needed before doing anything else. After this was done I set up the docker containers and docker compose file so that everything can easily be deployed by the interviewer later on. 

I then started setting up the [socket.io](http://socket.io) connections which was a bit tricky at first as I had never used it before, and only had minimal experience with websockets in general. I started testing some of the functions of websockets, before connecting it up to the react frontend using the socket.io client, and once I was comfortable with this I started actually connecting this up to the postgres database from docker.

I also figured that since the game needs to be created before anything else happens, I used a standard REST API method to create a user and game, and then immediately join the game as the first user, ensuring that no one else can hijack the room. And only after this does the game start using the socket connection.


## The database

As per the instructions the project uses a postgres database, and I decided that I would use it to save the games and related information, principally Games, users and moves.

- **Games** contains information about the games such as who the players were, what room code it has (which is necessary to join it) and whether the game is still active.

- **users** contains information about each of the players, mainly their ID and nickname

- **moves** records each move either player makes, with info about which game they were playing and which number move it was


# How it works

## Starting a game

1\) Create a new game

- to create a new game the user only needs to input their username

- The username is sent to the backend via POST and queries the DB to make a new row in the user tables, when this is done it creates a game, using the userID as the first player (or black)

- On confirmed the server creates a new room with a custom room code (5 char hex string such as **og7dc**)

- _gameID_ as well as, _userID_, _nickname_ and _roomcode_ is sent back to the user and stores in cookies

2\) join existing game

- to join existing room user inputs game code in addition to their username

- data sends to connect to server with username and what room they wish to join

- Database games is updated to status active and assigns white player (player two)

3\) spectators

- To become a spectator you just join the same way as normal but the server sets the room to full on player two and as such you cannot use the chat, it makes sure of this by checking if you are player 1 or 2 and if not your messages do not go through


## Chatting

When you join a game as a player, you also get added into a socket io room which is ID by room number. You then can send messages, which should only appear for members of your room (or game).![Example of the project]()

\


_Example of the project_


# Use of AI

As a part of the task brief, we were “_allowed and encouraged to use AI, except vibecoding_” as long as we detailed this in the project report. As such I have used chatGPT sparingly mostly as a guidance tool rather than to rely on it for the whole project.

At the start of the project, I asked GPT what how it would go about doing the project in broad strokes. I figured as I have not used docker more than a handful of times in the last 5 years, I could get a gist of how to set up the project. The aspects that I was the most unsure about were the docker setup, as well as how to set up the game itself as I had never heard of the game and the rules seemed slightly complicated.

I also asked GPT for recommendations for a database setup that would work with what I wanted to make. It gave me a list of potential schemas, some of which I ended up using, along with proposing socket.io channels that could work with my project.

At the end I also used gpt to generate a list of swears with 5 or less letters to filter out from potential room IDs, this decision was inspired by [a talk](https://www.youtube.com/watch?v=MxZdg2NNr1A) given by jackbox at AWS re:Invent where they explained they had encountered offensive words in the randomly generated codes and had done the same. This was strictly not needed as the chances of it actually happening are one in 60 million, however it's a nice touch in the case that it DOES happen.


# Results

In the end I ran out of time to finish the project to the standard I would have liked to but I still managed to implement various features. I have been working full time at a grocery store and had a busy week, as such I have not been able to dedicate the time I needed to finish this.


## Features

In the front-end I have implemented a react app using tailwindCSS, with partial responsibility for smaller screens (but not mobile). I’ve created a clean and minimal darkmode UI tested with WAVE accessibility tool to make sure it follows good accessibility guidelines. It has a functioning chat and features the game of GO. The chat also is only for players and cannot be accessed by spectators. It also features forfeit and pass buttons and player score. Additionally there is a form handler that prevents empty messages to be sent in the chat. And the join/create screen has something similar if the player does not fill out the required fields.In the front-end I have implemented a react app using tailwindCSS, with partial responsibility for smaller screens (but not mobile). I’ve created a clean and minimal darkmode UI tested with WAVE accessibility tool to make sure it follows good accessibility guidelines. It has a functioning chat and features the game of GO. The chat also is only for players and cannot be accessed by spectators. It also features forfeit and pass buttons and player score. Additionally there is a form handler that prevents empty messages to be sent in the chat. And the join/create screen has something similar if the player does not fill out the required fields. I also made the page keyboard accessible for people with disabilities but it does not extend into the game.

In the backend I've implemented a node/express/postgres setup with a mix of REST api and socket.io that handles game logic, chat functionality, game joining and stores relevant data in a postgres database. Additionally I’ve added some error and response handlers to spit out nicely parsed and structured data, and a filter for the roomCodes in the case of it generating swears/slurs as it could theoretically print out a code like “fuck1” although the chances are small.


## To-Do

The game is lacking a proper system for actually checking player turns, right now either player can click on the board and make a move. The current database system is also severely lacking, with a very nonoptimal way to save moves to DB (right now it just awaits db save before making a move, essentially undoing the benefit of websockets), and less than great object schemas. The control buttons also do not fully function, and the frontend could definitely have better structure. Lastly if I had the time for it I would’ve programmed my own solution for the game itself, that's better adapted to React.


# Takeaways

Before starting on the project I did not know how much time I’d need to spend on different parts, as such I started with a preliminary idea of what I should focus on. After finishing the project It is clear that some more time could’ve been spent on making the frontend better given the position I’m applying for is a frontend one. There are many changes I would do if I had more time to work on it, that being said I’m glad I spent some of that time learning tailwindCSS as it is a good tool for creating good looking UIs quickly. I quite enjoyed the aesthetic I went for, and I think the project was fun albeit stressful at times, being a bit of a perfectionist I am not entirely happy with the final result.


# Resources

Some of the resources I used for the project

Excellent tutorial on how to build a simple chat app with socket.io

<https://www.youtube.com/playlist?list=PL0Zuz27SZ-6NOkbTDxKi7grs_oxJhLu07>

Tutorial for building a simple react/posgres app with docker

<https://dev.to/aadarsh-nagrath/building-a-simple-crud-application-with-react-and-postgresql-using-docker-550i>

The basis for my implementation of the game, I’ve used their code directly with only slight modifications to increase compatibility with react

<https://github.com/maksimKorzh/goboard-js>

I referenced this medium post when trying to figure out how to structure some of my code.

<https://medium.com/@diegolikescode/multiplayer-game-with-websockets-fd629686aaec>

I took inspiration by some of the information given in this talk by the jackbox team for various parts of the project\
<https://www.youtube.com/watch?v=MxZdg2NNr1A>
