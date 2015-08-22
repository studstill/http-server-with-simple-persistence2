#HTTP Server with Simple Persistence

###HTTP server that will act as a simple data store.

- Responds to `GET/POST/PUT/DELETE` requests for a single user resource consisting of username and email

- The data coming in from a post request is saved to a json file in a `data` folder in your repository

>For example if a request is sent to `/users` with a body of {username: 'user123'} the json data in the will be stored in it's own json file.

- The file-naming scheme uses the numbers (`file1.json`, `file2.json`, etc.) when creating files
