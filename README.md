# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```
boilerplate
├─ .env
├─ .eslintignore
├─ .eslintrc
├─ .prettierrc
├─ README.md
├─ craco.config.js
├─ customize-cra-config.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ .htaccess
│  ├─ favicon.png
│  ├─ favicon.svg
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ logo_dark.svg
│  ├─ manifest.json
│  └─ robots.txt
└─ src
   ├─ App.js
   ├─ components
   │  ├─ buttons
   │  │  ├─ buttons.js
   │  │  ├─ calendar-button
   │  │  │  └─ calendar-button.js
   │  │  ├─ export-button
   │  │  │  └─ export-button.js
   │  │  ├─ share-button
   │  │  │  └─ share-button.js
   │  │  └─ styled.js
   │  ├─ cards
   │  │  ├─ Style.js
   │  │  └─ frame
   │  │     ├─ cards-frame.js
   │  │     └─ style.js
   │  ├─ checkbox
   │  │  ├─ checkbox.js
   │  │  └─ style.js
   │  ├─ dropdown
   │  │  ├─ dropdown-style.js
   │  │  └─ dropdown.js
   │  ├─ heading
   │  │  ├─ heading.js
   │  │  └─ style.js
   │  ├─ page-headers
   │  │  ├─ page-headers.js
   │  │  └─ style.js
   │  ├─ popup
   │  │  ├─ popup.js
   │  │  ├─ style.css
   │  │  └─ style.js
   │  ├─ tasklist
   │  │  └─ TaskList.js
   │  └─ utilities
   │     ├─ auth-info
   │     │  ├─ Message.js
   │     │  ├─ Notification.js
   │     │  ├─ Search.js
   │     │  ├─ auth-info-style.js
   │     │  ├─ info.js
   │     │  └─ settings.js
   │     ├─ icons.js
   │     ├─ protectedRoute.js
   │     └─ utilities.js
   ├─ config
   │  ├─ api
   │  │  ├─ firebase.js
   │  │  └─ index.js
   │  ├─ auth0.js
   │  ├─ config.js
   │  ├─ dataService
   │  │  └─ dataService.js
   │  ├─ database
   │  │  └─ firebase.js
   │  ├─ icon
   │  │  └─ icon.json
   │  ├─ map
   │  │  └─ google-maps-styles.js
   │  └─ theme
   │     ├─ themeConfigure.js
   │     └─ themeVariables.js
   ├─ container
   │  ├─ calendar
   │  │  ├─ Calendar.js
   │  │  └─ Style.js
   │  ├─ course
   │  │  └─ CourseDetails.js
   │  ├─ crud
   │  │  ├─ axios
   │  │  │  └─ Add.js
   │  │  └─ fireStore
   │  │     ├─ View.js
   │  │     ├─ addNew.js
   │  │     ├─ edit.js
   │  │     └─ style.js
   │  ├─ dashboard
   │  │  └─ overview
   │  │     └─ index
   │  │        └─ SalesByLocation.js
   │  ├─ maps
   │  │  └─ Vector.js
   │  ├─ pages
   │  │  ├─ 404.js
   │  │  ├─ BlankPage.js
   │  │  ├─ Dashboard.js
   │  │  ├─ style.js
   │  │  └─ wizards
   │  │     └─ overview
   │  │        └─ WizardsSix.js
   │  ├─ profile
   │  │  ├─ authentication
   │  │  │  ├─ Index.js
   │  │  │  └─ overview
   │  │  │     ├─ FbSignIn.js
   │  │  │     ├─ FbSignup.js
   │  │  │     ├─ ForgotPassword.js
   │  │  │     ├─ SignIn.js
   │  │  │     ├─ Signup.js
   │  │  │     └─ style.js
   │  │  ├─ myProfile
   │  │  │  ├─ Index.js
   │  │  │  └─ overview
   │  │  │     ├─ Activity.js
   │  │  │     ├─ ActivityContent.js
   │  │  │     ├─ Overview.js
   │  │  │     ├─ RightAside.js
   │  │  │     ├─ Timeline.js
   │  │  │     ├─ UserBio.js
   │  │  │     └─ timeline
   │  │  │        ├─ CreatePost.js
   │  │  │        └─ Posts.js
   │  │  ├─ overview
   │  │  │  └─ CoverSection.js
   │  │  └─ settings
   │  │     ├─ Settings.js
   │  │     └─ overview
   │  │        ├─ Account.js
   │  │        ├─ Notification.js
   │  │        ├─ Passwoard.js
   │  │        ├─ Profile.js
   │  │        ├─ ProfileAuthorBox.js
   │  │        └─ SocialProfile.js
   │  ├─ styled.js
   │  └─ table
   │     └─ DragTable.js
   ├─ demoData
   │  ├─ changelog.json
   │  └─ message-list.json
   ├─ i18n
   │  ├─ config.js
   │  └─ localization
   │     ├─ ar
   │     │  └─ translation.json
   │     ├─ en
   │     │  └─ translation.json
   │     └─ esp
   │        └─ translation.json
   ├─ index.js
   ├─ layout
   │  ├─ MenueItems.js
   │  ├─ Style.js
   │  ├─ TopMenu.js
   │  └─ withAdminLayout.js
   ├─ logo.svg
   ├─ redux
   │  ├─ authentication
   │  │  ├─ actionCreator.js
   │  │  ├─ actions.js
   │  │  └─ reducers.js
   │  ├─ crud
   │  │  └─ axios
   │  │     └─ actionCreator.js
   │  ├─ fileManager
   │  │  └─ actionCreator.js
   │  ├─ firebase
   │  │  ├─ auth
   │  │  │  ├─ actionCreator.js
   │  │  │  ├─ actions.js
   │  │  │  └─ reducers.js
   │  │  └─ firestore
   │  │     ├─ actionCreator.js
   │  │     ├─ actions.js
   │  │     └─ reducers.js
   │  ├─ jobs
   │  │  └─ actionCreator.js
   │  ├─ message
   │  │  ├─ actionCreator.js
   │  │  ├─ actions.js
   │  │  └─ reducers.js
   │  ├─ notification
   │  │  ├─ actionCreator.js
   │  │  ├─ actions.js
   │  │  └─ reducers.js
   │  ├─ rootReducers.js
   │  ├─ store.js
   │  └─ themeLayout
   │     ├─ actionCreator.js
   │     ├─ actions.js
   │     └─ reducers.js
   ├─ reportWebVitals.js
   ├─ routes
   │  ├─ admin
   │  │  ├─ firebase.js
   │  │  ├─ index.js
   │  │  └─ pages.js
   │  └─ auth.js
   ├─ setupTests.js
   ├─ static
   │  ├─ css
   │  │  └─ style.css
   │  └─ img
   │     ├─ Group 9786.png
   │     ├─ PayPalLogo.png
   │     ├─ Subtraction1.png
   │     ├─ admin-bg-light.png
   │     ├─ auth
   │     │  ├─ BG.png
   │     │  ├─ Illustration.png
   │     │  ├─ bottomShape.png
   │     │  └─ topShape.png
   │     ├─ avatar
   │     │  ├─ NoPath (2).png
   │     │  ├─ NoPath (3).png
   │     │  ├─ NoPath (4).png
   │     │  ├─ NoPath.png
   │     │  ├─ chat-auth.png
   │     │  ├─ profileImage.png
   │     │  ├─ t1.png
   │     │  └─ team-1.png
   │     ├─ banner
   │     │  ├─ 1.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  ├─ BG.png
   │     │  ├─ badge.svg
   │     │  ├─ banner-1.png
   │     │  ├─ banner-2.png
   │     │  ├─ banner-3.png
   │     │  ├─ banner-4.png
   │     │  ├─ card-banner-1.png
   │     │  ├─ card-banner-2.png
   │     │  ├─ cta-banner-1.png
   │     │  ├─ cta-banner-2.png
   │     │  └─ header-banner.png
   │     ├─ bar-dark.png
   │     ├─ barcode.png
   │     ├─ blogs
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 14.png
   │     │  ├─ 15.png
   │     │  ├─ 16.png
   │     │  ├─ 17.png
   │     │  ├─ 18.png
   │     │  ├─ 19.png
   │     │  ├─ 2.png
   │     │  ├─ 20.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  └─ blog-details
   │     │     ├─ 1.png
   │     │     └─ 2.png
   │     ├─ book-open.png
   │     ├─ browser
   │     │  ├─ chrome.png
   │     │  ├─ firefox.png
   │     │  ├─ internet-explorer.png
   │     │  ├─ opera.png
   │     │  └─ safari.png
   │     ├─ cards-logo
   │     │  ├─ american-express.png
   │     │  ├─ ms.png
   │     │  └─ visa.png
   │     ├─ chat-author
   │     │  ├─ g1.png
   │     │  ├─ g2.png
   │     │  ├─ g3.png
   │     │  ├─ t1.jpg
   │     │  ├─ t10.png
   │     │  ├─ t12.png
   │     │  ├─ t2.jpg
   │     │  ├─ t3.jpg
   │     │  ├─ t4.jpg
   │     │  ├─ t5.png
   │     │  ├─ t6.png
   │     │  ├─ t7.png
   │     │  ├─ t8.png
   │     │  ├─ t9.png
   │     │  └─ w.png
   │     ├─ corporate.png
   │     ├─ courses
   │     │  ├─ 1.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  └─ 7.png
   │     ├─ email
   │     │  ├─ 1.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  └─ 4.png
   │     ├─ files
   │     │  ├─ jpg.png
   │     │  ├─ pdf.png
   │     │  ├─ png.png
   │     │  ├─ psd.png
   │     │  └─ zip.png
   │     ├─ flag
   │     │  ├─ ar.png
   │     │  ├─ en.png
   │     │  ├─ esp.png
   │     │  └─ germany.png
   │     ├─ gallery
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  └─ 9.png
   │     ├─ google.png
   │     ├─ icon
   │     │  ├─ 007-microphone-1.png
   │     │  ├─ 010-home.png
   │     │  ├─ 013-document-1.png
   │     │  ├─ 014-document.png
   │     │  ├─ 015-color-palette.png
   │     │  ├─ 017-video-camera.png
   │     │  ├─ 024-like.svg
   │     │  ├─ 1.svg
   │     │  ├─ 155-credit-card.svg
   │     │  ├─ 2.svg
   │     │  ├─ 3.svg
   │     │  ├─ 4.svg
   │     │  ├─ New Customer.svg
   │     │  ├─ NotOpen.svg
   │     │  ├─ Opened.svg
   │     │  ├─ Profit.svg
   │     │  ├─ SalesRevenue.svg
   │     │  ├─ Sent.svg
   │     │  ├─ Slack.svg
   │     │  ├─ address.svg
   │     │  ├─ adidas.svg
   │     │  ├─ adobe.svg
   │     │  ├─ arrow-growth.svg
   │     │  ├─ arrow-left.png
   │     │  ├─ arrow-left.svg
   │     │  ├─ arrow-right.png
   │     │  ├─ arrow-right.svg
   │     │  ├─ bell.svg
   │     │  ├─ book-open.svg
   │     │  ├─ book.svg
   │     │  ├─ briefcase.svg
   │     │  ├─ camera.svg
   │     │  ├─ chat.svg
   │     │  ├─ check-circle.svg
   │     │  ├─ clipboard.svg
   │     │  ├─ clock.svg
   │     │  ├─ cloud.svg
   │     │  ├─ columns.svg
   │     │  ├─ documentation.svg
   │     │  ├─ dollar-circle.svg
   │     │  ├─ envelope.svg
   │     │  ├─ file.svg
   │     │  ├─ flat.svg
   │     │  ├─ google-customIcon.svg
   │     │  ├─ google-plus.svg
   │     │  ├─ headphone.svg
   │     │  ├─ heart-fill.svg
   │     │  ├─ home.svg
   │     │  ├─ iconfinder_trello_2317760.svg
   │     │  ├─ idea.svg
   │     │  ├─ image.png
   │     │  ├─ image.svg
   │     │  ├─ label.png
   │     │  ├─ layers.svg
   │     │  ├─ left-bar.svg
   │     │  ├─ left.svg
   │     │  ├─ logo2.svg
   │     │  ├─ logo3.svg
   │     │  ├─ logo4.svg
   │     │  ├─ logo5.svg
   │     │  ├─ logo6.svg
   │     │  ├─ logoIn.svg
   │     │  ├─ message.svg
   │     │  ├─ microsoft.svg
   │     │  ├─ money-wave.svg
   │     │  ├─ paint.svg
   │     │  ├─ protection.svg
   │     │  ├─ quote-left.png
   │     │  ├─ quote-right.png
   │     │  ├─ quote.png
   │     │  ├─ repeat.svg
   │     │  ├─ right.svg
   │     │  ├─ setting.svg
   │     │  ├─ shopping-cart.svg
   │     │  ├─ speed-meter.svg
   │     │  ├─ strategy.svg
   │     │  ├─ theme.svg
   │     │  ├─ ticket.svg
   │     │  ├─ user.svg
   │     │  ├─ users-alt.svg
   │     │  ├─ water-fall.svg
   │     │  └─ wordpress.svg
   │     ├─ jobs
   │     │  ├─ chrome.svg
   │     │  ├─ dribble.svg
   │     │  ├─ firefox.svg
   │     │  ├─ slack.svg
   │     │  ├─ stats.svg
   │     │  └─ tags.svg
   │     ├─ knowledgebase
   │     │  └─ wp-research.png
   │     ├─ logo_dark.svg
   │     ├─ logo_white.svg
   │     ├─ map
   │     │  └─ mpc.png
   │     ├─ ms.svg
   │     ├─ open-message.png
   │     ├─ pages
   │     │  ├─ 404.svg
   │     │  ├─ maintenance.svg
   │     │  └─ support.svg
   │     ├─ products
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  └─ electronics
   │     │     ├─ 1.png
   │     │     ├─ 2.png
   │     │     ├─ 3.png
   │     │     ├─ 4.png
   │     │     ├─ 5.png
   │     │     ├─ 6.png
   │     │     ├─ 7.png
   │     │     ├─ 8.png
   │     │     └─ 9.png
   │     ├─ profile
   │     │  ├─ Cover image-image.jpg
   │     │  ├─ CoverImage.svg
   │     │  ├─ cover-img.png
   │     │  └─ post
   │     │     ├─ 165.png
   │     │     ├─ 506.png
   │     │     ├─ 70.png
   │     │     ├─ 907.png
   │     │     ├─ brightland_3744.png
   │     │     └─ postImage.png
   │     ├─ progress-active.png
   │     ├─ progress-success.png
   │     ├─ progress.png
   │     ├─ progress.svg
   │     ├─ sampleCards
   │     │  ├─ 1.png
   │     │  ├─ 1.svg
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 2.png
   │     │  ├─ 2.svg
   │     │  ├─ 3.png
   │     │  ├─ 3.svg
   │     │  ├─ 4.png
   │     │  ├─ 4.svg
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  └─ card-bg.png
   │     ├─ sellers
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 14.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  └─ 9.png
   │     ├─ support-img.png
   │     ├─ trophy-2.png
   │     ├─ trophy.png
   │     ├─ users
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 14.jpg
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.jpg
   │     │  ├─ cover
   │     │  │  ├─ 1.png
   │     │  │  ├─ 10.png
   │     │  │  ├─ 11.png
   │     │  │  ├─ 12.png
   │     │  │  ├─ 13.png
   │     │  │  ├─ 14.png
   │     │  │  ├─ 15.png
   │     │  │  ├─ 2.png
   │     │  │  ├─ 3.png
   │     │  │  ├─ 4.png
   │     │  │  ├─ 5.png
   │     │  │  ├─ 6.png
   │     │  │  ├─ 7.png
   │     │  │  ├─ 8.png
   │     │  │  └─ 9.png
   │     │  └─ drew-hays-agGIKYs4mYs-unsplash.png
   │     └─ wizards
   │        ├─ 1-1.png
   │        ├─ 1-1.svg
   │        ├─ 1.png
   │        ├─ 1.svg
   │        ├─ 2.png
   │        ├─ 2.svg
   │        ├─ 3.svg
   │        └─ 4.svg
   └─ utility
      ├─ localStorageControl.js
      └─ utility.js

