# Doodle Frontend Engineer Task

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Notes

- Due to time constraints I made longer messages scrollable if the height is more than 100px. The preferable solution would be to have a 'Read more...' button like Telegram and WhatsApp.

- Usually I'd set up eslint and add the a11y plugin to catch accessibility issues which aren't immediately obvious. I could scroll through it with tab and shift tab and the input element starts on screen and focused. The app should in theory be usable with a screen reader.

- The way to determine the timestamp for initial and subsequent loads of messages was a bit unclear because when you start up, you have no record of the last poll so you do a fetch and record the time. If there number of messages between the beginning of the message log and the time you first poll is over the requested limit, any additional messages will not show up.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
