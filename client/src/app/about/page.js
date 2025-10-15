'use client';

import { Heading, Link as AriaLink} from "react-aria-components";
import { LinkButton } from '@/components/ui/AppButton';


export default function AboutPage() {
  return (
    <>
      {/* First focusable element on the page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>

      <main id="main-content" aria-labelledby="about-heading">
        <Heading level = {1} id="about-heading">
          About the Project
        </Heading>

        <p>
          This project utilizes resources from Project Gutenberg and Gutendex. 
          Gutendex is an open web API that provides access to the vast collection of 
          public domain books available on Project Gutenberg. Gutendex is MIT licensed
          and can be found on GitHub. 
        </p>

        <p>
          <LinkButton
            href="https://github.com/garethbjohnson/gutendex"
            external
          >
            Gutendex on GitHub
          </LinkButton>
        </p>

        <p>
          Project Gutenberg is a volunteer-driven initiative that digitizes and archives
          cultural works, making them freely accessible to the public. The platform offers 
          over 75,000 free eBooks, including many classic literary works.
          The books available through Project Gutenberg are in the public domain, meaning they are
          no longer under copyright protection and can be freely distributed and shared.
          By leveraging the Gutendex API, this project aims to provide users with an easy way to 
          search, discover, and access these public domain books.
          Support Gutendex and Project Gutenberg by visiting their websites and contributing to their efforts.
        </p>

        <p>
          <LinkButton
            href="https://www.gutenberg.org"
            external
          >
            Visit Project Gutenberg
          </LinkButton>
        </p>

      </main>
    </>
  );
}