```
```
boilerplate
├─ .env
├─ .prettierrc
├─ README.md
├─ build
│  ├─ .htaccess
│  ├─ asset-manifest.json
│  ├─ favicon.png
│  ├─ favicon.svg
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ logo_dark.svg
│  ├─ manifest.json
│  ├─ project_admin.zip
│  ├─ robots.txt
│  └─ static
│     ├─ css
│     │  └─ main.29ece854.css
│     ├─ js
│     │  ├─ 10.136f0d88.chunk.js
│     │  ├─ 11.9a8be0d6.chunk.js
│     │  ├─ 141.ecfac170.chunk.js
│     │  ├─ 206.d9753b9a.chunk.js
│     │  ├─ 219.96b9b59a.chunk.js
│     │  ├─ 256.dda77ae8.chunk.js
│     │  ├─ 277.489a1c1a.chunk.js
│     │  ├─ 359.d31a6ba8.chunk.js
│     │  ├─ 36.8dfe2f3d.chunk.js
│     │  ├─ 38.9a2124d9.chunk.js
│     │  ├─ 383.1ad24184.chunk.js
│     │  ├─ 39.784e5243.chunk.js
│     │  ├─ 451.42886b43.chunk.js
│     │  ├─ 467.2f7e9808.chunk.js
│     │  ├─ 471.f49fcd07.chunk.js
│     │  ├─ 482.fd086b8d.chunk.js
│     │  ├─ 486.040679db.chunk.js
│     │  ├─ 490.7d266f13.chunk.js
│     │  ├─ 499.a567055c.chunk.js
│     │  ├─ 510.c1ea3647.chunk.js
│     │  ├─ 529.966715a4.chunk.js
│     │  ├─ 529.966715a4.chunk.js.LICENSE.txt
│     │  ├─ 56.2d6ece7f.chunk.js
│     │  ├─ 626.8d3c0325.chunk.js
│     │  ├─ 639.7d307c65.chunk.js
│     │  ├─ 639.7d307c65.chunk.js.LICENSE.txt
│     │  ├─ 647.bb413c50.chunk.js
│     │  ├─ 660.5d9acc77.chunk.js
│     │  ├─ 693.6c29ad39.chunk.js
│     │  ├─ 72.5a25468b.chunk.js
│     │  ├─ 728.b6a2afb3.chunk.js
│     │  ├─ 758.f8e581fa.chunk.js
│     │  ├─ 781.2cdf9328.chunk.js
│     │  ├─ 813.cb91b12a.chunk.js
│     │  ├─ 848.120ac644.chunk.js
│     │  ├─ 858.45783039.chunk.js
│     │  ├─ 863.cef50307.chunk.js
│     │  ├─ 863.cef50307.chunk.js.LICENSE.txt
│     │  ├─ 871.36d4c19e.chunk.js
│     │  ├─ 938.dca8daed.chunk.js
│     │  ├─ 980.6c35c944.chunk.js
│     │  ├─ 996.04b9143c.chunk.js
│     │  ├─ main.3b37bf28.js
│     │  └─ main.3b37bf28.js.LICENSE.txt
│     └─ media
│        ├─ 024-like.0de90fbde8a1bf8f38ef.svg
│        ├─ 1.eb8cd7836682c6075db4.svg
│        ├─ 155-credit-card.8a2e457537a1794892ba.svg
│        ├─ 2.ffbf17e98e841982c360.svg
│        ├─ 3.8268f25b13598540294e.svg
│        ├─ 4.d81ea006fa5170a0deca.svg
│        ├─ 404.72d84482a671c69b7c8f659651fd4b51.svg
│        ├─ New Customer.e1dfd199cc7e5e1a8b97.svg
│        ├─ NotOpen.06a13d76ae09d91bedda.svg
│        ├─ Opened.c50099372ac07fe8db17.svg
│        ├─ Profit.7b13ee4f3a7c88c281a7.svg
│        ├─ SalesRevenue.7d995c31f85b9ca3ceaf.svg
│        ├─ Sent.391885c6e3c1e3041cf3.svg
│        ├─ Slack.2ad3910aa64e0351ec6d.svg
│        ├─ address.396fc27e3847b1e04d36.svg
│        ├─ adidas.7663ba7bc95df9005145.svg
│        ├─ admin-bg-light.abe5a40b8a8fe34f290a.png
│        ├─ adobe.cecc24eb3fc14da37bfb.svg
│        ├─ arrow-growth.1144d81905f9a3d6ab41.svg
│        ├─ arrow-left.ceed1e5c6daaff730765.svg
│        ├─ arrow-right.e2a9f4b720ac4c3cb6e8.svg
│        ├─ bell.aa4f9e252e677264ac33.svg
│        ├─ bell.aa4f9e252e677264ac339a59247c47f5.svg
│        ├─ book-open.b31d729246eea6f132fd.svg
│        ├─ book.1eb461c1714bea41b70d.svg
│        ├─ briefcase.a6f11c37fdf54476f4e1.svg
│        ├─ camera.916f639deea16226bb11.svg
│        ├─ chat.d807b2b6fc30350ba98e.svg
│        ├─ check-circle.6d65656884310bf44d69.svg
│        ├─ clipboard.a7baf41069746e4c53c6.svg
│        ├─ clock.76fb8efe325ff9fbd949.svg
│        ├─ cloud.15c834f0ec0d65a38668.svg
│        ├─ columns.21328f896ab2b21f9653.svg
│        ├─ documentation.d9940e4af4856a8ccb60.svg
│        ├─ dollar-circle.af3751a73a9ee046cb3d.svg
│        ├─ envelope.da62f4de2824cba46d76.svg
│        ├─ envelope.da62f4de2824cba46d7601c36af2e5b3.svg
│        ├─ file.57e885a5946e533ebd77.svg
│        ├─ flat.0b9eb3024a67dff9f6bd.svg
│        ├─ google-customIcon.d3641275457c11f70518.svg
│        ├─ google-plus.ff5ae61510aa58cedbe9.svg
│        ├─ google-plus.ff5ae61510aa58cedbe9855922094f21.svg
│        ├─ headphone.577f279c23a7ee0f4917.svg
│        ├─ heart-fill.29638307818364eac0a2.svg
│        ├─ home.86b39a0ae5b4b6dd596b.svg
│        ├─ home.86b39a0ae5b4b6dd596b6963557ed8ed.svg
│        ├─ iconfinder_trello_2317760.c9aceaea958d0fbad672.svg
│        ├─ idea.a678c5c1c28c146fea96.svg
│        ├─ image.c0794e9709914d11c3b5.svg
│        ├─ layers.b21ef81df137dd718b40.svg
│        ├─ left-bar.c824d7d9a98da1109270.svg
│        ├─ left.75e9c597e542b46d187d.svg
│        ├─ logo2.38ecb11f8542a4756ce5.svg
│        ├─ logo3.fe5b230b66e0561ed45e.svg
│        ├─ logo4.d565f0ae35481651c5e1.svg
│        ├─ logo5.2b714ac0013e4f9d2eeb.svg
│        ├─ logo6.9c5948e8d8ad1655afcd.svg
│        ├─ logoIn.f993f078e04598aec99c.svg
│        ├─ logo_dark.976ec3ef42cbf43c53c7e9f732da439f.svg
│        ├─ logo_white.0130cc6e6907c68915ace4f2ed1a7e74.svg
│        ├─ message.cd8eea65de72580047a4.svg
│        ├─ microsoft.33d50132b6508c5d6dfe.svg
│        ├─ money-wave.852dbf018a56dff3ca81.svg
│        ├─ paint.ecb8591c3777760ebb89.svg
│        ├─ protection.a31087adcdc94af4f237.svg
│        ├─ repeat.4a7258559f9d15607618.svg
│        ├─ right.8ec180e52dee56afd001.svg
│        ├─ setting.faf8bb07f96c34f5d56a.svg
│        ├─ setting.faf8bb07f96c34f5d56ad33c39dbd22d.svg
│        ├─ shopping-cart.1e57653a4886dacf7af0.svg
│        ├─ speed-meter.83c340811686ecda1cf3.svg
│        ├─ strategy.945a9b0a5f895e3cf6dd.svg
│        ├─ theme.ee3e479a3dbe449b8ee5.svg
│        ├─ ticket.a12b407b96bcd9ffa113.svg
│        ├─ user.35fbe76f8c2de074a44f.svg
│        ├─ users-alt.082c532bbc534600c561.svg
│        ├─ water-fall.72a52ccd5ea1015084f1.svg
│        └─ wordpress.d7ad36a520a236e3b830.svg
├─ craco.config.js
├─ customize-cra-config.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ .htaccess
│  ├─ favicon.png
│  ├─ favicon.svg
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ logo_dark.svg
│  ├─ manifest.json
│  └─ robots.txt
└─ src
   ├─ App.js
   ├─ components
   │  ├─ buttons
   │  │  ├─ buttons.js
   │  │  ├─ calendar-button
   │  │  │  └─ calendar-button.js
   │  │  ├─ export-button
   │  │  │  └─ export-button.js
   │  │  ├─ share-button
   │  │  │  └─ share-button.js
   │  │  └─ styled.js
   │  ├─ cards
   │  │  ├─ Style.js
   │  │  └─ frame
   │  │     ├─ cards-frame.js
   │  │     └─ style.js
   │  ├─ checkbox
   │  │  ├─ checkbox.js
   │  │  └─ style.js
   │  ├─ datePicker
   │  │  └─ datePicker.js
   │  ├─ dropdown
   │  │  ├─ dropdown-style.js
   │  │  └─ dropdown.js
   │  ├─ heading
   │  │  ├─ heading.js
   │  │  └─ style.js
   │  ├─ page-headers
   │  │  ├─ page-headers.js
   │  │  └─ style.js
   │  ├─ popup
   │  │  ├─ popup.js
   │  │  ├─ style.css
   │  │  └─ style.js
   │  ├─ tasklist
   │  │  └─ TaskList.js
   │  └─ utilities
   │     ├─ auth-info
   │     │  ├─ Message.js
   │     │  ├─ Notification.js
   │     │  ├─ Search.js
   │     │  ├─ auth-info-style.js
   │     │  ├─ info.js
   │     │  └─ settings.js
   │     ├─ icons.js
   │     ├─ protectedRoute.js
   │     └─ utilities.js
   ├─ config
   │  ├─ api
   │  │  ├─ firebase.js
   │  │  └─ index.js
   │  ├─ auth0.js
   │  ├─ config.js
   │  ├─ dataService
   │  │  └─ dataService.js
   │  ├─ database
   │  │  └─ firebase.js
   │  ├─ icon
   │  │  └─ icon.json
   │  ├─ map
   │  │  └─ google-maps-styles.js
   │  └─ theme
   │     ├─ themeConfigure.js
   │     └─ themeVariables.js
   ├─ container
   │  ├─ calendar
   │  │  ├─ Calendar.js
   │  │  └─ Style.js
   │  ├─ course
   │  │  └─ CourseDetails.js
   │  ├─ crud
   │  │  ├─ axios
   │  │  │  └─ Add.js
   │  │  └─ fireStore
   │  │     ├─ View.js
   │  │     ├─ addNew.js
   │  │     ├─ edit.js
   │  │     └─ style.js
   │  ├─ dashboard
   │  │  └─ overview
   │  ├─ maps
   │  │  └─ Vector.js
   │  ├─ pages
   │  │  ├─ 404.js
   │  │  ├─ CateringFormModal.js
   │  │  ├─ Caterings.js
   │  │  ├─ CustomerFormModal.js
   │  │  ├─ Customers.js
   │  │  ├─ Dashboard
   │  │  │  ├─ Analysis.js
   │  │  │  ├─ BrowserState.js
   │  │  │  ├─ CurrentRatio.js
   │  │  │  ├─ DailyOverview.js
   │  │  │  ├─ DashboardChart.js
   │  │  │  ├─ Demo2.js
   │  │  │  ├─ GrossProfit.js
   │  │  │  ├─ NetProfit.js
   │  │  │  ├─ OrderSummary.js
   │  │  │  ├─ OverviewCard.js
   │  │  │  ├─ OverviewDataList.js
   │  │  │  ├─ QuickRatio.js
   │  │  │  ├─ SalesByLocation.js
   │  │  │  ├─ SalesGrowth.js
   │  │  │  ├─ SalesReport.js
   │  │  │  ├─ SocialMediaContent.js
   │  │  │  ├─ SocialMediaOverview.js
   │  │  │  ├─ TopSellingProducts.js
   │  │  │  ├─ dashboardChartContent.json
   │  │  │  ├─ index.js
   │  │  │  ├─ overviewData.json
   │  │  │  ├─ table-data.json
   │  │  │  └─ uk-countries.json
   │  │  ├─ EventFormModal.js
   │  │  ├─ Events.js
   │  │  ├─ VendorFormModal.js
   │  │  ├─ Vendors.js
   │  │  ├─ customer-modal-style.js
   │  │  ├─ style.js
   │  │  └─ wizards
   │  │     └─ overview
   │  │        └─ WizardsSix.js
   │  ├─ profile
   │  │  ├─ authentication
   │  │  │  ├─ Index.js
   │  │  │  └─ overview
   │  │  │     ├─ FbSignIn.js
   │  │  │     ├─ FbSignup.js
   │  │  │     ├─ ForgotPassword.js
   │  │  │     ├─ SignIn.js
   │  │  │     ├─ Signup.js
   │  │  │     └─ style.js
   │  │  ├─ myProfile
   │  │  │  ├─ Index.js
   │  │  │  └─ overview
   │  │  │     ├─ Activity.js
   │  │  │     ├─ ActivityContent.js
   │  │  │     ├─ Overview.js
   │  │  │     ├─ RightAside.js
   │  │  │     ├─ Timeline.js
   │  │  │     ├─ UserBio.js
   │  │  │     └─ timeline
   │  │  │        ├─ CreatePost.js
   │  │  │        └─ Posts.js
   │  │  ├─ overview
   │  │  │  └─ CoverSection.js
   │  │  └─ settings
   │  │     ├─ Settings.js
   │  │     └─ overview
   │  │        ├─ Account.js
   │  │        ├─ Notification.js
   │  │        ├─ Passwoard.js
   │  │        ├─ Profile.js
   │  │        ├─ ProfileAuthorBox.js
   │  │        └─ SocialProfile.js
   │  ├─ styled.js
   │  └─ table
   │     └─ DragTable.js
   ├─ demoData
   │  ├─ changelog.json
   │  └─ message-list.json
   ├─ i18n
   │  ├─ config.js
   │  └─ localization
   │     ├─ ar
   │     │  └─ translation.json
   │     ├─ en
   │     │  └─ translation.json
   │     └─ esp
   │        └─ translation.json
   ├─ index.js
   ├─ layout
   │  ├─ MenueItems.js
   │  ├─ Style.js
   │  ├─ TopMenu.js
   │  └─ withAdminLayout.js
   ├─ logo.svg
   ├─ redux
   │  ├─ authentication
   │  │  ├─ actionCreator.js
   │  │  ├─ actions.js
   │  │  └─ reducers.js
   │  ├─ crud
   │  │  └─ axios
   │  │     └─ actionCreator.js
   │  ├─ fileManager
   │  │  └─ actionCreator.js
   │  ├─ firebase
   │  │  ├─ auth
   │  │  │  ├─ actionCreator.js
   │  │  │  ├─ actions.js
   │  │  │  └─ reducers.js
   │  │  └─ firestore
   │  │     ├─ actionCreator.js
   │  │     ├─ actions.js
   │  │     └─ reducers.js
   │  ├─ message
   │  │  ├─ actionCreator.js
   │  │  ├─ actions.js
   │  │  └─ reducers.js
   │  ├─ notification
   │  │  ├─ actionCreator.js
   │  │  ├─ actions.js
   │  │  └─ reducers.js
   │  ├─ rootReducers.js
   │  ├─ store.js
   │  └─ themeLayout
   │     ├─ actionCreator.js
   │     ├─ actions.js
   │     └─ reducers.js
   ├─ reportWebVitals.js
   ├─ routes
   │  ├─ admin
   │  │  ├─ firebase.js
   │  │  ├─ index.js
   │  │  └─ pages.js
   │  └─ auth.js
   ├─ setupTests.js
   ├─ static
   │  ├─ css
   │  │  └─ style.css
   │  └─ img
   │     ├─ Group 9786.png
   │     ├─ PayPalLogo.png
   │     ├─ Subtraction1.png
   │     ├─ admin-bg-light.png
   │     ├─ auth
   │     │  ├─ BG.png
   │     │  ├─ Illustration.png
   │     │  ├─ bottomShape.png
   │     │  └─ topShape.png
   │     ├─ avatar
   │     │  ├─ NoPath (2).png
   │     │  ├─ NoPath (3).png
   │     │  ├─ NoPath (4).png
   │     │  ├─ NoPath.png
   │     │  ├─ chat-auth.png
   │     │  ├─ profileImage.png
   │     │  ├─ t1.png
   │     │  └─ team-1.png
   │     ├─ banner
   │     │  ├─ 1.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  ├─ BG.png
   │     │  ├─ badge.svg
   │     │  ├─ banner-1.png
   │     │  ├─ banner-2.png
   │     │  ├─ banner-3.png
   │     │  ├─ banner-4.png
   │     │  ├─ card-banner-1.png
   │     │  ├─ card-banner-2.png
   │     │  ├─ cta-banner-1.png
   │     │  ├─ cta-banner-2.png
   │     │  └─ header-banner.png
   │     ├─ bar-dark.png
   │     ├─ barcode.png
   │     ├─ blogs
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 14.png
   │     │  ├─ 15.png
   │     │  ├─ 16.png
   │     │  ├─ 17.png
   │     │  ├─ 18.png
   │     │  ├─ 19.png
   │     │  ├─ 2.png
   │     │  ├─ 20.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  └─ blog-details
   │     │     ├─ 1.png
   │     │     └─ 2.png
   │     ├─ book-open.png
   │     ├─ browser
   │     │  ├─ chrome.png
   │     │  ├─ firefox.png
   │     │  ├─ internet-explorer.png
   │     │  ├─ opera.png
   │     │  └─ safari.png
   │     ├─ cards-logo
   │     │  ├─ american-express.png
   │     │  ├─ ms.png
   │     │  └─ visa.png
   │     ├─ chat-author
   │     │  ├─ g1.png
   │     │  ├─ g2.png
   │     │  ├─ g3.png
   │     │  ├─ t1.jpg
   │     │  ├─ t10.png
   │     │  ├─ t12.png
   │     │  ├─ t2.jpg
   │     │  ├─ t3.jpg
   │     │  ├─ t4.jpg
   │     │  ├─ t5.png
   │     │  ├─ t6.png
   │     │  ├─ t7.png
   │     │  ├─ t8.png
   │     │  ├─ t9.png
   │     │  └─ w.png
   │     ├─ corporate.png
   │     ├─ courses
   │     │  ├─ 1.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  └─ 7.png
   │     ├─ email
   │     │  ├─ 1.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  └─ 4.png
   │     ├─ files
   │     │  ├─ jpg.png
   │     │  ├─ pdf.png
   │     │  ├─ png.png
   │     │  ├─ psd.png
   │     │  └─ zip.png
   │     ├─ flag
   │     │  ├─ ar.png
   │     │  ├─ en.png
   │     │  ├─ esp.png
   │     │  └─ germany.png
   │     ├─ gallery
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  └─ 9.png
   │     ├─ google.png
   │     ├─ icon
   │     │  ├─ 007-microphone-1.png
   │     │  ├─ 010-home.png
   │     │  ├─ 013-document-1.png
   │     │  ├─ 014-document.png
   │     │  ├─ 015-color-palette.png
   │     │  ├─ 017-video-camera.png
   │     │  ├─ 024-like.svg
   │     │  ├─ 1.svg
   │     │  ├─ 155-credit-card.svg
   │     │  ├─ 2.svg
   │     │  ├─ 3.svg
   │     │  ├─ 4.svg
   │     │  ├─ New Customer.svg
   │     │  ├─ NotOpen.svg
   │     │  ├─ Opened.svg
   │     │  ├─ Profit.svg
   │     │  ├─ SalesRevenue.svg
   │     │  ├─ Sent.svg
   │     │  ├─ Slack.svg
   │     │  ├─ address.svg
   │     │  ├─ adidas.svg
   │     │  ├─ adobe.svg
   │     │  ├─ arrow-growth.svg
   │     │  ├─ arrow-left.png
   │     │  ├─ arrow-left.svg
   │     │  ├─ arrow-right.png
   │     │  ├─ arrow-right.svg
   │     │  ├─ bell.svg
   │     │  ├─ book-open.svg
   │     │  ├─ book.svg
   │     │  ├─ briefcase.svg
   │     │  ├─ camera.svg
   │     │  ├─ chat.svg
   │     │  ├─ check-circle.svg
   │     │  ├─ clipboard.svg
   │     │  ├─ clock.svg
   │     │  ├─ cloud.svg
   │     │  ├─ columns.svg
   │     │  ├─ documentation.svg
   │     │  ├─ dollar-circle.svg
   │     │  ├─ envelope.svg
   │     │  ├─ file.svg
   │     │  ├─ flat.svg
   │     │  ├─ google-customIcon.svg
   │     │  ├─ google-plus.svg
   │     │  ├─ headphone.svg
   │     │  ├─ heart-fill.svg
   │     │  ├─ home.svg
   │     │  ├─ iconfinder_trello_2317760.svg
   │     │  ├─ idea.svg
   │     │  ├─ image.png
   │     │  ├─ image.svg
   │     │  ├─ label.png
   │     │  ├─ layers.svg
   │     │  ├─ left-bar.svg
   │     │  ├─ left.svg
   │     │  ├─ logo2.svg
   │     │  ├─ logo3.svg
   │     │  ├─ logo4.svg
   │     │  ├─ logo5.svg
   │     │  ├─ logo6.svg
   │     │  ├─ logoIn.svg
   │     │  ├─ message.svg
   │     │  ├─ microsoft.svg
   │     │  ├─ money-wave.svg
   │     │  ├─ paint.svg
   │     │  ├─ protection.svg
   │     │  ├─ quote-left.png
   │     │  ├─ quote-right.png
   │     │  ├─ quote.png
   │     │  ├─ repeat.svg
   │     │  ├─ right.svg
   │     │  ├─ setting.svg
   │     │  ├─ shopping-cart.svg
   │     │  ├─ speed-meter.svg
   │     │  ├─ strategy.svg
   │     │  ├─ theme.svg
   │     │  ├─ ticket.svg
   │     │  ├─ user.svg
   │     │  ├─ users-alt.svg
   │     │  ├─ water-fall.svg
   │     │  └─ wordpress.svg
   │     ├─ jobs
   │     │  ├─ chrome.svg
   │     │  ├─ dribble.svg
   │     │  ├─ firefox.svg
   │     │  ├─ slack.svg
   │     │  ├─ stats.svg
   │     │  └─ tags.svg
   │     ├─ knowledgebase
   │     │  └─ wp-research.png
   │     ├─ logo_dark.svg
   │     ├─ logo_white.svg
   │     ├─ map
   │     │  └─ mpc.png
   │     ├─ ms.svg
   │     ├─ open-message.png
   │     ├─ pages
   │     │  ├─ 404.svg
   │     │  ├─ maintenance.svg
   │     │  └─ support.svg
   │     ├─ products
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  └─ electronics
   │     │     ├─ 1.png
   │     │     ├─ 2.png
   │     │     ├─ 3.png
   │     │     ├─ 4.png
   │     │     ├─ 5.png
   │     │     ├─ 6.png
   │     │     ├─ 7.png
   │     │     ├─ 8.png
   │     │     └─ 9.png
   │     ├─ profile
   │     │  ├─ Cover image-image.jpg
   │     │  ├─ CoverImage.svg
   │     │  ├─ cover-img.png
   │     │  └─ post
   │     │     ├─ 165.png
   │     │     ├─ 506.png
   │     │     ├─ 70.png
   │     │     ├─ 907.png
   │     │     ├─ brightland_3744.png
   │     │     └─ postImage.png
   │     ├─ progress-active.png
   │     ├─ progress-success.png
   │     ├─ progress.png
   │     ├─ progress.svg
   │     ├─ sampleCards
   │     │  ├─ 1.png
   │     │  ├─ 1.svg
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 2.png
   │     │  ├─ 2.svg
   │     │  ├─ 3.png
   │     │  ├─ 3.svg
   │     │  ├─ 4.png
   │     │  ├─ 4.svg
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.png
   │     │  └─ card-bg.png
   │     ├─ sellers
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 14.png
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  └─ 9.png
   │     ├─ support-img.png
   │     ├─ trophy-2.png
   │     ├─ trophy.png
   │     ├─ users
   │     │  ├─ 1.png
   │     │  ├─ 10.png
   │     │  ├─ 11.png
   │     │  ├─ 12.png
   │     │  ├─ 13.png
   │     │  ├─ 14.jpg
   │     │  ├─ 2.png
   │     │  ├─ 3.png
   │     │  ├─ 4.png
   │     │  ├─ 5.png
   │     │  ├─ 6.png
   │     │  ├─ 7.png
   │     │  ├─ 8.png
   │     │  ├─ 9.jpg
   │     │  ├─ cover
   │     │  │  ├─ 1.png
   │     │  │  ├─ 10.png
   │     │  │  ├─ 11.png
   │     │  │  ├─ 12.png
   │     │  │  ├─ 13.png
   │     │  │  ├─ 14.png
   │     │  │  ├─ 15.png
   │     │  │  ├─ 2.png
   │     │  │  ├─ 3.png
   │     │  │  ├─ 4.png
   │     │  │  ├─ 5.png
   │     │  │  ├─ 6.png
   │     │  │  ├─ 7.png
   │     │  │  ├─ 8.png
   │     │  │  └─ 9.png
   │     │  └─ drew-hays-agGIKYs4mYs-unsplash.png
   │     └─ wizards
   │        ├─ 1-1.png
   │        ├─ 1-1.svg
   │        ├─ 1.png
   │        ├─ 1.svg
   │        ├─ 2.png
   │        ├─ 2.svg
   │        ├─ 3.svg
   │        └─ 4.svg
   └─ utility
      ├─ localStorageControl.js
      └─ utility.js

```