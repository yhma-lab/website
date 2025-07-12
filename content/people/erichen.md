---
# Leave the homepage title empty to use the site title
title: ''
type: landing

design:
  # Default section spacing
  spacing: '2rem'

sections:
  - block: resume-biography
    content:
      username: erichen
      # Show a call-to-action button under your biography? (optional)
      # button:
      #   text: Download CV
      #   url: uploads/resume.pdf
    design:
      background:
        image:
          # Add your image background to `assets/media/`.
          # filename: stacked-peaks.svg
          filters:
            brightness: 1.0
          size: large
          position: center
          parallax: false
  - block: resume-experience
    content:
      # The user's folder name in `content/authors/`
      username: erichen
    design:
      # Hugo date format
      date_format: 'January 2006'
      # Education or Experience section first?
      is_education_first: false
  - block: resume-awards
    content:
      title: Awards
      # Note: `username` refers to the user's folder name in `content/authors/`
      username: erichen
---
