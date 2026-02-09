# Contact Manager

A full-stack contact management web application built on the LAMP stack (Linux, Apache, MySQL, PHP). Users can register, log in, and perform full CRUD operations on their personal contacts.

## Features

- User Authentication -- Register and log in with secure credentials; sessions are maintained via cookies (20-minute expiry).
- Add Contacts -- Store contacts with first name, last name, phone number, and email.
- Search Contacts -- Search your contact list by name with real-time results.
- Edit & Delete -- Update contact details or remove contacts through confirmation-protected modals.
- Responsive Design -- Fully responsive UI that works across desktop and mobile devices.

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | HTML, CSS, JavaScript   |
| Backend   | PHP (REST API)          |
| Database  | MySQL                   |
| Server    | Apache on Linux         |

## Project Structure

```
LAMP Stack/
├── LAMPAPI (Fully Complete)/
│   ├── Login.php
│   ├── Register.php
│   ├── AddContact.php
│   ├── SearchContact.php
│   ├── UpdateContact.php
│   └── DeleteContact.php
├── css/
├── js/
├── images/
├── index.html
├── contacts.html
└── color.html
```

## API Endpoints

All endpoints accept `POST` requests with JSON bodies and return JSON responses.

| Endpoint             | Description                        |
|----------------------|------------------------------------|
| `/LAMPAPI/Register.php     | Register a new user       |
| `/LAMPAPI/Login.php        | Authenticate a user       |
| `/LAMPAPI/AddContact.php   | Add a new contact         |
| `/LAMPAPI/SearchContact.php| Search contacts by name   |
| `/LAMPAPI/UpdateContact.php| Update an existing contact|
| `/LAMPAPI/DeleteContact.php| Delete a contact          |

Full API documentation is available via SwaggerHub (see the link in the LAMPAPI directory).

## Getting Started

### Prerequisites

- Linux server (or local environment such as XAMPP/WAMP)
- Apache with PHP enabled
- MySQL


## Team

| Role              | Members          |
|-------------------|------------------|
| Project Manager   | Sophi            |
| Frontend          | Manny, Sophi     |
| Database          | Parth, Zach      |
| API               | Aliza, Arav      |

## AI Disclosure

[Claude](https://claude.ai) (by Anthropic) was used to assist with the frontend UI aesthetics, including styling and visual design of the application.
