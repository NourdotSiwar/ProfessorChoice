# Web Development Final Project - *ProfessorChoice*

Submitted by: **Nour Siwar**

This web app: **This web app is a bit based off of rate my professor, in which students are on a discussion forum discussing what professor to take for their class at their college. This web app has functionalities like commenting on the post and chatting privately with users to allow students to understand more about who to take for their class.**

Time spent: **74** hours spent in total

## Video Walkthrough

<img src='CompressedProfessorChoice.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  LiceCap!

## Required Features

The following **required** functionality is completed:

- [X] **A create form that allows the user to create posts**
- [X] **Posts have a title and optionally additional textual content and/or an image added as an external image URL**
- [X] **A home feed displaying previously created posts**
- [X] **By default, the time created, title, and number of upvotes for each post is shown on the feed**
- [X] **Clicking on a post shall direct the user to a new page for the selected post**
- [X] **Users can sort posts by either their created time or upvotes count**
- [X] **Users can search for posts by title**
- [X] **A separate post page for each created post, where any additional information is shown is linked whenever a user clicks a post**
- [X] **Users can leave comments underneath a post on the post's separate page**
- [X] **Each post should have an upvote button on the post's page. Each click increases its upvotes count by one and users can upvote any number of times**
- [X] **A previously created post can be edited or deleted from its post page**

The following **optional** features are implemented:

- [ ] Users can only edit and deleted posts or delete comments by entering the secret key, which is set by the user during post creation
- [X] Upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them.
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface of the web app
- [ ] Users can share and view web videos
- [X] Users can set flags while creating a post. Then users can filter posts by flags on the home feed.
- [ ] Users can upload images directly from their local machine as an image file
- [X] Display a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [X] Users can login/signup to create an account with their username, fullname, email, and their ID will be created. 
* [X] Users can report a post which they see inappropriate 
* [X] Users can save posts and will see a list of posts on their account
* [X] Users have their own account, showing when they joined, their fullname, email, username, # of posts, # of comments, # of saved posts.
* [X] On account page, users can change their username, plus see a list of all their comments, posts, and saved posts.
* [X] When viewing detail of any post, users can see who posted the post.
* [X] On the post, users can click on the author of the post and see their profile, which has the date they joined, their username, # of comments and posts, and list of their comments and posts.
* [X] When creating a post, users are required to fill the form in a specific manner depending on flair. Ie, if flair was opinion, users must have char count of at least 250.
* [X] Users can see their character count while creating the post.
* [X] If stuck on creating a post, users can look at hints provided on the post form to ask/write about a professor.
* [X] On comments functionality, users can edit, delete, and update their own comments. 
* [X] Chat feature! Users can chat with one another in realtime to ask about a specific professor if needed. 

## Notes

1. Authnetication
* Struggled with signing and loggin in when my supabase version was different than other tutorials' versions, solved the issue by finding a tutorial that was using the same version as me.
* Credits: https://www.youtube.com/playlist?list=PLl6EcvA_AoxEU455Yi1JoYVwHfpHpNkAw

2. CRUD operation
* Struggled with getting user id, solved by utilizing chatgpt to understand the bugs and what was the source
* Utilized chatgpt to add the upvote functionality as I struggled with having all posts update when I click only one button of one post
* Used chatgpt to create quick css templates for each page

3. search functionality
* struggled with search functionality between navigation bar and dashboard so i moved the bar to the dashboard and used one of codepath labs
* played with the css to understand why posts kept getting squished, solved by playing with the width

4. Detailed Post 
* Uitlized lab 6 to be able to post title and content of post

5. Flag System
* Struggled with filtering by question and opinion, utilized chatgpt and ended up being able to get more concise code that does multiple filtering

6. Comment System
* Struggled with figuring out how to start the comment system, utilized CRUD operations like I did with posts.
* Struggled with linking comments and posts id's, utilized chatgpt and my understanding of code to debug
* Struggled with passing parameters, opted to go through each line and redefined variable
 
7. Naming convention 
* Struggled with naming divs and css elements, used this https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/ 
fix all files. 

8. CreatePost form 
credits for word counter: https://codepen.io/geoffbuell/pen/mdREpwM
dropdown icons: https://react-icons.github.io/react-icons/search?q=arrow

9. Adding # of comments
icon react: https://react-icons.github.io/react-icons/search?q=vote 

10. Saved professors
Utilized Instagram feature of saving posts

11. chat functionality
* utilized supabase commuity
* credit: https://reactjsexample.com/a-chat-app-using-reactjs-and-supabase/
* struggled with letting messages show, utilized project above
* struggled with getting db to listen to users message
* struggled with bar scrolling down automatically
* credit for bar: https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
* credit for bar behavior: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
* struggled with only showing conversations with users that alr conversed with the current user

12 Design credit:
https://www.befunky.com/create/blur-image/
https://imagecolorpicker.com/en
https://www.sessions.edu/color-calculator/


## License

    Copyright [2023] [Nour Siwar]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
