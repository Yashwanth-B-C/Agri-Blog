Agri-Blog: An Agricultural Platform
Agri-Blog is a full-stack web application designed to be a comprehensive platform for the agricultural community. It features a blog section for sharing knowledge, an AI-powered chatbot for farmer queries, and an e-commerce marketplace for direct sales of farm produce.

Features

•	Blog Platform: Users can create, publish, and manage agricultural blogs.

•	AI Chatbot: An integrated chatbot powered by OpenAI's GPT-3.5-turbo provides instant answers to farming-related questions.

•	E-commerce Marketplace: Farmers can list their products for sale, and customers can purchase them directly.

•	User Authentication: Secure signup and login for users.

•	Image Uploads: Support for uploading images for blogs and products.

Technologies Used

•	Backend: Node.js, Express.js

•	Frontend: HTML, CSS, JavaScript

•	Database: JSON files (for simplicity in this demonstration)

•	External APIs: OpenAI API (for the chatbot)

Getting Started

Follow these instructions to get your Agri-Blog project up and running on your local machine.

Prerequisites

Make sure you have the following installed:

•	Node.js1 (LTS version recommended)

•	npm (comes with Node.js)

Installation

1.	Clone the repository:
   
Bash

git clone https://github.com/Yashwanth-B-C/Agri-Blog

cd agri-blog

3.	Install Node.js packages:
   
Navigate to the project's root directory in your terminal and install the required npm packages:

Bash

npm install express fs path multer body-parser express-session axios dotenv

Self-correction: The provided package.json only lists dependencies. I should include all the mentioned packages explicitly.

Alternatively, you can create a package.json file and then run npm install:

JSON

// package.json

{
  
  "name": "agri-blog",
 
  "version": "1.0.0",
 
  "description": "An agricultural platform with blogs, an AI chatbot, and an e-commerce marketplace.",
 
  "main": "app.js",
 
  "scripts": {
   
    "start": "node app.js"

  },
  
  "dependencies":
  {
 
    "express": "^4.19.2",
   
    "fs": "^0.0.1-security",
   
    "path": "^0.12.7",
   
    "multer": "^1.4.5-lts.1",
   
    "body-parser": "^1.20.2",
   
    "express-session": "^1.18.0",
   
    "axios": "^1.7.2",
   
    "dotenv": "^16.4.5"
 
  },
  "keywords": 
  [
   
    "agriculture",
    
    "blog",
   
    "chatbot",
   
    "ecommerce",
   
    "nodejs"

  ],
  
  "author": "Your Name",
 
  "license": "ISC"

}

Then run:

Bash

npm install

Configuration

1.	Create .env file:
   
In the root directory of your project, create a file named .env. This file will store your OpenAI API key.

OPENAI_API_KEY=your_openai_api_key_here

Replace your_openai_api_key_here with your actual API key obtained from OpenAI.

3.	Create data directory and JSON files:
   
Create a folder named data in the root directory. Inside the data folder, create the following empty JSON files:

o	posts.json (for blog posts)

o	users.json (for user credentials)

o	products.json (for e-commerce products)

The directory structure should look like this:

agri-blog/

├── data/

│   ├── posts.json

│   ├── users.json

│   └── products.json

├── public/

│   ├── uploads/  (This folder will be created automatically by the app)

│   ├── index.html

│   ├── login.html

│   ├── signup.html

│   ├── shop.html

│   └── ... (other static files)
├── .env

├── app.js

├── package.json

└── README.md

5.	Create uploads directory:
   
Although the application creates this directory if it doesn't exist, you can manually create it within the public folder:

Bash

mkdir -p public/uploads

This folder will store images uploaded for blogs and products.

Running the Application

1.	Start the server:
   
Bash

node app.js

You should see the message: Server running at http://localhost:3000 in your terminal.

3.	Access the application:
   
Open your web browser and navigate to:

http://localhost:3000

You will be redirected to the login page. From there, you can sign up as a new user or log in if you have an existing account.


Screenshots

![image](https://github.com/user-attachments/assets/c47003fe-9a0d-4b05-a558-145a776d7e5a)
![image](https://github.com/user-attachments/assets/bf8ee7fd-8b30-44a1-b458-a348fa376037)
![screencapture-localhost-3000-index-html-2025-06-11-11_38_55](https://github.com/user-attachments/assets/77cae6c5-90ca-45be-b65e-ea39f4606b83)
![screencapture-localhost-3000-post-html-2025-06-11-11_39_51](https://github.com/user-attachments/assets/a3a7d424-6466-486a-a376-e662b44234c7)
![screencapture-localhost-3000-shop-html-2025-06-11-11_40_51](https://github.com/user-attachments/assets/7b660639-e5c7-4192-8699-0dbe10204cca)
