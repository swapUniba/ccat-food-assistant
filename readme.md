# Getting started

1) Download the repository on the machine
2) Install Node.js if needed using `sudo apt install npm`
3) Install Docker if needed
4) Move to project's webapp folder (e.g. `cd food-assistant/webapp`) and install npm dependencies with `npm install`
5) Give execution permission to react compiler script `chmod +x ./app/Packages/ReactJsBundler/Scripts/batch-compile.sh`
6) Compile JSX files `./app/Packages/ReactJsBundler/Scripts/batch-compile.sh` (it could take from 5 to 15 seconds)
7) Configure the following environment files (an example version is always available, just renaming file
   without `.example` and uncommenting constants should be fine):
   -`webapp/config/environment.php`
   -`webapp/app/Packages/FoodAssistant/Config/environment.php`
   -`webapp/app/Packages/Shortlinks/Config/environment.php`
   -`cat/data/metadata.json`
8) Rename .htaccess.example to .htaccess in /webapp folder
8) Move to project's root directory
9) Start docker compose app:

- `docker compose pull`
- `docker compose build`
- `docker compose up -d --remove-orphans`

10) Init the database

- `docker cp ./mysql/init/init.sql food_print_mysql:/init.sql`
- `docker exec -it food_print_mysql bash`
- `mysql -u root -p food_assistant < /init.sql` (default password = `root`)

# Webapp architecture

## Disclaimer

The following documentation should be intended as an appendix of the thesis work. It is really important to read (at
least) the chapter 1 and 3 of the thesis before reading the rest of this file, otherwise many concept could not be
understood correctly.

## Overview

The webapp is located in the "webapp" directory in the root folder of the project. It is developed with the help of a
custom PHP MVC framework named Fux inspired to Laravel. Each table in the database is mapped with a Model class that
implements various methods to interact with the table with an ORM paradigm. The webapp is mainly composed by 3
components:

- The FoodAssistant package
- The Shortlinks package
- Chat React JS implementation

The first two packages are located in the `/webapp/app/Packages/` folder. FoodAssistant package contains the entire
web app UI along with all controllers classes, route files and models. This package exploit the `Auth` package in order
to manage the user authentication easily. The FoodAssistant package is better described in following sections.

The Shortlinks package expose an API route that allow the assistant backend to generate shortlinks for long URLs
returned
from various APIs (such as Edamam or FoodPrint); in fact the JSON response sent from the cheshire cat to the webapp can
be included in the next LLM calls in order to provide chat history and providing long links cause a big increase of the
number of tokens sent to the LLM.

Lastly the chatroom itself is implemented with the help of small React JSX files. Those files are located in
the `/webapp/public/react-components` folder. In order to embed a React component inside a PHP based view a custom build
and bundle scripts have been implemented (the bundler code is located in `/webapp/app/Packages/ReactJsBundler` folder).
The whole process can be simplified with following steps:

- Each time a `*.jsx` file in the `/webapp/public/react-components` is modified the files need to be compiled manually
  or with the help of some IDE file watchers feature. There exists a dedicated shell script that automatically converts
  all .jsx files in compiled js files with the help of Babel NPM package. This shell script is located
  in  `/webapp/app/Packages/ReactJsBundler/Scripts/batch-compile.sh` (in the same folder exists a file `watchers.xml`
  that can be imported into JetBrains IDE in order to automatically generate .js files at every change of .jsx files).
  The shell script should be executed having `/webapp` folder as working directory;
- When a component (usually an entry point component) need to be included into a PHP view the following PHP code should
  be executed inside a <script> tag in the
  view: ```php <?= \App\Packages\ReactJsBundler\ReactBundler::bundle("/AiAssistant/AiAssistantChatRoomView.jsx", true) ?> ```
  This small line of code allow the PHP bundler to read the entry point component along with its dependencies (various
  JS imports statements) and create a unique JS code bundle that will be inserted in place.

## FoodAssistant package

The aim of this package is to manage the whole UI and act as a conversational proxy between the user and the cheshire
cat core.

