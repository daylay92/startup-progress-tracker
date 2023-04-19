# Shopping Basket

## Description

An application that documents and tracks the progress of startups through different phases.

## Requirements
- Every phase can have an unlimited amount of tasks.
- If a startup accomplishes all tasks in the phase, it's marked as done and unlocks the next phase.
- Tasks cannot be marked as completed unless all tasks in the previous phase were completed.
- Propose and implement a solution on how to undo a task.

## Features 
The following features have been added to the application.

- GraphQL mutations to create, update and edit a phase.
- GraphQL mutations to add a task to an existing phase.
- GraphQL mutations to update and remove a task from an existing phase.
- GraphQL queries to view all existing phases and their related tasks.
- GraphQL queries to view single details of phases and tasks.
- GraphQL mutations to create, update and remove a startup.
- GraphQL mutation to complete a task related to a specific phase.
- GraphQL query to view the progress of a specific startup (showing tasks completed and undone for each phase)
- GraphQL mutation to undo a task.

## Prepositions and Added Features
The following features where added to solve a number of issues including how to undo a task or to ensure that a phase is not completed unless the tasks in the preceding phases have all been completed.

- Added a field called `order` which is a number that is automatically added to a phase when it is created and used to track the order in which each phase must be completed. For instance, any task associated with a phase whose order number is `2` cannot be completed if all the tasks in phase with the order number of `1` have not been completed.

- The functionality to undo a task checks if there are completed tasks for phases that follow after the phase associated with the task that should be undone and also undoes all such tasks if any are found in order to ensure that tasks can be undone without breaching the requirement that states: *Tasks cannot be marked as completed unless all tasks in the previous phase were completed.*

## Database and Storage
No databases have been implemented as specified in the requirement but stored within data structures at runtime. The `database` folder contains artifacts that may help in understanding how this was done. Inline with the requirement, A database schema diagram was implemented and can be viewed [here](https://dbdiagram.io/d/643f5f626b31947051d3925a) on dbdiagram.io. 
To ensure that quick access and visibility of functionalities are available at runtime, I have added a functionality to automatically seed data into the datastore so that a few `startups` and `phases` can be viewed via the appropriate graphQL query.

### Prerequisites

This app is built with the following tools and may require that they are installed on your environment before it can run successfully. If docker is available on your environment, you do not need to have Node.js.

- Docker
- Nodejs (>=v16 Only required if Docker is unavailable)


#### Environment Variables
The application only has one environment variable (PORT) which is optional. To set the application PORT, add a .env file to the root folder of application (Non Docker setup). If you would be using Docker to run the application, this is unneccessary however, you would be required to bind the container PORT 4500 to port of your choice on your host machine where you would be able to send requests to the server.

PORT - The port of the backend server. (Backend - Optional and defaults to 4500)


### Initialization Steps (Docker)
To get the app up and running on a local environment, do the following:

- clone the repository with the following command:
```bash
# get app
$ git clone https://github.com/daylay92/startup-progress-tracker
```
- Open the folder of the cloned repository
- Run the following command at the root of the project:
```bash
# Build docker image
$ docker build -t startup-progress-tracker .
```
```bash
# Run app container
$ docker run -p 4500:4500 startup-progress-tracker
```
- Note that you can bind any other port on your host machine to the container if 4500 is taken by changing the command to: `docker run -p <PORT>:4500 startup-progress-tracker`
- The app should now be running on port 4500, You would be able to interface would the GraphQL Playground [here](http://localhost:4500/graphql)
- Navigate to the browser and visit `http://localhost:4500/graphql`


###### Command Summary

```bash
# get app
$ git clone https://github.com/daylay92/startup-progress-tracker

# navigate to working directory and add environment variables
$ cd startup-progress-tracker

# Build docker image
$ docker build -t startup-progress-tracker .

# Run app container
$ docker run -p 4500:4500 startup-progress-tracker
```

### Initialization Steps (Without Docker)
To get the app up and running on a local environment, do the following:

- clone the repository with the following command:
```bash
# get app
$ git clone https://github.com/daylay92/startup-progress-tracker
```
- Open the folder of the cloned repository
- Run the following command at the root of the project:
```bash
# start server
$ cd startup-progress-tracker && npm run dev
```
- The app should now be running on port 4500, (or a PORT you set in the .env file) with all GraphQL APIs visible on the playground [here](http://localhost:4500/graphql)
- Navigate to the browser and visit `http://localhost:4500/graphql`


###### Command Summary

```bash
# get app
$ git clone https://github.com/daylay92/startup-progress-tracker

# navigate to working directory and add environment variables
$ cd startup-progress-tracker

# start server
$ npm run dev
```

##### Testing (Integration Tests And Unit Tests)
No test have been added as at the time of submission due to the timeline but would be added later to this project.

### API Endpoints
Once the application is up, visit `http://localhost:4500/graphql` on your browser and you should see the GraphQL playground.


###### Other Technologies used:
- Typescript
- Nodejs
- Apollo Server (GraphQL)
- Express