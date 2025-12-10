# ReadingRm — User Manual

A modern, accessibility-first web reader for public-domain literature.  
Users can search for books, customize their reading experience, and save progress across devices.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How to Use the App](#how-to-use-the-app)
  - [Searching for Books](#searching-for-books)
  - [Viewing Book Details](#viewing-book-details)
  - [Reading a Book](#reading-a-book)
  - [Customizing the Reader](#customizing-the-reader)
  - [Tracking Progress](#tracking-progress)
  - [Managing Bookmarks and Lists](#managing-bookmarks-and-lists)
- [Demo Mode](#demo-mode)
- [User Accounts and Authentication](#user-accounts-and-authentication)
- [Technical Architecture (High-Level)](#technical-architecture-high-level)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Web Reader App provides a polished, mobile-friendly interface for reading public-domain books.

It integrates:

- Gutendex API for book metadata and book files
- Custom sanitized HTML rendering for a comfortable reading experience
- Firebase Authentication for secure login
- MongoDB Atlas for user preferences, lists, bookmarks, and reading progress

The app emphasizes accessibility, customization, and reading continuity across sessions.

---

## Key Features

### Search

- Keyword search powered by the Gutendex API
- Optional "Advanced Search" filters (e.g., language, topic, author)
- Search results show:
  - Book cover
  - Title and author
  - Quick actions (Read, Details)

### Reader Interface

- Clean, distraction-free reading layout
- Adjustable:
  - Font size
  - Theme (light, dark, sepia)
  - Column width
  - Typeface (serif or sans-serif)

### Reading Progress

- Progress automatically saved while you read
- Resume reading exactly where you left off
- Dashboard shows a progress bar and completion percentage
- Reader Action Rail can show the percentage completed

### Bookmarks and Lists

- Bookmark individual books
- Create and manage personal reading lists
- Dashboard cards can show:
  - Book cover and metadata
  - Progress bar
  - "Resume" button

### Mobile-Friendly Design

- Slide-out Action Rail or bottom drawer on small screens
- Horizontally scrollable carousels
- Responsive layout that adapts to different screen sizes

### Authentication

- Firebase email/password authentication
- Secure API communication using Firebase ID tokens
- User data (preferences, progress, lists) is tied to the authenticated account

---

## How to Use the App

### Searching for Books

1. Navigate to the **Search** page.
2. Enter a title, author, or keyword in the search field.
3. Optionally open **Advanced Search** to filter by:
   - Language
   - Topic or subject
   - Author
4. Review the search results:
   - Click **Read** to open the book in the reader.
   - Click **Details** to view more information about the book.

---

### Viewing Book Details

On any book card, click **Details** to open the details view. This typically includes:

- Title and author
- Subjects and topics
- Language
- Description (when available)
- Available formats or source information
- Cover preview

Use this to decide whether you want to start reading or add the book to a list.

---

### Reading a Book

1. Click **Read** from:
   - Search results
   - Dashboard cards
   - Bookmarks or lists
2. The Reader Page will load:
   - Sanitized HTML content of the book
   - Your previously saved reading position (if you are logged in and have read the book before)
3. Scroll naturally to read. The app will track your position in the background.

You can leave the page at any time: when you return, you should be able to resume from where you left off.

---

### Customizing the Reader

Use the Reader Action Rail or Reader Actions Drawer to adjust the reading experience.

Common options include:

| Setting        | Description                                          |
|----------------|------------------------------------------------------|
| Theme          | Switch between light, dark, or sepia modes           |
| Font Size      | Increase or decrease text size                       |
| Column Width   | Set text columns to narrow, medium, or wide          |
| Font Family    | Choose between serif and sans-serif fonts            |

Your preferences are saved per user and should apply the next time you open the reader.

---

### Tracking Progress

Reading progress is tracked based on your scroll position and, where possible, on specific paragraph anchors in the HTML.

- On the **Dashboard**, each book card can show:
  - A progress bar
  - A numeric completion percentage
  - A **Resume** button that takes you back into the reader at your last position
- Inside the **Reader**, progress may be displayed in the Action Rail.

This allows you to quickly see which books you have started and how far along you are.

---

### Managing Bookmarks and Lists

#### Bookmarks

- Inside the reader, use the bookmark icon (if available) to mark the current book as bookmarked.
- Bookmarked books appear on your **Dashboard** or in a dedicated "Bookmarks" or "Saved Books" section.

#### Lists

- You can create personal reading lists (for example: "To Read", "Favorites").
- Use list controls (such as "Add to List") on book cards or from within the book details.
- You can remove books from lists at any time.

---

## Demo Mode

The app may include a **Demo Reader** that does not require authentication.

Characteristics of Demo Mode:

- Uses a static HTML file (for example, `public/demo/pg1661-images.html`).
- Demonstrates the full reader interface:
  - Layout
  - Themes and typography
  - Action Rail or Reader Drawer
- Progress and data in demo mode are not stored permanently to your user account.

Demo mode is useful for evaluating the interface without creating an account.

---

## User Accounts and Authentication

### Creating an Account

1. Navigate to the **Sign In** page.
2. Choose the **Sign Up** option.
3. Enter your email and password.
4. Submit the form to create a Firebase Auth account.

### Logging In

- Use your email and password on the **Sign In** page.
- The client retrieves a Firebase ID token.
- The backend verifies the token and creates or updates your user record in MongoDB if needed.

Once authenticated, you can:

- Save reading progress
- Store reader preferences
- Manage bookmarks and lists

### Security

- All protected API routes require a valid Firebase ID token.
- The Express backend verifies the token on each request before reading or writing user data.

---

## Technical Architecture (High-Level)

### Frontend (Next.js / React)

- Built using Next.js with a mix of server and client components.
- Major UI sections:
  - Home Page
  - Search Page
  - Book Reader Page
  - Demo Reader Page
  - Dashboard
- Custom React hooks, such as:
  - `useReaderPrefs` for reader customization preferences
  - `useReadingProgress` for storing and restoring reading location
  - `useBookmark` for bookmarking books
  - `useLists` for managing user-created lists

Book content is fetched, sanitized (for example, using DOMPurify), and rendered within a styled reader component.

### Backend (Express.js)

The server exposes a set of REST API routes, for example:

- `/api/progress/:bookId`  
  Save and retrieve reading progress for a specific book.
- `/api/prefs`  
  Save and retrieve reader customization preferences.
- `/api/lists`  
  Create, update, and delete reading lists and their contents.
- `/api/user`  
  Synchronize user profile data between Firebase and MongoDB.

The backend uses Firebase Admin SDK (or equivalent logic) to verify incoming ID tokens.

### Database (MongoDB Atlas)

The database stores:

- User documents (uid, email, timestamps)
- Reader preferences (theme, font size, etc.)
- Reading progress for each user and book
- Bookmarks
- User-defined reading lists

### External Services

- **Gutendex API**  
  Used to search and retrieve metadata and book formats for public-domain books.
- **Project Gutenberg (via Gutendex)**  
  Provides the actual book HTML or text files.
- **Firebase Authentication**  
  Provides secure user authentication and ID tokens.
- **DOMPurify (or similar)**  
  Sanitizes HTML before rendering it in the browser.

---

## Limitations

- Some public-domain book HTML files may have inconsistent formatting because they come from external sources.
- Offline reading is not currently supported.
- Audiobook or text-to-speech support is not fully implemented.
- Loading time for some books may depend on external servers (Project Gutenberg / Gutendex).

---

## Contributing

Contributions are welcome.

Possible areas for contribution include:

- Improving accessibility and meeting WCAG guidelines
- Enhancing the reader UI (themes, typography, layout options)
- Adding pagination mode (page-by-page navigation instead of continuous scroll)
- Integrating audio or text-to-speech features
- Supporting localization and multiple interface languages
- Improving performance and caching strategies

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing your changes.

---

## Licenses
MIT License

[Gutendex](https://github.com/garethbjohnson/gutendex)
This project utilizes resources from Project Gutenberg and Gutendex. 
Gutendex is an open web API that provides access to the vast collection of public domain books available on Project Gutenberg. 
Gutendex is MIT licensed and can be found on GitHub. 

[Project Gutenberg](https://www.gutenberg.org)
Project Gutenberg is a volunteer-driven initiative that digitizes and archives cultural works, making them freely accessible to the public. The platform offers over 75,000 free eBooks, including many classic literary works. The books available through Project Gutenberg are in the public domain, meaning they are no longer under copyright protection and can be freely distributed and shared.

By leveraging the Gutendex API, this project aims to provide users with an easy way to search, discover, and access these public domain books.
Support Gutendex and Project Gutenberg by visiting their websites and contributing to their efforts.