### Authentication

The UsersModel class (`webapp/app/Packages/FoodAssistant/Models/UsersModel.php`) implement a simple Authenticatable
interface that allow to use the Auth package along with its Auth class in order to easily manage alla authetication
phases. All phases (register, login, logout) are implemented in
the `webapp/app/Packages/FoodAssistant/Controllers/AuthController.php` class.

### Chat system

In order to separate the chatting engine from the authentication and the assistant implementation, the chat rooms
management is completely agnostic with respect to the AI assistant. This means that the AI assistant work on top of a
chat system (which works with its own users, chat rooms and messages) and links assistant users (those stored in
the `users` table) to a chat user (those stored in the `chat_users` table). Chat system tables have their own model
files which are located in the `webapp/app/models/Chat` folder.
The `webapp/app/Packages/FoodAssistant/Utils/ChatRepository.php` class allow the assistant's package to interact with
chat system tables allowing to store and retrieve messages in a specific chat room.
Another important file that interacts with the underlying chat system is
the `webapp/app/Packages/FoodAssistant/Utils/AssistantChatUtils.php` class. Inside this class two important methods are
implemented:

- `getChatRoomId` that retrieve assistant chat room id for a given user, if not exists a new chat room is created
- `getUserChatId` that provide a chat_user_id (meaning the chat system's user id) for a given platform user. This method
  is used by the previous one in order to create/retrieve the correct assistant chat room for the given user

This mechanism allow to replace the chat system with other chat providers or external platforms (for instances
ChatRocket or similar) by simply editing previously cited classes/methods.

### Assistant conversation flow

A typical assistant conversation flow follows the steps listed below (we assume that a platform user already exists and
is already logged-in):

- User navigate the `/chat` route, this trigger the `AssistantChatUtils::getChatRoomId` method which assign
  a `chat_user_id` to the logged user and create a new chat room for that newly created chat user. If one of these items
  already exists their instance is just returned and not created again. The system returns as response the chat view,
  along with the compiled JSX files and all dependencies;
- At this point the cheshire cat has never been invoked;
- Once the user send a new message the React application send a request to the `/ai-assistant/chat/send-text-message`
  endpoint which invoke the `ChatController::sendTextMessage` method. Here the system stores the user's message in the
  DB and forward it to the Cheshire cat instance through a websocket connection created with the help of the official
  PHP library. A fast response in returned to the user while keeping PHP waiting the assistant response in the
  background. When the response is returned from the cheshire cat it is processed (intercepting widgets code and
  transforming it into a valid JSON structured to be stored in the message metadata) and then it is stored in the
  database;
- During these asynchronous tasks, the React application continuously check for new messages (this is done by making a
  request every X seconds to the  `/ai-assistant/chat/get-messages` endpoint which returns new message list based on the
  last received message on the client side);
- When the system is waiting the cheshire cat response, the user cannot send another message, emulating the same
  conversation constraints for various chat-based AI assistant
- On the client side each time a new message is added to the UI, it is processed by specific React components in order
  to manage the presence of widgets inside the message (it is important to specify that each message can contain only
  one widget that will be placed at the end of the message). In particular the component `AiAssistantChatRoomView`
  renders the base `ChatRoomView` component passing the reference of a callback function `widgetRenderer` that, given a
  message, returns the correct widget component instance to be rendered (if needed). When the `ChatRoomView` component
  is rendering single chat room messages the message itself is process by this function and its result is passed as
  props to the `ChatRoomMessage` component that will finally render the message text and the widget too.

The `ChatRoomMessage` component is capable of manage multiple type of messages (potentially images, video,
audio, etc...). It basically obtains the correct component instance based on the message type (actually only TextMessage
is implemented) passing down the eventual widget component received by the `ChatRoomView` parent.

### UI examples

Example messages can be edited/added through the `webapp/app/Packages/FoodAssistant/Config/examples.php`. There are two
version of the examples: in english and italian version. They should be always in sync, if they are not, nothing
dangerous happen, however is highly recommended.

