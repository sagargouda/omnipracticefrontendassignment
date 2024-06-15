
# omnipracticefrontendassignment
This is my submission for omnipractice frontend assignment

# omnipractice tweet app

## Introduction

This project is a simple social media application built with React and Redux, integrated with Firebase for authentication and Firestore for db. The application allows users to post updates, follow other users, and view posts from users they follow.

## Features

- User authentication with Firebase
- Create and view posts
- Follow and unfollow other users
- View posts from users you follow
- Profile page with tabs for user posts and following list



### Component Structure

1. **Profile Component**:
    - Displays the logged-in user's username and their following count.
    - Provides tab navigation to switch between viewing the user's own posts and the list of users they are following.

2. **Post Component**:
    - A reusable component to display individual posts. It accepts props for `id`, `post`, `currentUser`, and `time`.

### State Management

- **Redux**:
    - Used for managing global state including user data and following list.
    - `user` slice stores the logged-in user's information.
    - `follow` slice manages the list of users the logged-in user is following.

### Firestore Integration

- **Fetching Data**:
    - Real-time updates are enabled using Firestore's `onSnapshot` method.
    - The `Profile` component fetches the user's posts and updates the state when there are changes in the Firestore collection.

- **Following Functionality**:
    - The `followSlice` in Redux is used to manage following and unfollowing actions.
    - Firestore collections store the relationships between users (e.g., `/users/{userId}/following`).

### Styling

- **Tailwind CSS**:
    - Used for styling the components.
    - Responsive design to ensure compatibility across different screen sizes.

## File Structure


