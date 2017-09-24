# Health Tracker

A single page app that tracks the user's calorie intake, and optionally, other health-related metrics  using Backbone.js.

## Running the app

1. Clone the repository or Download and Unzip the ZipFile;
2. Via Command Prompt access the created directory; 
3. Inside the directory, initilializes a new server by writting 
``` 
python -m http.server 8000 
```
, for Python 3 users, or 
```
python -m SimpleHTTPServer 8000
```
for Python 2 users;

4. At this point, you should be able to access the ``index.html`` file by accessing the ``http://localhost:8000/`` on your browser;

Alternatively, you can follow the step 1 then navigate throught the operational system to the created directory and double click the ``index.html`` file.

## Usage 

- Make search for foods by writting the name in the search box and pressing the "Search" button; 

- Add foods to your diet by clicking in the green **"+"**; 

- Access added foods and your total calories by clicking in the red **heartbeat icon**; 

- Remove foods from your diet by clicking in the red **"x"**;