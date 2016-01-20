# Coffee Shop
E-commerce site for coffee shop powered by Express that allows you to subscribe for a coffee delivering service.  

## Summary 
Express app created and styled e-commerce website from wireframes and images assets provided.  Front-end developed using Jade & Sass.  Routes are handled through Node.  Payment methods are handled using Stripe, and Passport handles security.  

![](https://github.com/wkwyatt/ecommerce-coffee-site/blob/gh-readme/public/images/home_ss.png)
![](https://github.com/wkwyatt/ecommerce-coffee-site/blob/gh-readme/public/images/order_ss.png)
![](https://github.com/wkwyatt/ecommerce-coffee-site/blob/gh-readme/public/images/pay_ss.png)

## Demo
[Live Demo](https://wills-coffee.herokuapp.com/)

## NPM Installs
Be sure to run npm installs including the initial install to load the package.json files

```linux
$ npm install 
$ npm install mongoose --save
$ npm install nodemailer --save
$ npm install passport --save
$ npm install passport-local --save
$ npm install passport-local-mongoose --save
$ npm install stripe --save
```

## Features
* Sign up as a new user / Login
* Place subscription order
* Edit order information, view current order info
* Payment modal using Stripe
* Implemented passport strategies to manage security and session data
* Applied Mongoose models to collect data from MongoDB

## Upcoming Features
* Manage multiple orders from one user

## Bugs 
* Get Started button routing to wrong login page

